import React from 'react';
import { Pressable, TextInput, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const ReminderSearchBar = ({ value, onChangeText, onFilterPress, onClearPress }) => {
  return (
    <View className="flex-row items-center rounded-2xl bg-white px-3 py-2 shadow-sm" style={{ shadowColor: '#0F172A' }}>
      <Icon name="search-outline" size={18} color="#64748B" />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Search reminders"
        placeholderTextColor="#94A3B8"
        className="ml-2 flex-1 py-2 text-base text-slate-900"
      />
      {value ? (
        <Pressable onPress={onClearPress} className="mr-2 h-8 w-8 items-center justify-center rounded-full bg-slate-100">
          <Icon name="close" size={16} color="#64748B" />
        </Pressable>
      ) : null}
      <Pressable
        onPress={onFilterPress}
        className="h-10 w-10 items-center justify-center rounded-2xl bg-blue-50"
      >
        <Icon name="options-outline" size={18} color="#2563EB" />
      </Pressable>
    </View>
  );
};

export default ReminderSearchBar;
