import React from 'react';
import { Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const Row = ({ label, value }) => (
  <View className="mb-3 rounded-2xl bg-slate-50 px-3 py-3">
    <Text className="text-xs uppercase tracking-wide text-slate-500">{label}</Text>
    <Text className="mt-1 text-sm font-semibold text-slate-950" numberOfLines={2}>
      {value || '--'}
    </Text>
  </View>
);

const CurrentLocationCard = ({ location = {} }) => {
  const inside = location.isInsideGeofence ? 'Inside Geofence' : 'Outside Geofence';

  return (
    <View className="rounded-3xl bg-white p-4 shadow-sm" style={{ shadowColor: '#0F172A' }}>
      <View className="flex-row items-center justify-between">
        <View>
          <Text className="text-base font-bold text-slate-950">Current Location</Text>
          <Text className="mt-1 text-sm text-slate-500">Live device position</Text>
        </View>
        <View className="h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50">
          <Icon name="location-outline" size={18} color="#16A34A" />
        </View>
      </View>

      <View className="mt-4">
        <Row label="Latitude" value={location.currentLatitude} />
        <Row label="Longitude" value={location.currentLongitude} />
        <Row label="Address" value={location.address || location.locationName || 'Unknown'} />
        <Row label="Accuracy" value={location.accuracy != null ? `${location.accuracy} m` : '--'} />
        <Row label="Distance From Reminder" value={location.distance != null ? `${Number(location.distance).toFixed(0)} m` : '--'} />
        <Row label="Geofence Status" value={inside} />
      </View>
    </View>
  );
};

export default CurrentLocationCard;
