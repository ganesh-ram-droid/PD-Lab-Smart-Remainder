import React from 'react';
import { Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const ActivityRow = ({ label, items, icon, tone }) => {
  const toneClasses = {
    blue: 'bg-blue-50 text-blue-700',
    green: 'bg-emerald-50 text-emerald-700',
    orange: 'bg-orange-50 text-orange-700'
  };

  return (
    <View className="flex-row items-start rounded-2xl bg-slate-50 p-3">
      <View className={`mr-3 h-10 w-10 items-center justify-center rounded-2xl ${toneClasses[tone] || toneClasses.blue}`}>
        <Icon name={icon} size={18} color={tone === 'green' ? '#10B981' : tone === 'orange' ? '#F97316' : '#2563EB'} />
      </View>
      <View className="flex-1">
        <Text className="text-sm font-semibold text-slate-950">{label}</Text>
        <Text className="mt-1 text-xs text-slate-500">
          {items.length ? items.map((item) => item.title).join(', ') : 'No recent activity'}
        </Text>
      </View>
    </View>
  );
};

const RecentActivityCard = ({ recentActivity = {} }) => {
  return (
    <View className="rounded-3xl bg-white p-4 shadow-sm" style={{ shadowColor: '#0F172A' }}>
      <Text className="mb-4 text-base font-bold text-slate-950">Recent Activity</Text>
      <ActivityRow
        label="Recently Completed"
        items={recentActivity.completed || []}
        icon="checkmark-circle-outline"
        tone="green"
      />
      <View className="h-3" />
      <ActivityRow
        label="Recently Snoozed"
        items={recentActivity.snoozed || []}
        icon="time-outline"
        tone="orange"
      />
      <View className="h-3" />
      <ActivityRow
        label="Recently Dismissed"
        items={recentActivity.dismissed || []}
        icon="close-circle-outline"
        tone="blue"
      />
    </View>
  );
};

export default RecentActivityCard;
