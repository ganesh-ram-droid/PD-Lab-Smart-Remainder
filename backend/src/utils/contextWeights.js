const CONTEXT_WEIGHTS = Object.freeze({
  location: 35,
  time: 20,
  activity: 15,
  history: 15,
  priority: 10,
  battery: 3,
  network: 2
});

const CONTEXT_THRESHOLD = 70;

const ACTIVITY_TYPES = Object.freeze([
  'Walking',
  'Running',
  'Driving',
  'Cycling',
  'Stationary',
  'Unknown'
]);

const DEVICE_STATES = Object.freeze([
  'Screen On',
  'Screen Off',
  'Charging',
  'Low Battery'
]);

const NETWORK_STATUSES = Object.freeze(['WiFi', 'Mobile Data', 'Offline']);

const PRIORITY_SCORE_MAP = Object.freeze({
  High: 10,
  Medium: 7,
  Low: 4
});

const DAY_NAMES = Object.freeze([
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
]);

const DAY_NAME_TO_INDEX = Object.freeze({
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6
});

const CATEGORY_ACTIVITY_MAP = Object.freeze({
  Medicine: ['Stationary', 'Unknown'],
  Shopping: ['Walking', 'Stationary', 'Unknown'],
  Meeting: ['Stationary', 'Unknown'],
  Work: ['Stationary', 'Unknown'],
  College: ['Walking', 'Stationary', 'Unknown'],
  Exercise: ['Walking', 'Running', 'Cycling'],
  Travel: ['Driving', 'Cycling', 'Walking'],
  Bills: ['Stationary', 'Unknown'],
  Personal: ['Stationary', 'Walking', 'Unknown'],
  Custom: ACTIVITY_TYPES
});

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const roundCoordinate = (value) => Math.round(Number(value) * 10000) / 10000;

const normalizeBatteryLevel = (value) => {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  const numeric = Number(value);

  if (Number.isNaN(numeric)) {
    return null;
  }

  return clamp(numeric, 0, 100);
};

const normalizeDeviceState = (value) => {
  if (!value) {
    return 'Screen On';
  }

  return DEVICE_STATES.includes(value) ? value : 'Screen On';
};

const normalizeNetworkStatus = (value) => {
  if (!value) {
    return 'Offline';
  }

  return NETWORK_STATUSES.includes(value) ? value : 'Offline';
};

const getDayIndex = (dayName) => DAY_NAME_TO_INDEX[dayName];

module.exports = {
  CONTEXT_WEIGHTS,
  CONTEXT_THRESHOLD,
  ACTIVITY_TYPES,
  DEVICE_STATES,
  NETWORK_STATUSES,
  PRIORITY_SCORE_MAP,
  DAY_NAMES,
  DAY_NAME_TO_INDEX,
  CATEGORY_ACTIVITY_MAP,
  clamp,
  roundCoordinate,
  normalizeBatteryLevel,
  normalizeDeviceState,
  normalizeNetworkStatus,
  getDayIndex
};
