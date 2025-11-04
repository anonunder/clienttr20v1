import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { darkTheme } from '@/styles/theme';

export interface LabelProps {
  children: React.ReactNode;
  className?: string;
  htmlFor?: string; // For compatibility, but not used in RN
}

export function Label({ children, className = '' }: LabelProps) {
  return (
    <Text style={styles.label}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 14,
    color: darkTheme.color.foreground,
  },
});

