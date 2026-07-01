const contextModel = require('../models/contextModel');
const { clamp } = require('../utils/contextWeights');

const buildHistoryInsights = async ({ userId, reminderId, reminder }) => {
  const recentLogs = await contextModel.getContextLogsByReminder(userId, reminderId, 10);

  if (!recentLogs.length) {
    return {
      historyScore: 8,
      historyReasons: ['No recent reminder history available.'],
      recentLogs
    };
  }

  const triggerCount = recentLogs.filter((log) => log.decision === 'Trigger Reminder').length;
  const suppressCount = recentLogs.filter((log) => log.decision === 'Suppress Reminder').length;
  const completionRatio = triggerCount / recentLogs.length;

  let historyScore = 5 + Math.round(completionRatio * 8);
  const historyReasons = [];

  if (completionRatio >= 0.7) {
    historyScore += 4;
    historyReasons.push('User usually completes reminder.');
  }

  if (suppressCount >= 3 && recentLogs.slice(0, 3).every((log) => log.decision === 'Suppress Reminder')) {
    historyScore -= 5;
    historyReasons.push('Reminder already ignored recently.');
  }

  if (reminder && reminder.status === 'Snoozed') {
    historyScore -= 1;
    historyReasons.push('Reminder was snoozed before.');
  }

  if (reminder && reminder.priority === 'High') {
    historyScore += 1;
  }

  historyScore = clamp(historyScore, 0, 15);

  return {
    historyScore,
    historyReasons,
    recentLogs
  };
};

const getContextHistory = async (userId, reminderId = null, limit = 25) => {
  return contextModel.getContextLogsByUser(userId, { reminderId, limit });
};

module.exports = {
  buildHistoryInsights,
  getContextHistory
};
