import React from 'react';
import { Text, View } from 'react-native';

const TimelineItem = ({ label, value, active }) => (
  <View className="mb-3 flex-row items-start">
    <View className={`mt-1 h-3 w-3 rounded-full ${active ? 'bg-blue-600' : 'bg-slate-300'}`} />
    <View className="ml-3 flex-1">
      <Text className="text-sm font-semibold text-slate-950">{label}</Text>
      <Text className="mt-1 text-xs text-slate-500">{value || '--'}</Text>
    </View>
  </View>
);

const NotificationTimeline = ({ notification = {} }) => {
  return (
    <View className="rounded-3xl bg-white p-4 shadow-sm" style={{ shadowColor: '#0F172A' }}>
      <Text className="text-base font-bold text-slate-950">Timeline</Text>
      <Text className="mt-1 text-sm text-slate-500">Notification lifecycle</Text>
      <View className="mt-4">
        <TimelineItem label="Scheduled" value={notification.scheduledTime} active={Boolean(notification.scheduledTime)} />
        <TimelineItem label="Sent" value={notification.sentTime} active={Boolean(notification.sentTime)} />
        <TimelineItem label="Delivered" value={notification.deliveredTime} active={Boolean(notification.deliveredTime)} />
        <TimelineItem label="Opened" value={notification.openedTime} active={Boolean(notification.openedTime)} />
        <TimelineItem label="Completed" value={notification.completedTime} active={notification.status === 'Completed'} />
        <TimelineItem label="Dismissed" value={notification.dismissedTime} active={notification.status === 'Dismissed'} />
        <TimelineItem label="Cancelled" value={notification.cancelledTime} active={notification.status === 'Cancelled'} />
      </View>
    </View>
  );
};

export default NotificationTimeline;
