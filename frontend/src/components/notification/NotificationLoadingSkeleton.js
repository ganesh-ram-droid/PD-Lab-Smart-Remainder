import React from 'react';
import { View } from 'react-native';

const NotificationLoadingSkeleton = () => {
  return (
    <View className="px-4 pt-4">
      <View className="rounded-3xl bg-white p-4">
        <View className="h-5 w-32 rounded-full bg-slate-200" />
        <View className="mt-2 h-4 w-48 rounded-full bg-slate-200" />
      </View>
      <View className="mt-4 rounded-3xl bg-white p-4">
        <View className="h-12 rounded-2xl bg-slate-200" />
        <View className="mt-3 h-12 rounded-2xl bg-slate-200" />
        <View className="mt-3 h-12 rounded-2xl bg-slate-200" />
      </View>
      <View className="mt-4">
        <View className="mb-3 h-28 rounded-3xl bg-white" />
        <View className="mb-3 h-28 rounded-3xl bg-white" />
        <View className="mb-3 h-28 rounded-3xl bg-white" />
      </View>
    </View>
  );
};

export default NotificationLoadingSkeleton;
