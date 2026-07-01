import React from 'react';
import { Text, View } from 'react-native';

const StatisticTile = ({ label, value, accent = 'blue' }) => {
  const accentClasses = {
    blue: 'text-blue-600',
    green: 'text-emerald-600',
    orange: 'text-orange-600',
    red: 'text-red-600',
    slate: 'text-slate-900'
  };

  return (
    <View className="min-h-[86px] flex-1 rounded-2xl bg-slate-50 p-3">
      <Text className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</Text>
      <Text className={`mt-2 text-xl font-bold ${accentClasses[accent] || accentClasses.slate}`}>
        {value}
      </Text>
    </View>
  );
};

const StatisticsCard = ({ statistics = {} }) => {
  const items = [
    { label: "Today's Reminders", value: statistics.todaysReminders || 0, accent: 'blue' },
    { label: 'Completed', value: statistics.completedToday || 0, accent: 'green' },
    { label: 'Pending', value: statistics.pendingToday || 0, accent: 'orange' },
    { label: 'Missed', value: statistics.missedToday || 0, accent: 'red' },
    { label: 'Avg Context Score', value: statistics.averageContextScore || 0, accent: 'blue' },
    { label: 'Completion %', value: `${statistics.completionPercentage || 0}%`, accent: 'green' }
  ];

  return (
    <View className="rounded-3xl bg-white p-4 shadow-sm" style={{ shadowColor: '#0F172A' }}>
      <Text className="mb-4 text-base font-bold text-slate-950">Today's Statistics</Text>
      <View className="flex-row flex-wrap justify-between gap-3">
        {items.map((item) => (
          <View key={item.label} className="w-[48%]">
            <StatisticTile {...item} />
          </View>
        ))}
      </View>
    </View>
  );
};

export default StatisticsCard;
