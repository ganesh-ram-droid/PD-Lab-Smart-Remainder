import * as Location from 'expo-location';

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

export const getDeviceContext = async () => {
  const permission = await Location.getForegroundPermissionsAsync();

  if (permission.status !== Location.PermissionStatus.GRANTED) {
    const request = await Location.requestForegroundPermissionsAsync();
    if (request.status !== Location.PermissionStatus.GRANTED) {
      throw new Error('Location permission is required for context evaluation.');
    }
  }

  const position = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.High
  });

  return {
    currentLatitude: position.coords.latitude,
    currentLongitude: position.coords.longitude,
    accuracy: position.coords.accuracy ?? null,
    timestamp: new Date(position.timestamp).toISOString(),
    currentTime: new Date().toISOString()
  };
};

export const evaluateContext = async (payload) => {
  const headers = await getAuthHeaders();
  const response = await api.post('/context/evaluate', payload, { headers });
  return unwrap(response);
};

export const getContextHistory = async (params = {}) => {
  const headers = await getAuthHeaders();
  const response = await api.get('/context/history', { headers, params });
  return unwrap(response);
};

export const getContextScore = async (reminderId, params = {}) => {
  const headers = await getAuthHeaders();
  const response = await api.get(`/context/score/${reminderId}`, { headers, params });
  return unwrap(response);
};

export const getBehaviorProfile = async (params = {}) => {
  const headers = await getAuthHeaders();
  const response = await api.get('/behavior/profile', { headers, params });
  return unwrap(response);
};

export default {
  getDeviceContext,
  evaluateContext,
  getContextHistory,
  getContextScore,
  getBehaviorProfile
};
