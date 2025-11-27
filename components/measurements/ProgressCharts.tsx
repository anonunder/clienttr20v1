import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card } from '@/components/ui/Card';
import { Measurement } from '@/types/measurements';
import { darkTheme } from '@/styles/theme';
import { spacingStyles, textStyles } from '@/styles/shared-styles';
import { useResponsive } from '@/hooks/use-responsive';

interface ProgressChartsProps {
  measurements: Measurement[];
}

export function ProgressCharts({ measurements }: ProgressChartsProps) {
  // Responsive grid
  const { isTablet, isDesktop } = useResponsive();
  const getGridColumns = () => {
    if (isDesktop) return 4;
    if (isTablet) return 2;
    return 1;
  };
  // Group measurements by category
  const bodyComposition = measurements.filter(m => 
    ['Weight', 'Body Fat', 'Muscle Mass', 'BMI', 'Body Water', 'Bone Mass', 'Visceral Fat', 'Metabolic Age', 'Protein', 'BMR'].includes(m.name)
  );
  
  const upperBody = measurements.filter(m => 
    ['Neck', 'Shoulders', 'Chest', 'Biceps (L)', 'Biceps (R)', 'Forearms (L)', 'Forearms (R)', 'Wrist'].includes(m.name)
  );
  
  const core = measurements.filter(m => 
    ['Waist', 'Hips', 'Abdomen'].includes(m.name)
  );
  
  const lowerBody = measurements.filter(m => 
    ['Thighs (L)', 'Thighs (R)', 'Calves (L)', 'Calves (R)', 'Ankle'].includes(m.name)
  );

  const renderMiniChart = (measurement: Measurement) => {
    if (!measurement.history || measurement.history.length === 0) {
      return (
        <View style={styles.emptyChart}>
          <Text style={styles.emptyChartText}>No data</Text>
        </View>
      );
    }

    const values = measurement.history.map(h => h.value);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const range = maxValue - minValue || 1;

    return (
      <View style={styles.miniChart}>
        <View style={styles.chartArea}>
          {measurement.history.map((point, idx) => {
            const height = ((point.value - minValue) / range) * 50 + 10;
            const left = (idx / (measurement.history!.length - 1)) * 100;
            
            return (
              <View
                key={idx}
                style={[
                  styles.chartPoint,
                  {
                    left: `${left}%`,
                    bottom: height,
                  },
                ]}
              />
            );
          })}
          {measurement.history.length > 1 && (
            <View style={styles.chartLine} />
          )}
        </View>
      </View>
    );
  };

  const renderCategory = (title: string, categoryMeasurements: Measurement[]) => {
    if (categoryMeasurements.length === 0) return null;

    return (
      <View key={title} style={styles.category}>
        <View style={styles.categoryHeader}>
          <View style={styles.categoryIndicator} />
          <Text style={styles.categoryTitle}>{title}</Text>
        </View>
        <View style={[
          styles.categoryGrid,
          getGridColumns() === 4 && styles.gridDesktop,
          getGridColumns() === 2 && styles.gridTablet,
          getGridColumns() === 1 && styles.gridMobile,
        ]}>
          {categoryMeasurements.map((m) => (
            <View
              key={m.id}
              style={[
                styles.chartItem,
                getGridColumns() === 4 && styles.chartItemDesktop,
                getGridColumns() === 2 && styles.chartItemTablet,
                getGridColumns() === 1 && styles.chartItemMobile,
              ]}
            >
              <Card style={styles.chartCard}>
                <View style={styles.chartCardContent}>
                  <Text style={styles.chartName}>{m.name}</Text>
                  <Text style={styles.chartValue}>
                    {m.value}
                    <Text style={styles.chartUnit}> {m.unit}</Text>
                  </Text>
                  {m.change !== undefined && (
                    <Text style={[
                      styles.chartChange,
                      { color: m.change > 0 ? darkTheme.color.success : darkTheme.color.destructive }
                    ]}>
                      {m.change > 0 ? '+' : ''}{m.change} {m.unit}
                    </Text>
                  )}
                  {renderMiniChart(m)}
                  {m.goal && (
                    <Text style={styles.chartGoal}>
                      Goal: {m.goal}{m.unit}
                    </Text>
                  )}
                </View>
              </Card>
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Progress Analytics</Text>
        <Text style={styles.description}>Visual representation of your measurement trends</Text>
      </View>

      {renderCategory('Body Composition', bodyComposition)}
      {renderCategory('Upper Body', upperBody)}
      {renderCategory('Core & Waist', core)}
      {renderCategory('Lower Body', lowerBody)}

      {measurements.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No measurements to display</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    ...spacingStyles.mb24,
    gap: 8,
  },
  title: {
    ...textStyles.h2,
    color: darkTheme.color.foreground,
  },
  description: {
    ...textStyles.body,
    color: darkTheme.color.mutedForeground,
  },
  category: {
    ...spacingStyles.mb32,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    ...spacingStyles.mb16,
  },
  categoryIndicator: {
    width: 32,
    height: 4,
    backgroundColor: darkTheme.color.primary,
    borderRadius: 2,
  },
  categoryTitle: {
    ...textStyles.h3,
    color: darkTheme.color.foreground,
  },
  categoryGrid: {
    gap: 16,
  },
  gridMobile: {
    flexDirection: 'column',
  },
  gridTablet: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  gridDesktop: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chartItem: {
    gap: 16,
  },
  chartItemMobile: {
    width: '100%',
  },
  chartItemTablet: {
    flexBasis: '48%',
    flexGrow: 0,
    flexShrink: 0,
  },
  chartItemDesktop: {
    flexBasis: '23%',
    flexGrow: 0,
    flexShrink: 0,
  },
  chartCard: {
    marginBottom: 0,
  },
  chartCardContent: {
    ...spacingStyles.p16,
    gap: 8,
  },
  chartName: {
    ...textStyles.bodyMedium,
    color: darkTheme.color.mutedForeground,
  },
  chartValue: {
    fontSize: 24,
    fontWeight: '700',
    color: darkTheme.color.foreground,
  },
  chartUnit: {
    fontSize: 14,
    fontWeight: '400',
    color: darkTheme.color.mutedForeground,
  },
  chartChange: {
    ...textStyles.smallMedium,
  },
  miniChart: {
    height: 60,
    marginVertical: 8,
  },
  chartArea: {
    position: 'relative',
    height: '100%',
    backgroundColor: `${darkTheme.color.secondary}40`,
    borderRadius: 8,
  },
  chartPoint: {
    position: 'absolute',
    width: 6,
    height: 6,
    backgroundColor: darkTheme.color.primary,
    borderRadius: 3,
    transform: [{ translateX: -3 }],
  },
  chartLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: `${darkTheme.color.primary}20`,
  },
  emptyChart: {
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${darkTheme.color.secondary}40`,
    borderRadius: 8,
    marginVertical: 8,
  },
  emptyChartText: {
    ...textStyles.small,
    color: darkTheme.color.mutedForeground,
  },
  chartGoal: {
    ...textStyles.small,
    color: darkTheme.color.primary,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    ...textStyles.body,
    color: darkTheme.color.mutedForeground,
  },
});

