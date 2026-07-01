const { calculateHaversineDistance } = require('../utils/haversine');
const { checkRadius } = require('../utils/geoUtils');

const calculateDistance = ({ fromLatitude, fromLongitude, toLatitude, toLongitude }) => {
  return calculateHaversineDistance({
    fromLatitude,
    fromLongitude,
    toLatitude,
    toLongitude
  });
};

const calculateDistanceWithStatus = ({
  fromLatitude,
  fromLongitude,
  toLatitude,
  toLongitude,
  radius
}) => {
  const distance = calculateDistance({
    fromLatitude,
    fromLongitude,
    toLatitude,
    toLongitude
  });

  return {
    distanceInMeters: distance.meters,
    distanceInKilometers: distance.kilometers,
    status: checkRadius(distance.meters, radius)
  };
};

module.exports = {
  calculateDistance,
  calculateDistanceWithStatus
};
