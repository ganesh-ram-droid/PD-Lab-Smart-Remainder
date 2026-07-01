import React, { useState } from 'react';
import { Text, TextInput, View } from 'react-native';

const Input = ({
  label,
  error,
  secureTextEntry = false,
  autoCapitalize = 'none',
  className = '',
  ...props
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <View className={`mb-4 ${className}`}>
      {label ? (
        <Text className="mb-2 text-sm font-semibold text-slate-700">{label}</Text>
      ) : null}
      <TextInput
        className={`h-12 rounded-lg border bg-white px-4 text-base text-slate-900 ${
          focused ? 'border-blue-600' : 'border-slate-300'
        } ${error ? 'border-red-500' : ''}`}
        placeholderTextColor="#94A3B8"
        secureTextEntry={secureTextEntry}
        autoCapitalize={autoCapitalize}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...props}
      />
      {error ? <Text className="mt-2 text-sm text-red-600">{error}</Text> : null}
    </View>
  );
};

export default Input;
