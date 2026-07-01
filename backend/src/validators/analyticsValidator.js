const { query } = require('express-validator');

const dateRule = (field) =>
  query(field)
    .optional()
    .isISO8601()
    .withMessage(`${field} must be a valid ISO date.`);

const limitRule = query('limit')
  .optional()
  .isInt({ min: 1, max: 100 })
  .withMessage('Limit must be between 1 and 100.');

const categoryRule = query('category')
  .optional()
  .trim()
  .isLength({ min: 1, max: 60 })
  .withMessage('Category must be between 1 and 60 characters.');

const priorityRule = query('priority')
  .optional()
  .isIn(['High', 'Medium', 'Low'])
  .withMessage('Priority must be High, Medium, or Low.');

const statusRule = query('status')
  .optional()
  .trim()
  .isLength({ min: 1, max: 40 })
  .withMessage('Status is invalid.');

const locationRule = query('location')
  .optional()
  .trim()
  .isLength({ min: 1, max: 120 })
  .withMessage('Location is invalid.');

const filterRules = [dateRule('startDate'), dateRule('endDate'), categoryRule, priorityRule, statusRule, locationRule, limitRule];

module.exports = {
  filterRules
};
