import React from 'react';
import { Pressable, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import colors from '../../constants/colors';

const priorityStyles = {
  High: {
    bg: 'bg-red-50',
    text: 'text-red-700',
    dot: colors.danger
  },
  Medium: {
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    dot: colors.warning
  },
  Low: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    dot: colors.success
  }
};

const statusStyles = {
  Pending: 'bg-blue-50 text-blue-700',
  Scheduled: 'bg-blue-50 text-blue-700',
  Suppressed: 'bg-slate-100 text-slate-600',
  Snoozed: 'bg-orange-50 text-orange-700',
  Completed: 'bg-emerald-50 text-emerald-700',
  Missed: 'bg-red-50 text-red-700',
  Cancelled: 'bg-slate-100 text-slate-600'
};

const UpcomingReminderCard = ({ reminder, onPress }) => {
  const priority = priorityStyles[reminder.priority] || priorityStyles.Low;

  return (
    <Pressable
      onPress={() => onPress?.(reminder)}
      className="mb-3 rounded-3xl bg-white p-4 shadow-sm"
      style={{ shadowColor: '#0F172A' }}
    >
      <View className="flex-row items-start justify-between">
        <View className="flex-1 pr-3">
          <Text className="text-base font-bold text-slate-950" numberOfLines={1}>
            {reminder.title}
          </Text>
          <View className="mt-2 flex-row flex-wrap items-center gap-2">
            <View className="rounded-full bg-slate-100 px-2.5 py-1">
              <Text className="text-xs font-medium text-slate-600">{reminder.category}</Text>
            </View>
            <View className={`rounded-full px-2.5 py-1 ${priority.bg}`}>
              <Text className={`text-xs font-semibold ${priority.text}`}>{reminder.priority}</Text>
            </View>
            <View className={`rounded-full px-2.5 py-1 ${statusStyles[reminder.status] || 'bg-slate-100 text-slate-600'}`}>
              <Text className="text-xs font-semibold">{reminder.status}</Text>
            </View>
          </View>
          <Text className="mt-3 text-sm text-slate-600" numberOfLines={2}>
            {reminder.description || 'Reminder scheduled for today.'}
          </Text>
        </View>
        <View className={`h-10 w-10 items-center justify-center rounded-2xl ${priority.bg}`}>
          <Icon name="alarm-outline" size={18} color={priority.dot} />
        </View>
      </View>

      <View className="mt-4 flex-row items-center justify-between border-t border-slate-100 pt-3">
        <View>
          <Text className="text-xs text-slate-500">Reminder Time</Text>
          <Text className="mt-1 text-sm font-semibold text-slate-900">
            {reminder.reminderTime || '--:--'}
          </Text>
        </View>
        <View>
          <Text className="text-xs text-slate-500">Reminder Date</Text>
          <Text className="mt-1 text-sm font-semibold text-slate-900">
            {reminder.reminderDate || '--'}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

export default UpcomingReminderCard;
