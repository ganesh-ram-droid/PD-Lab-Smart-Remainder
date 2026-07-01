import React from 'react';
import { Text, View } from 'react-native';
import { Controller } from 'react-hook-form';

import Input from '../common/Input';

const LocationSelector = ({ control, errors, watch }) => {
  const latitudeValue = watch('latitude');
  const longitudeValue = watch('longitude');

  return (
    <View>
      <Text className="mb-2 text-sm font-semibold text-slate-700">Location</Text>

      <Controller
        control={control}
        name="location"
        render={({ field: { onChange, value } }) => (
          <Input
            label="Location Name"
            placeholder="Home, Office, College..."
            value={value}
            onChangeText={onChange}
            error={errors.location?.message}
          />
        )}
      />

      <View className="flex-row">
        <View className="mr-2 flex-1">
          <Controller
          control={control}
          name="latitude"
          rules={{
            validate: (value) => {
              if (!value && !longitudeValue) {
                return true;
              }

              if (!value || !longitudeValue) {
                return 'Latitude and longitude must both be provided.';
              }

              const latitude = Number(value);
              if (Number.isNaN(latitude) || latitude < -90 || latitude > 90) {
                return 'Latitude must be between -90 and 90.';
              }

              return true;
              }
            }}
            render={({ field: { onChange, value } }) => (
              <Input
                label="Latitude"
                placeholder="e.g. 17.3850"
                keyboardType="numeric"
                value={String(value ?? '')}
                onChangeText={onChange}
                error={errors.latitude?.message}
              />
            )}
          />
        </View>
        <View className="flex-1">
          <Controller
          control={control}
          name="longitude"
          rules={{
            validate: (value) => {
              if (!value && !latitudeValue) {
                return true;
              }

              if (!value || !latitudeValue) {
                return 'Latitude and longitude must both be provided.';
              }

              const longitude = Number(value);
              if (Number.isNaN(longitude) || longitude < -180 || longitude > 180) {
                return 'Longitude must be between -180 and 180.';
              }

              return true;
              }
            }}
            render={({ field: { onChange, value } }) => (
              <Input
                label="Longitude"
                placeholder="e.g. 78.4867"
                keyboardType="numeric"
                value={String(value ?? '')}
                onChangeText={onChange}
                error={errors.longitude?.message}
              />
            )}
          />
        </View>
      </View>

      <Text className="mt-1 text-xs text-slate-500">
        Coordinates are used to evaluate geofences and contextual triggers.
      </Text>
    </View>
  );
};

export default LocationSelector;
