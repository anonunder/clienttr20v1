import React from 'react';
import { View, Text, TextInput, TextInputProps, StyleSheet } from 'react-native';
import { darkTheme } from '@/styles/theme';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerClassName?: string;
  icon?: React.ReactNode;
}

export function Input({ 
  label, 
  error, 
  containerClassName = '', 
  icon,
  className = '',
  ...props 
}: InputProps) {
  return (
    <View>
      {label && (
        <Text style={styles.label}>
          {label}
        </Text>
      )}
      <View style={styles.inputContainer}>
        {icon && (
          <View style={styles.iconContainer}>
            {icon}
          </View>
        )}
        <TextInput
          style={[
            styles.input,
            icon && styles.inputWithIcon,
            error && styles.inputError,
          ]}
          placeholderTextColor={darkTheme.color.mutedForeground}
          {...props}
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: darkTheme.color.foreground,
    marginBottom: 8,
  },
  inputContainer: {
    position: 'relative',
  },
  iconContainer: {
    position: 'absolute',
    left: 12,
    top: '50%',
    zIndex: 10,
    transform: [{ translateY: -10 }],
  },
  input: {
    height: 48,
    width: '100%',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: darkTheme.color.border,
    backgroundColor: `${darkTheme.color.secondary}80`, // 50% opacity
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: darkTheme.color.foreground,
  },
  inputWithIcon: {
    paddingLeft: 40,
  },
  inputError: {
    borderColor: darkTheme.color.destructive,
  },
  errorText: {
    color: darkTheme.color.destructive,
    fontSize: 14,
    marginTop: 4,
  },
});
