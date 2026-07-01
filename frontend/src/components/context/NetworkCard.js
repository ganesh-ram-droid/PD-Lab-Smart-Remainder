import React from 'react';
import { Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const NetworkCard = ({ networkStatus }) => {
  return (
    <View className="rounded-3xl bg-white p-4 shadow-sm" style={{ shadowColor: '#0F172A' }}>
      <View className="flex-row items-center justify-between">
        <View>
          <Text className="text-base font-bold text-slate-950">Network</Text>
          <Text className="mt-1 text-sm text-slate-500">Connectivity state</Text>
        </View>
        <View className="h-10 w-10 items-center justify-center rounded-2xl bg-blue-50">
          <Icon name="wifi-outline" size={18} color="#2563EB" />
        </View>
      </View>
      <View className="mt-4 rounded-2xl bg-slate-50 px-3 py-3">
        <Text className="text-sm font-semibold text-slate-950">{networkStatus || 'Unknown'}</Text>
      </View>
    </View>
  );
};

export default NetworkCard;
