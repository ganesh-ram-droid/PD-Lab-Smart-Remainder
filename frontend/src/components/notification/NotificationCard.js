import React from 'react';
import { Pressable, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import NotificationPriorityChip from './NotificationPriorityChip';
import NotificationStatusChip from './NotificationStatusChip';

const NotificationCard = ({ notification, onPress }) => {
  const notificationTime =
    notification.sentTime || notification.scheduledTime || notification.createdAt || '--';

  return (
    <Pressable
      onPress={() => onPress?.(notification)}
      className="mb-3 rounded-3xl bg-white p-4 shadow-sm"
      style={{ shadowColor: '#0F172A' }}
    >
      <View className="flex-row items-start justify-between">
        <View className="flex-1 pr-3">
          <Text className="text-base font-bold text-slate-950" numberOfLines={1}>
            {notification.title}
          </Text>
          <Text className="mt-1 text-sm text-slate-500" numberOfLines={1}>
            {notification.category}
          </Text>
        </View>
        <View className="h-10 w-10 items-center justify-center rounded-2xl bg-blue-50">
          <Icon name="notifications-outline" size={18} color="#2563EB" />
        </View>
      </View>

      <View className="mt-3 flex-row flex-wrap items-center gap-2">
        <NotificationPriorityChip priority={notification.priority} />
        <NotificationStatusChip status={notification.status} />
        <View className="rounded-full bg-slate-100 px-2.5 py-1">
          <Text className="text-xs font-semibold text-slate-600">
            Score {Number(notification.contextScore || 0).toFixed(0)}
          </Text>
        </View>
        <View className="rounded-full bg-emerald-50 px-2.5 py-1">
          <Text className="text-xs font-semibold text-emerald-700" numberOfLines={1}>
            {notification.decision || 'Suppressed'}
          </Text>
        </View>
      </View>

      <View className="mt-4 flex-row items-center justify-between border-t border-slate-100 pt-3">
        <View>
          <Text className="text-xs text-slate-500">Notification Time</Text>
          <Text className="mt-1 text-sm font-semibold text-slate-900" numberOfLines={1}>
            {notificationTime}
          </Text>
        </View>
        <View>
          <Text className="text-xs text-slate-500">Reminder Time</Text>
          <Text className="mt-1 text-sm font-semibold text-slate-900" numberOfLines={1}>
            {notification.reminderTime || '--:--'}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

export default NotificationCard;
