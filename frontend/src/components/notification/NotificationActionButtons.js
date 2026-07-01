import React from 'react';
import { View } from 'react-native';

import Button from '../common/Button';

const NotificationActionButtons = ({
  onComplete,
  onSnooze,
  onDismiss,
  onOpenReminder,
  loading = false
}) => {
  return (
    <View className="flex-row flex-wrap">
      <View className="mb-2 mr-2 w-[48%]">
        <Button title="Complete" onPress={onComplete} loading={loading} />
      </View>
      <View className="mb-2 w-[48%]">
        <Button title="Snooze" variant="secondary" onPress={onSnooze} loading={loading} />
      </View>
      <View className="mb-2 mr-2 w-[48%]">
        <Button title="Dismiss" variant="danger" onPress={onDismiss} loading={loading} />
      </View>
      <View className="mb-2 w-[48%]">
        <Button title="Open Reminder" variant="secondary" onPress={onOpenReminder} loading={loading} />
      </View>
    </View>
  );
};

export default NotificationActionButtons;
