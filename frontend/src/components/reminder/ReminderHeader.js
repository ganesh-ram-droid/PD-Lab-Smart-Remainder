import React from 'react';
import { Pressable, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import colors from '../../constants/colors';

const ReminderHeader = ({
  title,
  subtitle,
  onBackPress,
  onRightPress,
  rightIcon = 'add-outline',
  rightLabel
}) => {
  return (
    <View className="rounded-3xl bg-white px-4 py-4 shadow-sm" style={{ shadowColor: '#0F172A' }}>
      <View className="flex-row items-center justify-between">
        <View className="flex-row flex-1 items-center">
          {onBackPress ? (
            <Pressable
              onPress={onBackPress}
              className="mr-3 h-11 w-11 items-center justify-center rounded-2xl bg-slate-100"
            >
              <Icon name="chevron-back" size={20} color={colors.primary} />
            </Pressable>
          ) : null}
          <View className="flex-1">
            <Text className="text-base font-bold text-slate-950" numberOfLines={1}>
              {title}
            </Text>
            {subtitle ? (
              <Text className="mt-0.5 text-xs text-slate-500" numberOfLines={1}>
                {subtitle}
              </Text>
            ) : null}
          </View>
        </View>

        {onRightPress ? (
          <Pressable
            onPress={onRightPress}
            className="ml-3 flex-row items-center rounded-2xl bg-blue-600 px-3 py-2"
          >
            <Icon name={rightIcon} size={18} color="#FFFFFF" />
            {rightLabel ? (
              <Text className="ml-2 text-sm font-semibold text-white">{rightLabel}</Text>
            ) : null}
          </Pressable>
        ) : null}
      </View>
    </View>
  );
};

export default ReminderHeader;
