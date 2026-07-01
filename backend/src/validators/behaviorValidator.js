const { body, query } = require('express-validator');

const { USER_ACTIONS } = require('../utils/learningWeights');
const { ACTIVITY_TYPES, NETWORK_STATUSES } = require('../utils/contextWeights');

const reminderIdRule = body('reminderId')
  .trim()
  .notEmpty()
  .withMessage('Reminder ID is required.');

const actionRule = body('action')
  .trim()
  .notEmpty()
  .withMessage('Action is required.')
  .bail()
  .isIn(USER_ACTIONS)
  .withMessage('Invalid behavior action.');

const contextScoreRule = body('contextScore')
  .optional({ nullable: true, checkFalsy: true })
  .isFloat({ min: 0, max: 100 })
  .withMessage('Context score must be between 0 and 100.');

const responseTimeRule = body('responseTime')
  .optional({ nullable: true, checkFalsy: true })
  .isFloat({ min: 0 })
  .withMessage('Response time must be greater than or equal to 0.');

const latitudeRule = body('latitude')
  .optional({ nullable: true, checkFalsy: true })
  .isFloat({ min: -90, max: 90 })
  .withMessage('Latitude must be between -90 and 90.');

const longitudeRule = body('longitude')
  .optional({ nullable: true, checkFalsy: true })
  .isFloat({ min: -180, max: 180 })
  .withMessage('Longitude must be between -180 and 180.');

const batteryRule = body('batteryLevel')
  .optional({ nullable: true, checkFalsy: true })
  .isFloat({ min: 0, max: 100 })
  .withMessage('Battery level must be between 0 and 100.');

const activityRule = body('activity')
  .optional()
  .isIn(ACTIVITY_TYPES)
  .withMessage('Invalid activity type.');

const networkRule = body('networkStatus')
  .optional()
  .isIn(NETWORK_STATUSES)
  .withMessage('Invalid network status.');

const timestampRule = body('timestamp')
  .optional()
  .isISO8601()
  .withMessage('Timestamp must be a valid ISO date-time.');

const logRules = [
  reminderIdRule,
  actionRule,
  contextScoreRule,
  responseTimeRule,
  activityRule,
  latitudeRule,
  longitudeRule,
  batteryRule,
  networkRule,
  timestampRule
];

const historyRules = [
  query('reminderId').optional().trim().notEmpty().withMessage('Reminder ID must not be empty.'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100.'),
  query('cursor').optional().trim().notEmpty().withMessage('Cursor must not be empty.')
];

const analyzeRules = [
  body('limit').optional().isInt({ min: 1, max: 500 }).withMessage('Limit must be between 1 and 500.'),
  contextScoreRule,
  activityRule,
  latitudeRule,
  longitudeRule,
  timestampRule
];

module.exports = {
  logRules,
  historyRules,
  analyzeRules
};
