import React from 'react';
import { Text, View } from 'react-native';

const LegendItem = ({ color, label }) => (
  <View className="mr-3 flex-row items-center">
    <View className="mr-2 h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
    <Text className="text-xs font-medium text-slate-600">{label}</Text>
  </View>
);

const MapLegend = () => {
  return (
    <View className="flex-row flex-wrap rounded-2xl bg-white px-4 py-3 shadow-sm" style={{ shadowColor: '#0F172A' }}>
      <LegendItem color="#2563EB" label="Upcoming" />
      <LegendItem color="#16A34A" label="Completed" />
      <LegendItem color="#DC2626" label="Missed" />
      <LegendItem color="#D97706" label="Snoozed" />
    </View>
  );
};

export default MapLegend;
