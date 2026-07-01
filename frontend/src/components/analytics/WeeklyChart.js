import React from 'react';
import { Text, View } from 'react-native';

const WeeklyChart = ({ data = [] }) => {
  const values = data.slice(0, 7);
  const max = Math.max(...values.map((item) => Number(item.value || 0)), 1);

  return (
    <View className="rounded-3xl bg-white p-4 shadow-sm" style={{ shadowColor: '#0F172A' }}>
      <Text className="text-base font-bold text-slate-950">Weekly Completion</Text>
      <View className="mt-4 flex-row items-end justify-between">
        {values.map((item) => {
          const height = `${Math.max(12, (Number(item.value || 0) / max) * 100)}%`;
          return (
            <View key={item.label} className="flex-1 items-center px-1">
              <View className="h-28 w-full justify-end rounded-2xl bg-slate-50 p-1">
                <View className="rounded-xl bg-emerald-500" style={{ height }} />
              </View>
              <Text className="mt-2 text-[10px] text-slate-500" numberOfLines={1}>
                {item.label}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default WeeklyChart;
