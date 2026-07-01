const locationModel = require('../models/locationModel');
const {
  validateLatitude,
  validateLongitude,
  validateAccuracy
} = require('../utils/geoUtils');

const normalizeOptionalNumber = (value) => {
  if (value === undefined || value === null || value === '') {
    return null;
  }

  const numeric = Number(value);
  return Number.isNaN(numeric) ? null : numeric;
};

const normalizeLocationPayload = (userId, payload) => ({
  userId,
  latitude: validateLatitude(payload.latitude),
  longitude: validateLongitude(payload.longitude),
  accuracy: validateAccuracy(payload.accuracy),
  speed: normalizeOptionalNumber(payload.speed),
  heading: normalizeOptionalNumber(payload.heading),
  altitude: normalizeOptionalNumber(payload.altitude),
  provider: payload.provider || 'Unknown',
  timestamp: payload.timestamp || new Date().toISOString()
});

const saveCurrentLocation = async (userId, payload) => {
  const normalized = normalizeLocationPayload(userId, payload);
  return locationModel.saveLocation(normalized);
};

const updateLiveLocation = async (userId, payload) => {
  const normalized = normalizeLocationPayload(userId, payload);
  return locationModel.saveLocation(normalized);
};

const getCurrentLocation = async (userId) => {
  return locationModel.getLastKnownLocation(userId);
};

const getLastKnownLocation = async (userId) => {
  return locationModel.getLastKnownLocation(userId);
};

const getLocationHistory = async (userId, query = {}) => {
  const limit = query.limit ? Number(query.limit) : 50;
  return locationModel.getLocationHistory(userId, limit);
};

const deleteLocationHistory = async (userId) => {
  return locationModel.deleteLocationHistory(userId);
};

module.exports = {
  saveCurrentLocation,
  updateLiveLocation,
  getCurrentLocation,
  getLastKnownLocation,
  getLocationHistory,
  deleteLocationHistory
};
