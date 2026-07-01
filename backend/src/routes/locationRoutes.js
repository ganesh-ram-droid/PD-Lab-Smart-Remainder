const express = require('express');

const authMiddleware = require('../middleware/authMiddleware');
const locationController = require('../controllers/locationController');
const locationValidator = require('../validators/locationValidator');
const validate = require('../validators/validate');

const locationRouter = express.Router();
const geofenceRouter = express.Router();

locationRouter.use(authMiddleware.authenticate);
geofenceRouter.use(authMiddleware.authenticate);

locationRouter.post(
  '/update',
  locationValidator.locationRules,
  validate,
  locationController.saveCurrentLocation
);
locationRouter.post(
  '/live',
  locationValidator.locationRules,
  validate,
  locationController.updateLiveLocation
);
locationRouter.get('/current', locationController.getCurrentLocation);
locationRouter.get('/last-known', locationController.getLastKnownLocation);
locationRouter.get(
  '/history',
  locationValidator.historyRules,
  validate,
  locationController.getLocationHistory
);
locationRouter.delete('/history', locationController.deleteLocationHistory);

geofenceRouter.post(
  '/check',
  locationValidator.checkGeofenceRules,
  validate,
  locationController.checkGeofence
);
geofenceRouter.post(
  '/entry',
  locationValidator.checkGeofenceRules,
  validate,
  locationController.checkGeofenceEntry
);
geofenceRouter.post(
  '/exit',
  locationValidator.checkGeofenceRules,
  validate,
  locationController.checkGeofenceExit
);
geofenceRouter.post(
  '/distance',
  locationValidator.distanceRules,
  validate,
  locationController.calculateDistance
);
geofenceRouter.post(
  '/create',
  locationValidator.createGeofenceRules,
  validate,
  locationController.createGeofence
);
geofenceRouter.get(
  '/:id',
  locationValidator.geofenceIdRules,
  validate,
  locationController.getGeofence
);
geofenceRouter.put(
  '/:id',
  locationValidator.updateGeofenceRules,
  validate,
  locationController.updateGeofence
);
geofenceRouter.delete(
  '/:id',
  locationValidator.geofenceIdRules,
  validate,
  locationController.deleteGeofence
);
geofenceRouter.patch(
  '/:id/enable',
  locationValidator.geofenceIdRules,
  validate,
  locationController.enableGeofence
);
geofenceRouter.patch(
  '/:id/disable',
  locationValidator.geofenceIdRules,
  validate,
  locationController.disableGeofence
);

module.exports = {
  locationRouter,
  geofenceRouter
};
