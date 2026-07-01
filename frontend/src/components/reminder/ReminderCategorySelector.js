import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Controller } from 'react-hook-form';

import Input from '../common/Input';

const categories = [
  'Medicine',
  'Shopping',
  'Meeting',
  'Work',
  'College',
  'Exercise',
  'Travel',
  'Bills',
  'Personal',
  'Custom'
];

const chipBase = 'mr-2 mb-2 rounded-full px-3 py-2';

const ReminderCategorySelector = ({ control, errors, setValue, watch }) => {
  const category = watch('category');
  const customCategory = watch('customCategory');

  return (
    <View>
      <Text className="mb-2 text-sm font-semibold text-slate-700">Category</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {categories.map((item) => {
          const active = category === item;
          return (
            <Pressable
              key={item}
              onPress={() => setValue('category', item, { shouldValidate: true })}
              className={`${chipBase} ${active ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'}`}
            >
              {item}
            </Pressable>
          );
        })}
      </ScrollView>
      {errors.category ? (
        <Text className="mt-1 text-sm text-red-600">{errors.category.message}</Text>
      ) : null}

      {category === 'Custom' ? (
        <Controller
          control={control}
          name="customCategory"
          rules={{
            validate: (value) => {
              if (category === 'Custom' && !value?.trim()) {
                return 'Custom category is required.';
              }

              return true;
            }
          }}
          render={({ field: { onChange, value } }) => (
            <Input
              label="Custom Category"
              placeholder="Enter category"
              value={value || customCategory}
              onChangeText={onChange}
              error={errors.customCategory?.message}
            />
          )}
        />
      ) : null}
    </View>
  );
};

export default ReminderCategorySelector;
