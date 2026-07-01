import React from 'react';
import { Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const CurrentLocationButton = ({ onPress }) => {
  return (
    <Pressable
      onPress={onPress}
      className="h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm"
      style={{ shadowColor: '#0F172A' }}
    >
      <Icon name="locate-outline" size={20} color="#2563EB" />
    </Pressable>
  );
};

export default CurrentLocationButton;
