const EARTH_RADIUS_METERS = 6371000;

const toRadians = (degrees) => (Number(degrees) * Math.PI) / 180;

const calculateHaversineDistance = ({ fromLatitude, fromLongitude, toLatitude, toLongitude }) => {
  const lat1 = Number(fromLatitude);
  const lon1 = Number(fromLongitude);
  const lat2 = Number(toLatitude);
  const lon2 = Number(toLongitude);

  const deltaLat = toRadians(lat2 - lat1);
  const deltaLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(deltaLon / 2) *
      Math.sin(deltaLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const meters = EARTH_RADIUS_METERS * c;

  return {
    meters: Math.round(meters),
    kilometers: Number((meters / 1000).toFixed(3))
  };
};

module.exports = {
  calculateHaversineDistance
};
