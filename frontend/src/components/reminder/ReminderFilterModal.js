import React from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import Button from '../common/Button';
import Input from '../common/Input';

const statusOptions = ['all', 'Upcoming', 'Completed', 'Missed', 'Cancelled', 'Snoozed'];
const categoryOptions = ['all', 'Medicine', 'Shopping', 'Meeting', 'Work', 'College', 'Exercise', 'Travel', 'Bills', 'Personal', 'Custom'];
const priorityOptions = ['all', 'High', 'Medium', 'Low'];
const contextOptions = ['all', 'true', 'false'];
const sortingOptions = ['newest', 'oldest', 'priority', 'reminderDate'];

const chipStyle = (active) => `mr-2 mb-2 rounded-full px-3 py-2 ${active ? 'bg-blue-600' : 'bg-slate-100'}`;
const chipText = (active) => `text-sm font-semibold ${active ? 'text-white' : 'text-slate-700'}`;

const OptionGroup = ({ label, options, value, onChange }) => (
  <View className="mb-4">
    <Text className="mb-2 text-sm font-semibold text-slate-700">{label}</Text>
    <View className="flex-row flex-wrap">
      {options.map((option) => {
        const active = value === option;
        return (
          <Pressable key={option} onPress={() => onChange(option)} className={chipStyle(active)}>
            <Text className={chipText(active)}>{option}</Text>
          </Pressable>
        );
      })}
    </View>
  </View>
);

const ReminderFilterModal = ({
  visible,
  filters,
  sorting,
  onChangeFilters,
  onChangeSorting,
  onApply,
  onReset,
  onClose
}) => {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/40">
        <View className="max-h-[88%] rounded-t-3xl bg-white px-4 pt-4">
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="text-lg font-bold text-slate-950">Filters</Text>
            <Pressable onPress={onClose} className="h-10 w-10 items-center justify-center rounded-full bg-slate-100">
              <Icon name="close" size={18} color="#0F172A" />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <OptionGroup
              label="Status"
              options={statusOptions}
              value={filters.status}
              onChange={(status) => onChangeFilters({ status })}
            />
            <OptionGroup
              label="Category"
              options={categoryOptions}
              value={filters.category}
              onChange={(category) => onChangeFilters({ category })}
            />
            <OptionGroup
              label="Priority"
              options={priorityOptions}
              value={filters.priority}
              onChange={(priority) => onChangeFilters({ priority })}
            />
            <OptionGroup
              label="Context Enabled"
              options={contextOptions}
              value={filters.contextEnabled}
              onChange={(contextEnabled) => onChangeFilters({ contextEnabled })}
            />
            <OptionGroup
              label="Sort By"
              options={sortingOptions}
              value={sorting}
              onChange={onChangeSorting}
            />

            <Input
              label="Date Filter"
              placeholder="YYYY-MM-DD"
              value={filters.date}
              onChangeText={(date) => onChangeFilters({ date })}
            />
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

export default ReminderFilterModal;
