import React from 'react';
import { Switch, Text, View } from 'react-native';

const Row = ({ label, description, value, onValueChange }) => (
  <View className="mb-4 flex-row items-center justify-between rounded-2xl bg-slate-50 px-4 py-4">
    <View className="flex-1 pr-3">
      <Text className="text-sm font-semibold text-slate-950">{label}</Text>
      {description ? <Text className="mt-1 text-xs text-slate-500">{description}</Text> : null}
    </View>
    <Switch value={Boolean(value)} onValueChange={onValueChange} />
  </View>
);

const NotificationSettings = ({ settings, onChangeSetting }) => {
  return (
    <View>
      <Row
        label="Enable Notifications"
        description="Global reminder notifications"
        value={settings.notificationEnabled}
        onValueChange={(value) => onChangeSetting('notificationEnabled', value)}
      />
      <Row
        label="Context Awareness"
        description="Use location and activity"
        value={settings.contextAwarenessEnabled}
        onValueChange={(value) => onChangeSetting('contextAwarenessEnabled', value)}
      />
      <Row
        label="Smart Reminders"
        description="Adaptive reminder decisions"
        value={settings.smartReminderEnabled}
        onValueChange={(value) => onChangeSetting('smartReminderEnabled', value)}
      />
      <Row
        label="Location Services"
        description="Use device location"
        value={settings.locationServicesEnabled}
        onValueChange={(value) => onChangeSetting('locationServicesEnabled', value)}
      />
    </View>
  );
};

export default NotificationSettings;
