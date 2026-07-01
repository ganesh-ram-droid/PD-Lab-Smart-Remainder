const { query } = require('express-validator');

const getExampleRules = [
  query('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters.')
    .matches(/^[a-zA-Z\s.'-]+$/)
    .withMessage('Name can contain letters, spaces, apostrophes, periods, and hyphens only.')
];

module.exports = {
  getExampleRules
};
