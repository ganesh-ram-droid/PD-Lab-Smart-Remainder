import React from 'react';
import { Text, View } from 'react-native';

const CompletionChart = ({ value = 0 }) => {
  const percent = Math.max(0, Math.min(100, Number(value) || 0));

  return (
    <View className="rounded-3xl bg-white p-4 shadow-sm" style={{ shadowColor: '#0F172A' }}>
      <Text className="text-base font-bold text-slate-950">Completion Rate</Text>
      <View className="mt-4 h-32 items-center justify-center rounded-full border-8 border-emerald-100">
        <View className="h-24 w-24 items-center justify-center rounded-full border-8 border-emerald-500">
          <Text className="text-2xl font-bold text-slate-950">{percent.toFixed(0)}</Text>
          <Text className="text-xs text-slate-500">%</Text>
        </View>
      </View>
    </View>
  );
};

export default CompletionChart;
