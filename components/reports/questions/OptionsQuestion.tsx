import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/Label';
import { darkTheme } from '@/styles/theme';
import { textStyles } from '@/styles/shared-styles';

interface OptionsQuestionProps {
  text: string;
  value: string | string[];
  options: string[];
  required?: boolean;
  multiSelect?: boolean;
  onSelect: (value: string | string[]) => void;
}

/**
 * OptionsQuestion Component
 * 
 * Renders radio buttons (single select) or checkboxes (multi-select) for report questions.
 */
export const OptionsQuestion: React.FC<OptionsQuestionProps> = ({
  text,
  value,
  options,
  required = false,
  multiSelect = false,
  onSelect,
}) => {
  const handleOptionPress = (option: string) => {
    if (multiSelect) {
      const currentValue = (value as string[]) || [];
      const isSelected = currentValue.includes(option);
      const newValue = isSelected
        ? currentValue.filter((v) => v !== option)
        : [...currentValue, option];
      onSelect(newValue);
    } else {
      onSelect(option);
    }
  };

  const isOptionSelected = (option: string): boolean => {
    if (multiSelect) {
      return ((value as string[]) || []).includes(option);
    }
    return value === option;
  };

  return (
    <View style={styles.fieldGroup}>
      <Label>
        {text}
        {required && <Text style={styles.requiredMark}> *</Text>}
      </Label>
      <View style={styles.optionsContainer}>
        {options.map((option, index) => {
          const isSelected = isOptionSelected(option);
          return (
            <Button
              key={index}
              variant={isSelected ? 'default' : 'outline'}
              onPress={() => handleOptionPress(option)}
            >
              <Text style={isSelected ? styles.optionTextSelected : styles.optionText}>
                {option}
              </Text>
            </Button>
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
    gap: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  optionText: {
    ...textStyles.body,
    color: darkTheme.color.foreground,
  },
  optionTextSelected: {
    ...textStyles.body,
    color: darkTheme.color.primaryForeground,
  },
});

