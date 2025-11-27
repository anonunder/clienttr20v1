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
import { DailyProgress } from '@/components/dashboard/DailyProgress';
import { darkTheme } from '@/styles/theme';
import { useDashboardAutoFetch } from '@/hooks/dashboard/use-dashboard';
import { 
  spacingStyles, 
  layoutStyles, 
  textStyles, 
  borderStyles, 
  componentStyles 
} from '@/styles/shared-styles';

/**
 * 📊 Dashboard Screen - REAL API DATA
 * 
 * This screen displays real data from the backend API.
 * Data is fetched from /api/client/dashboard endpoint.
 */
export default function DashboardScreen() {
  // Use dashboard data hook with auto-fetch
  const dashboard = useDashboardAutoFetch(true, false);
  
  // Extract data with default fallbacks for UI
  const stats = dashboard.overallStats ? {
    activePrograms: dashboard.overallStats.programsActive || 0,
    completedWorkouts: dashboard.overallStats.workoutsCompleted || 0,
    totalExercises: dashboard.data?.totalExercises || 0,
    streak: 0, // Not in API yet, using 0 as default
  } : {
    activePrograms: 0,
    completedWorkouts: 0,
    totalExercises: 0,
    streak: 0,
  };

  const continueWorkout = dashboard.continueWorkout ? {
    name: dashboard.continueWorkout.workoutTitle,
    progress: (dashboard.continueWorkout.exercisesCompleted / (dashboard.data?.totalExercises || 1)) * 100,
    lastExercise: dashboard.continueWorkout.currentExerciseId ? `Exercise #${dashboard.continueWorkout.currentExerciseId}` : 'Not started',
    planId: '',
    workoutId: String(dashboard.continueWorkout.workoutId),
    exerciseId: String(dashboard.continueWorkout.currentExerciseId || ''),
  } : null;

  const todayExercises = dashboard.todayWorkouts.map((workout, index) => ({
    id: workout.id ? String(workout.id) : `workout-${index}`,
    name: workout.title,
    sets: 3,
    reps: 10,
    completed: false,
    programId: workout.programId, // Keep programId for navigation
    day: workout.day, // Keep day for navigation
  }));

  // Map today's meals from API data - list them like exercises
  const todayMeals = dashboard.todayMeals.map((meal, index) => ({
    id: meal.id ? String(meal.id) : `meal-${index}`,
    name: meal.title,
    description: meal.description || '',
    day: meal.day,
    programId: meal.programId, // Keep programId for navigation
    programTitle: meal.programTitle,
  }));

  const todayGoals = [
    { 
      name: "Today's Exercise Time", 
      current: dashboard.dailyProgress?.totalDuration || 0, 
      target: 30, 
      unit: "min" 
    },
    { 
      name: "Workouts Completed", 
      current: dashboard.dailyProgress?.workoutsCompleted || 0, 
      target: 1, 
      unit: "workouts" 
    },
    { 
      name: "Exercises Completed", 
      current: dashboard.dailyProgress?.exercisesCompleted || 0, 
      target: 10, 
      unit: "exercises" 
    },
  ];

  // Map measurements with unique keys
  const measurements = dashboard.recentMeasurements.map((m) => {
    const firstKey = Object.keys(m.measurements)[0];
    const value = m.measurements[firstKey];
    return {
      id: `${m.id}-${firstKey}`, // Unique key combining measurement ID and field name
      label: firstKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      value: String(value),
      unit: firstKey.includes('weight') ? 'kg' : firstKey.includes('fat') ? '%' : '',
      change: undefined,
      trend: undefined,
    };
  }).slice(0, 3);

  const recentReports = dashboard.recentReports.map((r, index) => ({
    id: r.id ? String(r.id) : `report-${index}`,
    name: r.title,
    date: new Date(r.sentDate).toLocaleDateString(),
    type: r.status,
  }));

  const [isRefreshing, setIsRefreshing] = React.useState(false);
  
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await dashboard.refresh();
    setIsRefreshing(false);
  };

  // Show loading state on initial load
  if (dashboard.loading && !dashboard.data) {
    return (
      <MainLayout title="Dashboard" description="Loading your fitness data...">
        <View style={styles.centerContainer}>
          <Text style={styles.loadingText}>Loading dashboard...</Text>
        </View>
      </MainLayout>
    );
  }

  // Show error state (but still allow refresh)
  if (dashboard.error && !dashboard.data) {
    return (
      <MainLayout 
        title="Dashboard" 
        description="Unable to load data"
        refreshControl={
          <RefreshControl 
            refreshing={isRefreshing} 
            onRefresh={handleRefresh}
            tintColor={darkTheme.color.primary}
          />
        }
      >
        <View style={styles.centerContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={darkTheme.color.destructive} />
          <Text style={styles.errorText}>{dashboard.error}</Text>
          <Button onPress={handleRefresh} title="Retry" />
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
          onRefresh={handleRefresh}
          tintColor={darkTheme.color.primary}
        />
      }
    >
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

      {/* Today's Exercises */}
      <Card>
        <View style={styles.cardPadding}>
          <SectionHeader
            icon="barbell"
            title="Today's Workouts"
            actionTitle={`${todayExercises.length} Workout${todayExercises.length !== 1 ? 's' : ''}`}
          />
          {todayExercises.length > 0 ? (
            <View style={styles.exercisesList}>
              {todayExercises.map((exercise) => (
                <Pressable
                  key={exercise.id}
                  style={componentStyles.listItem}
                  onPress={() => router.push(`/programs/training/${exercise.programId}?day=${exercise.day}` as any)}
                >
                  <View style={styles.exerciseContent}>
                    <Text style={styles.exerciseName}>{exercise.name}</Text>
                    <Text style={styles.exerciseDay}>Day {exercise.day}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={darkTheme.color.mutedForeground} />
                </Pressable>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="barbell-outline" size={32} color={darkTheme.color.mutedForeground} />
              <Text style={styles.emptyStateText}>No workouts scheduled for today</Text>
            </View>
          )}
        </View>
      </Card>

      {/* Today's Meals - Listed like exercises */}
      {todayMeals.length > 0 && (
        <Card>
          <View style={styles.cardPadding}>
            <SectionHeader
              icon="restaurant"
              title="Today's Meals"
              actionTitle={`${todayMeals.length} Meal${todayMeals.length !== 1 ? 's' : ''}`}
            />
            <View style={styles.mealsList}>
              {todayMeals.map((meal) => (
                <Pressable
                  key={meal.id}
                  style={componentStyles.listItem}
                  onPress={() => router.push(`/programs/nutrition/${meal.programId}?day=${meal.day}` as any)}
                >
                  <View style={styles.mealContent}>
                    <Text style={styles.mealName}>{meal.name}</Text>
                    {meal.description && (
                      <Text style={styles.mealDescription}>{meal.description}</Text>
                    )}
                    <Text style={styles.mealProgram}>
                      From: {meal.programTitle} (Day {meal.day})
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={darkTheme.color.mutedForeground} />
                </Pressable>
              ))}
            </View>
          </View>
        </Card>
      )}

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
                  <View key={measurement.id} style={componentStyles.listItem}>
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
  exercisesList: {
    gap: 12,
  },
  exerciseContent: {
    flex: 1,
    gap: 4,
  },
  exerciseName: {
    ...textStyles.bodyMedium,
  },
  exerciseDay: {
    ...textStyles.smallMuted,
    fontSize: 11,
  },
  mealsList: {
    gap: 12,
  },
  mealContent: {
    flex: 1,
    gap: 4,
  },
  mealName: {
    ...textStyles.bodyMedium,
  },
  mealDescription: {
    ...textStyles.small,
    color: darkTheme.color.mutedForeground,
  },
  mealProgram: {
    ...textStyles.smallMuted,
    fontSize: 11,
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
