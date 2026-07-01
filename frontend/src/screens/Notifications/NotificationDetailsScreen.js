import React, { useCallback, useEffect, useState } from 'react';
import { Alert, SafeAreaView, ScrollView, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import NotificationActionButtons from '../../components/notification/NotificationActionButtons';
import NotificationDecisionCard from '../../components/notification/NotificationDecisionCard';
import NotificationHeader from '../../components/notification/NotificationHeader';
import NotificationReasonCard from '../../components/notification/NotificationReasonCard';
import NotificationTimeline from '../../components/notification/NotificationTimeline';
import NotificationStatusChip from '../../components/notification/NotificationStatusChip';
import NotificationPriorityChip from '../../components/notification/NotificationPriorityChip';
import routes from '../../constants/routes';
import useNotifications from '../../hooks/useNotifications';

const InfoRow = ({ label, value }) => (
  <View className="mb-3 rounded-2xl bg-slate-50 px-4 py-3">
    <Text className="text-xs uppercase tracking-wide text-slate-500">{label}</Text>
    <Text className="mt-1 text-sm font-semibold text-slate-950">{value || '--'}</Text>
  </View>
);

const NotificationDetailsScreen = ({ navigation, route }) => {
  const notificationId = route.params?.notificationId;
  const {
    currentNotification,
    loading,
    error,
    loadNotificationById,
    completeReminder,
    dismissReminder,
    snoozeReminder,
    clearCurrentNotification,
    clearError
  } = useNotifications();

  const [actionLoading, setActionLoading] = useState(false);

  const loadData = useCallback(async () => {
    if (!notificationId) {
      return;
    }

    try {
      await loadNotificationById(notificationId);
    } catch (loadError) {
      Alert.alert('Unable to load notification', loadError.message);
    }
  }, [loadNotificationById, notificationId]);

  useEffect(() => {
    clearCurrentNotification();
  }, [clearCurrentNotification]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  if (loading && !currentNotification) {
    return <Loader message="Loading notification..." />;
  }

  const notification = currentNotification || {};
  const reasons = notification.decisionReason || notification.reason || [];
  const openReminder = () => {
    if (!notification.reminderId) {
      Alert.alert('Reminder unavailable', 'This notification does not contain a reminder reference.');
      return;
    }

    navigation.navigate(routes.REMINDER_DETAILS, { reminderId: notification.reminderId });
  };

  const handleComplete = async () => {
    if (!notification.reminderId) {
      Alert.alert('Action unavailable', 'This notification does not have a reminder reference.');
      return;
    }

    setActionLoading(true);
    try {
      await completeReminder({
        reminderId: notification.reminderId,
        notificationId: notification.notificationId
      });
      Alert.alert('Success', 'Reminder marked as completed.');
      loadData();
    } catch (actionError) {
      Alert.alert('Unable to complete reminder', actionError.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleSnooze = async () => {
    if (!notification.reminderId) {
      Alert.alert('Action unavailable', 'This notification does not have a reminder reference.');
      return;
    }

    setActionLoading(true);
    try {
      await snoozeReminder({
        reminderId: notification.reminderId,
        notificationId: notification.notificationId,
        snoozeMinutes: 10
      });
      Alert.alert('Success', 'Reminder snoozed for 10 minutes.');
      loadData();
    } catch (actionError) {
      Alert.alert('Unable to snooze reminder', actionError.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDismiss = async () => {
    setActionLoading(true);
    try {
      await dismissReminder({
        notificationId: notification.notificationId,
        reminderId: notification.reminderId
      });
      Alert.alert('Success', 'Notification dismissed.');
      loadData();
    } catch (actionError) {
      Alert.alert('Unable to dismiss notification', actionError.message);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="flex-1 px-4 pt-4">
        <NotificationHeader
          title="Notification Details"
          subtitle="Review delivery, decision, and actions"
          count={1}
          onSettingsPress={() => navigation.navigate(routes.NOTIFICATION_SETTINGS)}
        />

        {error ? (
          <View className="mt-4 rounded-3xl bg-red-50 px-4 py-4">
            <Text className="text-sm font-medium text-red-700">{error}</Text>
            <View className="mt-3 w-28">
              <Button
                title="Retry"
                onPress={() => {
                  clearError();
                  loadData();
                }}
              />
            </View>
          </View>
        ) : null}

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
          <View className="mt-4 rounded-3xl bg-white p-4 shadow-sm" style={{ shadowColor: '#0F172A' }}>
            <Text className="text-xl font-bold text-slate-950">{notification.title}</Text>
            <Text className="mt-1 text-sm text-slate-500">{notification.body || notification.description}</Text>

            <View className="mt-4 flex-row flex-wrap items-center gap-2">
              <NotificationPriorityChip priority={notification.priority} />
              <NotificationStatusChip status={notification.status} />
              <View className="rounded-full bg-blue-50 px-2.5 py-1">
                <Text className="text-xs font-semibold text-blue-700">
                  Score {Number(notification.contextScore || 0).toFixed(0)}
                </Text>
              </View>
            </View>
          </View>

          <View className="mt-4">
            <InfoRow label="Reminder Title" value={notification.title} />
            <InfoRow label="Category" value={notification.category} />
            <InfoRow label="Priority" value={notification.priority} />
            <InfoRow label="Notification Status" value={notification.status} />
            <InfoRow label="Decision" value={notification.decision} />
            <InfoRow label="Context Score" value={Number(notification.contextScore || 0).toFixed(0)} />
            <InfoRow label="Sent Time" value={notification.sentTime} />
            <InfoRow label="Delivered Time" value={notification.deliveredTime} />
            <InfoRow label="Opened Time" value={notification.openedTime} />
          </View>

          <View className="mt-4">
            <NotificationDecisionCard decision={notification.decision} score={notification.contextScore} />
          </View>

          <View className="mt-4">
            <NotificationReasonCard reasons={reasons} />
          </View>

          <View className="mt-4">
            <NotificationTimeline notification={notification} />
          </View>

          <View className="mt-4">
            <NotificationActionButtons
              onComplete={handleComplete}
              onSnooze={handleSnooze}
              onDismiss={handleDismiss}
              onOpenReminder={openReminder}
              loading={actionLoading}
            />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default NotificationDetailsScreen;
