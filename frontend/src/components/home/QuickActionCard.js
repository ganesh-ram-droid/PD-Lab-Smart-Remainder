import React from 'react';
import { Pressable, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const toneMap = {
  blue: {
    container: 'bg-blue-50',
    icon: '#2563EB'
  },
  green: {
    container: 'bg-emerald-50',
    icon: '#10B981'
  },
  orange: {
    container: 'bg-orange-50',
    icon: '#F97316'
  },
  slate: {
    container: 'bg-slate-100',
    icon: '#0F172A'
  }
};

const QuickActionCard = ({ title, icon, tone = 'blue', onPress, className = '' }) => {
  const theme = toneMap[tone] || toneMap.blue;

  return (
    <Pressable
      onPress={onPress}
      className={`rounded-2xl bg-white p-3 shadow-sm ${className}`}
      style={{ shadowColor: '#0F172A' }}
    >
      <View className={`h-12 w-12 items-center justify-center rounded-2xl ${theme.container}`}>
        <Icon name={icon} size={22} color={theme.icon} />
      </View>
      <Text className="mt-3 text-sm font-semibold text-slate-950" numberOfLines={2}>
        {title}
      </Text>
    </Pressable>
  );
};

export default QuickActionCard;
