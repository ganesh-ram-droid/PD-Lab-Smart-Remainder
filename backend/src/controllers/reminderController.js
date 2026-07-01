const asyncHandler = require('../utils/asyncHandler');
const response = require('../utils/response');
const reminderService = require('../services/reminderService');

const createReminder = asyncHandler(async (req, res) => {
  const reminder = await reminderService.createReminder(req.user.uid, req.body);

  return response.success(res, {
    statusCode: 201,
    message: 'Reminder created successfully.',
    data: reminder
  });
});

const getAllReminders = asyncHandler(async (req, res) => {
  const reminders = await reminderService.getAllReminders(req.user.uid, req.query);

  return response.success(res, {
    statusCode: 200,
    message: 'Reminders fetched successfully.',
    data: reminders
  });
});

const getReminderById = asyncHandler(async (req, res) => {
  const reminder = await reminderService.getReminderById(req.user.uid, req.params.id);

  return response.success(res, {
    statusCode: 200,
    message: 'Reminder fetched successfully.',
    data: reminder
  });
});

const updateReminder = asyncHandler(async (req, res) => {
  const reminder = await reminderService.updateReminder(req.user.uid, req.params.id, req.body);

  return response.success(res, {
    statusCode: 200,
    message: 'Reminder updated successfully.',
    data: reminder
  });
});

const deleteReminder = asyncHandler(async (req, res) => {
  const result = await reminderService.deleteReminder(
    req.user.uid,
    req.params.id,
    req.query.confirm === 'true'
  );

  return response.success(res, {
    statusCode: 200,
    message: 'Reminder deleted successfully.',
    data: result
  });
});

const completeReminder = asyncHandler(async (req, res) => {
  const reminder = await reminderService.completeReminder(req.user.uid, req.params.id);

  return response.success(res, {
    statusCode: 200,
    message: 'Reminder marked as completed.',
    data: reminder
  });
});

const snoozeReminder = asyncHandler(async (req, res) => {
  const reminder = await reminderService.snoozeReminder(
    req.user.uid,
    req.params.id,
    req.body.snoozeUntil
  );

  return response.success(res, {
    statusCode: 200,
    message: 'Reminder snoozed successfully.',
    data: reminder
  });
});

const toggleReminder = asyncHandler(async (req, res) => {
  const reminder = await reminderService.toggleReminder(req.user.uid, req.params.id);

  return response.success(res, {
    statusCode: 200,
    message: 'Reminder status toggled successfully.',
    data: reminder
  });
});

module.exports = {
  createReminder,
  getAllReminders,
  getReminderById,
  updateReminder,
  deleteReminder,
  completeReminder,
  snoozeReminder,
  toggleReminder
};
