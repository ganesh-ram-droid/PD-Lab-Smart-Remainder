import React from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import Icon from 'react-native-vector-icons/Ionicons';

import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import routes from '../../constants/routes';
import { useAuthStore } from '../../store/authStore';
import { emailRules, nameRules, passwordRules } from '../../utils/validators';
import { formatFirebaseError } from '../../utils/helpers';

const RegisterScreen = ({ navigation }) => {
  const register = useAuthStore((state) => state.register);
  const loading = useAuthStore((state) => state.loading);
  const error = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  });

  const password = watch('password');

  const onSubmit = async (values) => {
    clearError();
    await register({
      name: values.name,
      email: values.email,
      password: values.password
    });
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-slate-50"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View className="flex-1 justify-center px-6 py-10">
          <Pressable
            className="mb-6 h-10 w-10 items-center justify-center rounded-full bg-white"
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={20} color="#0F172A" />
          </Pressable>

          <Text className="text-3xl font-bold text-slate-950">Create account</Text>
          <Text className="mt-2 text-base leading-6 text-slate-500">
            Start with secure access to your contextual reminder system.
          </Text>

          {error ? (
            <Text className="mb-4 mt-6 rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {formatFirebaseError(error)}
            </Text>
          ) : (
            <View className="mt-6" />
          )}

          <Controller
            control={control}
            name="name"
            rules={nameRules}
            render={({ field: { onChange, value } }) => (
              <Input
                label="Full name"
                placeholder="Ganesh"
                autoCapitalize="words"
                value={value}
                onChangeText={onChange}
                error={errors.name?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            rules={emailRules}
            render={({ field: { onChange, value } }) => (
              <Input
                label="Email address"
                placeholder="name@example.com"
                keyboardType="email-address"
                value={value}
                onChangeText={onChange}
                error={errors.email?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            rules={passwordRules}
            render={({ field: { onChange, value } }) => (
              <Input
                label="Password"
                placeholder="Create a password"
                secureTextEntry
                value={value}
                onChangeText={onChange}
                error={errors.password?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="confirmPassword"
            rules={{
              required: 'Confirm your password.',
              validate: (value) => value === password || 'Passwords do not match.'
            }}
            render={({ field: { onChange, value } }) => (
              <Input
                label="Confirm password"
                placeholder="Re-enter your password"
                secureTextEntry
                value={value}
                onChangeText={onChange}
                error={errors.confirmPassword?.message}
              />
            )}
          />

          <Button title="Create account" loading={loading} onPress={handleSubmit(onSubmit)} />

          <View className="mt-8 flex-row justify-center">
            <Text className="text-slate-500">Already registered? </Text>
            <Pressable onPress={() => navigation.navigate(routes.LOGIN)}>
              <Text className="font-semibold text-blue-700">Sign in</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;
