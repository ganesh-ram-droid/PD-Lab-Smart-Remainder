import React from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import Icon from 'react-native-vector-icons/Ionicons';

import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import routes from '../../constants/routes';
import { useAuthStore } from '../../store/authStore';
import { emailRules, passwordRules } from '../../utils/validators';
import { formatFirebaseError } from '../../utils/helpers';

const LoginScreen = ({ navigation }) => {
  const login = useAuthStore((state) => state.login);
  const loading = useAuthStore((state) => state.loading);
  const error = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (values) => {
    clearError();
    await login(values);
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-slate-50"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View className="flex-1 justify-center px-6 py-10">
          <View className="mb-8">
            <View className="mb-6 h-16 w-16 items-center justify-center rounded-2xl bg-blue-600">
              <Icon name="notifications" size={30} color="#FFFFFF" />
            </View>
            <Text className="text-3xl font-bold text-slate-950">Welcome back</Text>
            <Text className="mt-2 text-base leading-6 text-slate-500">
              Sign in to manage your adaptive reminder workspace.
            </Text>
          </View>

          {error ? (
            <Text className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {formatFirebaseError(error)}
            </Text>
          ) : null}

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
                placeholder="Enter your password"
                secureTextEntry
                value={value}
                onChangeText={onChange}
                error={errors.password?.message}
              />
            )}
          />

          <Pressable
            className="mb-6 self-end"
            onPress={() => navigation.navigate(routes.FORGOT_PASSWORD)}
          >
            <Text className="text-sm font-semibold text-blue-700">Forgot password?</Text>
          </Pressable>

          <Button title="Sign in" loading={loading} onPress={handleSubmit(onSubmit)} />

          <View className="mt-8 flex-row justify-center">
            <Text className="text-slate-500">New here? </Text>
            <Pressable onPress={() => navigation.navigate(routes.REGISTER)}>
              <Text className="font-semibold text-blue-700">Create account</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
