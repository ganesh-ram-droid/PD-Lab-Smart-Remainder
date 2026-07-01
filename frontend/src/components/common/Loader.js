import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

const Loader = ({ message = 'Loading...' }) => {
  return (
    <View className="flex-1 items-center justify-center bg-slate-50 px-6">
      <ActivityIndicator size="large" color="#2563EB" />
      <Text className="mt-4 text-base font-medium text-slate-600">{message}</Text>
    </View>
  );
};

export default Loader;
