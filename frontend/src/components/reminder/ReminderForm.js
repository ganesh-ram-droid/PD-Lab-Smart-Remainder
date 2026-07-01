import React from 'react';
import { Controller } from 'react-hook-form';
import { ScrollView, Switch, Text, View } from 'react-native';

import Button from '../common/Button';
import Input from '../common/Input';
import ReminderCategorySelector from './ReminderCategorySelector';
import PrioritySelector from './PrioritySelector';
import RepeatSelector from './RepeatSelector';
import LocationSelector from './LocationSelector';
import RadiusSelector from './RadiusSelector';

const ReminderForm = ({
  control,
  errors,
  watch,
  setValue,
  onSubmit,
  loading = false,
  submitLabel = 'Save Reminder',
  onCancel
}) => {
  const repeat = watch('repeat');
  const category = watch('category');
  const radius = watch('radius');

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
      <Controller
        control={control}
        name="title"
        rules={{
          required: 'Title is required.',
          minLength: { value: 3, message: 'Title must be at least 3 characters.' },
          maxLength: { value: 100, message: 'Title cannot exceed 100 characters.' }
        }}
        render={({ field: { onChange, value } }) => (
          <Input
            label="Title"
            placeholder="Enter reminder title"
            value={value}
            onChangeText={onChange}
            error={errors.title?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="description"
        rules={{ maxLength: { value: 500, message: 'Description cannot exceed 500 characters.' } }}
        render={({ field: { onChange, value } }) => (
          <Input
            label="Description / Notes"
            placeholder="Enter reminder details"
            value={value}
            onChangeText={onChange}
            error={errors.description?.message}
          />
        )}
      />

      <ReminderCategorySelector control={control} errors={errors} setValue={setValue} watch={watch} />

      <View className="mt-4">
        <Controller
          control={control}
          name="priority"
          rules={{ required: 'Priority is required.' }}
          render={({ field: { onChange, value } }) => (
            <PrioritySelector value={value} onChange={onChange} error={errors.priority?.message} />
          )}
        />
      </View>

      <View className="mt-4 flex-row">
        <View className="mr-2 flex-1">
          <Controller
            control={control}
            name="reminderDate"
            rules={{
              required: 'Reminder date is required.',
              validate: (value) => {
                const selected = new Date(`${value}T00:00:00`);
                if (Number.isNaN(selected.getTime())) {
                  return 'Enter a valid date in YYYY-MM-DD format.';
                }

                const today = new Date();
                today.setHours(0, 0, 0, 0);
                if (selected < today) {
                  return 'Reminder date cannot be in the past.';
                }

                return true;
              }
            }}
            render={({ field: { onChange, value } }) => (
              <Input
                label="Reminder Date"
                placeholder="YYYY-MM-DD"
                value={value}
                onChangeText={onChange}
                error={errors.reminderDate?.message}
              />
            )}
          />
        </View>
        <View className="flex-1">
          <Controller
            control={control}
            name="reminderTime"
            rules={{
              required: 'Reminder time is required.',
              validate: (value) => {
                const pattern = /^([01]\d|2[0-3]):([0-5]\d)$/;
                return pattern.test(value) || 'Enter a valid time in HH:MM format.';
              }
            }}
            render={({ field: { onChange, value } }) => (
              <Input
                label="Reminder Time"
                placeholder="HH:MM"
                value={value}
                onChangeText={onChange}
                error={errors.reminderTime?.message}
              />
            )}
          />
        </View>
      </View>

      <View className="mt-2">
        <Controller
          control={control}
          name="repeat"
          rules={{ required: 'Repeat option is required.' }}
          render={({ field: { onChange, value } }) => (
            <RepeatSelector value={value} onChange={onChange} error={errors.repeat?.message} />
          )}
        />
      </View>

      {repeat === 'Custom' ? (
        <Controller
          control={control}
          name="repeatDays"
          rules={{
            validate: (value) => {
              if (repeat !== 'Custom') {
                return true;
              }

              if (!value || !value.trim()) {
                return 'Repeat days are required for custom repeat.';
              }

              return true;
            }
          }}
          render={({ field: { onChange, value } }) => (
            <Input
              label="Repeat Days"
              placeholder="Monday, Wednesday"
              value={value}
              onChangeText={onChange}
              error={errors.repeatDays?.message}
            />
          )}
        />
      ) : null}

      <View className="mt-2">
        <LocationSelector control={control} errors={errors} watch={watch} />
      </View>

      <View className="mt-2">
        <RadiusSelector control={control} errors={errors} setValue={setValue} watch={watch} />
      </View>

      <View className="mt-4 rounded-3xl bg-slate-50 p-4">
        <Controller
          control={control}
          name="notificationEnabled"
          render={({ field: { onChange, value } }) => (
            <View className="mb-4 flex-row items-center justify-between">
              <View className="flex-1 pr-3">
                <Text className="text-sm font-semibold text-slate-900">Notification Enabled</Text>
                <Text className="mt-1 text-xs text-slate-500">
                  Allow push notifications for this reminder.
                </Text>
              </View>
              <Switch value={Boolean(value)} onValueChange={onChange} />
            </View>
          )}
        />

        <Controller
          control={control}
          name="contextEnabled"
          render={({ field: { onChange, value } }) => (
            <View className="flex-row items-center justify-between">
              <View className="flex-1 pr-3">
                <Text className="text-sm font-semibold text-slate-900">Context Enabled</Text>
                <Text className="mt-1 text-xs text-slate-500">
                  Use location, activity, and history to improve reminder decisions.
                </Text>
              </View>
              <Switch value={Boolean(value)} onValueChange={onChange} />
            </View>
          )}
        />
      </View>

      <View className="mt-5 flex-row">
        {onCancel ? (
          <View className="mr-2 flex-1">
            <Button title="Cancel" variant="secondary" onPress={onCancel} />
          </View>
        ) : null}
        <View className={onCancel ? 'flex-1' : ''}>
          <Button title={submitLabel} onPress={onSubmit} loading={loading} />
        </View>
      </View>
    </ScrollView>
  );
};

export default ReminderForm;
