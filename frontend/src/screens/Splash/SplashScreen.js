import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const SplashScreen = () => {
  return (
    <View className="flex-1 bg-slate-950 px-8">
      <View className="flex-1 items-center justify-center">
        <View className="h-20 w-20 items-center justify-center rounded-2xl bg-blue-600">
          <Icon name="notifications" size={38} color="#FFFFFF" />
        </View>
        <Text className="mt-6 text-center text-3xl font-bold text-white">
          Context Reminder
        </Text>
        <Text className="mt-3 text-center text-base leading-6 text-slate-300">
          Adaptive reminders powered by contextual intelligence.
        </Text>
      </View>
      <View className="pb-12">
        <ActivityIndicator color="#60A5FA" />
        <Text className="mt-3 text-center text-sm font-medium text-slate-300">
          Starting secure session...
        </Text>
      </View>
    </View>
  );
};

export default SplashScreen;
