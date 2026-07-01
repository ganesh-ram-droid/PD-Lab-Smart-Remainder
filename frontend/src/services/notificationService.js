import * as Notifications from 'expo-notifications';

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

export const configureNotificationHandler = () => {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false
    })
  });
};

export const requestPushPermission = async () => {
  const existing = await Notifications.getPermissionsAsync();

  if (existing.status === 'granted') {
    return existing;
  }

  const requested = await Notifications.requestPermissionsAsync();

  if (requested.status !== 'granted') {
    throw new Error('Notification permission was denied.');
  }

  return requested;
};

export const getPushToken = async () => {
  const permission = await requestPushPermission();

  if (permission.status !== 'granted') {
    throw new Error('Notification permission was denied.');
  }

  try {
    const projectId = process.env.EXPO_PUBLIC_EAS_PROJECT_ID;

    if (projectId) {
      const expoToken = await Notifications.getExpoPushTokenAsync({ projectId });
      return expoToken.data;
    }
  } catch (error) {
    // Fallback below.
  }

  const deviceToken = await Notifications.getDevicePushTokenAsync();
  return deviceToken.data || deviceToken.token;
};

export const registerDeviceToken = async (payload) => {
  const headers = await getAuthHeaders();
  const response = await api.post('/notifications/register-token', payload, { headers });
  return unwrap(response);
};

export const getNotificationHistory = async (params = {}) => {
  const headers = await getAuthHeaders();
  const response = await api.get('/notifications/history', { headers, params });
  return unwrap(response);
};

export const getNotificationById = async (notificationId) => {
  const headers = await getAuthHeaders();
  const response = await api.get(`/notifications/${notificationId}`, { headers });
  return unwrap(response);
};

export const sendNotification = async (payload) => {
  const headers = await getAuthHeaders();
  const response = await api.post('/notifications/send', payload, { headers });
  return unwrap(response);
};

export const scheduleNotification = async (payload) => {
  const headers = await getAuthHeaders();
  const response = await api.post('/notifications/schedule', payload, { headers });
  return unwrap(response);
};

export const cancelNotification = async (payload) => {
  const headers = await getAuthHeaders();
  const response = await api.post('/notifications/cancel', payload, { headers });
  return unwrap(response);
};

export const rescheduleNotification = async (payload) => {
  const headers = await getAuthHeaders();
  const response = await api.post('/notifications/reschedule', payload, { headers });
  return unwrap(response);
};

export default {
  configureNotificationHandler,
  requestPushPermission,
  getPushToken,
  registerDeviceToken,
  getNotificationHistory,
  getNotificationById,
  sendNotification,
  scheduleNotification,
  cancelNotification,
  rescheduleNotification
};
