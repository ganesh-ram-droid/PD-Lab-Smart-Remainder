import React from 'react';
import { View } from 'react-native';

const AnalyticsSkeleton = () => {
  return (
    <View className="px-4 pt-4">
      <View className="rounded-3xl bg-white p-4">
        <View className="h-5 w-32 rounded-full bg-slate-200" />
        <View className="mt-2 h-4 w-48 rounded-full bg-slate-200" />
      </View>
      <View className="mt-4 flex-row flex-wrap justify-between">
        <View className="mb-3 h-28 w-[48%] rounded-3xl bg-white" />
        <View className="mb-3 h-28 w-[48%] rounded-3xl bg-white" />
        <View className="mb-3 h-28 w-[48%] rounded-3xl bg-white" />
        <View className="mb-3 h-28 w-[48%] rounded-3xl bg-white" />
      </View>
      <View className="mt-2 rounded-3xl bg-white p-4">
        <View className="h-44 rounded-3xl bg-slate-200" />
      </View>
    </View>
  );
};

export default AnalyticsSkeleton;
