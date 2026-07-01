import React from 'react';
import { Text, View } from 'react-native';

import ProgressCard from './ProgressCard';

const ReminderStatisticsCard = ({ dashboard = {} }) => {
  const items = [
    { label: 'Completion Rate', value: dashboard.completionRate || dashboard.completionPercentage || 0, accent: 'green' },
    { label: 'Pending', value: dashboard.pendingReminders || 0, accent: 'blue', suffix: '' },
    { label: 'Missed', value: dashboard.missedReminders || 0, accent: 'red', suffix: '' },
    { label: 'Cancelled', value: dashboard.cancelledReminders || 0, accent: 'orange', suffix: '' },
    { label: 'Snoozed', value: dashboard.snoozedReminders || 0, accent: 'orange', suffix: '' },
    { label: 'Today', value: dashboard.todaysReminders || 0, accent: 'blue', suffix: '' }
  ];

  return (
    <View className="rounded-3xl bg-white p-4 shadow-sm" style={{ shadowColor: '#0F172A' }}>
      <Text className="text-base font-bold text-slate-950">Reminder Statistics</Text>
      <Text className="mt-1 text-sm text-slate-500">Operational summary</Text>
      <View className="mt-4 flex-row flex-wrap justify-between">
        {items.map((item) => (
          <View key={item.label} className="mb-3 w-[48%]">
            <ProgressCard {...item} />
          </View>
        ))}
      </View>
    </View>
  );
};

export default ReminderStatisticsCard;
