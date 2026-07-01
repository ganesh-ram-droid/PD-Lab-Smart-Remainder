import React from 'react';
import { Modal, Text, View } from 'react-native';

import Button from '../common/Button';

const LogoutDialog = ({ visible, onCancel, onConfirm, loading = false }) => {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View className="flex-1 items-center justify-center bg-black/40 px-4">
        <View className="w-full rounded-3xl bg-white p-5">
          <Text className="text-lg font-bold text-slate-950">Sign out?</Text>
          <Text className="mt-2 text-sm leading-5 text-slate-500">
            You will be signed out from this device.
          </Text>
          <View className="mt-5 flex-row">
            <View className="mr-2 flex-1">
              <Button title="Cancel" variant="secondary" onPress={onCancel} />
            </View>
            <View className="flex-1">
              <Button title="Logout" variant="danger" loading={loading} onPress={onConfirm} />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default LogoutDialog;
