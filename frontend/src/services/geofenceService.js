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

export const createGeofence = async (payload) => {
  const headers = await getAuthHeaders();
  const response = await api.post('/geofence/create', payload, { headers });
  return unwrap(response);
};

export const updateGeofence = async (geofenceId, payload) => {
  const headers = await getAuthHeaders();
  const response = await api.put(`/geofence/${geofenceId}`, payload, { headers });
  return unwrap(response);
};

export const deleteGeofence = async (geofenceId) => {
  const headers = await getAuthHeaders();
  const response = await api.delete(`/geofence/${geofenceId}`, { headers });
  return unwrap(response);
};

export const checkGeofence = async (payload) => {
  const headers = await getAuthHeaders();
  const response = await api.post('/geofence/check', payload, { headers });
  return unwrap(response);
};

export const metersToKilometers = (meters) => Number(meters || 0) / 1000;

export const kilometersToMeters = (kilometers) => Number(kilometers || 0) * 1000;

export const normalizeCoordinates = (latitude, longitude) => ({
  latitude: Number(latitude),
  longitude: Number(longitude)
});

export const validateCoordinates = (latitude, longitude) => {
  const lat = Number(latitude);
  const lng = Number(longitude);

  return !Number.isNaN(lat) && !Number.isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
};

export const calculateDistanceMeters = (from, to) => {
  const R = 6371000;
  const lat1 = (Number(from.latitude) * Math.PI) / 180;
  const lat2 = (Number(to.latitude) * Math.PI) / 180;
  const deltaLat = ((Number(to.latitude) - Number(from.latitude)) * Math.PI) / 180;
  const deltaLng = ((Number(to.longitude) - Number(from.longitude)) * Math.PI) / 180;

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

export const calculateDistanceKilometers = (from, to) => calculateDistanceMeters(from, to) / 1000;

export const isInsideRadius = (distanceMeters, radiusMeters) => Number(distanceMeters) <= Number(radiusMeters);

export default {
  createGeofence,
  updateGeofence,
  deleteGeofence,
  checkGeofence,
  metersToKilometers,
  kilometersToMeters,
  normalizeCoordinates,
  validateCoordinates,
  calculateDistanceMeters,
  calculateDistanceKilometers,
  isInsideRadius
};
