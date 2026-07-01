import React from 'react';
import { Pressable, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const AnalyticsHeader = ({ title, subtitle, onFilterPress, onRefreshPress }) => {
  return (
    <View className="rounded-3xl bg-white px-4 py-4 shadow-sm" style={{ shadowColor: '#0F172A' }}>
      <View className="flex-row items-start justify-between">
        <View className="flex-1 pr-3">
          <Text className="text-base font-bold text-slate-950">{title}</Text>
          {subtitle ? <Text className="mt-1 text-xs text-slate-500">{subtitle}</Text> : null}
        </View>
        <View className="flex-row">
          <Pressable onPress={onFilterPress} className="mr-2 h-11 w-11 items-center justify-center rounded-2xl bg-slate-100">
            <Icon name="options-outline" size={18} color="#2563EB" />
          </Pressable>
          <Pressable onPress={onRefreshPress} className="h-11 w-11 items-center justify-center rounded-2xl bg-blue-600">
            <Icon name="refresh-outline" size={18} color="#FFFFFF" />
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default AnalyticsHeader;
