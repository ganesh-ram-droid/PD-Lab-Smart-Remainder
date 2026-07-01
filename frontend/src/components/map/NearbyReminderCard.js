import React from 'react';
import { Pressable, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const priorityStyles = {
  High: 'bg-red-50 text-red-700',
  Medium: 'bg-orange-50 text-orange-700',
  Low: 'bg-emerald-50 text-emerald-700'
};

const NearbyReminderCard = ({ reminder, onNavigate }) => {
  const distanceValue =
    reminder.distance != null ? `${(Number(reminder.distance) / 1000).toFixed(2)} km` : 'Unknown';

  return (
    <View className="mb-3 rounded-3xl bg-white p-4 shadow-sm" style={{ shadowColor: '#0F172A' }}>
      <View className="flex-row items-start justify-between">
        <View className="flex-1 pr-3">
          <Text className="text-base font-bold text-slate-950" numberOfLines={1}>
            {reminder.title}
          </Text>
          <Text className="mt-1 text-sm text-slate-500" numberOfLines={1}>
            {reminder.category}
          </Text>
        </View>
        <View className="h-10 w-10 items-center justify-center rounded-2xl bg-blue-50">
          <Icon name="navigate-outline" size={18} color="#2563EB" />
        </View>
      </View>

      <View className="mt-3 flex-row flex-wrap items-center gap-2">
        <View className="rounded-full bg-blue-50 px-2.5 py-1">
          <Text className="text-xs font-semibold text-blue-700">{distanceValue}</Text>
        </View>
        <View className={`rounded-full px-2.5 py-1 ${priorityStyles[reminder.priority] || priorityStyles.Low}`}>
          <Text className="text-xs font-semibold">{reminder.priority}</Text>
        </View>
        <View className="rounded-full bg-slate-100 px-2.5 py-1">
          <Text className="text-xs font-semibold text-slate-600">{reminder.status}</Text>
        </View>
      </View>

      <View className="mt-4 flex-row">
        <Pressable
          onPress={() => onNavigate?.(reminder)}
          className="rounded-2xl bg-blue-600 px-4 py-3"
        >
          <Text className="text-sm font-semibold text-white">Navigate</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default NearbyReminderCard;
