import React from 'react';
import { Text, View } from 'react-native';

const Row = ({ label, value }) => (
  <View className="mb-3 rounded-2xl bg-slate-50 px-3 py-3">
    <Text className="text-xs uppercase tracking-wide text-slate-500">{label}</Text>
    <Text className="mt-1 text-sm font-semibold text-slate-950">{value || '--'}</Text>
  </View>
);

const BehaviorAnalyticsCard = ({ data = {} }) => {
  return (
    <View className="rounded-3xl bg-white p-4 shadow-sm" style={{ shadowColor: '#0F172A' }}>
      <Text className="text-base font-bold text-slate-950">Behavior Analytics</Text>
      <Text className="mt-1 text-sm text-slate-500">User response pattern</Text>
      <View className="mt-4">
        <Row label="Completion Rate" value={`${Number(data.completionRate || 0).toFixed(0)}%`} />
        <Row label="Ignore Rate" value={`${Number(data.ignoreRate || 0).toFixed(0)}%`} />
        <Row label="Dismiss Rate" value={`${Number(data.dismissRate || 0).toFixed(0)}%`} />
        <Row label="Average Response Time" value={data.averageResponseTime || '--'} />
        <Row label="Preferred Reminder Time" value={data.preferredReminderTime || '--'} />
        <Row label="Preferred Reminder Day" value={data.preferredReminderDay || '--'} />
        <Row label="Most Successful Category" value={data.mostSuccessfulReminderCategory || '--'} />
      </View>
    </View>
  );
};

export default BehaviorAnalyticsCard;
