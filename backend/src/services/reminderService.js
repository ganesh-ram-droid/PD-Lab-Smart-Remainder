const { v4: uuidv4 } = require('uuid');

const reminderModel = require('../models/reminderModel');
const AppError = require('../utils/AppError');

const categories = new Set([
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
]);

const priorities = new Set(['High', 'Medium', 'Low']);
const repeatOptions = new Set(['None', 'Daily', 'Weekly', 'Monthly', 'Custom']);
const reminderStatuses = new Set(['Pending', 'Completed', 'Missed', 'Cancelled', 'Snoozed']);
const sortOptions = new Set(['newest', 'oldest', 'priority', 'reminderDate']);

const priorityRank = {
  High: 1,
  Medium: 2,
  Low: 3
};

const parseDateTime = (date, time) => {
  const parsed = new Date(`${date}T${time}:00`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const validateReminderDateTime = (reminderDate, reminderTime) => {
  const parsedDateTime = parseDateTime(reminderDate, reminderTime);

  if (!parsedDateTime) {
    throw new AppError('Reminder date and time must form a valid date-time.', 422);
  }

  if (parsedDateTime.getTime() < Date.now()) {
    throw new AppError('Cannot create reminders in the past.', 422);
  }
};

const normalizeReminder = (payload) => {
  const reminderDate = payload.reminderDate;
  const reminderTime = payload.reminderTime;

  validateReminderDateTime(reminderDate, reminderTime);

  return {
    reminderId: uuidv4(),
    userId: payload.userId,
    title: payload.title.trim(),
    description: payload.description ? payload.description.trim() : '',
    category: payload.category,
    priority: payload.priority,
    reminderType: payload.reminderType || 'Manual',
    location: payload.location ? payload.location.trim() : '',
    latitude: payload.latitude !== undefined ? Number(payload.latitude) : null,
    longitude: payload.longitude !== undefined ? Number(payload.longitude) : null,
    radius: payload.radius !== undefined ? Number(payload.radius) : null,
    reminderDate,
    reminderTime,
    repeat: payload.repeat || 'None',
    repeatDays: Array.isArray(payload.repeatDays) ? payload.repeatDays : [],
    status: payload.status || 'Pending',
    isActive: payload.isActive !== undefined ? Boolean(payload.isActive) : true,
    notificationEnabled:
      payload.notificationEnabled !== undefined ? Boolean(payload.notificationEnabled) : true,
    contextEnabled: payload.contextEnabled !== undefined ? Boolean(payload.contextEnabled) : true
  };
};

const assertReminderOwner = (reminder, userId) => {
  if (!reminder) {
    throw new AppError('Reminder not found.', 404);
  }

  if (reminder.userId !== userId) {
    throw new AppError('You are not authorized to access this reminder.', 403);
  }
};

const buildFilters = (items, query) => {
  let result = [...items];

  if (query.category) {
    result = result.filter((item) => item.category === query.category);
  }

  if (query.priority) {
    result = result.filter((item) => item.priority === query.priority);
  }

  if (query.status) {
    result = result.filter((item) => item.status === query.status);
  }

  if (query.date) {
    result = result.filter((item) => item.reminderDate === query.date);
  }

  if (query.isActive !== undefined) {
    const active = query.isActive === true || query.isActive === 'true';
    result = result.filter((item) => item.isActive === active);
  }

  if (query.search) {
    const searchTerm = String(query.search).trim().toLowerCase();
    result = result.filter((item) => {
      const title = String(item.title || '').toLowerCase();
      const category = String(item.category || '').toLowerCase();
      const description = String(item.description || '').toLowerCase();
      return (
        title.includes(searchTerm) ||
        category.includes(searchTerm) ||
        description.includes(searchTerm)
      );
    });
  }

  return result;
};

const sortReminders = (items, sortBy) => {
  const sorted = [...items];

  switch (sortBy) {
    case 'oldest':
      return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    case 'priority':
      return sorted.sort((a, b) => priorityRank[a.priority] - priorityRank[b.priority]);
    case 'reminderDate':
      return sorted.sort((a, b) => {
        const aDate = new Date(`${a.reminderDate}T${a.reminderTime}:00`);
        const bDate = new Date(`${b.reminderDate}T${b.reminderTime}:00`);
        return aDate - bDate;
      });
    case 'newest':
    default:
      return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
};

const createReminder = async (userId, payload) => {
  if (!categories.has(payload.category)) {
    throw new AppError('Invalid reminder category.', 422);
  }

  if (!priorities.has(payload.priority)) {
    throw new AppError('Priority is required and must be High, Medium, or Low.', 422);
  }

  if (payload.reminderType && !['Manual', 'Location', 'Time', 'Context'].includes(payload.reminderType)) {
    throw new AppError('Invalid reminder type.', 422);
  }

  if (payload.repeat && !repeatOptions.has(payload.repeat)) {
    throw new AppError('Invalid repeat option.', 422);
  }

  if (payload.status && !reminderStatuses.has(payload.status)) {
    throw new AppError('Invalid reminder status.', 422);
  }

  const normalized = normalizeReminder({
    ...payload,
    userId
  });

  if (normalized.latitude !== null && (normalized.latitude < -90 || normalized.latitude > 90)) {
    throw new AppError('Latitude must be between -90 and 90.', 422);
  }

  if (normalized.longitude !== null && (normalized.longitude < -180 || normalized.longitude > 180)) {
    throw new AppError('Longitude must be between -180 and 180.', 422);
  }

  if (normalized.radius !== null && normalized.radius <= 0) {
    throw new AppError('Radius must be greater than 0.', 422);
  }

  if (!normalized.repeatDays.length && normalized.repeat !== 'None' && normalized.repeat !== 'Daily') {
    throw new AppError('Repeat days are required for Weekly, Monthly, or Custom reminders.', 422);
  }

  return reminderModel.createReminder(normalized);
};

const getAllReminders = async (userId, query) => {
  const reminders = await reminderModel.getUserReminders(userId);
  const filtered = buildFilters(reminders, query);
  const sortBy = sortOptions.has(query.sortBy) ? query.sortBy : 'newest';
  return sortReminders(filtered, sortBy);
};

const getReminderById = async (userId, reminderId) => {
  const reminder = await reminderModel.getReminderById(reminderId);
  assertReminderOwner(reminder, userId);
  return reminder;
};

const updateReminder = async (userId, reminderId, payload) => {
  const existingReminder = await getReminderById(userId, reminderId);

  if (payload.category && !categories.has(payload.category)) {
    throw new AppError('Invalid reminder category.', 422);
  }

  if (payload.priority && !priorities.has(payload.priority)) {
    throw new AppError('Invalid priority.', 422);
  }

  if (payload.repeat && !repeatOptions.has(payload.repeat)) {
    throw new AppError('Invalid repeat option.', 422);
  }

  if (payload.status && !reminderStatuses.has(payload.status)) {
    throw new AppError('Invalid reminder status.', 422);
  }

  if (payload.reminderDate || payload.reminderTime) {
    const nextDate = payload.reminderDate || existingReminder.reminderDate;
    const nextTime = payload.reminderTime || existingReminder.reminderTime;
    validateReminderDateTime(nextDate, nextTime);
  }

  const nextRepeat = payload.repeat || existingReminder.repeat;
  const nextRepeatDays =
    payload.repeatDays !== undefined ? payload.repeatDays : existingReminder.repeatDays;

  if (
    ['Weekly', 'Monthly', 'Custom'].includes(nextRepeat) &&
    (!Array.isArray(nextRepeatDays) || nextRepeatDays.length === 0)
  ) {
    throw new AppError('Repeat days are required for Weekly, Monthly, or Custom reminders.', 422);
  }

  const updates = {};

  ['title', 'description', 'category', 'priority', 'reminderType', 'location', 'reminderDate', 'reminderTime', 'repeat', 'status'].forEach((field) => {
    if (payload[field] !== undefined) {
      updates[field] = typeof payload[field] === 'string' ? payload[field].trim() : payload[field];
    }
  });

  if (payload.latitude !== undefined) {
    const latitude = Number(payload.latitude);
    if (latitude < -90 || latitude > 90) {
      throw new AppError('Latitude must be between -90 and 90.', 422);
    }
    updates.latitude = latitude;
  }

  if (payload.longitude !== undefined) {
    const longitude = Number(payload.longitude);
    if (longitude < -180 || longitude > 180) {
      throw new AppError('Longitude must be between -180 and 180.', 422);
    }
    updates.longitude = longitude;
  }

  if (payload.radius !== undefined) {
    const radius = Number(payload.radius);
    if (radius <= 0) {
      throw new AppError('Radius must be greater than 0.', 422);
    }
    updates.radius = radius;
  }

  if (payload.repeatDays !== undefined) {
    updates.repeatDays = Array.isArray(payload.repeatDays) ? payload.repeatDays : [];
  }

  if (payload.isActive !== undefined) {
    updates.isActive = Boolean(payload.isActive);
  }

  if (payload.notificationEnabled !== undefined) {
    updates.notificationEnabled = Boolean(payload.notificationEnabled);
  }

  if (payload.contextEnabled !== undefined) {
    updates.contextEnabled = Boolean(payload.contextEnabled);
  }

  return reminderModel.updateReminder(reminderId, updates);
};

const deleteReminder = async (userId, reminderId, confirmDelete = false) => {
  const reminder = await getReminderById(userId, reminderId);

  if (reminder.status === 'Completed' && !confirmDelete) {
    throw new AppError('Completed reminders require confirmation before deletion.', 409);
  }

  await reminderModel.deleteReminder(reminderId);

  return {
    reminderId,
    deleted: true
  };
};

const completeReminder = async (userId, reminderId) => {
  await getReminderById(userId, reminderId);
  return reminderModel.updateReminder(reminderId, {
    status: 'Completed',
    isActive: false
  });
};

const snoozeReminder = async (userId, reminderId, snoozeUntil) => {
  await getReminderById(userId, reminderId);

  if (!snoozeUntil) {
    throw new AppError('Snooze time is required.', 422);
  }

  const snoozeDate = new Date(snoozeUntil);
  if (Number.isNaN(snoozeDate.getTime()) || snoozeDate.getTime() <= Date.now()) {
    throw new AppError('Snooze time must be a valid future date-time.', 422);
  }

  return reminderModel.updateReminder(reminderId, {
    status: 'Snoozed',
    isActive: true
  });
};

const toggleReminder = async (userId, reminderId) => {
  const reminder = await getReminderById(userId, reminderId);

  return reminderModel.updateReminder(reminderId, {
    isActive: !reminder.isActive
  });
};

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
