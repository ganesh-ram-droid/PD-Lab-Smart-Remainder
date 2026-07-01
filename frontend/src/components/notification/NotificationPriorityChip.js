import React from 'react';
import { Text, View } from 'react-native';

const priorityStyles = {
  High: 'bg-red-50 text-red-700',
  Normal: 'bg-blue-50 text-blue-700',
  Low: 'bg-emerald-50 text-emerald-700'
};

const NotificationPriorityChip = ({ priority = 'Normal' }) => {
  const style = priorityStyles[priority] || priorityStyles.Normal;
  return (
    <View className={`rounded-full px-2.5 py-1 ${style}`}>
      <Text className="text-xs font-semibold">{priority}</Text>
    </View>
  );
};

export default NotificationPriorityChip;
