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

export const getAnalyticsDashboard = async (params = {}) => {
  const headers = await getAuthHeaders();
  const response = await api.get('/analytics/dashboard', { headers, params });
  return unwrap(response);
};

export const getReminderAnalytics = async (params = {}) => {
  const headers = await getAuthHeaders();
  const response = await api.get('/analytics/reminders', { headers, params });
  return unwrap(response);
};

export const getContextAnalytics = async (params = {}) => {
  const headers = await getAuthHeaders();
  const response = await api.get('/analytics/context', { headers, params });
  return unwrap(response);
};

export const getBehaviorAnalytics = async (params = {}) => {
  const headers = await getAuthHeaders();
  const response = await api.get('/analytics/behavior', { headers, params });
  return unwrap(response);
};

export const getLocationAnalytics = async (params = {}) => {
  const headers = await getAuthHeaders();
  const response = await api.get('/analytics/location', { headers, params });
  return unwrap(response);
};

export const getAnalyticsCharts = async (params = {}) => {
  const headers = await getAuthHeaders();
  const response = await api.get('/analytics/charts', { headers, params });
  return unwrap(response);
};

export default {
  getAnalyticsDashboard,
  getReminderAnalytics,
  getContextAnalytics,
  getBehaviorAnalytics,
  getLocationAnalytics,
  getAnalyticsCharts
};
