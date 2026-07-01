import React from 'react';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const statusMap = {
  Upcoming: { color: '#2563EB', icon: 'alarm-outline' },
  Pending: { color: '#2563EB', icon: 'alarm-outline' },
  Completed: { color: '#16A34A', icon: 'checkmark-circle-outline' },
  Missed: { color: '#DC2626', icon: 'close-circle-outline' },
  Cancelled: { color: '#64748B', icon: 'ban-outline' },
  Snoozed: { color: '#D97706', icon: 'time-outline' }
};

const ReminderMarker = ({ status = 'Upcoming' }) => {
  const theme = statusMap[status] || statusMap.Upcoming;

  return (
    <View className="items-center justify-center rounded-full border-4 border-white shadow-sm" style={{ backgroundColor: theme.color, width: 30, height: 30 }}>
      <Icon name={theme.icon} size={14} color="#FFFFFF" />
    </View>
  );
};

export default ReminderMarker;
