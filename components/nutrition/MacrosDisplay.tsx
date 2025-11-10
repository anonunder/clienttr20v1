import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { darkTheme } from '@/styles/theme';

interface MacrosDisplayProps {
  protein: number;
  carbs: number;
  fat: number;
  size?: 'sm' | 'md' | 'lg';
}

export function MacrosDisplay({ protein, carbs, fat, size = 'md' }: MacrosDisplayProps) {
  const textSize = {
    sm: styles.valueSm,
    md: styles.valueMd,
    lg: styles.valueLg,
  };

  const labelSize = {
    sm: styles.labelSm,
    md: styles.labelMd,
    lg: styles.labelLg,
  };

  return (
    <View style={styles.container}>
      <View style={styles.item}>
        <Text style={[textSize[size], styles.proteinColor]}>{protein}g</Text>
        <Text style={[labelSize[size], styles.labelText]}>Protein</Text>
      </View>
      
      <View style={styles.item}>
        <Text style={[textSize[size], styles.carbsColor]}>{carbs}g</Text>
        <Text style={[labelSize[size], styles.labelText]}>Carbs</Text>
      </View>
      
      <View style={styles.item}>
        <Text style={[textSize[size], styles.fatColor]}>{fat}g</Text>
        <Text style={[labelSize[size], styles.labelText]}>Fat</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
  },
  item: {
    alignItems: 'center',
    gap: 4,
  },
  valueSm: {
    fontSize: 12,
    fontWeight: '700',
  },
  valueMd: {
    fontSize: 14,
    fontWeight: '700',
  },
  valueLg: {
    fontSize: 24,
    fontWeight: '700',
  },
  labelSm: {
    fontSize: 10,
  },
  labelMd: {
    fontSize: 12,
  },
  labelLg: {
    fontSize: 14,
  },
  labelText: {
    color: darkTheme.color.mutedForeground,
  },
  proteinColor: {
    color: darkTheme.color.primary,
  },
  carbsColor: {
    color: darkTheme.color.info,
  },
  fatColor: {
    color: darkTheme.color.warning,
  },
});

