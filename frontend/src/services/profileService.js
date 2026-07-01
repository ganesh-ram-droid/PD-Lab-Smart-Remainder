import { signOut, updateProfile as updateFirebaseProfile } from 'firebase/auth';

import { auth } from '../config/firebase';
import api from './api';

const getAuthHeaders = async () => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error('Authentication session is not available.');
  }

  const token = await user.getIdToken();

  return {
    Authorization: `Bearer ${token}`
  };
};

const unwrap = (response) => response.data?.data || response.data || response;

export const getProfile = async () => {
  const headers = await getAuthHeaders();
  const response = await api.get('/auth/profile', { headers });
  return unwrap(response);
};

export const updateProfileData = async (payload) => {
  const headers = await getAuthHeaders();
  const response = await api.put('/auth/profile', payload, { headers });

  if (auth.currentUser && (payload.name || payload.photoURL)) {
    await updateFirebaseProfile(auth.currentUser, {
      displayName: payload.name ?? auth.currentUser.displayName,
      photoURL: payload.photoURL ?? auth.currentUser.photoURL
    });
  }

  return unwrap(response);
};

export const logoutAccount = async () => {
  const headers = await getAuthHeaders();
  try {
    await api.post('/auth/logout', {}, { headers });
  } catch (error) {
    // Backend logout is best-effort for audit logging.
  }

  await signOut(auth);
};

export const deleteAccount = async () => {
  const headers = await getAuthHeaders();
  const response = await api.delete('/auth/delete', { headers });
  await signOut(auth);
  return unwrap(response);
};

export default {
  getProfile,
  updateProfileData,
  logoutAccount,
  deleteAccount
};
