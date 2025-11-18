import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { darkTheme } from '@/styles/theme';
import { textStyles, spacingStyles, borderStyles } from '@/styles/shared-styles';

interface InfoQuestionProps {
  text: string;
}

/**
 * InfoQuestion Component
 * 
 * Displays informational text without requiring user input.
 * Used for displaying instructions or important notes.
 */
export const InfoQuestion: React.FC<InfoQuestionProps> = ({ text }) => {
  return (
    <View style={styles.infoSection}>
      <View style={styles.infoIconContainer}>
        <Ionicons name="information-circle" size={24} color={darkTheme.color.info} />
      </View>
      <View style={styles.infoTextContainer}>
        <Text style={styles.infoText}>{text}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  infoSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    ...spacingStyles.p16,
    backgroundColor: `${darkTheme.color.info}1A`, // 10% opacity
    ...borderStyles.rounded8,
    gap: 12,
    borderLeftWidth: 3,
    borderLeftColor: darkTheme.color.info,
  },
  infoIconContainer: {
    paddingTop: 2,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoText: {
    ...textStyles.body,
    color: darkTheme.color.foreground,
    lineHeight: 22,
  },
});

