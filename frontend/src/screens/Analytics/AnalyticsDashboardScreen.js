import React, { useCallback, useState } from 'react';
import { Alert, RefreshControl, SafeAreaView, ScrollView, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import AnalyticsHeader from '../../components/analytics/AnalyticsHeader';
import AnalyticsFilterModal from '../../components/analytics/AnalyticsFilterModal';
import AnalyticsSkeleton from '../../components/analytics/AnalyticsSkeleton';
import CompletionChart from '../../components/analytics/CompletionChart';
import ReminderStatisticsCard from '../../components/analytics/ReminderStatisticsCard';
import ContextScoreChart from '../../components/analytics/ContextScoreChart';
import NotificationAnalyticsCard from '../../components/analytics/NotificationAnalyticsCard';
import BehaviorAnalyticsCard from '../../components/analytics/BehaviorAnalyticsCard';
import LocationAnalyticsCard from '../../components/analytics/LocationAnalyticsCard';
import WeeklyChart from '../../components/analytics/WeeklyChart';
import MonthlyChart from '../../components/analytics/MonthlyChart';
import EmptyAnalyticsState from '../../components/analytics/EmptyAnalyticsState';
import colors from '../../constants/colors';
import useAnalytics from '../../hooks/useAnalytics';
import ProgressCard from '../../components/analytics/ProgressCard';
import { showToast } from '../../utils/toast';
import ErrorScreen from '../../components/common/ErrorScreen';

const AnalyticsDashboardScreen = () => {
  const {
    dashboard,
    reminderAnalytics,
    contextAnalytics,
    behaviorAnalytics,
    locationAnalytics,
    charts,
    loading,
    refreshing,
    error,
    filters,
    loadAnalytics,
    refreshAnalytics,
    setFilters,
    resetFilters,
    clearError
  } = useAnalytics();

  const [filterVisible, setFilterVisible] = useState(false);

  const loadData = useCallback(async () => {
    try {
      await loadAnalytics();
    } catch (loadError) {
      Alert.alert('Unable to load analytics', loadError.message);
    }
  }, [loadAnalytics]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const handleRetry = () => {
    clearError();
    loadData();
  };

  const handleRefresh = async () => {
    try {
      await refreshAnalytics();
      showToast({ type: 'success', message: 'Analytics refreshed.' });
    } catch (refreshError) {
      Alert.alert('Unable to refresh analytics', refreshError.message);
    }
  };

  if (loading && !dashboard) {
    return <AnalyticsSkeleton />;
  }

  const weeklyCompletion = charts.weeklyCompletion || [];
  const monthlyCompletion = charts.monthlyCompletion || [];
  const contextTrend = charts.contextScoreTrend || [];
  const notificationTrend = charts.notificationSuccess || [];
  const behaviorTrend = charts.behaviorTrend || [];
  const locationTrend = charts.locationTrend || [];

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 120 }}
        refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          tintColor={colors.primary}
          colors={[colors.primary]}
        />
        }
      >
        <View className="px-4 pt-4">
          <AnalyticsHeader
            title="Analytics Dashboard"
            subtitle="Performance, context, behavior, and location insights"
            onFilterPress={() => setFilterVisible(true)}
            onRefreshPress={handleRefresh}
          />

          {error && !dashboard && !loading ? (
            <View className="mt-4">
              <ErrorScreen title="Analytics unavailable" message={error} onRetry={handleRetry} />
            </View>
          ) : !dashboard && !loading ? (
            <View className="mt-4">
              <EmptyAnalyticsState onRetry={handleRetry} />
            </View>
          ) : (
            <>
              <View className="mt-4">
                <ReminderStatisticsCard dashboard={dashboard || {}} />
              </View>

              <View className="mt-4 flex-row flex-wrap justify-between">
                <View className="mb-3 w-[48%]">
                  <ProgressCard label="Average Context Score" value={dashboard?.averageContextScore || 0} accent="green" />
                </View>
                <View className="mb-3 w-[48%]">
                  <ProgressCard label="Average Response Time" value={dashboard?.averageResponseTime || 0} accent="orange" suffix="s" />
                </View>
                <View className="mb-3 w-[48%]">
                  <ProgressCard label="Notification Success Rate" value={dashboard?.notificationSuccessRate || 0} accent="blue" />
                </View>
                <View className="mb-3 w-[48%]">
                  <CompletionChart value={dashboard?.completionRate || dashboard?.completionPercentage || 0} />
                </View>
              </View>

              <View className="mt-4">
                <WeeklyChart data={weeklyCompletion} />
              </View>

              <View className="mt-4">
                <MonthlyChart data={monthlyCompletion} />
              </View>

              <View className="mt-4">
                <ContextScoreChart data={contextTrend} />
              </View>

              <View className="mt-4">
                <NotificationAnalyticsCard data={reminderAnalytics || dashboard || {}} />
              </View>

              <View className="mt-4">
                <BehaviorAnalyticsCard data={behaviorAnalytics || contextAnalytics || {}} />
              </View>

              <View className="mt-4">
                <LocationAnalyticsCard data={locationAnalytics || {}} />
              </View>

              <View className="mt-4 rounded-3xl bg-white p-4 shadow-sm" style={{ shadowColor: '#0F172A' }}>
                <Text className="text-base font-bold text-slate-950">Trend Summary</Text>
                <View className="mt-4">
                  <ProgressCard label="Weekly Completion" value={weeklyCompletion[0]?.value || 0} accent="green" />
                  <View className="h-3" />
                  <ProgressCard label="Monthly Completion" value={monthlyCompletion[0]?.value || 0} accent="blue" />
                  <View className="h-3" />
                  <ProgressCard label="Behavior Trend" value={behaviorTrend[0]?.value || 0} accent="orange" />
                  <View className="h-3" />
                  <ProgressCard label="Location Trend" value={locationTrend[0]?.value || 0} accent="red" />
                  <View className="h-3" />
                  <ProgressCard label="Notification Success" value={notificationTrend[0]?.value || 0} accent="green" />
                </View>
              </View>
            </>
          )}
        </View>
      </ScrollView>

      <AnalyticsFilterModal
        visible={filterVisible}
        filters={filters}
        onChangeFilters={setFilters}
        onApply={() => setFilterVisible(false)}
        onReset={() => {
          resetFilters();
          setFilterVisible(false);
        }}
        onClose={() => setFilterVisible(false)}
      />
    </SafeAreaView>
  );
};

export default AnalyticsDashboardScreen;
