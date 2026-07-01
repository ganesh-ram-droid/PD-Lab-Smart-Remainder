import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import { subscribeToast } from '../../utils/toast';

const toneStyles = {
  success: {
    container: 'bg-emerald-600',
    icon: 'checkmark-circle-outline'
  },
  error: {
    container: 'bg-red-600',
    icon: 'alert-circle-outline'
  },
  info: {
    container: 'bg-blue-600',
    icon: 'information-circle-outline'
  }
};

const ToastHost = () => {
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const unsubscribe = subscribeToast((payload) => {
      setToast({
        type: payload?.type || 'info',
        message: payload?.message || '',
        visible: true
      });

      setTimeout(() => {
        setToast(null);
      }, payload?.duration || 2800);
    });

    return unsubscribe;
  }, []);

  if (!toast?.visible) {
    return null;
  }

  const theme = toneStyles[toast.type] || toneStyles.info;

  return (
    <View pointerEvents="none" className="absolute bottom-8 left-4 right-4 z-50">
      <View className={`flex-row items-center rounded-2xl px-4 py-3 shadow-lg ${theme.container}`} style={{ shadowColor: '#0F172A' }}>
        <Icon name={theme.icon} size={18} color="#FFFFFF" />
        <Text className="ml-3 flex-1 text-sm font-semibold text-white">{toast.message}</Text>
      </View>
    </View>
  );
};

export default ToastHost;
