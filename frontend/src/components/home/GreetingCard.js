import React from 'react';
import { Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import colors from '../../constants/colors';

const quotes = [
  'Small steps today create a smoother tomorrow.',
  'A focused reminder is a reminder that gets done.',
  'Consistency turns reminders into completed routines.'
];

const getGreeting = () => {
  const hour = new Date().getHours();

  if (hour < 12) {
    return 'Good Morning';
  }

  if (hour < 18) {
    return 'Good Afternoon';
  }

  return 'Good Evening';
};

const GreetingCard = ({ name }) => {
  const greeting = getGreeting();
  const quote = quotes[new Date().getDate() % quotes.length];

  return (
    <View className="overflow-hidden rounded-3xl bg-blue-600 px-5 py-5 shadow-sm" style={{ shadowColor: '#1D4ED8' }}>
      <View className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/10" />
      <View className="absolute -bottom-10 -left-8 h-24 w-24 rounded-full bg-white/10" />
      <View className="flex-row items-start justify-between">
        <View className="flex-1 pr-3">
          <Text className="text-sm font-semibold uppercase tracking-wide text-blue-100">
            {greeting}
          </Text>
          <Text className="mt-1 text-2xl font-bold text-white">
            {name || 'User'}
          </Text>
          <Text className="mt-3 text-sm leading-5 text-blue-50">{quote}</Text>
        </View>
        <View className="h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
          <Icon name="sparkles-outline" size={22} color="#FFFFFF" />
        </View>
      </View>
    </View>
  );
};

export default GreetingCard;
