import React from 'react';
import { Text, View } from 'react-native';

const Card = ({ label, value, accent = 'blue' }) => {
  const accentMap = {
    blue: 'text-blue-700',
    green: 'text-emerald-700',
    orange: 'text-orange-700',
    red: 'text-red-700'
  };

  return (
    <View className="rounded-2xl bg-slate-50 p-3">
      <Text className="text-xs uppercase tracking-wide text-slate-500">{label}</Text>
      <Text className={`mt-2 text-xl font-bold ${accentMap[accent] || accentMap.blue}`}>{value}</Text>
    </View>
  );
};

const ProfileStatistics = ({ stats = {} }) => {
  return (
    <View className="rounded-3xl bg-white p-4 shadow-sm" style={{ shadowColor: '#0F172A' }}>
      <Text className="text-base font-bold text-slate-950">Analytics Summary</Text>
      <View className="mt-4 flex-row flex-wrap justify-between">
        <View className="mb-3 w-[48%]">
          <Card label="Completion Rate" value={`${Number(stats.completionRate || 0).toFixed(0)}%`} accent="green" />
        </View>
        <View className="mb-3 w-[48%]">
          <Card label="Total Reminders" value={Number(stats.totalReminders || 0).toFixed(0)} accent="blue" />
        </View>
        <View className="mb-3 w-[48%]">
          <Card label="Pending" value={Number(stats.pendingReminders || 0).toFixed(0)} accent="orange" />
        </View>
        <View className="mb-3 w-[48%]">
          <Card label="Missed" value={Number(stats.missedReminders || 0).toFixed(0)} accent="red" />
        </View>
      </View>
    </View>
  );
};

export default ProfileStatistics;
