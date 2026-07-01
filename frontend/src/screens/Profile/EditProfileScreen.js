import React, { useEffect } from 'react';
import { Alert, Image, KeyboardAvoidingView, Platform, SafeAreaView, Text, View } from 'react-native';
import { useForm, Controller } from 'react-hook-form';

import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import ProfileHeader from '../../components/profile/ProfileHeader';
import { useAuthStore } from '../../store/authStore';
import { useProfileStore } from '../../store/profileStore';
import routes from '../../constants/routes';
import { showToast } from '../../utils/toast';

const EditProfileScreen = ({ navigation }) => {
  const user = useAuthStore((state) => state.user);
  const { profile, loading, saving, loadProfile, updateProfile } = useProfileStore((state) => state);
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: '',
      phone: '',
      photoURL: ''
    }
  });

  useEffect(() => {
    loadProfile()
      .then((data) => {
        reset({
          name: data.name || user?.displayName || '',
          phone: data.phone || '',
          photoURL: data.photoURL || user?.photoURL || ''
        });
      })
      .catch((error) => Alert.alert('Unable to load profile', error.message));
  }, [loadProfile, reset, user?.displayName, user?.photoURL]);

  const photoURL = watch('photoURL');

  const onSubmit = handleSubmit(async (data) => {
    try {
      await updateProfile({
        name: data.name.trim(),
        phone: data.phone.trim(),
        photoURL: data.photoURL.trim()
      });
      showToast({ type: 'success', message: 'Profile updated successfully.' });
      Alert.alert('Success', 'Profile updated successfully.', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert('Unable to update profile', error.message);
    }
  });

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1">
        <View className="flex-1 px-4 pt-4">
          <ProfileHeader
            title="Edit Profile"
            subtitle="Update your personal information"
            onBackPress={() => navigation.goBack()}
          />

          <View className="mt-4 flex-1">
            <View className="rounded-3xl bg-white p-4 shadow-sm" style={{ shadowColor: '#0F172A' }}>
              <View className="items-center">
                <View className="h-24 w-24 overflow-hidden rounded-full bg-blue-600">
                  {photoURL ? (
                    <Image source={{ uri: photoURL }} className="h-24 w-24" resizeMode="cover" />
                  ) : (
                    <View className="h-24 w-24 items-center justify-center">
                      <Text className="text-2xl font-bold text-white">
                        {(user?.displayName || 'U').slice(0, 2).toUpperCase()}
                      </Text>
                    </View>
                  )}
                </View>
              </View>

              <View className="mt-5">
                <Controller
                  control={control}
                  name="name"
                  rules={{
                    required: 'Name is required.',
                    minLength: { value: 3, message: 'Name must be at least 3 characters.' }
                  }}
                  render={({ field: { onChange, value } }) => (
                    <Input
                      label="Name"
                      placeholder="Enter your name"
                      value={value}
                      onChangeText={onChange}
                      error={errors.name?.message}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="phone"
                  rules={{
                    minLength: { value: 6, message: 'Phone number looks too short.' }
                  }}
                  render={({ field: { onChange, value } }) => (
                    <Input
                      label="Phone"
                      placeholder="Enter phone number"
                      keyboardType="phone-pad"
                      value={value}
                      onChangeText={onChange}
                      error={errors.phone?.message}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="photoURL"
                  render={({ field: { onChange, value } }) => (
                    <Input
                      label="Photo URL"
                      placeholder="Enter profile image URL"
                      value={value}
                      onChangeText={onChange}
                      error={errors.photoURL?.message}
                    />
                  )}
                />
              </View>

              <View className="mt-2">
                <Button title="Save Changes" onPress={onSubmit} loading={saving || loading} />
              </View>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default EditProfileScreen;
