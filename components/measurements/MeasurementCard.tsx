import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/ui/Card';
import { Measurement } from '@/types/measurements';
import { darkTheme } from '@/styles/theme';
import { spacingStyles, textStyles } from '@/styles/shared-styles';

interface MeasurementCardProps {
  measurement?: Measurement;
  onClick?: () => void;
}

export function MeasurementCard({ measurement, onClick }: MeasurementCardProps) {
  if (!measurement) {
    return (
      <Card style={styles.card}>
        <View style={styles.cardContent}>
          <Text style={styles.emptyText}>No data</Text>
        </View>
      </Card>
    );
  }

  // Calculate percentage change if we have history with at least 2 entries
  const getPercentageChange = () => {
    if (!measurement.history || measurement.history.length < 2) {
      return null;
    }
    
    const latestValue = measurement.history[0].value;
    const previousValue = measurement.history[1].value;
    
    if (previousValue === 0) return null;
    
    const percentChange = ((latestValue - previousValue) / previousValue) * 100;
    return percentChange;
  };

  const percentChange = getPercentageChange();
  const hasChange = percentChange !== null;

  const getChangeColor = () => {
    if (!hasChange || percentChange === 0) return darkTheme.color.mutedForeground;
    return percentChange > 0 ? darkTheme.color.success : darkTheme.color.destructive;
  };

  const getChangeIcon = () => {
    if (!hasChange || percentChange === 0) return 'remove';
    return percentChange > 0 ? 'trending-up' : 'trending-down';
  };

  const CardWrapper = onClick ? Pressable : View;

  return (
    <CardWrapper onPress={onClick} style={({ pressed }: any) => [
      pressed && onClick && styles.pressed
    ]}>
      <Card style={styles.card}>
        <View style={styles.cardContent}>
          {/* Header with Icon and Name */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Ionicons name="pulse" size={18} color={darkTheme.color.primary} />
              <Text style={styles.name}>{measurement.name}</Text>
            </View>
            {hasChange && (
              <View style={[styles.changeBadge, { backgroundColor: `${getChangeColor()}1A` }]}>
                <Ionicons name={getChangeIcon() as any} size={12} color={getChangeColor()} />
                <Text style={[styles.changeText, { color: getChangeColor() }]}>
                  {percentChange > 0 ? '+' : ''}{percentChange.toFixed(1)}%
                </Text>
              </View>
            )}
          </View>

          {/* Value */}
          <View style={styles.valueContainer}>
            <Text style={styles.value}>
              {measurement.value}
            </Text>
            <Text style={styles.unit}> {measurement.unit}</Text>
          </View>

          {/* Date */}
          <View style={styles.dateContainer}>
            <Ionicons name="time-outline" size={14} color={darkTheme.color.mutedForeground} />
            <Text style={styles.date}>
              {new Date(measurement.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </Text>
          </View>
        </View>
      </Card>
    </CardWrapper>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 0,
    minHeight: 160,
  },
  cardContent: {
    ...spacingStyles.p16,
    gap: 12,
    flex: 1,
    justifyContent: 'space-between',
  },
  pressed: {
    opacity: 0.7,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  name: {
    ...textStyles.bodyMedium,
    color: darkTheme.color.foreground,
    fontWeight: '500',
    flex: 1,
  },
  changeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  changeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  value: {
    fontSize: 40,
    fontWeight: '700',
    color: darkTheme.color.foreground,
    lineHeight: 48,
  },
  unit: {
    fontSize: 18,
    fontWeight: '400',
    color: darkTheme.color.mutedForeground,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  date: {
    ...textStyles.small,
    color: darkTheme.color.mutedForeground,
  },
  emptyText: {
    ...textStyles.body,
    color: darkTheme.color.mutedForeground,
    textAlign: 'center',
  },
});

