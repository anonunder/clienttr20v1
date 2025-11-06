import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Dimensions, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/programs/[programId]/PageHeader';
import { HorizontalDaySelector } from '@/components/training/HorizontalDaySelector';
import { ProgressCard } from '@/components/training/ProgressCard';
import { WorkoutCard } from '@/components/training/WorkoutCard';
import { useTrainingPlan } from '@/hooks/programs/use-training-plan';
import { darkTheme } from '@/styles/theme';
import { textStyles, spacingStyles } from '@/styles/shared-styles';
import { env } from '@/config/env';
import { TrainingPlanWorkout } from '@/features/programs/programs-slice';

/**
 * Training Plan Screen
 * Displays training plan details with day selector and workouts
 */
export default function TrainingPlanScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { trainingPlan, loading, error } = useTrainingPlan(id || '');
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Construct image URL from storage path
  const getImageUrl = (imageUri: string | null | undefined): string => {
    if (!imageUri) {
      return 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&q=80';
    }
    
    if (imageUri.startsWith('http')) {
      return imageUri;
    }
    
    const baseUrl = env.apiBaseUrl.replace(/\/api\/?$/, '');
    const imagePath = imageUri.startsWith('/') ? imageUri : `/${imageUri}`;
    
    return `${baseUrl}${imagePath}`;
  };

  // Get duration from meta
  const duration = useMemo(() => {
    if (!trainingPlan?.meta) return null;
    const durationMeta = trainingPlan.meta.find(m => m.meta_key === 'duration');
    return durationMeta?.meta_value || null;
  }, [trainingPlan]);

  // Calculate weeks from duration
  const weeks = useMemo(() => {
    if (!duration) return 0;
    const weeksMatch = duration.match(/\d+/);
    return weeksMatch ? parseInt(weeksMatch[0], 10) : 0;
  }, [duration]);

  // Get workouts for selected day (day number from date)
  const selectedDayWorkouts = useMemo(() => {
    if (!trainingPlan?.trainingPlanDays) return [];
    
    // Get day number from selected date (day of year or relative day)
    // For now, we'll use a simple approach: find workouts for the day number
    // that matches the selected date's day of month
    const dayNumber = selectedDate.getDate();
    
    // Find the training plan day that matches
    const matchingDay = trainingPlan.trainingPlanDays.find(
      day => day.dayNumber === dayNumber || day.dayNumber === 0
    );
    
    if (!matchingDay) {
      // If no exact match, find the closest day
      const sortedDays = [...trainingPlan.trainingPlanDays].sort((a, b) => a.dayNumber - b.dayNumber);
      const closestDay = sortedDays.find(day => day.dayNumber >= dayNumber) || sortedDays[sortedDays.length - 1];
      return closestDay?.trainingPlanDayWorkouts || [];
    }
    
    return matchingDay.trainingPlanDayWorkouts || [];
  }, [trainingPlan, selectedDate]);

  // Calculate stats
  const completedCount = selectedDayWorkouts.filter((w: TrainingPlanWorkout) => {
    // Check if workout is completed by looking at meta
    const completedMeta = w.meta?.find(m => 
      m.meta_key?.includes('completed') || m.meta_key?.includes('started')
    );
    return !!completedMeta;
  }).length;

  const totalExercises = selectedDayWorkouts.reduce((acc: number, workout: TrainingPlanWorkout) => {
    return acc + (workout.workoutExercises?.length || 0);
  }, 0);

  // Get workout image from referencedMedia
  const getWorkoutImage = (workout: TrainingPlanWorkout): string | null => {
    if (workout.referencedMedia && workout.referencedMedia.length > 0) {
      return workout.referencedMedia[0].post_content || null;
    }
    return null;
  };

  // Calculate full-width header container styles
  const headerContainerStyle = useMemo(() => {
    const screenWidth = Dimensions.get('window').width;
    const maxWidth = 1200;
    const padding = 16;
    
    const marginLeft = screenWidth > maxWidth 
      ? -(screenWidth - maxWidth) / 2 - padding
      : -padding;
    const marginRight = screenWidth > maxWidth
      ? -(screenWidth - maxWidth) / 2 - padding
      : -padding;
    
    return {
      width: screenWidth,
      marginTop: -32,
      marginLeft,
      marginRight,
      marginBottom: -24,
    };
  }, []);

  // Handle back navigation
  const handleBack = () => {
    router.back();
  };

  // Handle workout press
  const handleWorkoutPress = (workoutId: number) => {
    // Navigate to workout detail (to be implemented)
    console.log('Navigate to workout:', workoutId);
  };

  // Loading state
  if (loading) {
    return (
      <MainLayout title="Training" hideNavigation={true}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={darkTheme.color.primary} />
          <Text style={styles.loadingText}>Loading training plan...</Text>
        </View>
      </MainLayout>
    );
  }

  // Error state
  if (error || !trainingPlan) {
    return (
      <MainLayout title="Training" hideNavigation={true}>
        <View style={styles.centerContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={darkTheme.color.destructive} />
          <Text style={styles.errorText}>{error || 'Training plan not found'}</Text>
          <Button onPress={handleBack} title="Go Back" />
        </View>
      </MainLayout>
    );
  }

  const imageUrl = getImageUrl(trainingPlan.imageUri);
  const subtitle = weeks > 0 ? `${weeks} weeks program` : undefined;

  return (
    <MainLayout title="" hideNavigation={false}>
      {/* Page Header - Full Width */}
      <View style={headerContainerStyle}>
        <PageHeader
          image={imageUrl}
          title={trainingPlan.post_title || 'Training Plan'}
          subtitle={subtitle}
          onBack={handleBack}
        />
      </View>

      {/* Content */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Horizontal Day Selector */}
          <HorizontalDaySelector 
            selectedDate={selectedDate} 
            onDateChange={setSelectedDate} 
          />

          {/* Progress Card */}
          <ProgressCard
            completedCount={completedCount}
            totalCount={selectedDayWorkouts.length}
            totalExercises={totalExercises}
          />

          {/* Workout List */}
          <View style={styles.workoutSection}>
            <Text style={styles.sectionTitle}>Today's Workouts</Text>
            <View style={styles.workoutList}>
              {selectedDayWorkouts.length === 0 ? (
                <View style={styles.emptyState}>
                  <Ionicons name="fitness-outline" size={48} color={darkTheme.color.mutedForeground} />
                  <Text style={styles.emptyText}>No workouts scheduled for this day</Text>
                </View>
              ) : (
                selectedDayWorkouts.map((workout: TrainingPlanWorkout) => (
                  <WorkoutCard
                    key={workout.id}
                    id={workout.id}
                    title={workout.post_title}
                    image={getWorkoutImage(workout)}
                    exercises={workout.workoutExercises?.length || 0}
                    completed={workout.meta?.some(m => 
                      m.meta_key?.includes('completed') || m.meta_key?.includes('started')
                    )}
                    onPress={() => handleWorkoutPress(workout.id)}
                  />
                ))
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: darkTheme.color.bg,
  },
  scrollContent: {
    paddingBottom: 96, // pb-24 equivalent
  },
  content: {
    padding: 16,
    gap: 24,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 16,
    minHeight: 400,
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
  workoutSection: {
    gap: 12,
  },
  sectionTitle: {
    ...textStyles.h4,
    fontWeight: '600',
  },
  workoutList: {
    gap: 12,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 48,
    gap: 16,
  },
  emptyText: {
    ...textStyles.body,
    color: darkTheme.color.mutedForeground,
    textAlign: 'center',
  },
});
