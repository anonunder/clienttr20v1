import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Select } from '@/components/ui/Select';
import { Label } from '@/components/ui/Label';
import { darkTheme } from '@/styles/theme';

interface SelectQuestionProps {
  text: string;
  value: string;
  options: string[];
  required?: boolean;
  onSelect: (value: string) => void;
}

/**
 * SelectQuestion Component
 * 
 * Renders a dropdown select input for report questions.
 */
export const SelectQuestion: React.FC<SelectQuestionProps> = ({
  text,
  value,
  options,
  required = false,
  onSelect,
}) => {
  return (
    <View style={styles.fieldGroup}>
      <Label>
        {text}
        {required && <Text style={styles.requiredMark}> *</Text>}
      </Label>
      <Select
        value={value}
        onValueChange={onSelect}
        placeholder={`Select ${text.toLowerCase()}`}
        options={options}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  fieldGroup: {
    gap: 8,
  },
  requiredMark: {
    color: darkTheme.color.destructive,
  },
});

