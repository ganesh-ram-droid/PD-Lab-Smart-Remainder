import React from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import Button from '../common/Button';
import Input from '../common/Input';

const dateRanges = [
  { label: 'All', value: 'all' },
  { label: 'Today', value: 'today' },
  { label: 'Yesterday', value: 'yesterday' },
  { label: 'Last 7 Days', value: '7' },
  { label: 'Last 30 Days', value: '30' }
];

const categoryOptions = ['all', 'Medicine', 'Shopping', 'Meeting', 'Work', 'College', 'Exercise', 'Travel', 'Bills', 'Personal', 'Custom'];
const priorityOptions = ['all', 'High', 'Normal', 'Low'];
const statusOptions = ['all', 'Scheduled', 'Sent', 'Delivered', 'Opened', 'Dismissed', 'Suppressed', 'Cancelled', 'Failed'];

const Chip = ({ label, active, onPress }) => (
  <Pressable
    onPress={onPress}
    className={`mr-2 mb-2 rounded-full px-3 py-2 ${active ? 'bg-blue-600' : 'bg-slate-100'}`}
  >
    <Text className={`text-sm font-semibold ${active ? 'text-white' : 'text-slate-700'}`}>{label}</Text>
  </Pressable>
);

const NotificationFilterModal = ({
  visible,
  filters,
  searchQuery,
  onChangeSearch,
  onChangeFilters,
  onApply,
  onReset,
  onClose
}) => {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/40">
        <View className="max-h-[90%] rounded-t-3xl bg-white px-4 pt-4">
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="text-lg font-bold text-slate-950">Filters</Text>
            <Pressable onPress={onClose} className="h-10 w-10 items-center justify-center rounded-full bg-slate-100">
              <Icon name="close" size={18} color="#0F172A" />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View className="mb-4">
              <Text className="mb-2 text-sm font-semibold text-slate-700">Search</Text>
              <Input
                placeholder="Reminder title, category, description"
                value={searchQuery}
                onChangeText={onChangeSearch}
              />
            </View>

            <View className="mb-4">
              <Text className="mb-2 text-sm font-semibold text-slate-700">Date Range</Text>
              <View className="flex-row flex-wrap">
                {dateRanges.map((item) => (
                  <Chip
                    key={item.value}
                    label={item.label}
                    active={filters.dateRange === item.value}
                    onPress={() => onChangeFilters({ dateRange: item.value })}
                  />
                ))}
              </View>
            </View>

            <View className="mb-4">
              <Text className="mb-2 text-sm font-semibold text-slate-700">Category</Text>
              <View className="flex-row flex-wrap">
                {categoryOptions.map((item) => (
                  <Chip
                    key={item}
                    label={item}
                    active={filters.category === item}
                    onPress={() => onChangeFilters({ category: item })}
                  />
                ))}
              </View>
            </View>

            <View className="mb-4">
              <Text className="mb-2 text-sm font-semibold text-slate-700">Priority</Text>
              <View className="flex-row flex-wrap">
                {priorityOptions.map((item) => (
                  <Chip
                    key={item}
                    label={item}
                    active={filters.priority === item}
                    onPress={() => onChangeFilters({ priority: item })}
                  />
                ))}
              </View>
            </View>

            <View className="mb-4">
              <Text className="mb-2 text-sm font-semibold text-slate-700">Status</Text>
              <View className="flex-row flex-wrap">
                {statusOptions.map((item) => (
                  <Chip
                    key={item}
                    label={item}
                    active={filters.status === item}
                    onPress={() => onChangeFilters({ status: item })}
                  />
                ))}
              </View>
            </View>
          </ScrollView>

          <View className="flex-row py-4">
            <View className="mr-2 flex-1">
              <Button title="Reset" variant="secondary" onPress={onReset} />
            </View>
            <View className="flex-1">
              <Button title="Apply" onPress={onApply} />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default NotificationFilterModal;
