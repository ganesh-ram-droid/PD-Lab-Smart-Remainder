import React from 'react';
import { Text, View } from 'react-native';

const Item = ({ label, value, accent = 'blue' }) => {
  const accentMap = {
    blue: 'text-blue-700',
    green: 'text-emerald-700',
    orange: 'text-orange-700',
    red: 'text-red-700',
    slate: 'text-slate-700'
  };

  return (
    <View className="mb-3 rounded-2xl bg-slate-50 px-3 py-3">
      <Text className="text-xs uppercase tracking-wide text-slate-500">{label}</Text>
      <Text className={`mt-1 text-sm font-bold ${accentMap[accent] || accentMap.slate}`}>
        {Number(value || 0).toFixed(0)}%
      </Text>
    </View>
  );
};

const ContextBreakdownCard = ({ breakdown = {} }) => {
  return (
    <View className="rounded-3xl bg-white p-4 shadow-sm" style={{ shadowColor: '#0F172A' }}>
      <Text className="text-base font-bold text-slate-950">Context Breakdown</Text>
      <Text className="mt-1 text-sm text-slate-500">How the score was formed</Text>
      <View className="mt-4">
        <Item label="Location" value={breakdown.location} accent="blue" />
        <Item label="Time" value={breakdown.time} accent="green" />
        <Item label="Activity" value={breakdown.activity} accent="orange" />
        <Item label="History" value={breakdown.history} accent="blue" />
        <Item label="Priority" value={breakdown.priority} accent="green" />
        <Item label="Battery" value={breakdown.battery} accent="orange" />
        <Item label="Network" value={breakdown.network} accent="red" />
      </View>
    </View>
  );
};

export default ContextBreakdownCard;
