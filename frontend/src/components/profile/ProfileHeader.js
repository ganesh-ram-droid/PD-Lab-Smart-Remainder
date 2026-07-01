import React from 'react';
import { Pressable, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const ProfileHeader = ({ title, subtitle, onBackPress, onActionPress, actionIcon = 'create-outline' }) => {
  return (
    <View className="rounded-3xl bg-white px-4 py-4 shadow-sm" style={{ shadowColor: '#0F172A' }}>
      <View className="flex-row items-center justify-between">
        <View className="flex-1 pr-3">
          <Text className="text-base font-bold text-slate-950">{title}</Text>
          {subtitle ? <Text className="mt-1 text-xs text-slate-500">{subtitle}</Text> : null}
        </View>
        <View className="flex-row">
          {onBackPress ? (
            <Pressable onPress={onBackPress} className="mr-2 h-11 w-11 items-center justify-center rounded-2xl bg-slate-100">
              <Icon name="chevron-back" size={18} color="#2563EB" />
            </Pressable>
          ) : null}
          {onActionPress ? (
            <Pressable onPress={onActionPress} className="h-11 w-11 items-center justify-center rounded-2xl bg-blue-600">
              <Icon name={actionIcon} size={18} color="#FFFFFF" />
            </Pressable>
          ) : null}
        </View>
      </View>
    </View>
  );
};

export default ProfileHeader;
