import React from 'react';
import { Text, View } from 'react-native';

const SettingsCard = ({ title, subtitle, children }) => {
  return (
    <View className="rounded-3xl bg-white p-4 shadow-sm" style={{ shadowColor: '#0F172A' }}>
      <Text className="text-base font-bold text-slate-950">{title}</Text>
      {subtitle ? <Text className="mt-1 text-sm text-slate-500">{subtitle}</Text> : null}
      <View className="mt-4">{children}</View>
    </View>
  );
};

export default SettingsCard;
