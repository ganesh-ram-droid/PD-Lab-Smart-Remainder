import React from 'react';
import { Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const BatteryCard = ({ batteryLevel, charging, powerSaving }) => {
  return (
    <View className="rounded-3xl bg-white p-4 shadow-sm" style={{ shadowColor: '#0F172A' }}>
      <View className="flex-row items-center justify-between">
        <View>
          <Text className="text-base font-bold text-slate-950">Battery</Text>
          <Text className="mt-1 text-sm text-slate-500">Power awareness</Text>
        </View>
        <View className="h-10 w-10 items-center justify-center rounded-2xl bg-orange-50">
          <Icon name="battery-charging-outline" size={18} color="#D97706" />
        </View>
      </View>
      <View className="mt-4 rounded-2xl bg-slate-50 px-3 py-3">
        <Text className="text-sm font-semibold text-slate-950">
          {batteryLevel != null ? `${Number(batteryLevel).toFixed(0)}%` : '--'}
        </Text>
        <Text className="mt-1 text-xs text-slate-500">
          {charging ? 'Charging' : 'Not charging'} {powerSaving ? '• Power saving on' : ''}
        </Text>
      </View>
    </View>
  );
};

export default BatteryCard;
