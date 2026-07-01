const { admin, firestore } = require('../config/firebase');

const USERS_COLLECTION = 'users';

const usersCollection = firestore.collection(USERS_COLLECTION);

const serializeTimestamp = (value) => {
  if (!value) {
    return null;
  }

  if (typeof value.toDate === 'function') {
    return value.toDate().toISOString();
  }

  return value;
};

const serializeUser = (doc) => {
  if (!doc || !doc.exists) {
    return null;
  }

  const data = doc.data();

  return {
    uid: data.uid,
    name: data.name,
    email: data.email,
    phone: data.phone,
    photoURL: data.photoURL,
    createdAt: serializeTimestamp(data.createdAt),
    updatedAt: serializeTimestamp(data.updatedAt),
    isActive: data.isActive,
    notificationEnabled: data.notificationEnabled,
    theme: data.theme
  };
};

const createUserProfile = async ({ uid, name, email, phone = '', photoURL = null }) => {
  const now = admin.firestore.FieldValue.serverTimestamp();

  const profile = {
    uid,
    name,
    email,
    phone,
    photoURL,
    createdAt: now,
    updatedAt: now,
    isActive: true,
    notificationEnabled: true,
    theme: 'system'
  };

  await usersCollection.doc(uid).set(profile);

  return getUserProfileByUid(uid);
};

const getUserProfileByUid = async (uid) => {
  const doc = await usersCollection.doc(uid).get();
  return serializeUser(doc);
};

const updateUserProfile = async (uid, updates) => {
  const allowedUpdates = {};

  ['name', 'phone', 'photoURL', 'notificationEnabled', 'theme'].forEach((field) => {
    if (updates[field] !== undefined) {
      allowedUpdates[field] = updates[field];
    }
  });

  await usersCollection.doc(uid).update({
    ...allowedUpdates,
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  });

  return getUserProfileByUid(uid);
};

const deactivateUserProfile = async (uid) => {
  await usersCollection.doc(uid).update({
    isActive: false,
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  });

  return getUserProfileByUid(uid);
};

module.exports = {
  createUserProfile,
  getUserProfileByUid,
  updateUserProfile,
  deactivateUserProfile
};
