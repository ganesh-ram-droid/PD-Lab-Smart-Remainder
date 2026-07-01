const { body, param, query } = require('express-validator');

const providerOptions = ['GPS', 'Network', 'Fused', 'Manual', 'Unknown'];

const latitudeRule = (field = 'latitude') =>
  body(field)
    .notEmpty()
    .withMessage('Latitude is required.')
    .bail()
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be between -90 and 90.');

const longitudeRule = (field = 'longitude') =>
  body(field)
    .notEmpty()
    .withMessage('Longitude is required.')
    .bail()
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be between -180 and 180.');

const optionalLatitudeRule = body('latitude')
  .optional()
  .isFloat({ min: -90, max: 90 })
  .withMessage('Latitude must be between -90 and 90.');

const optionalLongitudeRule = body('longitude')
  .optional()
  .isFloat({ min: -180, max: 180 })
  .withMessage('Longitude must be between -180 and 180.');

const radiusRule = body('radius')
  .notEmpty()
  .withMessage('Radius is required.')
  .bail()
  .isFloat({ gt: 0 })
  .withMessage('Radius must be greater than 0.');

const optionalRadiusRule = body('radius')
  .optional()
  .isFloat({ gt: 0 })
  .withMessage('Radius must be greater than 0.');

const accuracyRule = body('accuracy')
  .optional({ nullable: true, checkFalsy: true })
  .isFloat({ min: 0 })
  .withMessage('Accuracy must be greater than or equal to 0.');

const optionalNumberRule = (field, label) =>
  body(field)
    .optional({ nullable: true, checkFalsy: true })
    .isNumeric()
    .withMessage(`${label} must be a valid number.`);

const reminderIdBodyRule = body('reminderId')
  .trim()
  .notEmpty()
  .withMessage('Reminder ID is required.');

const reminderIdParamRule = param('id')
  .trim()
  .notEmpty()
  .withMessage('Reminder ID is required.');

const locationRules = [
  latitudeRule(),
  longitudeRule(),
  accuracyRule,
  optionalNumberRule('speed', 'Speed'),
  optionalNumberRule('heading', 'Heading'),
  optionalNumberRule('altitude', 'Altitude'),
  body('provider')
    .optional()
    .isIn(providerOptions)
    .withMessage('Provider must be GPS, Network, Fused, Manual, or Unknown.'),
  body('timestamp')
    .optional()
    .isISO8601()
    .withMessage('Timestamp must be a valid ISO date-time.')
];

const historyRules = [
  query('limit')
    .optional()
    .isInt({ min: 1, max: 200 })
    .withMessage('Limit must be between 1 and 200.')
];

const createGeofenceRules = [
  reminderIdBodyRule,
  latitudeRule(),
  longitudeRule(),
  radiusRule
];

const updateGeofenceRules = [
  reminderIdParamRule,
  optionalLatitudeRule,
  optionalLongitudeRule,
  optionalRadiusRule
];

const geofenceIdRules = [reminderIdParamRule];

const checkGeofenceRules = [
  reminderIdBodyRule,
  latitudeRule(),
  longitudeRule()
];

const distanceRules = [
  latitudeRule('fromLatitude'),
  longitudeRule('fromLongitude'),
  latitudeRule('toLatitude'),
  longitudeRule('toLongitude')
];

module.exports = {
  locationRules,
  historyRules,
  createGeofenceRules,
  updateGeofenceRules,
  geofenceIdRules,
  checkGeofenceRules,
  distanceRules
};
