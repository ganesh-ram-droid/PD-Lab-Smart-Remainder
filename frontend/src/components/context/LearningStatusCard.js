import React from 'react';
import { Text, View } from 'react-native';

const Row = ({ label, value }) => (
  <View className="mb-3 rounded-2xl bg-slate-50 px-3 py-3">
    <Text className="text-xs uppercase tracking-wide text-slate-500">{label}</Text>
    <Text className="mt-1 text-sm font-semibold text-slate-950">{value || '--'}</Text>
  </View>
);

const LearningStatusCard = ({ profile = {} }) => {
  return (
    <View className="rounded-3xl bg-white p-4 shadow-sm" style={{ shadowColor: '#0F172A' }}>
      <Text className="text-base font-bold text-slate-950">Learning Status</Text>
      <Text className="mt-1 text-sm text-slate-500">Adaptive behavior profile</Text>
      <View className="mt-4">
        <Row label="Adaptive Score" value={profile.adaptiveWeight != null ? `${profile.adaptiveWeight.toFixed(0)}%` : '--'} />
        <Row label="Completion Rate" value={profile.completionRate != null ? `${profile.completionRate.toFixed(0)}%` : '--'} />
        <Row label="Ignore Rate" value={profile.ignoreRate != null ? `${profile.ignoreRate.toFixed(0)}%` : '--'} />
        <Row label="Preferred Reminder Time" value={profile.preferredReminderTime} />
        <Row label="Preferred Activity" value={profile.preferredActivity} />
      </View>
    </View>
  );
};

export default LearningStatusCard;
