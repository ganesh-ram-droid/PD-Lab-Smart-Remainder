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

export const getReminders = async (params = {}) => {
  const headers = await getAuthHeaders();
  const response = await api.get('/reminders', { headers, params });
  return unwrap(response);
};

export const getReminderById = async (reminderId) => {
  const headers = await getAuthHeaders();
  const response = await api.get(`/reminders/${reminderId}`, { headers });
  return unwrap(response);
};

export const createReminder = async (payload) => {
  const headers = await getAuthHeaders();
  const response = await api.post('/reminders', payload, { headers });
  return unwrap(response);
};

export const updateReminder = async (reminderId, payload) => {
  const headers = await getAuthHeaders();
  const response = await api.put(`/reminders/${reminderId}`, payload, { headers });
  return unwrap(response);
};

export const deleteReminder = async (reminderId, payload = {}) => {
  const headers = await getAuthHeaders();
  const response = await api.delete(`/reminders/${reminderId}`, {
    headers,
    params: payload,
    data: payload
  });
  return unwrap(response);
};

export const completeReminder = async (reminderId) => {
  const headers = await getAuthHeaders();
  const response = await api.patch(`/reminders/${reminderId}/complete`, {}, { headers });
  return unwrap(response);
};

export const snoozeReminder = async (reminderId, payload = {}) => {
  const headers = await getAuthHeaders();
  const response = await api.patch(`/reminders/${reminderId}/snooze`, payload, { headers });
  return unwrap(response);
};

export const toggleReminder = async (reminderId, payload = {}) => {
  const headers = await getAuthHeaders();
  const response = await api.patch(`/reminders/${reminderId}/toggle`, payload, { headers });
  return unwrap(response);
};

export default {
  getReminders,
  getReminderById,
  createReminder,
  updateReminder,
  deleteReminder,
  completeReminder,
  snoozeReminder,
  toggleReminder
};
