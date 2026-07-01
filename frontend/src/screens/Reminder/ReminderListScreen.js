import React, { useCallback, useState } from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  SafeAreaView,
  Text,
  View
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import colors from '../../constants/colors';
import routes from '../../constants/routes';
import useReminder from '../../hooks/useReminder';
import EmptyReminder from '../../components/reminder/EmptyReminder';
import ReminderCard from '../../components/reminder/ReminderCard';
import ReminderFilterModal from '../../components/reminder/ReminderFilterModal';
import ReminderHeader from '../../components/reminder/ReminderHeader';
import ReminderSearchBar from '../../components/reminder/ReminderSearchBar';

const statusTabs = ['all', 'Upcoming', 'Completed', 'Missed', 'Cancelled', 'Snoozed'];

const SkeletonCard = () => (
  <View className="mb-3 rounded-3xl bg-white p-4 shadow-sm" style={{ shadowColor: '#0F172A' }}>
    <View className="h-4 w-2/3 rounded-full bg-slate-200" />
    <View className="mt-3 h-3 w-1/2 rounded-full bg-slate-200" />
    <View className="mt-4 h-10 rounded-2xl bg-slate-100" />
  </View>
);

const ReminderListScreen = ({ navigation }) => {
  const {
    reminders,
    visibleReminders,
    loading,
    error,
    searchQuery,
    filters,
    sorting,
    refreshing,
    loadReminders,
    setSearchQuery,
    setFilters,
    setSorting,
    resetFilters,
    clearError
  } = useReminder();

  const [filterVisible, setFilterVisible] = useState(false);

  const loadData = useCallback(async () => {
    try {
      await loadReminders();
    } catch (fetchError) {
      Alert.alert('Unable to load reminders', fetchError.message);
    }
  }, [loadReminders]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const statusCount = (status) => {
    const list = Array.isArray(reminders) ? reminders : [];

    if (!list.length) {
      return 0;
    }

    if (status === 'all') {
      return list.length;
    }

    if (status === 'Upcoming') {
      return list.filter((reminder) => !['Completed', 'Missed', 'Cancelled', 'Snoozed'].includes(reminder.status)).length;
    }

    return list.filter((reminder) => reminder.status === status).length;
  };

  const retryLoad = () => {
    clearError();
    loadData();
  };

  if (loading && visibleReminders.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50">
        <View className="flex-1 px-4 pt-4">
          <ReminderHeader title="Reminders" subtitle="Manage your scheduled reminders" />
          <View className="mt-4">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="flex-1 px-4 pt-4">
        <ReminderHeader
          title="Reminders"
          subtitle="Manage your scheduled reminders"
          onRightPress={() => navigation.navigate(routes.ADD_REMINDER)}
          rightIcon="add-outline"
          rightLabel="Add"
        />

        <View className="mt-4">
          <ReminderSearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFilterPress={() => setFilterVisible(true)}
            onClearPress={() => setSearchQuery('')}
          />
        </View>

        <View className="mt-4">
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={statusTabs}
            keyExtractor={(item) => item}
            renderItem={({ item }) => {
              const active = filters.status === item;
              return (
                <Pressable
                  onPress={() => setFilters({ status: item })}
                  className={`mr-2 rounded-full px-4 py-2 ${active ? 'bg-blue-600' : 'bg-white'}`}
                >
                  <Text className={`text-sm font-semibold ${active ? 'text-white' : 'text-slate-700'}`}>
                    {item === 'all' ? 'All' : item}
                    <Text className={active ? 'text-white' : 'text-slate-500'}>{` (${statusCount(item)})`}</Text>
                  </Text>
                </Pressable>
              );
            }}
          />
        </View>

        <View className="mt-4 flex-1">
          {error ? (
            <View className="mb-4 rounded-3xl bg-red-50 px-4 py-4">
              <Text className="text-sm font-medium text-red-700">{error}</Text>
              <View className="mt-3 w-28">
                <Button title="Retry" onPress={retryLoad} />
              </View>
            </View>
          ) : null}

          {visibleReminders.length === 0 && !loading ? (
            <EmptyReminder onCreatePress={() => navigation.navigate(routes.ADD_REMINDER)} />
          ) : (
            <FlatList
              data={visibleReminders}
              keyExtractor={(item) => item.reminderId}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={loadData}
                  tintColor={colors.primary}
                  colors={[colors.primary]}
                />
              }
              renderItem={({ item }) => (
                <ReminderCard
                  reminder={item}
                  onPress={(selectedReminder) =>
                    navigation.navigate(routes.REMINDER_DETAILS, {
                      reminderId: selectedReminder.reminderId
                    })
                  }
                />
              )}
              contentContainerStyle={{ paddingBottom: 120 }}
              ListFooterComponent={<View className="h-12" />}
            />
          )}
        </View>
      </View>

      <Pressable
        onPress={() => navigation.navigate(routes.ADD_REMINDER)}
        className="absolute bottom-6 right-5 h-14 w-14 items-center justify-center rounded-full bg-blue-600 shadow-lg"
        style={{ shadowColor: '#1D4ED8' }}
      >
        <Icon name="add" size={28} color="#FFFFFF" />
      </Pressable>

      <ReminderFilterModal
        visible={filterVisible}
        filters={filters}
        sorting={sorting}
        onChangeFilters={setFilters}
        onChangeSorting={setSorting}
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

export default ReminderListScreen;
