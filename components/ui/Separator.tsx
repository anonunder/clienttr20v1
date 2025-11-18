import React from 'react';
import { View, StyleSheet } from 'react-native';
import { darkTheme } from '@/styles/theme';

export interface SeparatorProps {
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export function Separator({ 
  orientation = 'horizontal',
  className = '',
}: SeparatorProps) {
  return (
    <View style={[
      styles.separator,
      orientation === 'horizontal' ? styles.horizontal : styles.vertical,
    ]} />
  );
}

const styles = StyleSheet.create({
  separator: {
    backgroundColor: darkTheme.color.border,
  },
  horizontal: {
    height: 1,
    width: '100%',
  },
  vertical: {
    width: 1,
    height: '100%',
  },
});

