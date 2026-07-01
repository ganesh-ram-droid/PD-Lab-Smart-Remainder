import React, { useEffect } from 'react';
import { Alert, KeyboardAvoidingView, Platform, SafeAreaView, View } from 'react-native';
import { useForm } from 'react-hook-form';

import Loader from '../../components/common/Loader';
import ReminderForm from '../../components/reminder/ReminderForm';
import ReminderHeader from '../../components/reminder/ReminderHeader';
import routes from '../../constants/routes';
import useReminder from '../../hooks/useReminder';

const EditReminderScreen = ({ navigation, route }) => {
  const reminderId = route.params?.reminderId;
  const {
    currentReminder,
    loading,
    saving,
    loadReminderById,
    updateReminder,
    clearCurrentReminder
  } = useReminder();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      category: 'Personal',
      customCategory: '',
      priority: 'Medium',
      reminderDate: '',
      reminderTime: '',
      repeat: 'None',
      repeatDays: '',
      location: '',
      latitude: '',
      longitude: '',
      radius: '100',
      customRadius: '',
      notificationEnabled: true,
      contextEnabled: true
    }
  });

  useEffect(() => {
    clearCurrentReminder();
    if (reminderId) {
      loadReminderById(reminderId).catch((error) => Alert.alert('Unable to load reminder', error.message));
    }
  }, [clearCurrentReminder, loadReminderById, reminderId]);

  useEffect(() => {
    if (currentReminder) {
      const currentRadius = Number(currentReminder.radius);
      const presetRadii = ['50', '100', '250', '500', '1000'];

      reset({
        title: currentReminder.title || '',
        description: currentReminder.description || '',
        category:
          ['Medicine', 'Shopping', 'Meeting', 'Work', 'College', 'Exercise', 'Travel', 'Bills', 'Personal'].includes(
            currentReminder.category
          )
            ? currentReminder.category
            : 'Custom',
        customCategory:
          ['Medicine', 'Shopping', 'Meeting', 'Work', 'College', 'Exercise', 'Travel', 'Bills', 'Personal'].includes(
            currentReminder.category
          )
            ? ''
            : currentReminder.category,
        priority: currentReminder.priority || 'Medium',
        reminderDate: currentReminder.reminderDate || '',
        reminderTime: currentReminder.reminderTime || '',
        repeat: currentReminder.repeat || 'None',
        repeatDays: Array.isArray(currentReminder.repeatDays) ? currentReminder.repeatDays.join(', ') : '',
        location: currentReminder.location || '',
        latitude: currentReminder.latitude ?? '',
        longitude: currentReminder.longitude ?? '',
        radius: presetRadii.includes(String(currentRadius)) ? String(currentRadius) : 'Custom',
        customRadius: presetRadii.includes(String(currentRadius)) ? '' : String(currentRadius || ''),
        notificationEnabled: Boolean(currentReminder.notificationEnabled),
        contextEnabled: Boolean(currentReminder.contextEnabled)
      });
    }
  }, [currentReminder, reset]);

  const onSubmit = handleSubmit(async (data) => {
    const payload = {
      title: data.title.trim(),
      description: data.description?.trim() || '',
      notes: data.description?.trim() || '',
      category: data.category === 'Custom' ? data.customCategory.trim() : data.category,
      priority: data.priority,
      reminderDate: data.reminderDate,
      reminderTime: data.reminderTime,
      repeat: data.repeat,
      repeatDays:
        data.repeat === 'Custom' && data.repeatDays
          ? data.repeatDays.split(',').map((day) => day.trim()).filter(Boolean)
          : [],
      location: data.location?.trim() || '',
      latitude: data.latitude ? Number(data.latitude) : null,
      longitude: data.longitude ? Number(data.longitude) : null,
      radius: data.radius === 'Custom' ? Number(data.customRadius) : Number(data.radius),
      notificationEnabled: Boolean(data.notificationEnabled),
      contextEnabled: Boolean(data.contextEnabled)
    };

    try {
      const reminder = await updateReminder(reminderId, payload);
      Alert.alert('Success', 'Reminder updated successfully.');
      navigation.replace(routes.REMINDER_DETAILS, { reminderId: reminder.reminderId });
    } catch (error) {
      Alert.alert('Unable to update reminder', error.message);
    }
  });

  if (loading && !currentReminder) {
    return <Loader message="Loading reminder..." />;
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1">
        <View className="flex-1 px-4 pt-4">
          <ReminderHeader
            title="Edit Reminder"
            subtitle="Update reminder details"
            onBackPress={() => navigation.goBack()}
            onRightPress={() => navigation.navigate(routes.REMINDERS)}
            rightIcon="list-outline"
            rightLabel="List"
          />

          <View className="mt-4 flex-1">
            <ReminderForm
              control={control}
              errors={errors}
              watch={watch}
              setValue={setValue}
              onSubmit={onSubmit}
              loading={saving}
              submitLabel="Update Reminder"
              onCancel={() => navigation.goBack()}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default EditReminderScreen;
