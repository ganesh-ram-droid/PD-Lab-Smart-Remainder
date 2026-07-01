import React from 'react';
import { Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const EmptyDashboard = () => {
  return (
    <View className="items-center justify-center rounded-3xl bg-white px-6 py-10 shadow-sm" style={{ shadowColor: '#0F172A' }}>
      <View className="h-20 w-20 items-center justify-center rounded-full bg-slate-100">
        <Icon name="document-text-outline" size={34} color="#2563EB" />
      </View>
      <Text className="mt-5 text-lg font-bold text-slate-950">No reminders available</Text>
      <Text className="mt-2 text-center text-sm leading-5 text-slate-500">
        Create a reminder to start seeing your dashboard insights, upcoming items, and recent activity.
      </Text>
    </View>
  );
};

export default EmptyDashboard;
