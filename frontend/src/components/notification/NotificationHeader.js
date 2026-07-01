import React from 'react';
import { Pressable, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const NotificationHeader = ({ title, subtitle, count, onSettingsPress }) => {
  return (
    <View className="rounded-3xl bg-white px-4 py-4 shadow-sm" style={{ shadowColor: '#0F172A' }}>
      <View className="flex-row items-center justify-between">
        <View className="flex-1 pr-3">
          <Text className="text-base font-bold text-slate-950">{title}</Text>
          {subtitle ? <Text className="mt-1 text-xs text-slate-500">{subtitle}</Text> : null}
        </View>
        <Pressable
          onPress={onSettingsPress}
          className="h-11 w-11 items-center justify-center rounded-2xl bg-slate-100"
        >
          <Icon name="settings-outline" size={18} color="#2563EB" />
        </Pressable>
      </View>

      <View className="mt-3 flex-row items-center">
        <View className="rounded-full bg-blue-50 px-2.5 py-1">
          <Text className="text-xs font-semibold text-blue-700">
            {typeof count === 'number' ? `${count} Notifications` : 'Notifications'}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default NotificationHeader;
