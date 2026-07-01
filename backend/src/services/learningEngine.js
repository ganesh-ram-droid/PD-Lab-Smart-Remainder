const {
  ACTION_SCORE_IMPACT,
  LEARNING_LIMITS,
  NEGATIVE_ACTIONS,
  POSITIVE_ACTIONS,
  RESPONSE_TIME_THRESHOLDS,
  clamp,
  round,
  getTimeBucket
} = require('../utils/learningWeights');

const calculateActionCounts = (logs) => {
  const counts = {
    total: logs.length,
    completed: 0,
    ignored: 0,
    dismissed: 0,
    snoozed: 0,
    opened: 0,
    delayed: 0,
    cancelled: 0
  };

  logs.forEach((log) => {
    if (log.action === 'Completed') counts.completed += 1;
    if (log.action === 'Ignored') counts.ignored += 1;
    if (log.action === 'Dismissed') counts.dismissed += 1;
    if (log.action === 'Snoozed') counts.snoozed += 1;
    if (log.action === 'Opened Notification') counts.opened += 1;
    if (log.action === 'Delayed Reminder') counts.delayed += 1;
    if (log.action === 'Cancelled Reminder') counts.cancelled += 1;
  });

  return counts;
};

const calculateRates = (counts) => {
  const divisor = counts.total || 1;

  return {
    completionRate: round((counts.completed / divisor) * 100),
    ignoreRate: round((counts.ignored / divisor) * 100),
    dismissRate: round((counts.dismissed / divisor) * 100),
    snoozeRate: round((counts.snoozed / divisor) * 100)
  };
};

const calculateAverageResponseTime = (logs) => {
  const responseLogs = logs.filter(
    (log) => log.responseTime !== null && log.responseTime !== undefined
  );

  if (!responseLogs.length) {
    return 0;
  }

  const total = responseLogs.reduce((sum, log) => sum + Number(log.responseTime), 0);
  return round(total / responseLogs.length);
};

const calculateAdaptiveWeight = ({ logs, rates, averageResponseTime }) => {
  if (!logs.length) {
    return 0;
  }

  let weight = 0;

  logs.slice(0, LEARNING_LIMITS.defaultHistoryLimit).forEach((log, index) => {
    const recencyMultiplier = Math.max(0.35, 1 - index * 0.015);
    weight += (ACTION_SCORE_IMPACT[log.action] || 0) * recencyMultiplier;

    if (log.action === 'Completed' && Number(log.responseTime) <= RESPONSE_TIME_THRESHOLDS.fastSeconds) {
      weight += 2 * recencyMultiplier;
    }

    if (
      NEGATIVE_ACTIONS.includes(log.action) &&
      Number(log.contextScore || 0) >= 70
    ) {
      weight -= 2 * recencyMultiplier;
    }
  });

  if (rates.completionRate >= 70) {
    weight += 6;
  }

  if (rates.ignoreRate >= 40 || rates.dismissRate >= 40) {
    weight -= 8;
  }

  if (rates.snoozeRate >= 35) {
    weight -= 4;
  }

  if (averageResponseTime > 0 && averageResponseTime <= RESPONSE_TIME_THRESHOLDS.acceptableSeconds) {
    weight += 3;
  }

  if (rates.completionRate === 0 && logs.length >= 5) {
    weight -= 10;
  }

  return round(
    clamp(weight, LEARNING_LIMITS.minAdaptiveWeight, LEARNING_LIMITS.maxAdaptiveWeight)
  );
};

const calculateConfidenceScore = (logs) => {
  const sampleScore = Math.min(logs.length * 6, 60);
  const recentPositive = logs.slice(0, 10).filter((log) => POSITIVE_ACTIONS.includes(log.action)).length;
  const consistencyScore = logs.length ? (recentPositive / Math.min(logs.length, 10)) * 40 : 0;

  return round(
    clamp(sampleScore + consistencyScore, LEARNING_LIMITS.minConfidence, LEARNING_LIMITS.maxConfidence)
  );
};

const buildLearningProfile = ({ logs, patterns }) => {
  const counts = calculateActionCounts(logs);
  const rates = calculateRates(counts);
  const averageResponseTime = calculateAverageResponseTime(logs);
  const adaptiveWeight = calculateAdaptiveWeight({ logs, rates, averageResponseTime });
  const confidenceScore = calculateConfidenceScore(logs);

  return {
    ...rates,
    averageResponseTime,
    preferredReminderTime: patterns.preferredReminderTime,
    preferredReminderDay: patterns.preferredReminderDay,
    preferredActivity: patterns.preferredActivity,
    preferredLocation: patterns.preferredLocation,
    mostSuccessfulReminderCategory: patterns.mostSuccessfulReminderCategory,
    adaptiveWeight,
    confidenceScore,
    totalBehaviorCount: counts.total,
    patterns: patterns.patterns
  };
};

const adjustContextScore = ({ baseContextScore, profile, activity, timestamp, latitude, longitude }) => {
  const baseScore = Number(baseContextScore || 0);
  const adaptiveWeight = Number(profile?.adaptiveWeight || 0);
  let adjustment = adaptiveWeight;
  const reasons = [];

  if (profile?.preferredActivity && profile.preferredActivity === activity) {
    adjustment += 4;
    reasons.push('Preferred activity matched');
  }

  if (profile?.preferredReminderTime && profile.preferredReminderTime === getTimeBucket(timestamp)) {
    adjustment += 4;
    reasons.push('Preferred reminder time matched');
  }

  if (
    profile?.preferredLocation &&
    latitude !== undefined &&
    longitude !== undefined &&
    Math.abs(Number(latitude) - Number(profile.preferredLocation.latitude)) <= 0.002 &&
    Math.abs(Number(longitude) - Number(profile.preferredLocation.longitude)) <= 0.002
  ) {
    adjustment += 4;
    reasons.push('Preferred location matched');
  }

  if (profile?.ignoreRate >= 40) {
    adjustment -= 5;
    reasons.push('High ignore rate');
  }

  if (profile?.dismissRate >= 40) {
    adjustment -= 5;
    reasons.push('High dismiss rate');
  }

  if (profile?.snoozeRate >= 35) {
    adjustment -= 3;
    reasons.push('High snooze rate');
  }

  const adjustedContextScore = round(clamp(baseScore + adjustment, 0, 100));
  const confidenceScore = Number(profile?.confidenceScore || 0);

  return {
    baseContextScore: baseScore,
    adjustedContextScore,
    confidenceScore,
    adaptiveWeight: round(adjustment),
    decisionRecommendation:
      adjustedContextScore >= 70 ? 'Trigger Reminder' : 'Suppress Reminder',
    successProbability: round(clamp(adjustedContextScore * 0.7 + confidenceScore * 0.3, 0, 100)),
    reasons
  };
};

const predictBestContext = (profile) => ({
  bestReminderTime: profile?.preferredReminderTime || 'Unknown',
  bestReminderDay: profile?.preferredReminderDay || 'Unknown',
  bestLocation: profile?.preferredLocation || null,
  bestActivity: profile?.preferredActivity || 'Unknown',
  expectedResponseTime: profile?.averageResponseTime || 0,
  reminderSuccessProbability: round(
    clamp((profile?.completionRate || 0) * 0.65 + (profile?.confidenceScore || 0) * 0.35, 0, 100)
  ),
  decisionRecommendation:
    (profile?.completionRate || 0) >= 60 ? 'Trigger Reminder' : 'Require Context Check'
});

module.exports = {
  buildLearningProfile,
  adjustContextScore,
  predictBestContext
};
