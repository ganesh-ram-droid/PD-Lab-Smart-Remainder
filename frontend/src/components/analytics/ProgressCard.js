import React from 'react';
import { Text, View } from 'react-native';

const ProgressCard = ({ label, value, accent = 'blue', suffix = '%' }) => {
  const accentMap = {
    blue: 'text-blue-700',
    green: 'text-emerald-700',
    orange: 'text-orange-700',
    red: 'text-red-700'
  };

  return (
    <View className="rounded-3xl bg-white p-4 shadow-sm" style={{ shadowColor: '#0F172A' }}>
      <Text className="text-xs uppercase tracking-wide text-slate-500">{label}</Text>
      <Text className={`mt-2 text-2xl font-bold ${accentMap[accent] || accentMap.blue}`}>
        {Number(value || 0).toFixed(0)}
        {suffix}
      </Text>
    </View>
  );
};

export default ProgressCard;
