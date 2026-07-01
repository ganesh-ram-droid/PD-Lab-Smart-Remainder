import React from 'react';
import { Text, View } from 'react-native';

const statusStyles = {
  Scheduled: 'bg-blue-50 text-blue-700',
  Pending: 'bg-blue-50 text-blue-700',
  Sent: 'bg-emerald-50 text-emerald-700',
  Delivered: 'bg-emerald-50 text-emerald-700',
  Opened: 'bg-emerald-50 text-emerald-700',
  Dismissed: 'bg-slate-100 text-slate-600',
  Suppressed: 'bg-red-50 text-red-700',
  Cancelled: 'bg-slate-100 text-slate-600',
  Failed: 'bg-red-50 text-red-700'
};

const NotificationStatusChip = ({ status = 'Pending' }) => {
  const style = statusStyles[status] || statusStyles.Pending;
  return (
    <View className={`rounded-full px-2.5 py-1 ${style}`}>
      <Text className="text-xs font-semibold">{status}</Text>
    </View>
  );
};

export default NotificationStatusChip;
