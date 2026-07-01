import React from 'react';
import { Text, View } from 'react-native';

const NotificationBadge = ({ label, count }) => {
  return (
    <View className="rounded-full bg-slate-100 px-2.5 py-1">
      <Text className="text-xs font-semibold text-slate-700">
        {label}
        {typeof count === 'number' ? ` ${count}` : ''}
      </Text>
    </View>
  );
};

export default NotificationBadge;
