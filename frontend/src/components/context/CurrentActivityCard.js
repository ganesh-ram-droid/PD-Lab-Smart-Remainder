import React from 'react';
import { Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const iconMap = {
  Walking: 'walk-outline',
  Running: 'run-outline',
  Driving: 'car-outline',
  Cycling: 'bicycle-outline',
  Stationary: 'pause-circle-outline',
  Unknown: 'help-circle-outline'
};

const CurrentActivityCard = ({ activity = 'Unknown' }) => {
  return (
    <View className="rounded-3xl bg-white p-4 shadow-sm" style={{ shadowColor: '#0F172A' }}>
      <Text className="text-base font-bold text-slate-950">Current Activity</Text>
      <View className="mt-4 flex-row items-center rounded-2xl bg-slate-50 px-4 py-4">
        <View className="h-12 w-12 items-center justify-center rounded-2xl bg-blue-50">
          <Icon name={iconMap[activity] || iconMap.Unknown} size={20} color="#2563EB" />
        </View>
        <View className="ml-3 flex-1">
          <Text className="text-sm text-slate-500">Detected movement</Text>
          <Text className="mt-1 text-base font-bold text-slate-950">{activity}</Text>
        </View>
      </View>
    </View>
  );
};

export default CurrentActivityCard;
