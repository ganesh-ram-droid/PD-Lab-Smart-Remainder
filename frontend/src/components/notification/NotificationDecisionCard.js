import React from 'react';
import { Text, View } from 'react-native';

import NotificationBadge from './NotificationBadge';

const NotificationDecisionCard = ({ decision, score }) => {
  return (
    <View className="rounded-3xl bg-white p-4 shadow-sm" style={{ shadowColor: '#0F172A' }}>
      <Text className="text-base font-bold text-slate-950">Decision</Text>
      <Text className="mt-1 text-sm text-slate-500">How the notification was handled</Text>
      <View className="mt-4 flex-row items-center justify-between rounded-2xl bg-slate-50 px-4 py-4">
        <View className="flex-1 pr-3">
          <Text className="text-xs uppercase tracking-wide text-slate-500">Outcome</Text>
          <Text className="mt-1 text-sm font-semibold text-slate-950">{decision || 'Suppressed'}</Text>
        </View>
        <NotificationBadge label="Score" count={Number(score || 0).toFixed(0)} />
      </View>
    </View>
  );
};

export default NotificationDecisionCard;
