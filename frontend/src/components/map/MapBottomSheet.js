import React from 'react';
import { Pressable, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import Button from '../common/Button';

const MapBottomSheet = ({
  title,
  subtitle,
  primaryActionLabel,
  onPrimaryAction,
  secondaryActionLabel,
  onSecondaryAction,
  tertiaryActionLabel,
  onTertiaryAction
}) => {
  return (
    <View className="rounded-t-3xl bg-white px-4 py-4 shadow-lg" style={{ shadowColor: '#0F172A' }}>
      <View className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-slate-200" />
      <Text className="text-base font-bold text-slate-950">{title}</Text>
      {subtitle ? <Text className="mt-1 text-sm text-slate-500">{subtitle}</Text> : null}

      <View className="mt-4 flex-row flex-wrap">
        {primaryActionLabel ? (
          <View className="mb-2 mr-2 flex-1">
            <Button title={primaryActionLabel} onPress={onPrimaryAction} />
          </View>
        ) : null}
        {secondaryActionLabel ? (
          <View className="mb-2 mr-2 flex-1">
            <Button title={secondaryActionLabel} variant="secondary" onPress={onSecondaryAction} />
          </View>
        ) : null}
      </View>
      {tertiaryActionLabel ? (
        <Pressable onPress={onTertiaryAction} className="mt-1 flex-row items-center">
          <Icon name="open-outline" size={16} color="#2563EB" />
          <Text className="ml-2 text-sm font-semibold text-blue-700">{tertiaryActionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
};

export default MapBottomSheet;
