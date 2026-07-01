const asyncHandler = require('../utils/asyncHandler');
const response = require('../utils/response');
const locationService = require('../services/locationService');
const geofenceService = require('../services/geofenceService');

const saveCurrentLocation = asyncHandler(async (req, res) => {
  const location = await locationService.saveCurrentLocation(req.user.uid, req.body);

  return response.success(res, {
    statusCode: 201,
    message: 'Current location saved successfully.',
    data: location
  });
});

const updateLiveLocation = asyncHandler(async (req, res) => {
  const location = await locationService.updateLiveLocation(req.user.uid, req.body);

  return response.success(res, {
    statusCode: 201,
    message: 'Live location updated successfully.',
    data: location
  });
});

const getCurrentLocation = asyncHandler(async (req, res) => {
  const location = await locationService.getCurrentLocation(req.user.uid);

  return response.success(res, {
    statusCode: 200,
    message: 'Current location fetched successfully.',
    data: location
  });
});

const getLastKnownLocation = asyncHandler(async (req, res) => {
  const location = await locationService.getLastKnownLocation(req.user.uid);

  return response.success(res, {
    statusCode: 200,
    message: 'Last known location fetched successfully.',
    data: location
  });
});

const getLocationHistory = asyncHandler(async (req, res) => {
  const history = await locationService.getLocationHistory(req.user.uid, req.query);

  return response.success(res, {
    statusCode: 200,
    message: 'Location history fetched successfully.',
    data: history
  });
});

const deleteLocationHistory = asyncHandler(async (req, res) => {
  const result = await locationService.deleteLocationHistory(req.user.uid);

  return response.success(res, {
    statusCode: 200,
    message: 'Location history deleted successfully.',
    data: result
  });
});

const createGeofence = asyncHandler(async (req, res) => {
  const geofence = await geofenceService.createGeofence(req.user.uid, req.body);

  return response.success(res, {
    statusCode: 201,
    message: 'Geofence created successfully.',
    data: geofence
  });
});

const updateGeofence = asyncHandler(async (req, res) => {
  const geofence = await geofenceService.updateGeofence(req.user.uid, req.params.id, req.body);

  return response.success(res, {
    statusCode: 200,
    message: 'Geofence updated successfully.',
    data: geofence
  });
});

const deleteGeofence = asyncHandler(async (req, res) => {
  const geofence = await geofenceService.deleteGeofence(req.user.uid, req.params.id);

  return response.success(res, {
    statusCode: 200,
    message: 'Geofence deleted successfully.',
    data: geofence
  });
});

const getGeofence = asyncHandler(async (req, res) => {
  const geofence = await geofenceService.getGeofence(req.user.uid, req.params.id);

  return response.success(res, {
    statusCode: 200,
    message: 'Geofence fetched successfully.',
    data: geofence
  });
});

const enableGeofence = asyncHandler(async (req, res) => {
  const geofence = await geofenceService.enableGeofence(req.user.uid, req.params.id);

  return response.success(res, {
    statusCode: 200,
    message: 'Geofence enabled successfully.',
    data: geofence
  });
});

const disableGeofence = asyncHandler(async (req, res) => {
  const geofence = await geofenceService.disableGeofence(req.user.uid, req.params.id);

  return response.success(res, {
    statusCode: 200,
    message: 'Geofence disabled successfully.',
    data: geofence
  });
});

const checkGeofence = asyncHandler(async (req, res) => {
  const result = await geofenceService.checkGeofence(req.user.uid, req.body);

  return response.success(res, {
    statusCode: 200,
    message: 'Geofence checked successfully.',
    data: result
  });
});

const checkGeofenceEntry = asyncHandler(async (req, res) => {
  const result = await geofenceService.checkGeofenceEntry(req.user.uid, req.body);

  return response.success(res, {
    statusCode: 200,
    message: 'Geofence entry checked successfully.',
    data: result
  });
});

const checkGeofenceExit = asyncHandler(async (req, res) => {
  const result = await geofenceService.checkGeofenceExit(req.user.uid, req.body);

  return response.success(res, {
    statusCode: 200,
    message: 'Geofence exit checked successfully.',
    data: result
  });
});

const calculateDistance = asyncHandler(async (req, res) => {
  const result = await geofenceService.calculateDistance(req.body);

  return response.success(res, {
    statusCode: 200,
    message: 'Distance calculated successfully.',
    data: result
  });
});

module.exports = {
  saveCurrentLocation,
  updateLiveLocation,
  getCurrentLocation,
  getLastKnownLocation,
  getLocationHistory,
  deleteLocationHistory,
  createGeofence,
  updateGeofence,
  deleteGeofence,
  getGeofence,
  enableGeofence,
  disableGeofence,
  checkGeofence,
  checkGeofenceEntry,
  checkGeofenceExit,
  calculateDistance
};
