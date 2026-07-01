const {
  CONTEXT_WEIGHTS,
  CONTEXT_THRESHOLD,
  CATEGORY_ACTIVITY_MAP,
  PRIORITY_SCORE_MAP,
  clamp,
  getDayIndex
} = require('../utils/contextWeights');

const calculateDistanceMeters = (lat1, lon1, lat2, lon2) => {
  const earthRadiusMeters = 6371000;
  const toRadians = (value) => (value * Math.PI) / 180;

  const deltaLat = toRadians(lat2 - lat1);
  const deltaLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(deltaLon / 2) *
      Math.sin(deltaLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadiusMeters * c;
};

const parseDateTime = (value) => {
  if (!value) {
    return new Date();
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
};

const getPriorityScore = (priority) => PRIORITY_SCORE_MAP[priority] || 0;

const evaluateLocationScore = ({ reminder, currentLatitude, currentLongitude }) => {
  const hasReminderCoordinates =
    reminder.latitude !== null &&
    reminder.latitude !== undefined &&
    reminder.longitude !== null &&
    reminder.longitude !== undefined;

  if (!hasReminderCoordinates || currentLatitude === null || currentLongitude === null) {
    return {
      locationMatched: false,
      distance: null,
      locationScore: 0,
      locationReason: 'Outside reminder radius'
    };
  }

  const distance = calculateDistanceMeters(
    Number(currentLatitude),
    Number(currentLongitude),
    Number(reminder.latitude),
    Number(reminder.longitude)
  );
  const radius = Number(reminder.radius || 0);

  if (radius > 0 && distance <= radius) {
    return {
      locationMatched: true,
      distance: Math.round(distance),
      locationScore: CONTEXT_WEIGHTS.location,
      locationReason: 'Location matched'
    };
  }

  if (radius > 0 && distance <= radius * 1.5) {
    return {
      locationMatched: false,
      distance: Math.round(distance),
      locationScore: 12,
      locationReason: 'Near reminder location'
    };
  }

  return {
    locationMatched: false,
    distance: Math.round(distance),
    locationScore: 0,
    locationReason: 'Outside reminder radius'
  };
};

const evaluateTimeScore = ({ reminder, currentTime, dayOfWeek }) => {
  const now = parseDateTime(currentTime);
  const reminderDateTime = parseDateTime(`${reminder.reminderDate}T${reminder.reminderTime}:00`);
  const currentDay = dayOfWeek || now.toLocaleDateString('en-US', { weekday: 'long' });
  const currentDayIndex = getDayIndex(currentDay);

  const diffMinutes = Math.abs(now.getTime() - reminderDateTime.getTime()) / 60000;
  const repeatMode = reminder.repeat || 'None';
  const repeatDays = Array.isArray(reminder.repeatDays)
    ? reminder.repeatDays.map((day) => Number(day))
    : [];
  const currentDayAllowed =
    repeatMode === 'Daily' ||
    (repeatMode === 'Weekly' && repeatDays.includes(currentDayIndex)) ||
    (repeatMode === 'Monthly' && now.getDate() === reminderDateTime.getDate()) ||
    (repeatMode === 'Custom' && repeatDays.includes(currentDayIndex)) ||
    (repeatMode === 'None' && now.toISOString().slice(0, 10) === reminder.reminderDate);

  let timeScore = 0;
  const timeReasons = [];

  if (currentDayAllowed && diffMinutes <= 30) {
    timeScore = CONTEXT_WEIGHTS.time;
    timeReasons.push('Time matched');
  } else if (currentDayAllowed && diffMinutes <= 90) {
    timeScore = 14;
    timeReasons.push('Morning routine');
  } else if (currentDayAllowed && diffMinutes <= 180) {
    timeScore = 8;
    timeReasons.push('Scheduled day matched');
  } else if (!currentDayAllowed) {
    timeScore = 0;
    timeReasons.push('Reminder day did not match');
  }

  return {
    timeMatched: timeScore >= 14,
    timeScore,
    currentTime: now.toISOString(),
    dayOfWeek: currentDay,
    timeReasons
  };
};

const evaluateActivityScore = ({ reminder, currentActivity }) => {
  const normalizedActivity = currentActivity || 'Unknown';
  const expectedActivities = CATEGORY_ACTIVITY_MAP[reminder.category] || CATEGORY_ACTIVITY_MAP.Custom;

  let activityScore = 0;
  const activityReasons = [];

  if (expectedActivities.includes(normalizedActivity)) {
    if (normalizedActivity === 'Driving') {
      activityReasons.push('Driving detected');
    } else if (normalizedActivity === 'Walking') {
      activityReasons.push('Walking detected');
    } else if (normalizedActivity === 'Running') {
      activityReasons.push('Running detected');
    } else if (normalizedActivity === 'Cycling') {
      activityReasons.push('Cycling detected');
    } else if (normalizedActivity === 'Stationary') {
      activityReasons.push('Morning routine');
    } else {
      activityReasons.push('Activity matched');
    }

    activityScore = CONTEXT_WEIGHTS.activity;
  } else if (normalizedActivity === 'Unknown') {
    activityScore = 6;
    activityReasons.push('Activity could not be determined');
  } else {
    activityScore = 4;
    activityReasons.push('Activity weakly matched');
  }

  return {
    activityMatched: activityScore >= 10,
    activityScore,
    activityReasons,
    currentActivity: normalizedActivity
  };
};

const evaluateBatteryScore = ({ batteryLevel, deviceState }) => {
  const level = batteryLevel === null || batteryLevel === undefined ? null : Number(batteryLevel);

  if (deviceState === 'Charging') {
    return {
      batteryScore: CONTEXT_WEIGHTS.battery,
      batteryReason: 'Device is charging'
    };
  }

  if (deviceState === 'Low Battery' || (level !== null && level < 15)) {
    return {
      batteryScore: 0,
      batteryReason: 'Low battery'
    };
  }

  if (level !== null && level >= 60) {
    return {
      batteryScore: CONTEXT_WEIGHTS.battery,
      batteryReason: 'Battery healthy'
    };
  }

  if (level !== null && level >= 30) {
    return {
      batteryScore: 2,
      batteryReason: 'Battery acceptable'
    };
  }

  return {
    batteryScore: 1,
    batteryReason: 'Battery level moderate'
  };
};

const evaluateNetworkScore = (networkStatus) => {
  if (networkStatus === 'WiFi') {
    return {
      networkScore: CONTEXT_WEIGHTS.network,
      networkReason: 'WiFi available'
    };
  }

  if (networkStatus === 'Mobile Data') {
    return {
      networkScore: 1,
      networkReason: 'Mobile data available'
    };
  }

  return {
    networkScore: 0,
    networkReason: 'Offline'
  };
};

const calculateContextScore = ({ reminder, context, historyScore }) => {
  const location = evaluateLocationScore({
    reminder,
    currentLatitude: context.currentLatitude,
    currentLongitude: context.currentLongitude
  });
  const time = evaluateTimeScore({
    reminder,
    currentTime: context.currentTime,
    dayOfWeek: context.dayOfWeek
  });
  const activity = evaluateActivityScore({
    reminder,
    currentActivity: context.currentActivity
  });
  const battery = evaluateBatteryScore({
    batteryLevel: context.batteryLevel,
    deviceState: context.deviceState
  });
  const network = evaluateNetworkScore(context.networkStatus);
  const priorityScore = getPriorityScore(reminder.priority);

  const total = clamp(
    location.locationScore +
      time.timeScore +
      activity.activityScore +
      historyScore +
      priorityScore +
      battery.batteryScore +
      network.networkScore,
    0,
    100
  );

  const reasons = [
    location.locationReason,
    ...time.timeReasons,
    ...activity.activityReasons,
    battery.batteryReason,
    network.networkReason
  ].filter(Boolean);

  if (historyScore >= 12) {
    reasons.push('High completion history');
  } else if (historyScore <= 4) {
    reasons.push('Reminder already ignored recently');
  }

  if (priorityScore >= 10) {
    reasons.push('High priority');
  }

  return {
    locationMatched: location.locationMatched,
    timeMatched: time.timeMatched,
    activityMatched: activity.activityMatched,
    locationScore: location.locationScore,
    timeScore: time.timeScore,
    activityScore: activity.activityScore,
    priorityScore,
    historyScore,
    batteryScore: battery.batteryScore,
    networkScore: network.networkScore,
    contextScore: total,
    decision: total >= CONTEXT_THRESHOLD ? 'Trigger Reminder' : 'Suppress Reminder',
    reason: reasons.slice(0, 5).join(', '),
    distance: location.distance,
    currentTime: time.currentTime,
    dayOfWeek: time.dayOfWeek,
    currentActivity: activity.currentActivity
  };
};

module.exports = {
  calculateContextScore
};
