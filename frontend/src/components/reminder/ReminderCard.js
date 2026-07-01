import React from 'react';
import { Pressable, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import colors from '../../constants/colors';
import ReminderStatusBadge from './ReminderStatusBadge';

const pillStyles = {
  true: 'bg-emerald-50 text-emerald-700',
  false: 'bg-slate-100 text-slate-600'
};

const formatEnabled = (value) => (value ? 'Enabled' : 'Disabled');

const ReminderCard = ({ reminder, onPress }) => {
  const locationEnabled = Boolean(
    reminder.location || (reminder.latitude !== '' && reminder.longitude !== '' && reminder.latitude != null)
  );

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
          <Text className="mt-1 text-sm text-slate-500" numberOfLines={2}>
            {reminder.description || 'No description added.'}
          </Text>

          <View className="mt-3 flex-row flex-wrap items-center gap-2">
            <View className="rounded-full bg-slate-100 px-2.5 py-1">
              <Text className="text-xs font-medium text-slate-600">{reminder.category}</Text>
            </View>
            <View className="rounded-full bg-blue-50 px-2.5 py-1">
              <Text className="text-xs font-semibold text-blue-700">{reminder.priority}</Text>
            </View>
            <ReminderStatusBadge status={reminder.status} />
          </View>
        </View>

        <View className="h-11 w-11 items-center justify-center rounded-2xl bg-blue-50">
          <Icon name="alarm-outline" size={18} color={colors.primary} />
        </View>
      </View>

      <View className="mt-4 flex-row items-center justify-between border-t border-slate-100 pt-3">
        <View>
          <Text className="text-xs text-slate-500">Reminder Date</Text>
          <Text className="mt-1 text-sm font-semibold text-slate-950">
            {reminder.reminderDate || '--'}
          </Text>
        </View>
        <View>
          <Text className="text-xs text-slate-500">Reminder Time</Text>
          <Text className="mt-1 text-sm font-semibold text-slate-950">
            {reminder.reminderTime || '--:--'}
          </Text>
        </View>
      </View>

      <View className="mt-3 flex-row flex-wrap gap-2">
        <View className={`rounded-full px-2.5 py-1 ${pillStyles[String(reminder.contextEnabled)]}`}>
          <Text className="text-xs font-semibold">{`Context ${formatEnabled(reminder.contextEnabled)}`}</Text>
        </View>
        <View className={`rounded-full px-2.5 py-1 ${pillStyles[String(reminder.notificationEnabled)]}`}>
          <Text className="text-xs font-semibold">{`Notification ${formatEnabled(reminder.notificationEnabled)}`}</Text>
        </View>
        <View className={`rounded-full px-2.5 py-1 ${pillStyles[String(locationEnabled)]}`}>
          <Text className="text-xs font-semibold">{`Location ${formatEnabled(locationEnabled)}`}</Text>
        </View>
      </View>
    </Pressable>
  );
};

export default ReminderCard;
