const { body, param, query } = require('express-validator');

const categories = [
  'Medicine',
  'Shopping',
  'Meeting',
  'Work',
  'College',
  'Exercise',
  'Travel',
  'Bills',
  'Personal',
  'Custom'
];

const priorities = ['High', 'Medium', 'Low'];
const repeatOptions = ['None', 'Daily', 'Weekly', 'Monthly', 'Custom'];
const statuses = ['Pending', 'Completed', 'Missed', 'Cancelled', 'Snoozed'];
const sortOptions = ['newest', 'oldest', 'priority', 'reminderDate'];

const numberRule = (field, message) =>
  body(field)
    .optional({ checkFalsy: true })
    .isNumeric()
    .withMessage(message);

const createReminderRules = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required.')
    .bail()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters.'),
  body('description')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must be at most 500 characters.'),
  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required.')
    .bail()
    .isIn(categories)
    .withMessage('Invalid reminder category.'),
  body('priority')
    .trim()
    .notEmpty()
    .withMessage('Priority is required.')
    .bail()
    .isIn(priorities)
    .withMessage('Priority must be High, Medium, or Low.'),
  body('reminderType')
    .optional()
    .trim()
    .isIn(['Manual', 'Location', 'Time', 'Context'])
    .withMessage('Invalid reminder type.'),
  body('location')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 200 })
    .withMessage('Location must be at most 200 characters.'),
  body('latitude')
    .optional({ checkFalsy: true })
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be a valid value between -90 and 90.'),
  body('longitude')
    .optional({ checkFalsy: true })
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be a valid value between -180 and 180.'),
  body('radius')
    .optional({ checkFalsy: true })
    .isFloat({ gt: 0 })
    .withMessage('Radius must be greater than 0.'),
  body('reminderDate')
    .trim()
    .notEmpty()
    .withMessage('Reminder date is required.')
    .bail()
    .isDate({ format: 'YYYY-MM-DD' })
    .withMessage('Reminder date must be in YYYY-MM-DD format.'),
  body('reminderTime')
    .trim()
    .notEmpty()
    .withMessage('Reminder time is required.')
    .bail()
    .matches(/^([01]\d|2[0-3]):[0-5]\d$/)
    .withMessage('Reminder time must be in HH:mm format.'),
  body('repeat')
    .optional()
    .trim()
    .isIn(repeatOptions)
    .withMessage('Invalid repeat option.'),
  body('repeatDays')
    .optional()
    .isArray()
    .withMessage('Repeat days must be an array.'),
  body('repeatDays.*')
    .optional()
    .isInt({ min: 0, max: 6 })
    .withMessage('Repeat days must contain integers from 0 to 6.'),
  body('status')
    .optional()
    .trim()
    .isIn(statuses)
    .withMessage('Invalid reminder status.'),
  body('isActive').optional().isBoolean().withMessage('isActive must be true or false.').toBoolean(),
  body('notificationEnabled')
    .optional()
    .isBoolean()
    .withMessage('notificationEnabled must be true or false.')
    .toBoolean(),
  body('contextEnabled')
    .optional()
    .isBoolean()
    .withMessage('contextEnabled must be true or false.')
    .toBoolean()
];

const updateReminderRules = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters.'),
  body('description')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must be at most 500 characters.'),
  body('category')
    .optional()
    .trim()
    .isIn(categories)
    .withMessage('Invalid reminder category.'),
  body('priority')
    .optional()
    .trim()
    .isIn(priorities)
    .withMessage('Priority must be High, Medium, or Low.'),
  body('reminderType')
    .optional()
    .trim()
    .isIn(['Manual', 'Location', 'Time', 'Context'])
    .withMessage('Invalid reminder type.'),
  body('location')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 200 })
    .withMessage('Location must be at most 200 characters.'),
  body('latitude')
    .optional({ checkFalsy: true })
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be a valid value between -90 and 90.'),
  body('longitude')
    .optional({ checkFalsy: true })
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be a valid value between -180 and 180.'),
  body('radius')
    .optional({ checkFalsy: true })
    .isFloat({ gt: 0 })
    .withMessage('Radius must be greater than 0.'),
  body('reminderDate')
    .optional()
    .isDate({ format: 'YYYY-MM-DD' })
    .withMessage('Reminder date must be in YYYY-MM-DD format.'),
  body('reminderTime')
    .optional()
    .matches(/^([01]\d|2[0-3]):[0-5]\d$/)
    .withMessage('Reminder time must be in HH:mm format.'),
  body('repeat')
    .optional()
    .trim()
    .isIn(repeatOptions)
    .withMessage('Invalid repeat option.'),
  body('repeatDays')
    .optional()
    .isArray()
    .withMessage('Repeat days must be an array.'),
  body('repeatDays.*')
    .optional()
    .isInt({ min: 0, max: 6 })
    .withMessage('Repeat days must contain integers from 0 to 6.'),
  body('status')
    .optional()
    .trim()
    .isIn(statuses)
    .withMessage('Invalid reminder status.'),
  body('isActive').optional().isBoolean().withMessage('isActive must be true or false.').toBoolean(),
  body('notificationEnabled')
    .optional()
    .isBoolean()
    .withMessage('notificationEnabled must be true or false.')
    .toBoolean(),
  body('contextEnabled')
    .optional()
    .isBoolean()
    .withMessage('contextEnabled must be true or false.')
    .toBoolean()
];

const reminderIdRule = param('id').trim().notEmpty().withMessage('Reminder ID is required.');

const listQueryRules = [
  query('category').optional().isIn(categories).withMessage('Invalid category filter.'),
  query('priority').optional().isIn(priorities).withMessage('Invalid priority filter.'),
  query('status').optional().isIn(statuses).withMessage('Invalid status filter.'),
  query('date')
    .optional()
    .isDate({ format: 'YYYY-MM-DD' })
    .withMessage('Date filter must be in YYYY-MM-DD format.'),
  query('isActive').optional().isBoolean().withMessage('isActive filter must be true or false.'),
  query('sortBy').optional().isIn(sortOptions).withMessage('Invalid sort option.'),
  query('search').optional().trim().isLength({ min: 1, max: 100 }).withMessage('Search term must be between 1 and 100 characters.')
];

const completeRules = [reminderIdRule];

const snoozeRules = [
  reminderIdRule,
  body('snoozeUntil')
    .trim()
    .notEmpty()
    .withMessage('Snooze time is required.')
    .bail()
    .isISO8601()
    .withMessage('Snooze time must be a valid ISO date-time.')
];

const toggleRules = [reminderIdRule];

const deleteRules = [
  reminderIdRule,
  query('confirm')
    .optional()
    .isBoolean()
    .withMessage('confirm must be true or false.')
];

module.exports = {
  createReminderRules,
  updateReminderRules,
  listQueryRules,
  reminderIdRule,
  completeRules,
  snoozeRules,
  toggleRules,
  deleteRules
};
