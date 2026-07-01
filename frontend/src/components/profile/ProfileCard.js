import React from 'react';
import { Image, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import { getInitials } from '../../utils/helpers';

const Row = ({ label, value }) => (
  <View className="mb-3 rounded-2xl bg-slate-50 px-4 py-3">
    <Text className="text-xs uppercase tracking-wide text-slate-500">{label}</Text>
    <Text className="mt-1 text-sm font-semibold text-slate-950" numberOfLines={2}>
      {value || '--'}
    </Text>
  </View>
);

const ProfileCard = ({ profile = {} }) => {
  const identity = profile.name || profile.email || 'User';

  return (
    <View className="rounded-3xl bg-white p-4 shadow-sm" style={{ shadowColor: '#0F172A' }}>
      <View className="items-center">
        <View className="h-24 w-24 overflow-hidden rounded-full bg-blue-600">
          {profile.photoURL ? (
            <Image source={{ uri: profile.photoURL }} className="h-24 w-24" resizeMode="cover" />
          ) : (
            <View className="h-24 w-24 items-center justify-center">
              <Text className="text-2xl font-bold text-white">{getInitials(identity)}</Text>
            </View>
          )}
        </View>
        <Text className="mt-4 text-xl font-bold text-slate-950">{identity}</Text>
        <Text className="mt-1 text-sm text-slate-500">{profile.email}</Text>
      </View>

      <View className="mt-5">
        <Row label="Phone" value={profile.phone} />
        <Row label="Member Since" value={profile.createdAt} />
        <Row label="Theme" value={profile.theme === 'dark' ? 'Dark' : 'Light'} />
      </View>
    </View>
  );
};

export default ProfileCard;
