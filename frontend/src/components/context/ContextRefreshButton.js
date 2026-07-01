import React from 'react';
import { Pressable, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const ContextRefreshButton = ({ onPress, loading = false }) => {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center rounded-full bg-blue-600 px-4 py-2.5 shadow-sm"
      style={{ shadowColor: '#1D4ED8' }}
      disabled={loading}
    >
      <Icon name={loading ? 'sync-outline' : 'refresh-outline'} size={16} color="#FFFFFF" />
      <Text className="ml-2 text-sm font-semibold text-white">{loading ? 'Refreshing' : 'Refresh'}</Text>
    </Pressable>
  );
};

export default ContextRefreshButton;
