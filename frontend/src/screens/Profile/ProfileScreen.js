import React, { useCallback, useEffect } from 'react';
import { Alert, SafeAreaView, ScrollView, Text, View, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import ProfileHeader from '../../components/profile/ProfileHeader';
import ProfileCard from '../../components/profile/ProfileCard';
import ProfileStatistics from '../../components/profile/ProfileStatistics';
import PreferenceCard from '../../components/profile/PreferenceCard';
import { useAuthStore } from '../../store/authStore';
import { useProfileStore } from '../../store/profileStore';
import routes from '../../constants/routes';
import useAnalytics from '../../hooks/useAnalytics';
import ErrorScreen from '../../components/common/ErrorScreen';

const ProfileScreen = ({ navigation }) => {
  const user = useAuthStore((state) => state.user);
  const { profile, error, loadProfile, clearError } = useProfileStore((state) => state);
  const { dashboard, loadAnalytics } = useAnalytics();

  const loadData = useCallback(async () => {
    try {
      await loadProfile();
    } catch (loadError) {
      Alert.alert('Unable to load profile', loadError.message);
    }
  }, [loadProfile]);

  useEffect(() => {
    loadData();
    loadAnalytics().catch(() => null);
  }, [loadData]);

  const summary = profile || {
    name: user?.displayName,
    email: user?.email,
    photoURL: user?.photoURL,
    theme: 'light'
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 110 }}>
        <ProfileHeader
          title="Profile"
          subtitle="Account overview and analytics"
          onActionPress={() => navigation.navigate(routes.PROFILE_EDIT)}
        />

        {error && !profile ? (
          <View className="mt-4">
            <ErrorScreen
              title="Profile unavailable"
              message={error}
              onRetry={() => {
                clearError();
                loadData();
              }}
            />
          </View>
        ) : error ? (
          <View className="mt-4 rounded-3xl bg-red-50 px-4 py-4">
            <Text className="text-sm font-medium text-red-700">{error}</Text>
          </View>
        ) : null}

        <View className="mt-4">
          <ProfileCard profile={summary} />
        </View>

        <View className="mt-4">
          <ProfileStatistics
            stats={{
              completionRate: dashboard?.completionRate || dashboard?.completionPercentage || 0,
              totalReminders: dashboard?.todaysReminders || dashboard?.weeklyReminders || 0,
              pendingReminders: dashboard?.pendingReminders || 0,
              missedReminders: dashboard?.missedReminders || 0
            }}
          />
        </View>

        <View className="mt-4 rounded-3xl bg-white p-4 shadow-sm" style={{ shadowColor: '#0F172A' }}>
          <Text className="text-base font-bold text-slate-950">Quick Actions</Text>
          <View className="mt-4">
            <PreferenceCard
              title="Edit Profile"
              subtitle="Update your account information"
              onPress={() => navigation.navigate(routes.PROFILE_EDIT)}
            />
            <View className="h-3" />
            <PreferenceCard
              title="Settings"
              subtitle="Manage preferences and privacy"
              onPress={() => navigation.navigate(routes.SETTINGS)}
            />
            <View className="h-3" />
            <PreferenceCard
              title="Analytics"
              subtitle="View reminder and context insights"
              onPress={() => navigation.navigate(routes.ANALYTICS_DASHBOARD)}
            />
          </View>
        </View>

        <View className="mt-4 flex-row flex-wrap justify-between">
          <Pressable
            onPress={loadData}
            className="mb-3 w-[48%] rounded-2xl bg-blue-600 px-4 py-4"
          >
            <Text className="text-center text-sm font-semibold text-white">Refresh Profile</Text>
          </Pressable>
          <Pressable
            onPress={() => navigation.navigate(routes.PRIVACY)}
            className="mb-3 w-[48%] rounded-2xl bg-white px-4 py-4"
          >
            <Text className="text-center text-sm font-semibold text-slate-700">Privacy</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;
