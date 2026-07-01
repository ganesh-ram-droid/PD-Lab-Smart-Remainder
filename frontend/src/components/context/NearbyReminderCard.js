import React from 'react';
import { Text, View } from 'react-native';

const NearbyReminderCard = ({ reminder }) => {
  const distance = reminder?.distance != null ? `${Number(reminder.distance).toFixed(0)} m` : '--';

  return (
    <View className="rounded-3xl bg-white p-4 shadow-sm" style={{ shadowColor: '#0F172A' }}>
      <Text className="text-base font-bold text-slate-950">Nearby Reminder</Text>
      <View className="mt-3 rounded-2xl bg-slate-50 px-3 py-3">
        <Text className="text-sm font-semibold text-slate-950" numberOfLines={1}>
          {reminder?.title || 'No nearby reminder'}
        </Text>
        <Text className="mt-1 text-sm text-slate-500">{distance}</Text>
        <Text className="mt-1 text-xs text-slate-500">
          Priority: {reminder?.priority || '--'}
        </Text>
        <Text className="mt-1 text-xs text-slate-500">
          Estimated Arrival: {reminder?.estimatedArrival || '--'}
        </Text>
      </View>
    </View>
  );
};

export default NearbyReminderCard;
