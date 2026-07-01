import React from 'react';
import { Text, View } from 'react-native';

const Row = ({ label, value }) => (
  <View className="mb-3 rounded-2xl bg-slate-50 px-3 py-3">
    <Text className="text-xs uppercase tracking-wide text-slate-500">{label}</Text>
    <Text className="mt-1 text-sm font-semibold text-slate-950">{value || '--'}</Text>
  </View>
);

const LocationAnalyticsCard = ({ data = {} }) => {
  return (
    <View className="rounded-3xl bg-white p-4 shadow-sm" style={{ shadowColor: '#0F172A' }}>
      <Text className="text-base font-bold text-slate-950">Location Analytics</Text>
      <Text className="mt-1 text-sm text-slate-500">Geofence and movement insights</Text>
      <View className="mt-4">
        <Row label="Most Visited Location" value={data.mostVisitedReminderLocation || '--'} />
        <Row label="Most Triggered Geofence" value={data.mostTriggeredGeofence || '--'} />
        <Row label="Average Distance" value={data.averageDistanceFromReminder || '--'} />
        <Row label="Location Success Rate" value={`${Number(data.locationSuccessRate || 0).toFixed(0)}%`} />
      </View>
    </View>
  );
};

export default LocationAnalyticsCard;
