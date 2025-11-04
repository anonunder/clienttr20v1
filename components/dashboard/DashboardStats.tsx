import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatsCard } from '@/components/common/StatsCard';
import { darkTheme } from '@/styles/theme';

export function DashboardStats() {
  const windowWidth = Dimensions.get('window').width;
  
  // Responsive breakpoints
  const isTablet = windowWidth >= 640 && windowWidth < 1024; // sm breakpoint
  const isDesktop = windowWidth >= 1024; // lg breakpoint
  
  const stats = [
    { 
      label: 'Calories Burned', 
      value: '2,234', 
      icon: <Ionicons name="flame" size={32} color={darkTheme.color.warning} />, 
    },
    { 
      label: 'Active Days', 
      value: '35', 
      icon: <Ionicons name="pulse" size={32} color={darkTheme.color.success} />, 
    },
    { 
      label: 'Goals Hit', 
      value: '12/15', 
      icon: <Ionicons name="checkmark-circle" size={32} color={darkTheme.color.info} />, 
    },
    { 
      label: 'Streak', 
      value: '7 days', 
      icon: <Ionicons name="trending-up" size={32} color={darkTheme.color.primary} />, 
    },
  ];

  // Determine grid layout based on screen size
  // Mobile: 1 column, Tablet: 2 columns, Desktop: 4 columns
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
      return styles.statCardWrapperDesktop; // flex: 1 (equal width)
    } else if (isTablet) {
      return styles.statCardWrapperTablet; // 2 columns with flexBasis
    } else {
      return styles.statCardWrapperMobile; // 100% width
    }
  };

  return (
    <View style={[styles.statsContainer, getContainerStyle()]}>
      {stats.map((stat) => (
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
    flexDirection: 'column', // 1 column on mobile
    gap: 16, // gap-4 = 16px between stat cards vertically
  },
  statsContainerTablet: {
    flexDirection: 'row', // 2 columns on tablet
    flexWrap: 'wrap', // Allow wrapping to next row
    gap: 16, // gap-4 = 16px between stat cards
  },
  statsContainerDesktop: {
    flexDirection: 'row', // 4 columns on desktop (all in one row)
    gap: 16, // gap-4 = 16px between stat cards horizontally
  },
  statCardWrapperMobile: {
    width: '100%', // Full width on mobile
  },
  statCardWrapperTablet: {
    flexBasis: '48%', // Approximately 50% width accounting for gap
    flexGrow: 0,
    flexShrink: 0,
  },
  statCardWrapperDesktop: {
    flex: 1, // Equal width for all cards on desktop (4 columns)
  },
});
