import React from 'react';
import { Text, View } from 'react-native';

const MonthlyChart = ({ data = [] }) => {
  const values = data.slice(0, 12);
  const max = Math.max(...values.map((item) => Number(item.value || 0)), 1);

  return (
    <View className="rounded-3xl bg-white p-4 shadow-sm" style={{ shadowColor: '#0F172A' }}>
      <Text className="text-base font-bold text-slate-950">Monthly Trend</Text>
      <View className="mt-4 flex-row flex-wrap justify-between">
        {values.map((item) => {
          const width = `${Math.max(8, (Number(item.value || 0) / max) * 100)}%`;
          return (
            <View key={item.label} className="mb-3 w-[48%]">
              <Text className="mb-2 text-xs text-slate-500" numberOfLines={1}>
                {item.label}
              </Text>
              <View className="h-3 rounded-full bg-slate-100">
                <View className="h-3 rounded-full bg-blue-600" style={{ width }} />
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default MonthlyChart;
