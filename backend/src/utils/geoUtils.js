const AppError = require('./AppError');

const GEOFENCE_STATUS = Object.freeze({
  INSIDE: 'INSIDE_GEOFENCE',
  OUTSIDE: 'OUTSIDE_GEOFENCE'
});

const SUPPORTED_RADII = Object.freeze([50, 100, 250, 500, 1000]);

const normalizeCoordinate = (value, precision = 7) => {
  const numeric = Number(value);

  if (Number.isNaN(numeric)) {
    return null;
  }

  return Number(numeric.toFixed(precision));
};

const validateLatitude = (latitude) => {
  const normalized = normalizeCoordinate(latitude);

  if (normalized === null || normalized < -90 || normalized > 90) {
    throw new AppError('Latitude must be a valid value between -90 and 90.', 422);
  }

  return normalized;
};

const validateLongitude = (longitude) => {
  const normalized = normalizeCoordinate(longitude);

  if (normalized === null || normalized < -180 || normalized > 180) {
    throw new AppError('Longitude must be a valid value between -180 and 180.', 422);
  }

  return normalized;
};

const validateRadius = (radius) => {
  const numeric = Number(radius);

  if (Number.isNaN(numeric) || numeric <= 0) {
    throw new AppError('Radius must be greater than 0.', 422);
  }

  return Math.round(numeric);
};

const validateAccuracy = (accuracy) => {
  if (accuracy === undefined || accuracy === null || accuracy === '') {
    return null;
  }

  const numeric = Number(accuracy);

  if (Number.isNaN(numeric) || numeric < 0) {
    throw new AppError('Accuracy must be greater than or equal to 0.', 422);
  }

  return numeric;
};

const metersToKilometers = (meters) => Number((Number(meters) / 1000).toFixed(3));

const kilometersToMeters = (kilometers) => Math.round(Number(kilometers) * 1000);

const checkRadius = (distanceMeters, radiusMeters) =>
  Number(distanceMeters) <= Number(radiusMeters)
    ? GEOFENCE_STATUS.INSIDE
    : GEOFENCE_STATUS.OUTSIDE;

const buildGeofenceEvaluationKey = ({ userId, reminderId, latitude, longitude, status }) => {
  const roundedLatitude = Number(Number(latitude).toFixed(4));
  const roundedLongitude = Number(Number(longitude).toFixed(4));
  const minuteBucket = new Date().toISOString().slice(0, 16);

  return [userId, reminderId, roundedLatitude, roundedLongitude, status, minuteBucket].join('|');
};

module.exports = {
  GEOFENCE_STATUS,
  SUPPORTED_RADII,
  normalizeCoordinate,
  validateLatitude,
  validateLongitude,
  validateRadius,
  validateAccuracy,
  metersToKilometers,
  kilometersToMeters,
  checkRadius,
  buildGeofenceEvaluationKey
};
