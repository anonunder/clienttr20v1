import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatsCard } from '@/components/data-display/StatsCard';
import { useResponsive } from '@/hooks/use-responsive';
import { darkTheme } from '@/styles/theme';

interface Stats {
  activePrograms: number;
  completedWorkouts: number;
  totalExercises: number;
  streak: number;
}

interface DashboardStatsProps {
  stats?: Stats;
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  const { isTablet, isDesktop } = useResponsive();
  
  const statsData = [
    { 
      label: 'Active Programs', 
      value: stats?.activePrograms?.toString() || '0', 
      icon: <Ionicons name="barbell" size={32} color={darkTheme.color.warning} />, 
    },
    { 
      label: 'Completed Workouts', 
      value: stats?.completedWorkouts?.toString() || '0', 
      icon: <Ionicons name="checkmark-circle" size={32} color={darkTheme.color.success} />, 
    },
    { 
      label: 'Total Exercises', 
      value: stats?.totalExercises?.toString() || '0', 
      icon: <Ionicons name="fitness" size={32} color={darkTheme.color.info} />, 
    },
    { 
      label: 'Streak', 
      value: `${stats?.streak || 0} days`, 
      icon: <Ionicons name="trending-up" size={32} color={darkTheme.color.primary} />, 
    },
  ];

  // Determine grid layout based on screen size
  const getContainerStyle = () => {
    if (isDesktop) {
      return styles.statsContainerDesktop; // 4 columns
    } else if (isTablet) {
      return styles.statsContainerTablet; // 2 columns
    } else {
      return styles.statsContainerMobile; // 1 column
    }
  };

  const getCardWrapperStyle = () => {
    if (isDesktop) {
      return styles.statCardWrapperDesktop;
    } else if (isTablet) {
      return styles.statCardWrapperTablet;
    } else {
      return styles.statCardWrapperMobile;
    }
  };

  return (
    <View style={[styles.statsContainer, getContainerStyle()]}>
      {statsData.map((stat) => (
        <View 
          key={stat.label} 
          style={getCardWrapperStyle()}
        >
          <StatsCard
            label={stat.label}
            value={stat.value}
            icon={stat.icon}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  statsContainer: {
    // Base styles
  },
  statsContainerMobile: {
    flexDirection: 'column',
    gap: 16,
  },
  statsContainerTablet: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  statsContainerDesktop: {
    flexDirection: 'row',
    gap: 16,
  },
  statCardWrapperMobile: {
    width: '100%',
  },
  statCardWrapperTablet: {
    flexBasis: '48%',
    flexGrow: 0,
    flexShrink: 0,
  },
  statCardWrapperDesktop: {
    flex: 1,
  },
});
