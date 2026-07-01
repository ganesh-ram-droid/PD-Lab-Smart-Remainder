import React from 'react';
import { Text, View } from 'react-native';

const statusStyles = {
  Upcoming: 'bg-blue-50 text-blue-700',
  Pending: 'bg-blue-50 text-blue-700',
  Scheduled: 'bg-blue-50 text-blue-700',
  Completed: 'bg-emerald-50 text-emerald-700',
  Missed: 'bg-red-50 text-red-700',
  Cancelled: 'bg-slate-100 text-slate-600',
  Snoozed: 'bg-orange-50 text-orange-700',
  Suppressed: 'bg-slate-100 text-slate-600',
  Failed: 'bg-red-50 text-red-700'
};

const ReminderStatusBadge = ({ status = 'Pending' }) => {
  const style = statusStyles[status] || statusStyles.Pending;

  return (
    <View className={`rounded-full px-2.5 py-1 ${style}`}>
      <Text className="text-xs font-semibold">{status}</Text>
    </View>
  );
};

export default ReminderStatusBadge;
