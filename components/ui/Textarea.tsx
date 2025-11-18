import React from 'react';
import { View, Text, TextInput, TextInputProps, StyleSheet } from 'react-native';
import { darkTheme } from '@/styles/theme';

export interface TextareaProps extends TextInputProps {
  label?: string;
  error?: string;
  containerClassName?: string;
  minHeight?: number;
}

export function Textarea({ 
  label, 
  error, 
  containerClassName = '', 
  minHeight = 100,
  className = '',
  ...props 
}: TextareaProps) {
  return (
    <View>
      {label && (
        <Text style={styles.label}>
          {label}
        </Text>
      )}
      <View style={styles.inputContainer}>
        <TextInput
          style={[
            styles.textarea,
            { minHeight },
            error && styles.textareaError,
          ]}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
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
  textarea: {
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
  textareaError: {
    borderColor: darkTheme.color.destructive,
  },
  errorText: {
    color: darkTheme.color.destructive,
    fontSize: 14,
    marginTop: 4,
  },
});

