const { body, param, query } = require('express-validator');

const {
  NOTIFICATION_TYPES,
  NOTIFICATION_STATUSES,
  NOTIFICATION_PRIORITIES
} = require('../utils/notificationTemplates');
const { ACTIVITY_TYPES, DEVICE_STATES, NETWORK_STATUSES, DAY_NAMES } = require('../utils/contextWeights');

const platformOptions = ['android', 'ios', 'web', 'unknown'];

const deviceTokenRules = [
  body('deviceId')
    .trim()
    .notEmpty()
    .withMessage('Device ID is required.')
    .isLength({ min: 2, max: 120 })
    .withMessage('Device ID must be between 2 and 120 characters.'),
  body('deviceToken')
    .trim()
    .notEmpty()
    .withMessage('Device token is required.')
    .isLength({ min: 20 })
    .withMessage('Device token is invalid.'),
  body('platform')
    .optional()
    .trim()
    .toLowerCase()
    .isIn(platformOptions)
    .withMessage('Platform must be android, ios, web, or unknown.')
];

const deleteTokenRules = [
  body('deviceId')
    .trim()
    .notEmpty()
    .withMessage('Device ID is required.')
];

const notificationIdBodyRule = body('notificationId')
  .trim()
  .notEmpty()
  .withMessage('Notification ID is required.');

const reminderIdRule = body('reminderId')
  .trim()
  .notEmpty()
  .withMessage('Reminder ID is required.');

const contextRules = [
  body('context.currentLatitude')
    .notEmpty()
    .withMessage('Current latitude is required for context evaluation.')
    .bail()
    .isFloat({ min: -90, max: 90 })
    .withMessage('Current latitude must be between -90 and 90.'),
  body('context.currentLongitude')
    .notEmpty()
    .withMessage('Current longitude is required for context evaluation.')
    .bail()
    .isFloat({ min: -180, max: 180 })
    .withMessage('Current longitude must be between -180 and 180.'),
  body('context.currentActivity')
    .notEmpty()
    .withMessage('Current activity is required for context evaluation.')
    .bail()
    .isIn(ACTIVITY_TYPES)
    .withMessage('Invalid activity type.'),
  body('context.currentTime')
    .optional()
    .isISO8601()
    .withMessage('Current time must be a valid ISO date-time.'),
  body('context.dayOfWeek')
    .optional()
    .isIn(DAY_NAMES)
    .withMessage('Day of week must be a valid day name.'),
  body('context.batteryLevel')
    .optional({ nullable: true, checkFalsy: false })
    .isFloat({ min: 0, max: 100 })
    .withMessage('Battery level must be between 0 and 100.'),
  body('context.networkStatus')
    .optional()
    .isIn(NETWORK_STATUSES)
    .withMessage('Invalid network status.'),
  body('context.deviceState')
    .optional()
    .isIn(DEVICE_STATES)
    .withMessage('Invalid device state.'),
  body('context.weather')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Weather must be 100 characters or less.')
];

const notificationContentRules = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 2, max: 120 })
    .withMessage('Title must be between 2 and 120 characters.'),
  body('body')
    .optional()
    .trim()
    .isLength({ min: 2, max: 500 })
    .withMessage('Body must be between 2 and 500 characters.'),
  body('type')
    .optional()
    .isIn(NOTIFICATION_TYPES)
    .withMessage('Invalid notification type.'),
  body('priority')
    .optional()
    .isIn(NOTIFICATION_PRIORITIES)
    .withMessage('Invalid notification priority.'),
  body('deviceToken')
    .optional()
    .isLength({ min: 20 })
    .withMessage('Device token is invalid.')
];

const sendRules = [
  reminderIdRule,
  ...contextRules,
  ...notificationContentRules
];

const localRules = sendRules;

const scheduleRules = [
  reminderIdRule,
  body('scheduledTime')
    .notEmpty()
    .withMessage('Scheduled time is required.')
    .bail()
    .isISO8601()
    .withMessage('Scheduled time must be a valid ISO date-time.'),
  ...contextRules,
  ...notificationContentRules
];

const cancelRules = [notificationIdBodyRule];

const rescheduleRules = [
  notificationIdBodyRule,
  body('scheduledTime')
    .notEmpty()
    .withMessage('Scheduled time is required.')
    .bail()
    .isISO8601()
    .withMessage('Scheduled time must be a valid ISO date-time.')
];

const retryRules = [
  notificationIdBodyRule,
  body('deviceToken')
    .optional()
    .isLength({ min: 20 })
    .withMessage('Device token is invalid.'),
  ...contextRules
];

const historyRules = [
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100.'),
  query('status')
    .optional()
    .isIn(NOTIFICATION_STATUSES)
    .withMessage('Invalid notification status.')
];

const detailsRules = [
  param('id')
    .trim()
    .notEmpty()
    .withMessage('Notification ID is required.')
];

module.exports = {
  deviceTokenRules,
  deleteTokenRules,
  sendRules,
  localRules,
  scheduleRules,
  cancelRules,
  rescheduleRules,
  retryRules,
  historyRules,
  detailsRules
};
