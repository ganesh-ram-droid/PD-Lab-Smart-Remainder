import React from 'react';
import { Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import Button from './Button';

const EmptyState = ({ icon = 'file-tray-outline', title, message, actionLabel, onAction }) => {
  return (
    <View className="items-center justify-center rounded-lg border border-slate-200 bg-white p-6">
      <View className="h-14 w-14 items-center justify-center rounded-full bg-blue-50">
        <Icon name={icon} size={28} color="#2563EB" />
      </View>
      <Text className="mt-4 text-center text-lg font-bold text-slate-950">{title}</Text>
      <Text className="mt-2 text-center text-sm leading-5 text-slate-500">{message}</Text>
      {actionLabel ? (
        <Button title={actionLabel} onPress={onAction} className="mt-5 self-stretch" />
      ) : null}
    </View>
  );
};

export default EmptyState;
