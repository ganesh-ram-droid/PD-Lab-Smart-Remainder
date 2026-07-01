import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import Icon from 'react-native-vector-icons/Ionicons';

import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { useAuthStore } from '../../store/authStore';
import { emailRules } from '../../utils/validators';
import { formatFirebaseError } from '../../utils/helpers';

const ForgotPasswordScreen = ({ navigation }) => {
  const resetPassword = useAuthStore((state) => state.resetPassword);
  const loading = useAuthStore((state) => state.loading);
  const error = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);
  const [sent, setSent] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      email: ''
    }
  });

  const onSubmit = async ({ email }) => {
    clearError();
    await resetPassword(email);
    setSent(true);
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

          <Text className="text-3xl font-bold text-slate-950">Reset password</Text>
          <Text className="mt-2 text-base leading-6 text-slate-500">
            Enter your email and Firebase will send secure reset instructions.
          </Text>

          {sent ? (
            <Text className="mb-4 mt-6 rounded-lg bg-green-50 p-3 text-sm text-green-700">
              Password reset email sent. Check your inbox.
            </Text>
          ) : null}

          {error ? (
            <Text className="mb-4 mt-6 rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {formatFirebaseError(error)}
            </Text>
          ) : null}

          <View className="mt-6">
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
          </View>

          <Button title="Send reset email" loading={loading} onPress={handleSubmit(onSubmit)} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ForgotPasswordScreen;
