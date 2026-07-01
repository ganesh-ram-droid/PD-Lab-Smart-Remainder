import React, { useCallback } from 'react';
import { Alert, RefreshControl, SafeAreaView, ScrollView, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import ContextRefreshButton from '../../components/context/ContextRefreshButton';
import ContextScoreCard from '../../components/context/ContextScoreCard';
import ContextBreakdownCard from '../../components/context/ContextBreakdownCard';
import CurrentActivityCard from '../../components/context/CurrentActivityCard';
import CurrentLocationCard from '../../components/context/CurrentLocationCard';
import DecisionCard from '../../components/context/DecisionCard';
import ReasonCard from '../../components/context/ReasonCard';
import NearbyReminderCard from '../../components/context/NearbyReminderCard';
import BatteryCard from '../../components/context/BatteryCard';
import NetworkCard from '../../components/context/NetworkCard';
import GeofenceStatusCard from '../../components/context/GeofenceStatusCard';
import ContextTimeline from '../../components/context/ContextTimeline';
import LearningStatusCard from '../../components/context/LearningStatusCard';
import EmptyContextState from '../../components/context/EmptyContextState';
import colors from '../../constants/colors';
import useContextEvaluation from '../../hooks/useContextEvaluation';

const formatTime = () =>
  new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date());

const formatDate = () =>
  new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  }).format(new Date());

const ContextSkeleton = () => (
  <View className="px-4 pt-4">
    <View className="rounded-3xl bg-white p-4">
      <View className="h-5 w-24 rounded-full bg-slate-200" />
      <View className="mt-3 h-4 w-40 rounded-full bg-slate-200" />
    </View>
    <View className="mt-4 rounded-3xl bg-white p-4">
      <View className="h-8 w-32 rounded-full bg-slate-200" />
      <View className="mt-4 h-28 rounded-full bg-slate-200" />
    </View>
    <View className="mt-4 flex-row flex-wrap justify-between">
      <View className="mb-3 h-28 w-[48%] rounded-3xl bg-white" />
      <View className="mb-3 h-28 w-[48%] rounded-3xl bg-white" />
      <View className="mb-3 h-28 w-[48%] rounded-3xl bg-white" />
      <View className="mb-3 h-28 w-[48%] rounded-3xl bg-white" />
    </View>
  </View>
);

const ContextDashboardScreen = ({ route }) => {
  const reminderId = route.params?.reminderId || null;
  const {
    contextScore,
    decision,
    currentContext,
    history,
    behaviorProfile,
    currentReminder,
    loading,
    refreshing,
    error,
    loadDashboardData,
    refreshContext,
    clearError
  } = useContextEvaluation();

  const loadData = useCallback(async () => {
    try {
      await loadDashboardData(reminderId);
    } catch (loadError) {
      Alert.alert('Unable to load context', loadError.message);
    }
  }, [loadDashboardData, reminderId]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const handleRefresh = async () => {
    try {
      await refreshContext(reminderId);
    } catch (refreshError) {
      Alert.alert('Unable to refresh context', refreshError.message);
    }
  };

  const context = currentContext || {};
  const reasons = context.reason || [];
  const nearbyReminder = currentReminder
    ? {
        title: currentReminder.title,
        distance: context.distance,
        priority: currentReminder.priority,
        estimatedArrival: context.estimatedArrival
      }
    : null;

  if (loading && !currentContext && !history.length) {
    return <ContextSkeleton />;
  }

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
          <View className="rounded-3xl border border-white/60 bg-white/80 px-4 py-4 shadow-sm" style={{ shadowColor: '#0F172A' }}>
            <View className="flex-row items-center justify-between">
              <View className="flex-1 pr-3">
                <Text className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {formatDate()}
                </Text>
                <Text className="mt-1 text-2xl font-bold text-slate-950">{formatTime()}</Text>
                <Text className="mt-1 text-sm text-slate-500">Context awareness dashboard</Text>
              </View>
              <ContextRefreshButton onPress={handleRefresh} loading={refreshing} />
            </View>
          </View>

          {error ? (
            <View className="mt-4 rounded-3xl bg-red-50 px-4 py-4">
              <Text className="text-sm font-medium text-red-700">{error}</Text>
            </View>
          ) : null}

          {!currentContext && !loading ? (
            <View className="mt-4">
              <EmptyContextState onRetry={loadData} />
            </View>
          ) : (
            <>
              <View className="mt-4">
                <ContextScoreCard score={contextScore} decision={decision} />
              </View>

              <View className="mt-4">
                <ContextBreakdownCard breakdown={context.scoreBreakdown || {}} />
              </View>

              <View className="mt-4 flex-row flex-wrap justify-between">
                <View className="mb-3 w-[48%]">
                  <CurrentActivityCard activity={context.currentActivity || 'Unknown'} />
                </View>
                <View className="mb-3 w-[48%]">
                  <DecisionCard decision={decision} score={contextScore} />
                </View>
                <View className="mb-3 w-[48%]">
                  <BatteryCard
                    batteryLevel={context.batteryLevel}
                    charging={context.batteryStatus?.toLowerCase?.().includes('charging')}
                    powerSaving={context.batteryStatus?.toLowerCase?.().includes('saving')}
                  />
                </View>
                <View className="mb-3 w-[48%]">
                  <NetworkCard networkStatus={context.networkStatus} />
                </View>
              </View>

              <View className="mt-4">
                <CurrentLocationCard location={context} />
              </View>

              <View className="mt-4">
                <GeofenceStatusCard
                  insideGeofence={context.isInsideGeofence}
                  distanceRemaining={
                    context.distance != null && context.reminderRadius != null
                      ? Math.max(0, Number(context.reminderRadius) - Number(context.distance))
                      : null
                  }
                  reminderRadius={context.reminderRadius}
                />
              </View>

              <View className="mt-4">
                <ReasonCard reasons={reasons} />
              </View>

              <View className="mt-4">
                <LearningStatusCard profile={behaviorProfile || {}} />
              </View>

              <View className="mt-4">
                <NearbyReminderCard reminder={nearbyReminder} />
              </View>

              <View className="mt-4">
                <ContextTimeline history={history} />
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ContextDashboardScreen;
