import React, { useCallback, useMemo, useState } from 'react';
import { Alert, Pressable, RefreshControl, SafeAreaView, ScrollView, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

import Button from '../../components/common/Button';
import NotificationBadge from '../../components/notification/NotificationBadge';
import NotificationCard from '../../components/notification/NotificationCard';
import NotificationEmptyState from '../../components/notification/NotificationEmptyState';
import NotificationFilterModal from '../../components/notification/NotificationFilterModal';
import NotificationHeader from '../../components/notification/NotificationHeader';
import NotificationLoadingSkeleton from '../../components/notification/NotificationLoadingSkeleton';
import colors from '../../constants/colors';
import routes from '../../constants/routes';
import useNotifications from '../../hooks/useNotifications';
import Input from '../../components/common/Input';

const groupNotifications = (notifications = []) => {
  const today = [];
  const yesterday = [];
  const earlier = [];
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  const yesterdayDate = new Date(currentDate);
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);

  notifications.forEach((item) => {
    const itemDate = new Date(item.sentTime || item.createdAt || item.updatedAt || Date.now());
    const normalized = new Date(itemDate);
    normalized.setHours(0, 0, 0, 0);

    if (normalized.getTime() === currentDate.getTime()) {
      today.push(item);
    } else if (normalized.getTime() === yesterdayDate.getTime()) {
      yesterday.push(item);
    } else {
      earlier.push(item);
    }
  });

  return [
    { title: 'Today', data: today },
    { title: 'Yesterday', data: yesterday },
    { title: 'Earlier', data: earlier }
  ].filter((section) => section.data.length);
};

const NotificationCenterScreen = ({ navigation }) => {
  const {
    groupedNotifications,
    visibleNotifications,
    notifications,
    loading,
    refreshing,
    error,
    searchQuery,
    filters,
    pendingNotificationId,
    loadNotifications,
    refreshNotifications,
    setSearchQuery,
    setFilters,
    resetFilters,
    clearError,
    clearPendingNotification
  } = useNotifications();

  const [filterVisible, setFilterVisible] = useState(false);

  const loadData = useCallback(async () => {
    try {
      await loadNotifications();
    } catch (loadError) {
      Alert.alert('Unable to load notifications', loadError.message);
    }
  }, [loadNotifications]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  useEffect(() => {
    if (pendingNotificationId) {
      navigation.navigate(routes.NOTIFICATION_DETAILS, {
        notificationId: pendingNotificationId
      });
      clearPendingNotification();
    }
  }, [clearPendingNotification, navigation, pendingNotificationId]);

  const sections = useMemo(() => groupNotifications(visibleNotifications), [visibleNotifications]);

  const retry = () => {
    clearError();
    loadData();
  };

  if (loading && !notifications.length) {
    return <NotificationLoadingSkeleton />;
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="flex-1 px-4 pt-4">
        <NotificationHeader
          title="Notifications"
          subtitle="History, decisions, and actions"
          count={visibleNotifications.length}
          onSettingsPress={() => navigation.navigate(routes.NOTIFICATION_SETTINGS)}
        />

        <View className="mt-4">
          <Input
            placeholder="Search reminder title, category, description"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <View className="mt-3 flex-row items-center">
          <View className="mr-2">
            <NotificationBadge label="Today" count={sections[0]?.title === 'Today' ? sections[0].data.length : 0} />
          </View>
          <View className="mr-2">
            <NotificationBadge
              label="Yesterday"
              count={sections.find((item) => item.title === 'Yesterday')?.data.length || 0}
            />
          </View>
          <View className="mr-2">
            <NotificationBadge
              label="Earlier"
              count={sections.find((item) => item.title === 'Earlier')?.data.length || 0}
            />
          </View>
          <Pressable
            onPress={() => setFilterVisible(true)}
            className="ml-auto h-10 w-10 items-center justify-center rounded-2xl bg-white shadow-sm"
            style={{ shadowColor: '#0F172A' }}
          >
            <Icon name="options-outline" size={18} color={colors.primary} />
          </Pressable>
        </View>

        <View className="mt-4 flex-1">
          {error ? (
            <View className="mb-4 rounded-3xl bg-red-50 px-4 py-4">
              <Text className="text-sm font-medium text-red-700">{error}</Text>
              <View className="mt-3 w-28">
                <Button title="Retry" onPress={retry} />
              </View>
            </View>
          ) : null}

          {visibleNotifications.length === 0 && !loading ? (
            <NotificationEmptyState onRetry={retry} />
          ) : (
            <ScrollView
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={refreshNotifications}
                  tintColor={colors.primary}
                  colors={[colors.primary]}
                />
              }
              contentContainerStyle={{ paddingBottom: 120 }}
            >
              {sections.map((section) => (
                <View key={section.title} className="mt-2">
                  <Text className="mb-3 text-base font-bold text-slate-950">{section.title}</Text>
                  {section.data.map((notification) => (
                    <NotificationCard
                      key={notification.notificationId}
                      notification={notification}
                      onPress={(selected) =>
                        navigation.navigate(routes.NOTIFICATION_DETAILS, {
                          notificationId: selected.notificationId
                        })
                      }
                    />
                  ))}
                </View>
              ))}
            </ScrollView>
          )}
        </View>
      </View>

      <NotificationFilterModal
        visible={filterVisible}
        filters={filters}
        searchQuery={searchQuery}
        onChangeSearch={setSearchQuery}
        onChangeFilters={setFilters}
        onApply={() => setFilterVisible(false)}
        onReset={() => {
          resetFilters();
          setFilterVisible(false);
        }}
        onClose={() => setFilterVisible(false)}
      />
    </SafeAreaView>
  );
};

export default NotificationCenterScreen;
