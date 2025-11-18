import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Textarea } from '@/components/ui/Textarea';
import { Label } from '@/components/ui/Label';
import { Text } from 'react-native';
import { darkTheme } from '@/styles/theme';

interface TextareaQuestionProps {
  text: string;
  value: string;
  required?: boolean;
  onChangeText: (value: string) => void;
  minHeight?: number;
}

/**
 * TextareaQuestion Component
 * 
 * Renders a multi-line textarea input for report questions.
 */
export const TextareaQuestion: React.FC<TextareaQuestionProps> = ({
  text,
  value,
  required = false,
  onChangeText,
  minHeight = 100,
}) => {
  return (
    <View style={styles.fieldGroup}>
      <Label>
        {text}
        {required && <Text style={styles.requiredMark}> *</Text>}
      </Label>
      <Textarea
        placeholder={`Enter ${text.toLowerCase()}`}
        value={value}
        onChangeText={onChangeText}
        minHeight={minHeight}
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

