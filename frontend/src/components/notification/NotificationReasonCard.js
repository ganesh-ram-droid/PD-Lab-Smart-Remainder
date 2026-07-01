import React from 'react';
import { Text, View } from 'react-native';

const NotificationReasonCard = ({ reasons = [] }) => {
  return (
    <View className="rounded-3xl bg-white p-4 shadow-sm" style={{ shadowColor: '#0F172A' }}>
      <Text className="text-base font-bold text-slate-950">Decision Reasons</Text>
      <Text className="mt-1 text-sm text-slate-500">Why the system took this action</Text>
      <View className="mt-4">
        {reasons.length ? (
          reasons.map((reason, index) => (
            <View key={`${reason}-${index}`} className="mb-2 rounded-2xl bg-slate-50 px-3 py-3">
              <Text className="text-sm text-slate-700">{reason}</Text>
            </View>
          ))
        ) : (
          <View className="rounded-2xl bg-slate-50 px-3 py-3">
            <Text className="text-sm text-slate-500">No reasons available.</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default NotificationReasonCard;
