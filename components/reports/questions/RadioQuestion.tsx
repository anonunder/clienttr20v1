import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Label } from '@/components/ui/Label';
import { darkTheme } from '@/styles/theme';
import { textStyles } from '@/styles/shared-styles';

interface RadioQuestionProps {
  text: string;
  value: string;
  options: string[];
  required?: boolean;
  onSelect: (value: string) => void;
}

/**
 * RadioQuestion Component
 * 
 * Renders radio buttons for single-select report questions.
 */
export const RadioQuestion: React.FC<RadioQuestionProps> = ({
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
      <View style={styles.optionsContainer}>
        {options.map((option, index) => {
          const isSelected = value === option;
          return (
            <TouchableOpacity
              key={index}
              style={styles.radioRow}
              onPress={() => onSelect(option)}
              activeOpacity={0.7}
            >
              <View style={styles.radioOuter}>
                {isSelected && <View style={styles.radioInner} />}
              </View>
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
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
  optionsContainer: {
    gap: 12,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: darkTheme.color.border,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: darkTheme.color.bg,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: darkTheme.color.primary,
  },
  optionText: {
    ...textStyles.body,
    color: darkTheme.color.foreground,
    flex: 1,
  },
});

