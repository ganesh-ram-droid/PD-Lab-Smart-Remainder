const reminderModel = require('../models/reminderModel');
const {
  POSITIVE_ACTIONS,
  getTimeBucket,
  getDayType,
  round
} = require('../utils/learningWeights');

const increment = (map, key) => {
  if (!key && key !== 0) {
    return;
  }

  map.set(key, (map.get(key) || 0) + 1);
};

const getTopKey = (map, fallback = null) => {
  let topKey = fallback;
  let topValue = -1;

  map.forEach((value, key) => {
    if (value > topValue) {
      topKey = key;
      topValue = value;
    }
  });

  return topKey;
};

const buildLocationCluster = (logs) => {
  const completedWithLocation = logs.filter(
    (log) =>
      POSITIVE_ACTIONS.includes(log.action) &&
      log.latitude !== null &&
      log.latitude !== undefined &&
      log.longitude !== null &&
      log.longitude !== undefined
  );

  if (!completedWithLocation.length) {
    return null;
  }

  const latitude =
    completedWithLocation.reduce((sum, log) => sum + Number(log.latitude), 0) /
    completedWithLocation.length;
  const longitude =
    completedWithLocation.reduce((sum, log) => sum + Number(log.longitude), 0) /
    completedWithLocation.length;

  return {
    latitude: round(latitude, 6),
    longitude: round(longitude, 6),
    sampleSize: completedWithLocation.length
  };
};

const getMostSuccessfulCategory = async (logs) => {
  const categoryMap = new Map();

  const completedLogs = logs.filter((log) => POSITIVE_ACTIONS.includes(log.action));

  await Promise.all(
    completedLogs.map(async (log) => {
      const reminder = await reminderModel.getReminderById(log.reminderId);

      if (reminder?.category) {
        increment(categoryMap, reminder.category);
      }
    })
  );

  return getTopKey(categoryMap, null);
};

const identifyPatterns = (logs) => {
  const completedLogs = logs.filter((log) => POSITIVE_ACTIONS.includes(log.action));
  const timeBuckets = new Map();
  const dayTypes = new Map();
  const activities = new Map();

  completedLogs.forEach((log) => {
    increment(timeBuckets, getTimeBucket(log.timestamp));
    increment(dayTypes, getDayType(log.timestamp));
    increment(activities, log.activity || 'Unknown');
  });

  const topTimeBucket = getTopKey(timeBuckets, null);
  const topDayType = getTopKey(dayTypes, null);
  const topActivity = getTopKey(activities, null);
  const patterns = [];

  if (topTimeBucket === 'Morning') {
    patterns.push('Morning routines');
  }

  if (topTimeBucket === 'Evening') {
    patterns.push('Evening routines');
  }

  if (topDayType === 'Weekend') {
    patterns.push('Weekend habits');
  }

  if (topDayType === 'Weekday') {
    patterns.push('Weekday habits');
  }

  if (topActivity === 'Stationary') {
    patterns.push('Office reminders');
    patterns.push('Home reminders');
  }

  if (['Driving', 'Cycling', 'Walking'].includes(topActivity)) {
    patterns.push('Travel habits');
  }

  return {
    patterns,
    topTimeBucket,
    topDayType,
    topActivity
  };
};

const analyzeBehaviorPatterns = async (logs) => {
  const completedLogs = logs.filter((log) => POSITIVE_ACTIONS.includes(log.action));
  const activityMap = new Map();
  const timeMap = new Map();
  const dayMap = new Map();

  completedLogs.forEach((log) => {
    increment(activityMap, log.activity || 'Unknown');
    increment(timeMap, getTimeBucket(log.timestamp));
    increment(dayMap, getDayType(log.timestamp));
  });

  const patternSummary = identifyPatterns(logs);

  return {
    preferredReminderTime: getTopKey(timeMap, 'Unknown'),
    preferredReminderDay: getTopKey(dayMap, 'Unknown'),
    preferredActivity: getTopKey(activityMap, 'Unknown'),
    preferredLocation: buildLocationCluster(logs),
    mostSuccessfulReminderCategory: await getMostSuccessfulCategory(logs),
    patterns: patternSummary.patterns
  };
};

module.exports = {
  analyzeBehaviorPatterns,
  identifyPatterns
};
