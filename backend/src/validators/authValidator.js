const { body } = require('express-validator');

const phoneRule = body('phone')
  .optional({ checkFalsy: true })
  .trim()
  .matches(/^\+[1-9]\d{7,14}$/)
  .withMessage('Phone number must be in E.164 format, for example +919876543210.');

const photoUrlRule = body('photoURL')
  .optional({ nullable: true, checkFalsy: true })
  .trim()
  .isURL({ protocols: ['http', 'https'], require_protocol: true })
  .withMessage('Photo URL must be a valid http or https URL.');

const registerRules = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required.')
    .bail()
    .isLength({ min: 2, max: 60 })
    .withMessage('Name must be between 2 and 60 characters.')
    .bail()
    .matches(/^[a-zA-Z\s.'-]+$/)
    .withMessage('Name can contain letters, spaces, apostrophes, periods, and hyphens only.'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required.')
    .bail()
    .isEmail()
    .withMessage('Enter a valid email address.')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required.')
    .bail()
    .isLength({ min: 8, max: 128 })
    .withMessage('Password must be between 8 and 128 characters.')
    .bail()
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter.')
    .bail()
    .matches(/[a-z]/)
    .withMessage('Password must contain at least one lowercase letter.')
    .bail()
    .matches(/\d/)
    .withMessage('Password must contain at least one number.'),
  phoneRule,
  photoUrlRule
];

const loginRules = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required.')
    .bail()
    .isEmail()
    .withMessage('Enter a valid email address.')
    .normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required.')
];

const updateProfileRules = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 60 })
    .withMessage('Name must be between 2 and 60 characters.')
    .matches(/^[a-zA-Z\s.'-]+$/)
    .withMessage('Name can contain letters, spaces, apostrophes, periods, and hyphens only.'),
  phoneRule,
  photoUrlRule,
  body('notificationEnabled')
    .optional()
    .isBoolean()
    .withMessage('Notification preference must be true or false.')
    .toBoolean(),
  body('theme')
    .optional()
    .isIn(['light', 'dark', 'system'])
    .withMessage('Theme must be one of: light, dark, system.')
];

module.exports = {
  registerRules,
  loginRules,
  updateProfileRules
};
