import React from 'react';
import { Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import Button from './Button';

const ErrorScreen = ({ title = 'Something went wrong', message, onRetry }) => {
  return (
    <View className="flex-1 items-center justify-center bg-slate-50 px-6">
      <View className="h-20 w-20 items-center justify-center rounded-full bg-red-50">
        <Icon name="alert-circle-outline" size={34} color="#DC2626" />
      </View>
      <Text className="mt-5 text-lg font-bold text-slate-950">{title}</Text>
      {message ? <Text className="mt-2 text-center text-sm leading-5 text-slate-500">{message}</Text> : null}
      {onRetry ? (
        <View className="mt-5 w-full">
          <Button title="Retry" onPress={onRetry} />
        </View>
      ) : null}
    </View>
  );
};

export default ErrorScreen;
