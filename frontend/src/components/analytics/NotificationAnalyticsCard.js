import React from 'react';
import { Text, View } from 'react-native';

const Metric = ({ label, value, color = 'blue' }) => {
  const colorMap = {
    blue: 'text-blue-700',
    green: 'text-emerald-700',
    orange: 'text-orange-700',
    red: 'text-red-700'
  };

  return (
    <View className="mb-3 rounded-2xl bg-slate-50 px-3 py-3">
      <Text className="text-xs uppercase tracking-wide text-slate-500">{label}</Text>
      <Text className={`mt-1 text-sm font-bold ${colorMap[color] || colorMap.blue}`}>{value}</Text>
    </View>
  );
};

const NotificationAnalyticsCard = ({ data = {} }) => {
  return (
    <View className="rounded-3xl bg-white p-4 shadow-sm" style={{ shadowColor: '#0F172A' }}>
      <Text className="text-base font-bold text-slate-950">Notification Analytics</Text>
      <Text className="mt-1 text-sm text-slate-500">Delivery and engagement</Text>
      <View className="mt-4">
        <Metric label="Sent" value={data.sent || data.notificationsSent || 0} color="blue" />
        <Metric label="Delivered" value={data.delivered || data.notificationsDelivered || 0} color="green" />
        <Metric label="Opened" value={data.opened || data.notificationsOpened || 0} color="green" />
        <Metric label="Suppressed" value={data.suppressed || data.notificationsSuppressed || 0} color="red" />
        <Metric label="Failed" value={data.failed || data.notificationsFailed || 0} color="red" />
        <Metric label="Success Rate" value={`${Number(data.successRate || data.notificationSuccessRate || 0).toFixed(0)}%`} color="green" />
      </View>
    </View>
  );
};

export default NotificationAnalyticsCard;
