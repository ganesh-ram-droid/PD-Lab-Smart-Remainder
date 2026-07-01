import React from 'react';
import { SafeAreaView, ScrollView, Text, View } from 'react-native';

import ProfileHeader from '../../components/profile/ProfileHeader';

const PrivacyScreen = ({ navigation }) => {
  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        <ProfileHeader title="Privacy Policy" subtitle="Data handling and permissions" onBackPress={() => navigation.goBack()} />
        <View className="mt-4 rounded-3xl bg-white p-4 shadow-sm" style={{ shadowColor: '#0F172A' }}>
          <Text className="text-base font-bold text-slate-950">Privacy</Text>
          <Text className="mt-3 text-sm leading-6 text-slate-600">
            The app stores reminder, profile, notification, location, and context data to deliver context-aware reminders.
            Sensitive data is only sent to the backend when needed to power authenticated features.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PrivacyScreen;
