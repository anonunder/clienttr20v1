import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Label } from '@/components/ui/Label';
import { darkTheme } from '@/styles/theme';
import { textStyles, spacingStyles, borderStyles } from '@/styles/shared-styles';
import type { DetailStatisticField } from '@/features/reports';

interface MeasurementCardProps {
  field: DetailStatisticField;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  readOnly?: boolean;
}

/**
 * Measurement Input Field for Detail Statistics
 * Matches the design from Progress.tsx
 */
export function MeasurementCard({
  field,
  value,
  onChange,
  disabled = false,
  readOnly = false,
}: MeasurementCardProps) {
  const isEditable = !disabled && !readOnly && onChange;

  return (
    <View style={styles.container}>
      <Label style={styles.label}>
        {field.fieldName} {field.unit && `(${field.unit})`}
      </Label>
      {isEditable ? (
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChange}
          placeholder="Optional"
          placeholderTextColor={darkTheme.color.mutedForeground}
          keyboardType={field.type === 'number' ? 'decimal-pad' : 'default'}
          editable={!disabled}
        />
      ) : (
        <View style={styles.displayContainer}>
          <Text style={styles.displayValue}>
            {value || 'Not provided'}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  label: {
    ...textStyles.small,
    fontSize: 14,
    color: darkTheme.color.foreground,
    fontWeight: '400',
  },
  input: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: darkTheme.color.input,
    borderWidth: 1,
    borderColor: darkTheme.color.border,
    ...borderStyles.rounded8,
    ...textStyles.body,
    fontSize: 14,
    color: darkTheme.color.foreground,
  },
  displayContainer: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: `${darkTheme.color.secondary}4D`,
    ...borderStyles.rounded8,
  },
  displayValue: {
    ...textStyles.body,
    fontSize: 14,
    color: darkTheme.color.foreground,
  },
});

