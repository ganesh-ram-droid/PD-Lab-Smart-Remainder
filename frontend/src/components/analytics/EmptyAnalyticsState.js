import React from 'react';
import { Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import Button from '../common/Button';

const EmptyAnalyticsState = ({ onRetry }) => {
  return (
    <View className="items-center justify-center rounded-3xl bg-white px-6 py-10 shadow-sm" style={{ shadowColor: '#0F172A' }}>
      <View className="h-20 w-20 items-center justify-center rounded-full bg-blue-50">
        <Icon name="stats-chart-outline" size={34} color="#2563EB" />
      </View>
      <Text className="mt-5 text-lg font-bold text-slate-950">No analytics available</Text>
      <Text className="mt-2 text-center text-sm leading-5 text-slate-500">
        Refresh the dashboard after reminders, notifications, or context evaluations are available.
      </Text>
      <View className="mt-5 w-full">
        <Button title="Retry" onPress={onRetry} />
      </View>
    </View>
  );
};

export default EmptyAnalyticsState;
