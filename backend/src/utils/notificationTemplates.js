const NOTIFICATION_TYPES = Object.freeze([
  'Time Reminder',
  'Location Reminder',
  'Context Reminder',
  'Priority Reminder',
  'Adaptive Reminder',
  'System Notification'
]);

const NOTIFICATION_STATUSES = Object.freeze([
  'Scheduled',
  'Pending',
  'Sent',
  'Delivered',
  'Opened',
  'Dismissed',
  'Suppressed',
  'Cancelled',
  'Failed'
]);

const NOTIFICATION_PRIORITIES = Object.freeze(['High', 'Normal', 'Low']);

const ACTIVE_NOTIFICATION_STATUSES = Object.freeze(['Scheduled', 'Pending', 'Sent']);

const ACTION_BUTTONS = Object.freeze([
  { id: 'open_reminder', title: 'Open Reminder' },
  { id: 'snooze', title: 'Snooze' },
  { id: 'dismiss', title: 'Dismiss' },
  { id: 'mark_completed', title: 'Mark Completed' }
]);

const priorityBadgeMap = Object.freeze({
  High: 'High Priority',
  Medium: 'Medium Priority',
  Low: 'Low Priority'
});

const notificationPriorityMap = Object.freeze({
  High: 'High',
  Medium: 'Normal',
  Low: 'Low'
});

const buildReminderTitle = (reminder) => reminder.title || 'Reminder';

const buildReminderBody = (reminder, decisionReason = '') => {
  const categoryBadge = reminder.category ? `[${reminder.category}]` : '[Reminder]';
  const priorityBadge = priorityBadgeMap[reminder.priority] || 'Normal Priority';
  const description = reminder.description || 'It is time to check this reminder.';
  const reason = decisionReason ? ` Reason: ${decisionReason}` : '';

  return `${categoryBadge} ${priorityBadge}. ${description}${reason}`;
};

const buildNotificationTemplate = ({ reminder, type = 'Context Reminder', decisionReason = '' }) => ({
  title: buildReminderTitle(reminder),
  body: buildReminderBody(reminder, decisionReason),
  type,
  priority: notificationPriorityMap[reminder.priority] || 'Normal',
  categoryBadge: reminder.category || 'Personal',
  priorityBadge: priorityBadgeMap[reminder.priority] || 'Normal Priority',
  actionButtons: ACTION_BUTTONS
});

module.exports = {
  NOTIFICATION_TYPES,
  NOTIFICATION_STATUSES,
  NOTIFICATION_PRIORITIES,
  ACTIVE_NOTIFICATION_STATUSES,
  ACTION_BUTTONS,
  buildNotificationTemplate
};
