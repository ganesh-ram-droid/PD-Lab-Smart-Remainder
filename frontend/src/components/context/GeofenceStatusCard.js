import React from 'react';
import { Text, View } from 'react-native';

const GeofenceStatusCard = ({ insideGeofence, distanceRemaining, reminderRadius }) => {
  return (
    <View className="rounded-3xl bg-white p-4 shadow-sm" style={{ shadowColor: '#0F172A' }}>
      <Text className="text-base font-bold text-slate-950">Geofence Status</Text>
      <View className="mt-4 rounded-2xl bg-slate-50 px-3 py-3">
        <Text className="text-sm font-semibold text-slate-950">
          {insideGeofence ? 'Inside Geofence' : 'Outside Geofence'}
        </Text>
        <Text className="mt-1 text-xs text-slate-500">
          Distance Remaining: {distanceRemaining != null ? `${Number(distanceRemaining).toFixed(0)} m` : '--'}
        </Text>
        <Text className="mt-1 text-xs text-slate-500">
          Reminder Radius: {reminderRadius != null ? `${Number(reminderRadius).toFixed(0)} m` : '--'}
        </Text>
      </View>
    </View>
  );
};

export default GeofenceStatusCard;
