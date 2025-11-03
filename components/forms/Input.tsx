import React from 'react';
import { View, Text, TextInput, TextInputProps } from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerClassName?: string;
}

export function Input({ label, error, containerClassName = '', ...props }: InputProps) {
  return (
    <View className={containerClassName}>
      {label && <Text className="text-text font-semibold mb-2">{label}</Text>}
      <TextInput
        className={`bg-bgMuted text-text px-4 py-3 rounded-xl ${error ? 'border border-danger' : ''}`}
        placeholderTextColor="#94a3b8"
        {...props}
      />
      {error && <Text className="text-danger text-sm mt-1">{error}</Text>}
    </View>
  );
}

