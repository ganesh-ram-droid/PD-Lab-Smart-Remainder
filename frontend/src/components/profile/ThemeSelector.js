import React from 'react';
import { Pressable, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const ThemeSelector = ({ value, onChange }) => {
  const options = [
    { label: 'Light', key: 'light', icon: 'sunny-outline' },
    { label: 'Dark', key: 'dark', icon: 'moon-outline' }
  ];

  return (
    <View className="flex-row">
      {options.map((item) => {
        const active = value === item.key;
        return (
          <Pressable
            key={item.key}
            onPress={() => onChange(item.key)}
            className={`mr-2 flex-1 rounded-2xl px-4 py-4 ${active ? 'bg-blue-600' : 'bg-slate-100'}`}
          >
            <View className="items-center">
              <Icon name={item.icon} size={18} color={active ? '#FFFFFF' : '#2563EB'} />
              <Text className={`mt-2 text-sm font-semibold ${active ? 'text-white' : 'text-slate-700'}`}>
                {item.label}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
};

export default ThemeSelector;
