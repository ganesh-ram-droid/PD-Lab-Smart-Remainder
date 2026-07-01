import React from 'react';
import { Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import Button from '../common/Button';

const PreferenceCard = ({ title, subtitle, onPress, icon = 'chevron-forward' }) => {
  return (
    <View className="rounded-2xl bg-slate-50 px-4 py-4">
      <View className="flex-row items-center justify-between">
        <View className="flex-1 pr-3">
          <Text className="text-sm font-semibold text-slate-950">{title}</Text>
          {subtitle ? <Text className="mt-1 text-xs text-slate-500">{subtitle}</Text> : null}
        </View>
        <Button title="Open" variant="secondary" onPress={onPress} />
      </View>
    </View>
  );
};

export default PreferenceCard;
