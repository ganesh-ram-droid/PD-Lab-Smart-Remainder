import React, { useCallback, useEffect, useState } from 'react';
import { Alert, SafeAreaView, ScrollView, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import DeleteReminderModal from '../../components/reminder/DeleteReminderModal';
import ReminderHeader from '../../components/reminder/ReminderHeader';
import ReminderStatusBadge from '../../components/reminder/ReminderStatusBadge';
import colors from '../../constants/colors';
import routes from '../../constants/routes';
import useReminder from '../../hooks/useReminder';

const DetailRow = ({ label, value }) => (
  <View className="mb-3 rounded-2xl bg-slate-50 px-4 py-3">
    <Text className="text-xs uppercase tracking-wide text-slate-500">{label}</Text>
    <Text className="mt-1 text-sm font-semibold text-slate-950">{value || '--'}</Text>
  </View>
);

const ReminderDetailsScreen = ({ navigation, route }) => {
  const reminderId = route.params?.reminderId;
  const {
    currentReminder,
    loading,
    saving,
    error,
    loadReminderById,
    deleteReminder,
    completeReminder,
    snoozeReminder,
    clearCurrentReminder,
    clearError
  } = useReminder();

  const [deleteVisible, setDeleteVisible] = useState(false);

  const loadData = useCallback(async () => {
    if (!reminderId) {
      return;
    }

    try {
      await loadReminderById(reminderId);
    } catch (fetchError) {
      Alert.alert('Unable to load reminder', fetchError.message);
    }
  }, [loadReminderById, reminderId]);

  useEffect(() => {
    clearCurrentReminder();
  }, [clearCurrentReminder]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const handleDelete = async () => {
    try {
      await deleteReminder(reminderId);
      setDeleteVisible(false);
      Alert.alert('Success', 'Reminder deleted successfully.', [
        { text: 'OK', onPress: () => navigation.replace(routes.REMINDERS) }
      ]);
    } catch (deleteError) {
      Alert.alert('Delete failed', deleteError.message);
    }
  };

  const handleComplete = async () => {
    try {
      await completeReminder(reminderId);
      Alert.alert('Success', 'Reminder marked as completed.');
      loadData();
    } catch (completeError) {
      Alert.alert('Unable to complete reminder', completeError.message);
    }
  };

  const handleSnooze = async () => {
    try {
      await snoozeReminder(reminderId, { snoozeMinutes: 10 });
      Alert.alert('Success', 'Reminder snoozed for 10 minutes.');
      loadData();
    } catch (snoozeError) {
      Alert.alert('Unable to snooze reminder', snoozeError.message);
    }
  };

  if (loading && !currentReminder) {
    return <Loader message="Loading reminder..." />;
  }

  if (!currentReminder) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50">
        <View className="flex-1 px-4 pt-4">
          <ReminderHeader
            title="Reminder Details"
            subtitle="Review and manage your reminder"
            onBackPress={() => navigation.goBack()}
          />
          <View className="mt-4 rounded-3xl bg-white px-4 py-6 shadow-sm">
            <Text className="text-sm text-slate-500">
              {error || 'Reminder could not be found.'}
            </Text>
            <View className="mt-4 w-28">
              <Button title="Retry" onPress={loadData} />
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const reminder = currentReminder;
  const locationLabel = reminder.location || 'No location set';
  const locationEnabled = Boolean(
    reminder.location || (reminder.latitude !== '' && reminder.longitude !== '' && reminder.latitude != null)
  );
  const coordinateLabel =
    reminder.latitude !== '' && reminder.longitude !== ''
      ? `${reminder.latitude}, ${reminder.longitude}`
      : 'No coordinates set';

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="flex-1 px-4 pt-4">
        <ReminderHeader
          title="Reminder Details"
          subtitle="Review and manage your reminder"
          onBackPress={() => navigation.goBack()}
          onRightPress={() => navigation.navigate(routes.EDIT_REMINDER, { reminderId })}
          rightIcon="create-outline"
          rightLabel="Edit"
        />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 36 }}>
          <View className="mt-4 rounded-3xl bg-white p-4 shadow-sm" style={{ shadowColor: '#0F172A' }}>
            <View className="flex-row items-start justify-between">
              <View className="flex-1 pr-3">
                <Text className="text-xl font-bold text-slate-950">{reminder.title}</Text>
                <Text className="mt-1 text-sm text-slate-500">{reminder.description || 'No description added.'}</Text>
              </View>
              <View className="h-12 w-12 items-center justify-center rounded-2xl bg-blue-50">
                <Icon name="document-text-outline" size={20} color={colors.primary} />
              </View>
            </View>

            <View className="mt-4 flex-row flex-wrap items-center gap-2">
              <View className="rounded-full bg-slate-100 px-3 py-2">
                <Text className="text-xs font-semibold text-slate-700">{reminder.category}</Text>
              </View>
              <View className="rounded-full bg-blue-50 px-3 py-2">
                <Text className="text-xs font-semibold text-blue-700">{reminder.priority}</Text>
              </View>
              <ReminderStatusBadge status={reminder.status} />
            </View>
          </View>

          <View className="mt-4">
            <DetailRow label="Reminder Date" value={reminder.reminderDate} />
            <DetailRow label="Reminder Time" value={reminder.reminderTime} />
            <DetailRow label="Repeat Option" value={reminder.repeat} />
            <DetailRow label="Reminder Radius" value={reminder.radius ? `${reminder.radius} meters` : '--'} />
            <DetailRow label="Location" value={locationLabel} />
            <DetailRow label="Latitude" value={String(reminder.latitude ?? '--')} />
            <DetailRow label="Longitude" value={String(reminder.longitude ?? '--')} />
            <DetailRow label="Created Date" value={reminder.createdAt} />
            <DetailRow label="Updated Date" value={reminder.updatedAt} />
            <DetailRow label="Notification Status" value={reminder.notificationStatus || reminder.status} />
          </View>

          <View className="mt-2 rounded-3xl bg-white p-4 shadow-sm" style={{ shadowColor: '#0F172A' }}>
            <Text className="mb-3 text-base font-bold text-slate-950">Settings</Text>
            <DetailRow label="Context Enabled" value={reminder.contextEnabled ? 'Enabled' : 'Disabled'} />
            <DetailRow label="Notification Enabled" value={reminder.notificationEnabled ? 'Enabled' : 'Disabled'} />
            <DetailRow label="Location Enabled" value={locationEnabled ? 'Enabled' : 'Disabled'} />
            <DetailRow label="Coordinates" value={coordinateLabel} />
          </View>

          <View className="mt-4 flex-row flex-wrap">
            <View className="mb-3 w-[48%] mr-3">
              <Button
                title="Edit"
                onPress={() => navigation.navigate(routes.EDIT_REMINDER, { reminderId })}
              />
            </View>
            <View className="mb-3 w-[48%]">
              <Button title="Delete" variant="danger" onPress={() => setDeleteVisible(true)} loading={saving} />
            </View>
            <View className="mb-3 w-[48%] mr-3">
              <Button
                title="Complete"
                onPress={handleComplete}
                loading={saving}
                variant={reminder.status === 'Completed' ? 'secondary' : 'primary'}
                disabled={reminder.status === 'Completed'}
              />
            </View>
            <View className="mb-3 w-[48%]">
              <Button
                title="Snooze"
                onPress={handleSnooze}
                loading={saving}
                variant="secondary"
                disabled={reminder.status === 'Completed'}
              />
            </View>
          </View>
        </ScrollView>
      </View>

      <DeleteReminderModal
        visible={deleteVisible}
        title={reminder.title}
        loading={saving}
        onCancel={() => setDeleteVisible(false)}
        onConfirm={handleDelete}
      />
    </SafeAreaView>
  );
};

export default ReminderDetailsScreen;
