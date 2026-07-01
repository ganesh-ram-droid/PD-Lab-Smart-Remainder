const { body, param, query } = require('express-validator');

const { ACTIVITY_TYPES, DEVICE_STATES, NETWORK_STATUSES, DAY_NAMES } = require('../utils/contextWeights');

const latitudeRule = (source) =>
  source('currentLatitude')
    .notEmpty()
    .withMessage('Latitude is required.')
    .bail()
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be between -90 and 90.');

const longitudeRule = (source) =>
  source('currentLongitude')
    .notEmpty()
    .withMessage('Longitude is required.')
    .bail()
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be between -180 and 180.');

const activityRule = (source) =>
  source('currentActivity')
    .notEmpty()
    .withMessage('Activity is required.')
    .bail()
    .isIn(ACTIVITY_TYPES)
    .withMessage('Invalid activity type.');

const reminderIdRule = body('reminderId')
  .trim()
  .notEmpty()
  .withMessage('ReminderId is required.');

const userIdRule = body('userId')
  .optional()
  .trim()
  .custom((value, { req }) => !value || value === req.user.uid)
  .withMessage('UserId must match the authenticated user.');

const currentTimeRule = (source) =>
  source('currentTime').optional().isISO8601().withMessage('Current time must be a valid ISO date-time.');

const dayOfWeekRule = (source) =>
  source('dayOfWeek')
    .optional()
    .isIn(DAY_NAMES)
    .withMessage('Day of week must be a valid day name.');

const batteryRule = (source) =>
  source('batteryLevel')
    .optional({ nullable: true, checkFalsy: false })
    .isFloat({ min: 0, max: 100 })
    .withMessage('Battery level must be between 0 and 100.');

const networkRule = (source) =>
  source('networkStatus').optional().isIn(NETWORK_STATUSES).withMessage('Invalid network status.');

const deviceStateRule = (source) =>
  source('deviceState').optional().isIn(DEVICE_STATES).withMessage('Invalid device state.');

const weatherRule = (source) =>
  source('weather').optional().isLength({ max: 100 }).withMessage('Weather must be 100 characters or less.');

const evaluateRules = [
  reminderIdRule,
  userIdRule,
  latitudeRule(body),
  longitudeRule(body),
  activityRule(body),
  currentTimeRule(body),
  dayOfWeekRule(body),
  batteryRule(body),
  networkRule(body),
  deviceStateRule(body),
  weatherRule(body)
];

const logRules = [
  reminderIdRule,
  userIdRule,
  latitudeRule(body),
  longitudeRule(body),
  activityRule(body),
  currentTimeRule(body),
  dayOfWeekRule(body),
  batteryRule(body),
  networkRule(body),
  deviceStateRule(body),
  weatherRule(body),
  body('contextScore').optional().isFloat({ min: 0, max: 100 }).withMessage('Context score must be between 0 and 100.'),
  body('decision').optional().isIn(['Trigger Reminder', 'Suppress Reminder']).withMessage('Invalid decision.')
];

const historyRules = [
  query('reminderId').optional().trim().notEmpty().withMessage('ReminderId must not be empty.'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100.')
];

const scoreRules = [
  param('reminderId').trim().notEmpty().withMessage('ReminderId is required.'),
  latitudeRule(query),
  longitudeRule(query),
  activityRule(query),
  currentTimeRule(query),
  dayOfWeekRule(query),
  batteryRule(query),
  networkRule(query),
  deviceStateRule(query),
  weatherRule(query)
];

module.exports = {
  evaluateRules,
  logRules,
  historyRules,
  scoreRules
};
