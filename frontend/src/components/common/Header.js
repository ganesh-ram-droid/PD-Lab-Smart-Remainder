import React from 'react';
import { Pressable, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const Header = ({ title, subtitle, leftIcon, onLeftPress, rightIcon, onRightPress }) => {
  return (
    <View className="border-b border-slate-200 bg-white px-5 pb-4 pt-3">
      <View className="flex-row items-center justify-between">
        <View className="w-10">
          {leftIcon ? (
            <Pressable
              onPress={onLeftPress}
              className="h-10 w-10 items-center justify-center rounded-full bg-slate-100"
            >
              <Icon name={leftIcon} size={20} color="#0F172A" />
            </Pressable>
          ) : null}
        </View>
        <View className="flex-1 px-3">
          <Text className="text-center text-lg font-bold text-slate-950">{title}</Text>
          {subtitle ? (
            <Text className="mt-1 text-center text-sm text-slate-500">{subtitle}</Text>
          ) : null}
        </View>
        <View className="w-10">
          {rightIcon ? (
            <Pressable
              onPress={onRightPress}
              className="h-10 w-10 items-center justify-center rounded-full bg-slate-100"
            >
              <Icon name={rightIcon} size={20} color="#0F172A" />
            </Pressable>
          ) : null}
        </View>
      </View>
    </View>
  );
};

export default Header;
