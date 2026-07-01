import React from 'react';
import { Pressable, Text, View } from 'react-native';

const priorities = ['High', 'Medium', 'Low'];

const priorityStyles = {
  High: 'bg-red-50 text-red-700',
  Medium: 'bg-orange-50 text-orange-700',
  Low: 'bg-emerald-50 text-emerald-700'
};

const PrioritySelector = ({ value, onChange, error }) => {
  return (
    <View>
      <Text className="mb-2 text-sm font-semibold text-slate-700">Priority</Text>
      <View className="flex-row">
        {priorities.map((item) => {
          const active = value === item;
          return (
            <Pressable
              key={item}
              onPress={() => onChange(item)}
              className={`mr-2 rounded-full px-4 py-2 ${active ? 'bg-blue-600' : 'bg-slate-100'}`}
            >
              <Text className={`text-sm font-semibold ${active ? 'text-white' : priorityStyles[item]}`}>
                {item}
              </Text>
            </Pressable>
          );
        })}
      </View>
      {error ? <Text className="mt-1 text-sm text-red-600">{error}</Text> : null}
    </View>
  );
};

export default PrioritySelector;
