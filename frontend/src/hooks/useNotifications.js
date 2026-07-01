import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';

import notificationService from '../services/notificationService';
import { useNotificationStore } from '../store/notificationStore';

let listenersInitialized = false;

const normalizeIncoming = (notification) => ({
  notificationId: notification.request?.content?.data?.notificationId || '',
  reminderId: notification.request?.content?.data?.reminderId || '',
  title: notification.request?.content?.title || '',
  body: notification.request?.content?.body || '',
  timestamp: new Date().toISOString()
});

const useNotifications = () => {
  const store = useNotificationStore((state) => state);

  useEffect(() => {
    const initialize = async () => {
      const preferences = await store.loadPreferences();

      if (preferences.enablePushNotifications) {
        try {
          const token = await notificationService.getPushToken();
          await store.registerDeviceToken(token, 'expo');
        } catch (error) {
          store.updatePreference('enablePushNotifications', false);
        }
      }

      if (!listenersInitialized) {
        notificationService.configureNotificationHandler();

        Notifications.addNotificationReceivedListener((notification) => {
          store.setIncomingNotification(normalizeIncoming(notification));
        });

        Notifications.addNotificationResponseReceivedListener((response) => {
          const data = response.notification?.request?.content?.data || {};
          store.setIncomingNotification({
            notificationId: data.notificationId || '',
            reminderId: data.reminderId || '',
            title: response.notification?.request?.content?.title || '',
            body: response.notification?.request?.content?.body || '',
            timestamp: new Date().toISOString()
          });
          store.setPendingNotification({
            notificationId: data.notificationId || '',
            reminderId: data.reminderId || ''
          });
        });

        listenersInitialized = true;
      }
    };

    initialize();
  }, []);

  return {
    ...store,
    loadNotifications: store.loadNotifications,
    refreshNotifications: store.refreshNotifications,
    registerDeviceToken: store.registerDeviceToken,
    completeReminder: store.completeReminder,
    dismissReminder: store.dismissReminder,
    snoozeReminder: store.snoozeReminder
  };
};

export default useNotifications;
