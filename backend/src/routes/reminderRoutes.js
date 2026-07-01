const express = require('express');

const authMiddleware = require('../middleware/authMiddleware');
const reminderController = require('../controllers/reminderController');
const reminderValidator = require('../validators/reminderValidator');
const validate = require('../validators/validate');

const router = express.Router();

router.use(authMiddleware.authenticate);

router.post('/', reminderValidator.createReminderRules, validate, reminderController.createReminder);
router.get('/', reminderValidator.listQueryRules, validate, reminderController.getAllReminders);
router.get('/:id', reminderValidator.reminderIdRule, validate, reminderController.getReminderById);
router.put(
  '/:id',
  reminderValidator.reminderIdRule,
  reminderValidator.updateReminderRules,
  validate,
  reminderController.updateReminder
);
router.delete(
  '/:id',
  reminderValidator.deleteRules,
  validate,
  reminderController.deleteReminder
);
router.patch(
  '/:id/complete',
  reminderValidator.completeRules,
  validate,
  reminderController.completeReminder
);
router.patch(
  '/:id/snooze',
  reminderValidator.snoozeRules,
  validate,
  reminderController.snoozeReminder
);
router.patch(
  '/:id/toggle',
  reminderValidator.toggleRules,
  validate,
  reminderController.toggleReminder
);

module.exports = router;
