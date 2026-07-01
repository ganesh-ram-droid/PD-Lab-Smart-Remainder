import React, { useEffect } from 'react';
import { RefreshControl, SafeAreaView, ScrollView, Text, View, Pressable } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

import routes from '../../constants/routes';
import colors from '../../constants/colors';
import { useAuthStore } from '../../store/authStore';
import { useDashboardStore } from '../../store/dashboardStore';
import HeaderCard from '../../components/home/HeaderCard';
import GreetingCard from '../../components/home/GreetingCard';
import QuickActionCard from '../../components/home/QuickActionCard';
import StatisticsCard from '../../components/home/StatisticsCard';
import UpcomingReminderCard from '../../components/home/UpcomingReminderCard';
import RecentActivityCard from '../../components/home/RecentActivityCard';
import EmptyDashboard from '../../components/home/EmptyDashboard';

const actionItems = (navigation) => ([
  {
    title: 'Add Reminder',
    icon: 'add-circle-outline',
    tone: 'blue',
    onPress: () => navigation.navigate(routes.ADD_REMINDER)
  },
  {
    title: 'Maps',
    icon: 'location-outline',
    tone: 'green',
    onPress: () => navigation.navigate(routes.MAPS)
  },
  {
    title: 'Analytics',
    icon: 'stats-chart-outline',
    tone: 'orange',
    onPress: () => navigation.navigate(routes.ANALYTICS)
  },
  {
    title: 'Settings',
    icon: 'settings-outline',
    tone: 'slate',
    onPress: () => navigation.navigate(routes.SETTINGS)
  }
]);

const formatDateLabel = () => {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  }).format(new Date());
};

const DashboardSkeleton = () => {
  const skeletonBlock = 'rounded-2xl bg-slate-200';

  return (
    <View className="px-4 pt-4">
      <View className="rounded-3xl bg-slate-100 p-4">
        <View className="h-16 rounded-2xl bg-slate-200" />
      </View>

      <View className="mt-4 rounded-3xl bg-blue-500 p-5">
        <View className="h-5 w-32 rounded-full bg-white/30" />
        <View className="mt-4 h-8 w-44 rounded-full bg-white/30" />
        <View className="mt-3 h-4 w-56 rounded-full bg-white/30" />
      </View>

      <View className="mt-4 flex-row flex-wrap justify-between gap-3">
        <View className={`h-24 w-[48%] ${skeletonBlock}`} />
        <View className={`h-24 w-[48%] ${skeletonBlock}`} />
        <View className={`h-24 w-[48%] ${skeletonBlock}`} />
        <View className={`h-24 w-[48%] ${skeletonBlock}`} />
      </View>

      <View className="mt-4 rounded-3xl bg-white p-4">
        <View className="h-5 w-40 rounded-full bg-slate-200" />
        <View className="mt-4 h-12 rounded-2xl bg-slate-200" />
        <View className="mt-3 h-12 rounded-2xl bg-slate-200" />
        <View className="mt-3 h-12 rounded-2xl bg-slate-200" />
      </View>
    </View>
  );
};

const HomeScreen = ({ navigation }) => {
  const user = useAuthStore((state) => state.user);
  const loadDashboard = useDashboardStore((state) => state.loadDashboard);
  const refreshDashboard = useDashboardStore((state) => state.refreshDashboard);
  const dashboard = useDashboardStore((state) => state.dashboard);
  const statistics = useDashboardStore((state) => state.statistics);
  const upcomingReminders = useDashboardStore((state) => state.upcomingReminders);
  const recentActivity = useDashboardStore((state) => state.recentActivity);
  const contextCard = useDashboardStore((state) => state.contextCard);
  const loading = useDashboardStore((state) => state.loading);
  const refreshing = useDashboardStore((state) => state.refreshing);
  const error = useDashboardStore((state) => state.error);

  useEffect(() => {
    if (!dashboard && !loading) {
      loadDashboard().catch(() => null);
    }
  }, [dashboard, loading, loadDashboard]);

  useFocusEffect(
    React.useCallback(() => {
      if (!dashboard && !loading) {
        loadDashboard().catch(() => null);
      }
    }, [dashboard, loading, loadDashboard])
  );

  const isEmpty = !loading && upcomingReminders.length === 0;

  if (loading && !dashboard) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50">
        <DashboardSkeleton />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="absolute inset-x-0 top-0 h-36 bg-blue-600" />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 110 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => refreshDashboard().catch(() => null)}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        <View className="px-4 pt-4">
          <HeaderCard
            userName={user?.displayName || 'User'}
            dateLabel={formatDateLabel()}
            photoURL={user?.photoURL}
            onNotificationPress={() => navigation.navigate(routes.NOTIFICATIONS)}
          />

          <View className="mt-4">
            <GreetingCard name={user?.displayName || 'User'} />
          </View>

          <View className="mt-4 flex-row flex-wrap justify-between">
            {actionItems(navigation).map((item) => (
              <QuickActionCard key={item.title} {...item} className="mb-3 w-[48%]" />
            ))}
          </View>

          <View className="mt-4">
            <StatisticsCard statistics={statistics} />
          </View>

          <View className="mt-4 rounded-3xl bg-white p-4 shadow-sm" style={{ shadowColor: '#0F172A' }}>
            <Text className="mb-4 text-base font-bold text-slate-950">Context Snapshot</Text>
            <View className="flex-row items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
              <View>
                <Text className="text-xs uppercase tracking-wide text-slate-500">Current Activity</Text>
                <Text className="mt-1 text-sm font-semibold text-slate-950">
                  {contextCard.currentActivity}
                </Text>
              </View>
              <Icon name="walk-outline" size={20} color={colors.primary} />
            </View>
            <View className="mt-3 flex-row items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
              <View>
                <Text className="text-xs uppercase tracking-wide text-slate-500">Current Location</Text>
                <Text className="mt-1 text-sm font-semibold text-slate-950" numberOfLines={1}>
                  {String(contextCard.currentLocation)}
                </Text>
              </View>
              <Icon name="location-outline" size={20} color={colors.success} />
            </View>
            <View className="mt-3 flex-row items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
              <View>
                <Text className="text-xs uppercase tracking-wide text-slate-500">Context Score</Text>
                <Text className="mt-1 text-sm font-semibold text-slate-950">
                  {Number(contextCard.contextScore || 0).toFixed(0)}
                </Text>
              </View>
              <Icon name="pulse-outline" size={20} color={colors.warning} />
            </View>
          </View>

          <View className="mt-4">
            <Text className="mb-3 text-base font-bold text-slate-950">Upcoming Reminders</Text>
            {isEmpty ? (
              <EmptyDashboard />
            ) : (
              upcomingReminders.map((reminder) => (
                <UpcomingReminderCard
                  key={reminder.reminderId}
                  reminder={reminder}
                  onPress={() => navigation.navigate(routes.REMINDER_DETAILS, { reminderId: reminder.reminderId })}
                />
              ))
            )}
          </View>

          <View className="mt-4">
            <RecentActivityCard recentActivity={recentActivity} />
          </View>

          {error ? (
            <View className="mt-4 rounded-3xl bg-red-50 px-4 py-3">
              <Text className="text-sm font-medium text-red-700">{error}</Text>
            </View>
          ) : null}
        </View>
      </ScrollView>

      <Pressable
        onPress={() => navigation.navigate(routes.ADD_REMINDER)}
        className="absolute bottom-6 right-5 h-14 w-14 items-center justify-center rounded-full bg-blue-600 shadow-lg"
        style={{ shadowColor: '#1D4ED8' }}
      >
        <Icon name="add" size={28} color="#FFFFFF" />
      </Pressable>
    </SafeAreaView>
  );
};

export default HomeScreen;
