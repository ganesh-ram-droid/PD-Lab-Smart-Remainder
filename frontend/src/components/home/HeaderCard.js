import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import colors from '../../constants/colors';

const HeaderCard = ({ userName, dateLabel, photoURL, onNotificationPress }) => {
  const initials = (userName || 'User')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

  return (
    <View className="rounded-3xl bg-white px-4 py-4 shadow-sm" style={{ shadowColor: '#0F172A' }}>
      <View className="flex-row items-center justify-between">
        <View className="flex-row flex-1 items-center">
          <View className="h-12 w-12 overflow-hidden rounded-2xl bg-blue-600">
            {photoURL ? (
              <Image source={{ uri: photoURL }} className="h-12 w-12" resizeMode="cover" />
            ) : (
              <View className="h-12 w-12 items-center justify-center">
                <Text className="text-sm font-bold text-white">{initials}</Text>
              </View>
            )}
          </View>
          <View className="ml-3 flex-1">
            <Text className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Welcome
            </Text>
            <Text className="text-base font-bold text-slate-950" numberOfLines={1}>
              {userName || 'User'}
            </Text>
            <Text className="mt-0.5 text-xs text-slate-500">{dateLabel}</Text>
          </View>
        </View>

        <Pressable
          onPress={onNotificationPress}
          className="h-11 w-11 items-center justify-center rounded-2xl bg-slate-100"
        >
          <Icon name="notifications-outline" size={20} color={colors.primary} />
        </Pressable>
      </View>
    </View>
  );
};

export default HeaderCard;
