import React from 'react';
import { SafeAreaView, ScrollView, Text, View } from 'react-native';

import ProfileHeader from '../../components/profile/ProfileHeader';

const AboutScreen = ({ navigation }) => {
  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        <ProfileHeader title="About" subtitle="Project information" onBackPress={() => navigation.goBack()} />
        <View className="mt-4 rounded-3xl bg-white p-4 shadow-sm" style={{ shadowColor: '#0F172A' }}>
          <Text className="text-base font-bold text-slate-950">Dynamic Contextual Relevance Evaluation System</Text>
          <Text className="mt-3 text-sm leading-6 text-slate-600">
            This application combines reminders, geofencing, behavioral learning, and context evaluation to decide
            whether a reminder should notify the user at a given moment.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AboutScreen;
