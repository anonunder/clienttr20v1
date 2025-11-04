import React from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Card } from '@/components/common/Card';
import { Progress } from '@/components/common/Progress';
import { Button } from '@/components/common/Button';
import { MainLayout } from '@/components/common/MainLayout';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { TodayExercises } from '@/components/dashboard/TodayExercises';
import { TodayMeals } from '@/components/dashboard/TodayMeals';
import { DailyProgress } from '@/components/dashboard/DailyProgress';
import { darkTheme } from '@/styles/theme';

export default function DashboardScreen() {
  const windowWidth = Dimensions.get('window').width;
  const isTablet = windowWidth >= 640; // sm breakpoint
  
  const todayGoals = [
    { name: "Today's Exercise Time", current: 22, target: 30, unit: "min" },
    { name: "Daily Steps", current: 5832, target: 10000, unit: "steps" },
    { name: "Completed Goals", current: 3, target: 5, unit: "goals" },
  ];

  const continueWorkout = {
    name: "Upper Body Strength",
    progress: 60,
    lastExercise: "Dumbbell Shoulder Press",
    planId: "1",
    workoutId: "1",
    exerciseId: "2"
  };

  const todaysExercises = [
    { id: "1", name: "Dumbbell Shoulder Press", sets: 3, reps: 12, completed: true },
    { id: "2", name: "Barbell Squats", sets: 4, reps: 10, completed: false },
    { id: "3", name: "Bench Press", sets: 3, reps: 8, completed: false },
  ];

  const todaysMeal = {
    breakfast: { name: "Breakfast", description: "Oatmeal with Berries", calories: 350 },
    lunch: { name: "Lunch", description: "Grilled Chicken Salad", calories: 450 },
    dinner: { name: "Dinner", description: "Not logged yet", calories: 0 },
    totalCalories: 800,
    targetCalories: 2100
  };

  const recentReports = [
    { id: "1", name: "Weekly Progress", date: "2025-10-20", type: "Progress" },
    { id: "2", name: "Body Composition", date: "2025-10-15", type: "Measurements" },
    { id: "3", name: "Nutrition Summary", date: "2025-10-12", type: "Nutrition" },
  ];

  const measurements = [
    { label: "Weight", value: "75.2", unit: "kg", change: "-0.5", trend: "down" },
    { label: "Body Fat", value: "18.5", unit: "%", change: "-1.2", trend: "down" },
    { label: "Muscle Mass", value: "61.3", unit: "kg", change: "+0.8", trend: "up" },
  ];

  return (
    <MainLayout title="Dashboard" description="Manage your fitness journey and track progress">
      {/* Stats Grid */}
      <DashboardStats />

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

      {/* Continue Section */}
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
                onPress={() => router.push(`/programs/training/${continueWorkout.planId}/workout/${continueWorkout.workoutId}` as any)}
              >
                <Text style={{ color: darkTheme.color.primaryForeground, marginRight: 8 }}>Continue</Text>
                <Ionicons name="chevron-forward" size={16} color={darkTheme.color.primaryForeground} />
              </Button>
            </View>
          </View>
        </LinearGradient>
      </Card>

      {/* Today's Exercises & Meals Grid */}
      <View style={styles.grid}>
        <TodayExercises exercises={todaysExercises} />
        <TodayMeals
          breakfast={todaysMeal.breakfast}
          lunch={todaysMeal.lunch}
          dinner={todaysMeal.dinner}
          totalCalories={todaysMeal.totalCalories}
          targetCalories={todaysMeal.targetCalories}
        />
      </View>

      {/* Progress Section */}
      <DailyProgress goals={todayGoals} />

      {/* Measurements & Reports Grid */}
      <View style={styles.grid}>
        {/* Measurements Overview */}
        <Card>
          <View style={styles.cardPadding}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionHeaderLeft}>
                <Ionicons name="resize" size={20} color={darkTheme.color.primary} />
                <Text style={styles.sectionTitle}>Measurements</Text>
              </View>
              <Button
                variant="ghost"
                size="sm"
                title="View All"
                onPress={() => router.push('/progress')}
              />
            </View>
            <View style={styles.measurementsList}>
              {measurements.map((measurement) => (
                <View key={measurement.label} style={styles.measurementItem}>
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
              ))}
            </View>
          </View>
        </Card>

        {/* Recent Reports */}
        <Card>
          <View style={styles.cardPadding}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionHeaderLeft}>
                <Ionicons name="document-text" size={20} color={darkTheme.color.primary} />
                <Text style={styles.sectionTitle}>Recent Reports</Text>
              </View>
              <Button
                variant="ghost"
                size="sm"
                title="View All"
                onPress={() => router.push('/progress')}
              />
            </View>
            <View style={styles.reportsList}>
              {recentReports.map((report) => (
                <Pressable
                  key={report.id}
                  style={styles.reportItem}
                  onPress={() => router.push('/progress')}
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
              ))}
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
                onPress={() => router.push('/(protected)/(tabs)/programs' as any)}
              />
            </View>
          </View>
        </LinearGradient>
      </Card>
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  gradientCard: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  cardPadding: {
    padding: 24, // p-6
  },
  favoritesCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  favoritesContent: {
    flex: 1,
    gap: 8,
  },
  favoritesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  favoritesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: darkTheme.color.foreground,
  },
  favoritesDescription: {
    fontSize: 14,
    color: darkTheme.color.mutedForeground,
  },
  continueCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  continueContent: {
    flex: 1,
    gap: 8,
  },
  continueHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  continueTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: darkTheme.color.foreground,
  },
  continueWorkoutName: {
    fontSize: 16,
    fontWeight: '500',
    color: darkTheme.color.foreground,
  },
  continueLastExercise: {
    fontSize: 14,
    color: darkTheme.color.mutedForeground,
  },
  progressSection: {
    gap: 4,
    paddingTop: 8,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressLabel: {
    fontSize: 14,
    color: darkTheme.color.mutedForeground,
  },
  progressValue: {
    fontSize: 14,
    fontWeight: '500',
    color: darkTheme.color.foreground,
  },
  grid: {
    gap: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: darkTheme.color.foreground,
  },
  measurementsList: {
    gap: 16,
  },
  measurementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
    backgroundColor: `${darkTheme.color.secondary}4D`, // 30% opacity
  },
  measurementLabel: {
    fontSize: 14,
    color: darkTheme.color.mutedForeground,
    marginBottom: 4,
  },
  measurementValue: {
    fontSize: 20,
    fontWeight: '700',
    color: darkTheme.color.foreground,
  },
  measurementUnit: {
    fontSize: 14,
    fontWeight: '400',
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  trendBadgeSuccess: {
    backgroundColor: `${darkTheme.color.success}33`, // 20% opacity
  },
  trendBadgeInfo: {
    backgroundColor: `${darkTheme.color.info}33`, // 20% opacity
  },
  trendText: {
    fontSize: 14,
    fontWeight: '500',
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
    backgroundColor: `${darkTheme.color.secondary}4D`, // 30% opacity
  },
  reportContent: {
    flex: 1,
  },
  reportName: {
    fontSize: 14,
    fontWeight: '500',
    color: darkTheme.color.foreground,
    marginBottom: 4,
  },
  reportDate: {
    fontSize: 14,
    color: darkTheme.color.mutedForeground,
  },
  reportFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  reportBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: `${darkTheme.color.primary}33`, // 20% opacity
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dailyGoalContent: {
    flex: 1,
    gap: 8,
  },
  dailyGoalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: darkTheme.color.foreground,
  },
  dailyGoalDescription: {
    fontSize: 14,
    color: darkTheme.color.mutedForeground,
  },
});
