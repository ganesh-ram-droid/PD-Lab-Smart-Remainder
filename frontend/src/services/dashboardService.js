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

const getDashboard = async () => {
  const headers = await getAuthHeaders();
  const response = await api.get('/analytics/dashboard', { headers });
  return response.data?.data || response.data;
};

const getReminders = async (params = {}) => {
  const headers = await getAuthHeaders();
  const response = await api.get('/reminders', {
    headers,
    params
  });
  return response.data?.data || response.data;
};

const getDashboardBundle = async () => {
  const [dashboard, reminders] = await Promise.all([getDashboard(), getReminders({ limit: 20 })]);

  return {
    dashboard,
    reminders
  };
};

export default {
  getDashboard,
  getReminders,
  getDashboardBundle
};
