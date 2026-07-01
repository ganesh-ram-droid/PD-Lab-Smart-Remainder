import React, { useEffect } from 'react';
import { Alert, SafeAreaView, ScrollView, Text, View } from 'react-native';

import Button from '../../components/common/Button';
import NotificationHeader from '../../components/notification/NotificationHeader';
import NotificationPreferenceCard from '../../components/notification/NotificationPreferenceCard';
import useNotifications from '../../hooks/useNotifications';

const NotificationSettingsScreen = ({ navigation }) => {
  const { settings, loadPreferences, updatePreference } = useNotifications();

  useEffect(() => {
    loadPreferences().catch((error) => Alert.alert('Unable to load preferences', error.message));
  }, [loadPreferences]);

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="flex-1 px-4 pt-4">
        <NotificationHeader
          title="Notification Settings"
          subtitle="Configure how notifications behave"
          count={0}
          onSettingsPress={() => navigation.goBack()}
        />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
          <View className="mt-4">
            <NotificationPreferenceCard settings={settings} onChangeSetting={updatePreference} />
          </View>

          <View className="mt-4 rounded-3xl bg-white p-4 shadow-sm" style={{ shadowColor: '#0F172A' }}>
            <Text className="text-base font-bold text-slate-950">Notification Tone</Text>
            <Text className="mt-1 text-sm text-slate-500">Placeholder for tone selection</Text>
            <View className="mt-4 flex-row flex-wrap">
              {['Default', 'Chime', 'Pulse', 'Soft'].map((tone) => {
                const active = settings.notificationTone === tone;
                return (
                  <Button
                    key={tone}
                    title={tone}
                    variant={active ? 'primary' : 'secondary'}
                    className="mr-2 mb-2"
                    onPress={() => updatePreference('notificationTone', tone)}
                  />
                );
              })}
            </View>
          </View>

          <View className="mt-4 rounded-3xl bg-white p-4 shadow-sm" style={{ shadowColor: '#0F172A' }}>
            <Text className="text-base font-bold text-slate-950">Reminder Preview</Text>
            <Text className="mt-1 text-sm text-slate-500">
              Preview notifications before they are displayed to the user.
            </Text>
            <View className="mt-4 rounded-2xl bg-slate-50 px-4 py-4">
              <Text className="text-sm font-semibold text-slate-950">Medicine reminder</Text>
              <Text className="mt-1 text-sm text-slate-500">Take your evening medicine at 8:00 PM.</Text>
            </View>
          </View>

          <View className="mt-4">
            <Button title="Done" onPress={() => navigation.goBack()} />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default NotificationSettingsScreen;
