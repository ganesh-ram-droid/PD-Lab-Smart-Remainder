import React from 'react';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const MapMarker = ({ color = '#2563EB', icon = 'location' }) => {
  return (
    <View className="items-center justify-center rounded-full border-4 border-white shadow-sm" style={{ backgroundColor: color, width: 28, height: 28 }}>
      <Icon name={icon} size={14} color="#FFFFFF" />
    </View>
  );
};

export default MapMarker;
