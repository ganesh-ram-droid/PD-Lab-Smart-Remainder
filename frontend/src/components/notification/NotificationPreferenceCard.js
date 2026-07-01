import React from 'react';
import { Pressable, Switch, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const Row = ({ label, description, value, onValueChange }) => (
  <View className="mb-4 flex-row items-center justify-between rounded-2xl bg-slate-50 px-4 py-4">
    <View className="flex-1 pr-3">
      <Text className="text-sm font-semibold text-slate-950">{label}</Text>
      {description ? <Text className="mt-1 text-xs text-slate-500">{description}</Text> : null}
    </View>
    <Switch value={Boolean(value)} onValueChange={onValueChange} />
  </View>
);

const NotificationPreferenceCard = ({ settings, onChangeSetting }) => {
  return (
    <View className="rounded-3xl bg-white p-4 shadow-sm" style={{ shadowColor: '#0F172A' }}>
      <View className="flex-row items-center justify-between">
        <View>
          <Text className="text-base font-bold text-slate-950">Notification Preferences</Text>
          <Text className="mt-1 text-sm text-slate-500">Control how reminders reach you</Text>
        </View>
        <View className="h-10 w-10 items-center justify-center rounded-2xl bg-blue-50">
          <Icon name="notifications-outline" size={18} color="#2563EB" />
        </View>
      </View>

      <View className="mt-4">
        <Row
          label="Enable Push Notifications"
          description="Allow push notifications on this device."
          value={settings.enablePushNotifications}
          onValueChange={(value) => onChangeSetting('enablePushNotifications', value)}
        />
        <Row
          label="Enable Smart Notifications"
          description="Let the system decide when to notify."
          value={settings.enableSmartNotifications}
          onValueChange={(value) => onChangeSetting('enableSmartNotifications', value)}
        />
        <Row
          label="Enable Context Awareness"
          description="Use location, time, and history for decisions."
          value={settings.enableContextAwareness}
          onValueChange={(value) => onChangeSetting('enableContextAwareness', value)}
        />
        <Row
          label="Enable Sound"
          description="Play an alert sound."
          value={settings.enableSound}
          onValueChange={(value) => onChangeSetting('enableSound', value)}
        />
        <Row
          label="Enable Vibration"
          description="Vibrate the device on delivery."
          value={settings.enableVibration}
          onValueChange={(value) => onChangeSetting('enableVibration', value)}
        />
        <Row
          label="Enable High Priority Alerts"
          description="Always deliver urgent reminders."
          value={settings.enableHighPriorityAlerts}
          onValueChange={(value) => onChangeSetting('enableHighPriorityAlerts', value)}
        />
      </View>

      <View className="rounded-2xl bg-slate-50 px-4 py-4">
        <Text className="text-sm font-semibold text-slate-950">Reminder Preview</Text>
        <Text className="mt-1 text-xs text-slate-500">
          Preview shown before a push notification is sent.
        </Text>
        <Pressable className="mt-3 rounded-full bg-blue-600 px-4 py-2 self-start">
          <Text className="text-xs font-semibold text-white">Notification Tone: {settings.notificationTone}</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default NotificationPreferenceCard;
