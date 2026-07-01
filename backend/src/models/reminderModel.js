const { admin, firestore } = require('../config/firebase');

const REMINDERS_COLLECTION = 'reminders';

const remindersCollection = firestore.collection(REMINDERS_COLLECTION);

const serializeTimestamp = (value) => {
  if (!value) {
    return null;
  }

  if (typeof value.toDate === 'function') {
    return value.toDate().toISOString();
  }

  return value;
};

const serializeReminder = (doc) => {
  if (!doc || !doc.exists) {
    return null;
  }

  const data = doc.data();

  return {
    reminderId: data.reminderId,
    userId: data.userId,
    title: data.title,
    description: data.description,
    category: data.category,
    priority: data.priority,
    reminderType: data.reminderType,
    location: data.location,
    latitude: data.latitude,
    longitude: data.longitude,
    radius: data.radius,
    reminderDate: data.reminderDate,
    reminderTime: data.reminderTime,
    repeat: data.repeat,
    repeatDays: data.repeatDays,
    status: data.status,
    isActive: data.isActive,
    notificationEnabled: data.notificationEnabled,
    contextEnabled: data.contextEnabled,
    createdAt: serializeTimestamp(data.createdAt),
    updatedAt: serializeTimestamp(data.updatedAt)
  };
};

const buildReminderDocRef = (reminderId) => remindersCollection.doc(reminderId);

const createReminder = async (payload) => {
  const reminderId = payload.reminderId;
  const now = admin.firestore.FieldValue.serverTimestamp();

  const reminder = {
    ...payload,
    reminderId,
    createdAt: now,
    updatedAt: now
  };

  await buildReminderDocRef(reminderId).set(reminder);
  return getReminderById(reminderId);
};

const getReminderById = async (reminderId) => {
  const doc = await buildReminderDocRef(reminderId).get();
  return serializeReminder(doc);
};

const updateReminder = async (reminderId, updates) => {
  await buildReminderDocRef(reminderId).update({
    ...updates,
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  });

  return getReminderById(reminderId);
};

const deleteReminder = async (reminderId) => {
  await buildReminderDocRef(reminderId).delete();
};

const getUserReminders = async (userId) => {
  const snapshot = await remindersCollection.where('userId', '==', userId).get();
  return snapshot.docs.map(serializeReminder).filter(Boolean);
};

module.exports = {
  createReminder,
  getReminderById,
  updateReminder,
  deleteReminder,
  getUserReminders
};
