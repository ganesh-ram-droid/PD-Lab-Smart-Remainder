import React from 'react';
import { ActivityIndicator, Pressable, Text } from 'react-native';

const variants = {
  primary: 'bg-blue-600 active:bg-blue-700',
  secondary: 'bg-slate-100 active:bg-slate-200',
  danger: 'bg-red-600 active:bg-red-700',
  ghost: 'bg-transparent active:bg-slate-100'
};

const textVariants = {
  primary: 'text-white',
  secondary: 'text-slate-900',
  danger: 'text-white',
  ghost: 'text-blue-700'
};

const Button = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
  className = '',
  textClassName = ''
}) => {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      className={`h-12 flex-row items-center justify-center rounded-lg px-4 ${variants[variant]} ${
        isDisabled ? 'opacity-60' : ''
      } ${className}`}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'secondary' || variant === 'ghost' ? '#2563EB' : '#FFFFFF'} />
      ) : (
        <Text className={`text-base font-semibold ${textVariants[variant]} ${textClassName}`}>
          {title}
        </Text>
      )}
    </Pressable>
  );
};

export default Button;
