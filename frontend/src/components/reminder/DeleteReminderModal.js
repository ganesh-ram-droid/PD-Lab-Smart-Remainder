import React from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import Button from '../common/Button';

const DeleteReminderModal = ({
  visible,
  title,
  loading = false,
  onCancel,
  onConfirm
}) => {
  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onCancel}>
      <View className="flex-1 items-center justify-center bg-black/40 px-4">
        <View className="w-full rounded-3xl bg-white p-5">
          <View className="mb-4 h-12 w-12 items-center justify-center rounded-2xl bg-red-50">
            <Icon name="trash-outline" size={20} color="#DC2626" />
          </View>
          <Text className="text-lg font-bold text-slate-950">Delete reminder?</Text>
          <Text className="mt-2 text-sm leading-5 text-slate-500">
            {title
              ? `This will permanently remove "${title}" from your account.`
              : 'This will permanently remove the reminder from your account.'}
          </Text>

          <View className="mt-5 flex-row">
            <View className="mr-2 flex-1">
              <Button title="Cancel" variant="secondary" onPress={onCancel} />
            </View>
            <View className="flex-1">
              <Button title="Delete" variant="danger" loading={loading} onPress={onConfirm} />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DeleteReminderModal;
