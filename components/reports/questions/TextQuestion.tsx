import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Text } from 'react-native';
import { darkTheme } from '@/styles/theme';

interface TextQuestionProps {
  text: string;
  value: string;
  required?: boolean;
  type?: 'text' | 'number';
  onChangeText: (value: string) => void;
}

/**
 * TextQuestion Component
 * 
 * Renders a text or number input field for report questions.
 */
export const TextQuestion: React.FC<TextQuestionProps> = ({
  text,
  value,
  required = false,
  type = 'text',
  onChangeText,
}) => {
  return (
    <View style={styles.fieldGroup}>
      <Label>
        {text}
        {required && <Text style={styles.requiredMark}> *</Text>}
      </Label>
      <Input
        keyboardType={type === 'number' ? 'numeric' : 'default'}
        placeholder={`Enter ${text.toLowerCase()}`}
        value={value}
        onChangeText={onChangeText}
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

