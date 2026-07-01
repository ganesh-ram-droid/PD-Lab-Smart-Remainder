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

export const requestLocationPermission = async () => {
  const status = await Location.requestForegroundPermissionsAsync();

  if (status.status !== Location.PermissionStatus.GRANTED) {
    throw new Error('Location permission is required to use map features.');
  }

  return status;
};

export const getDeviceLocation = async () => {
  const permission = await Location.getForegroundPermissionsAsync();

  if (permission.status !== Location.PermissionStatus.GRANTED) {
    await requestLocationPermission();
  }

  const currentPosition = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.High
  });

  return {
    latitude: currentPosition.coords.latitude,
    longitude: currentPosition.coords.longitude,
    accuracy: currentPosition.coords.accuracy ?? null,
    speed: currentPosition.coords.speed ?? null,
    heading: currentPosition.coords.heading ?? null,
    altitude: currentPosition.coords.altitude ?? null,
    provider: 'device',
    timestamp: new Date().toISOString()
  };
};

export const watchDeviceLocation = async (callback) => {
  const permission = await Location.getForegroundPermissionsAsync();

  if (permission.status !== Location.PermissionStatus.GRANTED) {
    await requestLocationPermission();
  }

  return Location.watchPositionAsync(
    {
      accuracy: Location.Accuracy.High,
      distanceInterval: 10,
      timeInterval: 5000
    },
    callback
  );
};

export const getCurrentLocation = async () => {
  const headers = await getAuthHeaders();
  const response = await api.get('/location/current', { headers });
  return unwrap(response);
};

export const updateLocation = async (payload) => {
  const headers = await getAuthHeaders();
  const response = await api.post('/location/update', payload, { headers });
  return unwrap(response);
};

export const getLocationHistory = async (params = {}) => {
  const headers = await getAuthHeaders();
  const response = await api.get('/location/history', { headers, params });
  return unwrap(response);
};

export const deleteLocationHistory = async (params = {}) => {
  const headers = await getAuthHeaders();
  const response = await api.delete('/location/history', { headers, params });
  return unwrap(response);
};

export const searchLocations = async (query) => {
  const trimmed = (query || '').trim();

  if (!trimmed) {
    return [];
  }

  const isCoordinates = /^-?\d+(\.\d+)?,\s*-?\d+(\.\d+)?$/.test(trimmed);

  if (isCoordinates) {
    const [latitude, longitude] = trimmed.split(',').map((value) => Number(value.trim()));
    return [
      {
        displayName: `${latitude}, ${longitude}`,
        latitude,
        longitude,
        address: `${latitude}, ${longitude}`
      }
    ];
  }

  const response = await api.get('https://nominatim.openstreetmap.org/search', {
    params: {
      q: trimmed,
      format: 'jsonv2',
      addressdetails: 1,
      limit: 8
    },
    headers: {
      Accept: 'application/json'
    }
  });

  const items = Array.isArray(response.data) ? response.data : [];

  return items.map((item) => ({
    displayName: item.display_name,
    latitude: Number(item.lat),
    longitude: Number(item.lon),
    address: item.display_name,
    bounds: item.boundingbox || null
  }));
};

export default {
  requestLocationPermission,
  getDeviceLocation,
  watchDeviceLocation,
  getCurrentLocation,
  updateLocation,
  getLocationHistory,
  deleteLocationHistory,
  searchLocations
};
