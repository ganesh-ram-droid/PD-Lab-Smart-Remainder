import React from 'react';
import { Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import Button from './Button';

const OfflineScreen = ({ onRetry }) => {
  return (
    <View className="flex-1 items-center justify-center bg-slate-50 px-6">
      <View className="h-20 w-20 items-center justify-center rounded-full bg-slate-100">
        <Icon name="cloud-offline-outline" size={34} color="#2563EB" />
      </View>
      <Text className="mt-5 text-lg font-bold text-slate-950">Offline</Text>
      <Text className="mt-2 text-center text-sm leading-5 text-slate-500">
        Check your internet connection and try again.
      </Text>
      <View className="mt-5 w-full">
        <Button title="Retry" onPress={onRetry} />
      </View>
    </View>
  );
};

export default OfflineScreen;
