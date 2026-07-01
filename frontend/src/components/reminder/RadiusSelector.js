import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Controller } from 'react-hook-form';

import Input from '../common/Input';

const radii = ['50', '100', '250', '500', '1000', 'Custom'];

const RadiusSelector = ({ control, errors, setValue, watch }) => {
  const radius = watch('radius');

  return (
    <View>
      <Text className="mb-2 text-sm font-semibold text-slate-700">Radius</Text>
      <View className="flex-row flex-wrap">
        {radii.map((item) => {
          const active = radius === item || (item !== 'Custom' && radius === item);
          return (
            <Pressable
              key={item}
              onPress={() => setValue('radius', item, { shouldValidate: true })}
              className={`mr-2 mb-2 rounded-full px-3 py-2 ${active ? 'bg-blue-600' : 'bg-slate-100'}`}
            >
              <Text className={`text-sm font-semibold ${active ? 'text-white' : 'text-slate-700'}`}>
                {item === 'Custom' ? 'Custom' : `${item} m`}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {radius === 'Custom' ? (
        <Controller
          control={control}
          name="customRadius"
          rules={{
            validate: (value) => {
              if (radius !== 'Custom') {
                return true;
              }

              const number = Number(value);
              if (!value || Number.isNaN(number) || number <= 0) {
                return 'Custom radius must be greater than 0.';
              }

              return true;
            }
          }}
          render={({ field: { onChange, value } }) => (
            <Input
              label="Custom Radius (meters)"
              placeholder="Enter radius"
              keyboardType="numeric"
              value={String(value ?? '')}
              onChangeText={onChange}
              error={errors.customRadius?.message}
            />
          )}
        />
      ) : null}

      {errors.radius ? <Text className="mt-1 text-sm text-red-600">{errors.radius.message}</Text> : null}
    </View>
  );
};

export default RadiusSelector;
