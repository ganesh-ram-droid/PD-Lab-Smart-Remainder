const axios = require('axios');

const { auth } = require('../config/firebase');
const userModel = require('../models/userModel');
const AppError = require('../utils/AppError');

const mapFirebaseAuthError = (error) => {
  const code = error.code || error.response?.data?.error?.message;

  const messages = {
    'auth/email-already-exists': ['Email is already registered.', 409],
    'auth/user-not-found': ['User account was not found.', 404],
    'auth/invalid-id-token': ['Invalid or expired authentication token.', 401],
    'auth/id-token-expired': ['Authentication token has expired.', 401],
    EMAIL_NOT_FOUND: ['Invalid email or password.', 401],
    INVALID_PASSWORD: ['Invalid email or password.', 401],
    INVALID_LOGIN_CREDENTIALS: ['Invalid email or password.', 401],
    USER_DISABLED: ['This account has been disabled.', 403],
    TOO_MANY_ATTEMPTS_TRY_LATER: ['Too many attempts. Please try again later.', 429]
  };

  const [message, statusCode] = messages[code] || ['Authentication request failed.', 500];
  return new AppError(message, statusCode, true, { code });
};

const getWebApiKey = () => {
  if (!process.env.FIREBASE_WEB_API_KEY) {
    throw new AppError('Firebase Web API key is not configured.', 500);
  }

  return process.env.FIREBASE_WEB_API_KEY;
};

const register = async ({ name, email, password, phone = '', photoURL = null }) => {
  let firebaseUser = null;

  try {
    firebaseUser = await auth.createUser({
      email,
      password,
      displayName: name,
      phoneNumber: phone || undefined,
      photoURL: photoURL || undefined,
      disabled: false
    });

    const profile = await userModel.createUserProfile({
      uid: firebaseUser.uid,
      name,
      email,
      phone,
      photoURL
    });

    return {
      uid: firebaseUser.uid,
      profile
    };
  } catch (error) {
    if (firebaseUser) {
      await auth.deleteUser(firebaseUser.uid).catch(() => null);
    }

    throw mapFirebaseAuthError(error);
  }
};

const login = async ({ email, password }) => {
  try {
    const apiKey = getWebApiKey();
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`;

    const { data } = await axios.post(url, {
      email,
      password,
      returnSecureToken: true
    });

    const profile = await userModel.getUserProfileByUid(data.localId);

    if (!profile || !profile.isActive) {
      throw new AppError('User profile is inactive or unavailable.', 403);
    }

    return {
      uid: data.localId,
      email: data.email,
      idToken: data.idToken,
      refreshToken: data.refreshToken,
      expiresIn: Number(data.expiresIn),
      profile
    };
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw mapFirebaseAuthError(error);
  }
};

const getProfile = async (uid) => {
  const profile = await userModel.getUserProfileByUid(uid);

  if (!profile || !profile.isActive) {
    throw new AppError('User profile not found.', 404);
  }

  return profile;
};

const updateProfile = async (uid, updates) => {
  const existingProfile = await getProfile(uid);
  const authUpdates = {};

  if (updates.name !== undefined) {
    authUpdates.displayName = updates.name || existingProfile.name;
  }

  if (updates.phone !== undefined) {
    authUpdates.phoneNumber = updates.phone || null;
  }

  if (updates.photoURL !== undefined) {
    authUpdates.photoURL = updates.photoURL || null;
  }

  if (Object.keys(authUpdates).length) {
    await auth.updateUser(uid, authUpdates);
  }

  return userModel.updateUserProfile(uid, updates);
};

const logout = async (uid) => {
  await auth.revokeRefreshTokens(uid);

  return {
    uid,
    revoked: true
  };
};

const deleteAccount = async (uid) => {
  await getProfile(uid);
  const profile = await userModel.deactivateUserProfile(uid);
  await auth.deleteUser(uid);

  return profile;
};

const verifyIdToken = async (idToken) => {
  try {
    return await auth.verifyIdToken(idToken, true);
  } catch (error) {
    throw mapFirebaseAuthError(error);
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  logout,
  deleteAccount,
  verifyIdToken
};
