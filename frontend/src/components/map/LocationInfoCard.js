import React from 'react';
import { Text, View } from 'react-native';

const InfoItem = ({ label, value }) => (
  <View className="mb-3 rounded-2xl bg-slate-50 px-3 py-3">
    <Text className="text-xs uppercase tracking-wide text-slate-500">{label}</Text>
    <Text className="mt-1 text-sm font-semibold text-slate-950" numberOfLines={1}>
      {value || '--'}
    </Text>
  </View>
);

const LocationInfoCard = ({ location, selectedMarker, geofence, distance }) => {
  const activeLocation = selectedMarker || location || {};

  return (
    <View className="rounded-3xl bg-white p-4 shadow-sm" style={{ shadowColor: '#0F172A' }}>
      <Text className="mb-3 text-base font-bold text-slate-950">Location Details</Text>
      <InfoItem label="Latitude" value={activeLocation.latitude} />
      <InfoItem label="Longitude" value={activeLocation.longitude} />
      <InfoItem label="Address" value={activeLocation.address || activeLocation.description} />
      <InfoItem label="Accuracy" value={location?.accuracy != null ? `${location.accuracy} m` : '--'} />
      <InfoItem label="Distance" value={distance != null ? `${distance.toFixed(0)} m` : '--'} />
      <InfoItem label="Radius" value={geofence?.radius != null ? `${geofence.radius} m` : '--'} />
    </View>
  );
};

export default LocationInfoCard;
