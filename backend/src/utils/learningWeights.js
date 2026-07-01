const USER_ACTIONS = Object.freeze([
  'Completed',
  'Ignored',
  'Dismissed',
  'Snoozed',
  'Opened Notification',
  'Delayed Reminder',
  'Cancelled Reminder'
]);

const POSITIVE_ACTIONS = Object.freeze(['Completed', 'Opened Notification']);

const NEGATIVE_ACTIONS = Object.freeze([
  'Ignored',
  'Dismissed',
  'Snoozed',
  'Delayed Reminder',
  'Cancelled Reminder'
]);

const ACTION_SCORE_IMPACT = Object.freeze({
  Completed: 8,
  'Opened Notification': 3,
  Ignored: -8,
  Dismissed: -6,
  Snoozed: -4,
  'Delayed Reminder': -3,
  'Cancelled Reminder': -7
});

const LEARNING_LIMITS = Object.freeze({
  minAdaptiveWeight: -20,
  maxAdaptiveWeight: 20,
  minConfidence: 0,
  maxConfidence: 100,
  defaultHistoryLimit: 50
});

const RESPONSE_TIME_THRESHOLDS = Object.freeze({
  fastSeconds: 60,
  acceptableSeconds: 300,
  slowSeconds: 900
});

const TIME_BUCKETS = Object.freeze({
  Morning: { start: 5, end: 11 },
  Afternoon: { start: 12, end: 16 },
  Evening: { start: 17, end: 20 },
  Night: { start: 21, end: 23 },
  LateNight: { start: 0, end: 4 }
});

const WEEKEND_DAYS = Object.freeze(['Saturday', 'Sunday']);

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const round = (value, precision = 2) => {
  const multiplier = 10 ** precision;
  return Math.round(Number(value) * multiplier) / multiplier;
};

const getTimeBucket = (timestamp) => {
  const date = timestamp ? new Date(timestamp) : new Date();
  const hour = date.getHours();

  return Object.entries(TIME_BUCKETS).find(([, range]) => {
    if (range.start <= range.end) {
      return hour >= range.start && hour <= range.end;
    }

    return hour >= range.start || hour <= range.end;
  })?.[0] || 'Unknown';
};

const getDayType = (timestamp) => {
  const date = timestamp ? new Date(timestamp) : new Date();
  const day = date.toLocaleDateString('en-US', { weekday: 'long' });
  return WEEKEND_DAYS.includes(day) ? 'Weekend' : 'Weekday';
};

const buildBehaviorDedupKey = ({ userId, reminderId, action, timestamp }) => {
  const minuteBucket = new Date(timestamp || Date.now()).toISOString().slice(0, 16);
  return [userId, reminderId, action, minuteBucket].join('|');
};

module.exports = {
  USER_ACTIONS,
  POSITIVE_ACTIONS,
  NEGATIVE_ACTIONS,
  ACTION_SCORE_IMPACT,
  LEARNING_LIMITS,
  RESPONSE_TIME_THRESHOLDS,
  TIME_BUCKETS,
  WEEKEND_DAYS,
  clamp,
  round,
  getTimeBucket,
  getDayType,
  buildBehaviorDedupKey
};
