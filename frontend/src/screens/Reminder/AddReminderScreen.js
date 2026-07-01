import React from 'react';
import { Alert, KeyboardAvoidingView, Platform, SafeAreaView, View } from 'react-native';
import { useForm } from 'react-hook-form';

import ReminderForm from '../../components/reminder/ReminderForm';
import ReminderHeader from '../../components/reminder/ReminderHeader';
import colors from '../../constants/colors';
import routes from '../../constants/routes';
import useReminder from '../../hooks/useReminder';

const defaultValues = {
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
};

const AddReminderScreen = ({ navigation }) => {
  const { createReminder, saving } = useReminder();
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm({ defaultValues });

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
      contextEnabled: Boolean(data.contextEnabled),
      isActive: true
    };

    try {
      const reminder = await createReminder(payload);
      Alert.alert('Success', 'Reminder created successfully.');
      navigation.replace(routes.REMINDER_DETAILS, { reminderId: reminder.reminderId });
    } catch (error) {
      Alert.alert('Unable to create reminder', error.message);
    }
  });

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1">
        <View className="flex-1 px-4 pt-4">
          <ReminderHeader
            title="Add Reminder"
            subtitle="Create a new reminder"
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
              submitLabel="Create Reminder"
              onCancel={() => navigation.goBack()}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AddReminderScreen;
