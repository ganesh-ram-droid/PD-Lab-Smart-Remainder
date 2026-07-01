import React from 'react';
import { View } from 'react-native';

const Card = ({ children, className = '' }) => {
  return (
    <View className={`rounded-lg border border-slate-200 bg-white p-5 ${className}`}>
      {children}
    </View>
  );
};

export default Card;
