import React from 'react';
import { View, Text, StyleSheet, Pressable, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Card } from '@/components/ui/Card';
import { Progress } from '@/components/ui/Progress';
import { Button } from '@/components/ui/Button';
import { MainLayout } from '@/components/layout/MainLayout';
import { SectionHeader } from '@/components/data-display/SectionHeader';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { TodayExercises } from '@/components/dashboard/TodayExercises';
import { TodayMeals } from '@/components/dashboard/TodayMeals';
import { DailyProgress } from '@/components/dashboard/DailyProgress';
import { darkTheme } from '@/styles/theme';
import { useResponsive } from '@/hooks/use-responsive';
import { useDashboardData } from '@/hooks/dashboard';
import { 
  spacingStyles, 
  layoutStyles, 
  textStyles, 
  borderStyles, 
  componentStyles 
} from '@/styles/shared-styles';

/**
 * 📊 Dashboard Screen - MOCK DATA ONLY
 * 
 * This screen displays mock data for development.
 * No real API calls are made.
 */
export default function DashboardScreen() {
  const { isTablet } = useResponsive();
  
  // Use dashboard data hook - MOCK DATA ONLY
  const {
    stats,
    todayExercises,
    todayMeals,
    continueWorkout,
    todayGoals,
    measurements,
    recentReports,
    loading,
    isRefreshing,
    isInitializing,
    error,
    socketConnected,
    socketReady,
    initializeDashboard,
    refresh,
  } = useDashboardData();

  // Initialize dashboard data on mount
  React.useEffect(() => {
    initializeDashboard().catch((error) => {
      console.error('Failed to initialize dashboard:', error);
      // Error is already handled in the hook, but component can add custom handling here if needed
    });
  }, [initializeDashboard]);

  // Show loading state on initial load
  if ((loading || isInitializing) && !stats) {
    return (
      <MainLayout title="Dashboard" description="Loading your fitness data...">
        <View style={styles.centerContainer}>
          <Text style={styles.loadingText}>Loading dashboard...</Text>
        </View>
      </MainLayout>
    );
  }

  // Show error state (but still allow refresh)
  if (error && !stats) {
    return (
      <MainLayout 
        title="Dashboard" 
        description="Unable to load data"
        refreshControl={
          <RefreshControl 
            refreshing={isRefreshing} 
            onRefresh={refresh}
            tintColor={darkTheme.color.primary}
          />
        }
      >
        <View style={styles.centerContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={darkTheme.color.destructive} />
          <Text style={styles.errorText}>{error}</Text>
          <Button onPress={refresh} title="Retry" />
        </View>
      </MainLayout>
    );
  }

  return (
    <MainLayout 
      title="Dashboard" 
      description="Manage your fitness journey and track progress"
      refreshControl={
        <RefreshControl 
          refreshing={isRefreshing} 
          onRefresh={refresh}
          tintColor={darkTheme.color.primary}
        />
      }
    >
      {/* Socket Status Indicator */}
      {!socketReady && (
        <View style={styles.offlineBanner}>
          <Ionicons name="cloud-offline-outline" size={16} color={darkTheme.color.warning} />
          <Text style={styles.offlineText}>
            {socketConnected ? 'Connecting to real-time updates...' : 'Real-time updates unavailable'}
          </Text>
        </View>
      )}

      {/* Stats Grid */}
      <DashboardStats stats={stats} />

      {/* Quick Action - Favorites */}
      <Pressable onPress={() => router.push('/(protected)/(tabs)/favorites' as any)}>
        <Card>
          <LinearGradient
            colors={[`${darkTheme.color.destructive}1A`, `${darkTheme.color.destructive}0D`]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientCard}
          >
            <View style={styles.cardPadding}>
              <View style={styles.favoritesCard}>
                <View style={styles.favoritesContent}>
                  <View style={styles.favoritesHeader}>
                    <Ionicons name="heart" size={20} color={darkTheme.color.destructive} />
                    <Text style={styles.favoritesTitle}>Favorites</Text>
                  </View>
                  <Text style={styles.favoritesDescription}>
                    Access your favorite workouts & nutrition plans
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color={darkTheme.color.mutedForeground} />
              </View>
            </View>
          </LinearGradient>
        </Card>
      </Pressable>

      {/* Continue Section - Only show if workout exists */}
      {continueWorkout && (
        <Card>
          <LinearGradient
            colors={[`${darkTheme.color.primary}1A`, `${darkTheme.color.primary}0D`]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientCard}
          >
            <View style={styles.cardPadding}>
              <View style={styles.continueCard}>
                <View style={styles.continueContent}>
                  <View style={styles.continueHeader}>
                    <Ionicons name="play-circle" size={20} color={darkTheme.color.primary} />
                    <Text style={styles.continueTitle}>Continue Workout</Text>
                  </View>
                  <Text style={styles.continueWorkoutName}>{continueWorkout.name}</Text>
                  <Text style={styles.continueLastExercise}>Last: {continueWorkout.lastExercise}</Text>
                  <View style={styles.progressSection}>
                    <View style={styles.progressHeader}>
                      <Text style={styles.progressLabel}>Progress</Text>
                      <Text style={styles.progressValue}>{continueWorkout.progress}%</Text>
                    </View>
                    <Progress value={continueWorkout.progress} />
                  </View>
                </View>
                <Button
                  size="lg"
                  onPress={() => console.log('Continue workout - route not implemented')}
                >
                  <Text style={{ color: darkTheme.color.primaryForeground, marginRight: 8 }}>Continue</Text>
                  <Ionicons name="chevron-forward" size={16} color={darkTheme.color.primaryForeground} />
                </Button>
              </View>
            </View>
          </LinearGradient>
        </Card>
      )}

      {/* Today's Exercises & Meals Grid */}
      <View style={styles.grid}>
        <TodayExercises 
          exercises={todayExercises.length > 0 ? todayExercises : []} 
        />
        <TodayMeals
          breakfast={todayMeals.breakfast}
          lunch={todayMeals.lunch}
          dinner={todayMeals.dinner}
          totalCalories={todayMeals.totalCalories}
          targetCalories={todayMeals.targetCalories}
        />
      </View>

      {/* Progress Section */}
      <DailyProgress goals={todayGoals} />

      {/* Measurements & Reports Grid */}
      <View style={styles.grid}>
        {/* Measurements Overview */}
        <Card>
          <View style={styles.cardPadding}>
            <SectionHeader
              icon="resize"
              title="Measurements"
              actionTitle="View All"
              onActionPress={() => console.log('View measurements - route not implemented')}
            />
            <View style={styles.measurementsList}>
              {measurements.length > 0 ? (
                measurements.map((measurement) => (
                  <View key={measurement.label} style={componentStyles.listItem}>
                    <View>
                      <Text style={styles.measurementLabel}>{measurement.label}</Text>
                      <Text style={styles.measurementValue}>
                        {measurement.value} <Text style={styles.measurementUnit}>{measurement.unit}</Text>
                      </Text>
                    </View>
                    <View style={[
                      styles.trendBadge,
                      measurement.trend === 'down' ? styles.trendBadgeSuccess : styles.trendBadgeInfo
                    ]}>
                      <Ionicons 
                        name={measurement.trend === 'down' ? 'trending-down' : 'trending-up'} 
                        size={16} 
                        color={measurement.trend === 'down' ? darkTheme.color.success : darkTheme.color.info} 
                      />
                      <Text style={[
                        styles.trendText,
                        measurement.trend === 'down' ? styles.trendTextSuccess : styles.trendTextInfo
                      ]}>
                        {measurement.change}
                      </Text>
                    </View>
                  </View>
                ))
              ) : (
                <View style={styles.emptyState}>
                  <Ionicons name="analytics-outline" size={32} color={darkTheme.color.mutedForeground} />
                  <Text style={styles.emptyStateText}>No measurements yet</Text>
                </View>
              )}
            </View>
          </View>
        </Card>

        {/* Recent Reports */}
        <Card>
          <View style={styles.cardPadding}>
            <SectionHeader
              icon="document-text"
              title="Recent Reports"
              actionTitle="View All"
              onActionPress={() => console.log('View reports - route not implemented')}
            />
            <View style={styles.reportsList}>
              {recentReports.length > 0 ? (
                recentReports.map((report) => (
                  <Pressable
                    key={report.id}
                    style={styles.reportItem}
                    onPress={() => console.log('View report - route not implemented')}
                  >
                    <View style={styles.reportContent}>
                      <Text style={styles.reportName}>{report.name}</Text>
                      <Text style={styles.reportDate}>{report.date}</Text>
                    </View>
                    <View style={styles.reportFooter}>
                      <View style={styles.reportBadge}>
                        <Text style={styles.reportBadgeText}>{report.type}</Text>
                      </View>
                      <Ionicons name="chevron-forward" size={16} color={darkTheme.color.mutedForeground} />
                    </View>
                  </Pressable>
                ))
              ) : (
                <View style={styles.emptyState}>
                  <Ionicons name="document-text-outline" size={32} color={darkTheme.color.mutedForeground} />
                  <Text style={styles.emptyStateText}>No reports yet</Text>
                </View>
              )}
            </View>
          </View>
        </Card>
      </View>

      {/* Daily Goal Card */}
      <Card>
        <LinearGradient
          colors={[darkTheme.color.card, darkTheme.color.secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientCard}
        >
          <View style={styles.cardPadding}>
            <View style={[
              styles.dailyGoalCard,
              isTablet ? styles.dailyGoalCardHorizontal : styles.dailyGoalCardVertical,
            ]}>
              <View style={styles.dailyGoalContent}>
                <Text style={styles.dailyGoalTitle}>Daily Goal</Text>
                <Text style={styles.dailyGoalDescription}>
                  Do 3-5 exercises you haven't done today
                </Text>
              </View>
              <Button
                title="Try a 6-min cardio workout today"
                onPress={() => console.log('Programs - route not implemented')}
              />
            </View>
          </View>
        </LinearGradient>
      </Card>
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 16,
  },
  loadingText: {
    ...textStyles.body,
    color: darkTheme.color.mutedForeground,
  },
  errorText: {
    ...textStyles.body,
    color: darkTheme.color.destructive,
    textAlign: 'center',
    marginTop: 8,
  },
  offlineBanner: {
    ...layoutStyles.rowCenterGap8,
    ...spacingStyles.p12,
    backgroundColor: `${darkTheme.color.warning}1A`,
    ...borderStyles.rounded8,
    marginBottom: 16,
  },
  offlineText: {
    ...textStyles.small,
    color: darkTheme.color.warning,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    ...spacingStyles.py24,
    gap: 8,
  },
  emptyStateText: {
    ...textStyles.small,
    color: darkTheme.color.mutedForeground,
  },
  gradientCard: {
    ...borderStyles.rounded8,
    overflow: 'hidden',
  },
  cardPadding: {
    ...spacingStyles.p24,
  },
  favoritesCard: {
    ...layoutStyles.rowBetween,
  },
  favoritesContent: {
    ...layoutStyles.flex1,
    gap: 8,
  },
  favoritesHeader: {
    ...layoutStyles.rowCenterGap8,
  },
  favoritesTitle: {
    ...textStyles.h4,
  },
  favoritesDescription: {
    ...textStyles.small,
    color: darkTheme.color.mutedForeground,
  },
  continueCard: {
    ...layoutStyles.rowBetween,
  },
  continueContent: {
    ...layoutStyles.flex1,
    gap: 8,
  },
  continueHeader: {
    ...layoutStyles.rowCenterGap8,
  },
  continueTitle: {
    ...textStyles.h4,
  },
  continueWorkoutName: {
    ...textStyles.bodyMedium,
  },
  continueLastExercise: {
    ...textStyles.small,
    color: darkTheme.color.mutedForeground,
  },
  progressSection: {
    gap: 4,
    ...spacingStyles.pt8,
  },
  progressHeader: {
    ...layoutStyles.rowBetween,
  },
  progressLabel: {
    ...textStyles.smallMuted,
  },
  progressValue: {
    ...textStyles.smallMedium,
  },
  grid: {
    gap: 24,
  },
  measurementsList: {
    gap: 16,
  },
  measurementLabel: {
    ...textStyles.smallMuted,
    ...spacingStyles.mb4,
  },
  measurementValue: {
    ...textStyles.valueLarge,
  },
  measurementUnit: {
    fontSize: 14,
    fontWeight: '400',
  },
  trendBadge: {
    ...layoutStyles.rowCenterGap4,
    ...componentStyles.badge,
  },
  trendBadgeSuccess: {
    ...componentStyles.badgeSuccess,
  },
  trendBadgeInfo: {
    ...componentStyles.badgeInfo,
  },
  trendText: {
    ...textStyles.smallMedium,
  },
  trendTextSuccess: {
    color: darkTheme.color.success,
  },
  trendTextInfo: {
    color: darkTheme.color.info,
  },
  reportsList: {
    gap: 8,
  },
  reportItem: {
    ...componentStyles.listItem,
  },
  reportContent: {
    ...layoutStyles.flex1,
  },
  reportName: {
    ...textStyles.smallMedium,
    ...spacingStyles.mb4,
  },
  reportDate: {
    ...textStyles.smallMuted,
  },
  reportFooter: {
    ...layoutStyles.rowCenterGap8,
  },
  reportBadge: {
    ...componentStyles.badge,
    ...componentStyles.badgePrimary,
  },
  reportBadgeText: {
    fontSize: 12,
    color: darkTheme.color.primary,
  },
  dailyGoalCard: {
    gap: 16,
  },
  dailyGoalCardVertical: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  dailyGoalCardHorizontal: {
    ...layoutStyles.rowBetween,
  },
  dailyGoalContent: {
    ...layoutStyles.flex1,
    gap: 8,
  },
  dailyGoalTitle: {
    ...textStyles.h3,
  },
  dailyGoalDescription: {
    ...textStyles.small,
    color: darkTheme.color.mutedForeground,
  },
});
