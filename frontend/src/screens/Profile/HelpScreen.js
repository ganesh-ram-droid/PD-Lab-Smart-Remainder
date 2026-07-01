import React from 'react';
import { SafeAreaView, ScrollView, Text, View } from 'react-native';

import ProfileHeader from '../../components/profile/ProfileHeader';

const HelpScreen = ({ navigation }) => {
  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        <ProfileHeader title="Help & Support" subtitle="Getting started and troubleshooting" onBackPress={() => navigation.goBack()} />
        <View className="mt-4 rounded-3xl bg-white p-4 shadow-sm" style={{ shadowColor: '#0F172A' }}>
          <Text className="text-base font-bold text-slate-950">Support</Text>
          <Text className="mt-3 text-sm leading-6 text-slate-600">
            Use the dashboard, reminder, map, context, and notification screens to manage the app. If permissions are
            denied, enable them in device settings and return to the app.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HelpScreen;
