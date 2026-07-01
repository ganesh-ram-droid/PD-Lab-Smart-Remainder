import React from 'react';
import { Text, View } from 'react-native';

const styles = {
  'Will Notify': 'bg-emerald-50 text-emerald-700',
  Trigger: 'bg-emerald-50 text-emerald-700',
  Suppressed: 'bg-red-50 text-red-700',
  Delayed: 'bg-orange-50 text-orange-700',
  Rescheduled: 'bg-blue-50 text-blue-700',
  Cancelled: 'bg-slate-100 text-slate-600'
};

const DecisionBadge = ({ decision }) => {
  const style = styles[decision] || styles.Suppressed;

  return (
    <View className={`rounded-full px-3 py-1.5 ${style}`}>
      <Text className="text-xs font-semibold">{decision || 'Suppressed'}</Text>
    </View>
  );
};

export default DecisionBadge;
