import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Label } from '@/components/ui/Label';
import { Ionicons } from '@expo/vector-icons';
import { darkTheme } from '@/styles/theme';
import { textStyles, borderStyles } from '@/styles/shared-styles';

interface CheckboxQuestionProps {
  text: string;
  value: string[];
  options: string[];
  required?: boolean;
  onSelect: (value: string[]) => void;
}

/**
 * CheckboxQuestion Component
 * 
 * Renders checkboxes for multi-select report questions.
 */
export const CheckboxQuestion: React.FC<CheckboxQuestionProps> = ({
  text,
  value,
  options,
  required = false,
  onSelect,
}) => {
  const currentValue = value || [];

  const handleOptionPress = (option: string) => {
    const isSelected = currentValue.includes(option);
    const newValue = isSelected
      ? currentValue.filter((v) => v !== option)
      : [...currentValue, option];
    onSelect(newValue);
  };

  return (
    <View style={styles.fieldGroup}>
      <Label>
        {text}
        {required && <Text style={styles.requiredMark}> *</Text>}
      </Label>
      <View style={styles.optionsContainer}>
        {options.map((option, index) => {
          const isSelected = currentValue.includes(option);
          return (
            <TouchableOpacity
              key={index}
              style={styles.checkboxRow}
              onPress={() => handleOptionPress(option)}
              activeOpacity={0.7}
            >
              <View style={[
                styles.checkbox,
                isSelected && styles.checkboxSelected
              ]}>
                {isSelected && (
                  <Ionicons
                    name="checkmark"
                    size={16}
                    color={darkTheme.color.primaryForeground}
                  />
                )}
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
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: darkTheme.color.border,
    ...borderStyles.rounded4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: darkTheme.color.background,
  },
  checkboxSelected: {
    backgroundColor: darkTheme.color.primary,
    borderColor: darkTheme.color.primary,
  },
  optionText: {
    ...textStyles.body,
    color: darkTheme.color.foreground,
    flex: 1,
  },
});

