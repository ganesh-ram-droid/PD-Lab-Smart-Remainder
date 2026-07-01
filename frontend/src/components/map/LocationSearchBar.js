import React from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const LocationSearchBar = ({
  value,
  onChangeText,
  onSearchPress,
  suggestions = [],
  onSelectSuggestion,
  onClear
}) => {
  return (
    <View className="rounded-3xl bg-white p-3 shadow-sm" style={{ shadowColor: '#0F172A' }}>
      <View className="flex-row items-center rounded-2xl bg-slate-50 px-3">
        <Icon name="search-outline" size={18} color="#64748B" />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder="Search place, address, or coordinates"
          placeholderTextColor="#94A3B8"
          className="ml-2 flex-1 py-3 text-base text-slate-900"
          returnKeyType="search"
          onSubmitEditing={onSearchPress}
        />
        {value ? (
          <Pressable onPress={onClear} className="mr-2 h-8 w-8 items-center justify-center rounded-full bg-slate-200">
            <Icon name="close" size={16} color="#64748B" />
          </Pressable>
        ) : null}
        <Pressable onPress={onSearchPress} className="h-9 w-9 items-center justify-center rounded-full bg-blue-600">
          <Icon name="arrow-forward" size={16} color="#FFFFFF" />
        </Pressable>
      </View>

      {suggestions.length ? (
        <ScrollView className="mt-3 max-h-48" nestedScrollEnabled showsVerticalScrollIndicator={false}>
          {suggestions.map((item, index) => (
            <Pressable
              key={`${item.latitude}-${item.longitude}-${index}`}
              onPress={() => onSelectSuggestion?.(item)}
              className="mb-2 rounded-2xl bg-slate-50 px-3 py-3"
            >
              <Text className="text-sm font-semibold text-slate-950" numberOfLines={1}>
                {item.displayName}
              </Text>
              <Text className="mt-1 text-xs text-slate-500">
                {item.latitude}, {item.longitude}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      ) : null}
    </View>
  );
};

export default LocationSearchBar;
