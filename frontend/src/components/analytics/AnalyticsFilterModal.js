import React from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import Button from '../common/Button';

const sections = {
  dateRange: [
    { label: 'All', value: 'all' },
    { label: 'Today', value: 'today' },
    { label: '7 Days', value: '7' },
    { label: '30 Days', value: '30' }
  ],
  category: ['all', 'Medicine', 'Shopping', 'Meeting', 'Work', 'College', 'Exercise', 'Travel', 'Bills', 'Personal'],
  priority: ['all', 'High', 'Normal', 'Low'],
  status: ['all', 'Pending', 'Completed', 'Missed', 'Cancelled', 'Snoozed']
};

const Chip = ({ label, active, onPress }) => (
  <Pressable
    onPress={onPress}
    className={`mr-2 mb-2 rounded-full px-3 py-2 ${active ? 'bg-blue-600' : 'bg-slate-100'}`}
  >
    <Text className={`text-sm font-semibold ${active ? 'text-white' : 'text-slate-700'}`}>{label}</Text>
  </Pressable>
);

const AnalyticsFilterModal = ({ visible, filters, onChangeFilters, onApply, onReset, onClose }) => {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/40">
        <View className="max-h-[90%] rounded-t-3xl bg-white px-4 pt-4">
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="text-lg font-bold text-slate-950">Filters</Text>
            <Pressable onPress={onClose} className="h-10 w-10 items-center justify-center rounded-full bg-slate-100">
              <Icon name="close" size={18} color="#0F172A" />
            </Pressable>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            {Object.entries(sections).map(([key, values]) => (
              <View key={key} className="mb-4">
                <Text className="mb-2 text-sm font-semibold text-slate-700">
                  {key === 'dateRange' ? 'Date' : key.charAt(0).toUpperCase() + key.slice(1)}
                </Text>
                <View className="flex-row flex-wrap">
                  {values.map((item) => {
                    const option = typeof item === 'string' ? item : item.value;
                    const label = typeof item === 'string' ? item : item.label;
                    const active = filters[key] === option;
                    return (
                      <Chip
                        key={option}
                        label={label}
                        active={active}
                        onPress={() => onChangeFilters({ [key]: option })}
                      />
                    );
                  })}
                </View>
              </View>
            ))}
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

export default AnalyticsFilterModal;
