import React from 'react';
import { Pressable, Text, View } from 'react-native';

const repeats = ['None', 'Daily', 'Weekly', 'Monthly', 'Custom'];

const RepeatSelector = ({ value, onChange, error }) => {
  return (
    <View>
      <Text className="mb-2 text-sm font-semibold text-slate-700">Repeat</Text>
      <View className="flex-row flex-wrap">
        {repeats.map((item) => {
          const active = value === item;
          return (
            <Pressable
              key={item}
              onPress={() => onChange(item)}
              className={`mr-2 mb-2 rounded-full px-3 py-2 ${active ? 'bg-blue-600' : 'bg-slate-100'}`}
            >
              <Text className={`text-sm font-semibold ${active ? 'text-white' : 'text-slate-700'}`}>
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

export default RepeatSelector;
