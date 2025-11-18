import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/Label';
import { Ionicons } from '@expo/vector-icons';
import { darkTheme } from '@/styles/theme';
import { layoutStyles } from '@/styles/shared-styles';

interface StarsQuestionProps {
  text: string;
  value: string;
  options: string[];
  required?: boolean;
  onSelect: (value: string) => void;
}

/**
 * StarsQuestion Component
 * 
 * Renders a star rating input for report questions.
 */
export const StarsQuestion: React.FC<StarsQuestionProps> = ({
  text,
  value,
  options,
  required = false,
  onSelect,
}) => {
  const currentRating = parseInt(value) || 0;

  return (
    <View style={styles.fieldGroup}>
      <Label>
        {text}
        {required && <Text style={styles.requiredMark}> *</Text>}
      </Label>
      <View style={styles.starsContainer}>
        {options.map((star, index) => {
          const starValue = parseInt(star);
          const isFilled = currentRating >= starValue;
          
          return (
            <Button
              key={index}
              variant="ghost"
              size="icon"
              onPress={() => onSelect(star)}
            >
              <Ionicons
                name={isFilled ? 'star' : 'star-outline'}
                size={32}
                color={isFilled ? darkTheme.color.warning : darkTheme.color.mutedForeground}
              />
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
  starsContainer: {
    ...layoutStyles.rowCenterGap4,
  },
});

