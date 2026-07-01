import React from 'react';
import { Circle } from 'react-native-maps';

const GeofenceCircle = ({ center, radius, visible = true }) => {
  if (!visible || !center) {
    return null;
  }

  return (
    <Circle
      center={{
        latitude: Number(center.latitude),
        longitude: Number(center.longitude)
      }}
      radius={Number(radius)}
      strokeColor="rgba(37, 99, 235, 0.75)"
      fillColor="rgba(37, 99, 235, 0.12)"
      strokeWidth={2}
    />
  );
};

export default GeofenceCircle;
