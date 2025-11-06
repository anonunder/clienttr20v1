import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Dimensions, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/programs/[programId]/PageHeader';
import { HorizontalDaySelector } from '@/components/training/HorizontalDaySelector';
import { ProgressCard } from '@/components/training/ProgressCard';
import { WorkoutCard } from '@/components/training/WorkoutCard';
import { Loading } from '@/components/common/Loading';
import { useTrainingPlan } from '@/hooks/programs/use-training-plan';
import { darkTheme } from '@/styles/theme';
import { textStyles } from '@/styles/shared-styles';
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
  
  // Initialize selected date to program start date or today
  const [selectedDate, setSelectedDate] = useState(() => {
    // Initial state - will be updated when program data loads
    return new Date();
  });
  
  // Loading state for day change
  const [isDayLoading, setIsDayLoading] = useState(false);
  
  // Update selected date when program data loads (only once)
  useEffect(() => {
    if (trainingPlan?.program?.startDate) {
      const programStartDate = new Date(trainingPlan.program.startDate);
      setSelectedDate(programStartDate);
    }
  }, [trainingPlan?.program?.startDate]);

  // Handle date change with loading state
  const handleDateChange = (date: Date) => {
    setIsDayLoading(true);
    setSelectedDate(date);
    // Simulate loading time (you can adjust or remove this based on actual data fetching)
    setTimeout(() => {
      setIsDayLoading(false);
    }, 300);
  };

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

  // Calculate day number based on program start date (1-based)
  const calculateDayNumber = useMemo(() => {
    if (!trainingPlan?.program?.startDate) return null;
    
    const startDate = new Date(trainingPlan.program.startDate);
    startDate.setHours(0, 0, 0, 0);
    const selected = new Date(selectedDate);
    selected.setHours(0, 0, 0, 0);
    
    const diffTime = selected.getTime() - startDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays + 1; // 1-based day number
  }, [trainingPlan?.program?.startDate, selectedDate]);

  // Get workouts for selected day (day number from program start date)
  const selectedDayWorkouts = useMemo(() => {
    if (!trainingPlan?.trainingPlanDays) return [];
    
    const dayNumber = calculateDayNumber;
    if (!dayNumber || dayNumber < 1) return [];
    
    // Find the training plan day that matches
    const matchingDay = trainingPlan.trainingPlanDays.find(
      day => day.dayNumber === dayNumber
    );
    
    if (!matchingDay) {
      // If no exact match, find the closest day
      const sortedDays = [...trainingPlan.trainingPlanDays].sort((a, b) => a.dayNumber - b.dayNumber);
      const closestDay = sortedDays.find(day => day.dayNumber >= dayNumber) || sortedDays[sortedDays.length - 1];
      return closestDay?.trainingPlanDayWorkouts || [];
    }
    
    return matchingDay.trainingPlanDayWorkouts || [];
  }, [trainingPlan, calculateDayNumber]);

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

  // Check if there are incomplete workouts
  const hasIncompleteWorkouts = selectedDayWorkouts.some((w: TrainingPlanWorkout) => {
    const completedMeta = w.meta?.find(m => 
      m.meta_key?.includes('completed') || m.meta_key?.includes('started')
    );
    return !completedMeta;
  });

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
      marginBottom: 0,
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

  // Handle start workout
  const handleStartWorkout = () => {
    // Find first incomplete workout
    const incompleteWorkout = selectedDayWorkouts.find((w: TrainingPlanWorkout) => {
      const completedMeta = w.meta?.find(m => 
        m.meta_key?.includes('completed') || m.meta_key?.includes('started')
      );
      return !completedMeta;
    });
    
    if (incompleteWorkout && incompleteWorkout.workoutExercises && incompleteWorkout.workoutExercises.length > 0) {
      // Get first exercise from this workout
      const firstExercise = incompleteWorkout.workoutExercises[0];
      
      if (firstExercise && firstExercise.term_taxonomy_id) {
        // Navigate to exercise page with correct term_taxonomy_id and pass workout ID
        router.push(
          `/programs/training/${id}/workout/${incompleteWorkout.id}/exercise/${firstExercise.term_taxonomy_id}`
        );
      } else {
        // Fallback to workout press if no exercises
        handleWorkoutPress(incompleteWorkout.id);
      }
    } else {
      Alert.alert('No Exercises', 'This workout has no exercises.');
    }
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
        
        {/* Horizontal Day Selector - Below Header */}
        <HorizontalDaySelector 
          selectedDate={selectedDate} 
          onDateChange={handleDateChange}
          startDate={trainingPlan?.program?.startDate}
          endDate={trainingPlan?.program?.endDate}
        />
      </View>

      {/* Content */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Loading State */}
          {isDayLoading ? (
            <Loading message="Loading workouts..." />
          ) : (
            <>
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
                        workoutExercises={workout.workoutExercises}
                        onPress={() => handleWorkoutPress(workout.id)}
                      />
                    ))
                  )}
                </View>
              </View>
            </>
          )}
        </View>
      </ScrollView>

      {/* Sticky START Workout Button */}
      {!isDayLoading && hasIncompleteWorkouts && selectedDayWorkouts.length > 0 && (
        <View style={styles.stickyButtonContainer}>
          <SafeAreaView edges={['bottom']} style={styles.safeArea}>
            <View style={styles.startButton}>
              <Button
                title="START Workout"
                onPress={handleStartWorkout}
                variant="default"
                size="lg"
              />
            </View>
          </SafeAreaView>
        </View>
      )}
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: darkTheme.color.bg,
  },
  scrollContent: {
    paddingBottom: 140, // Extra padding for sticky button + navigation
  },
  stickyButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: darkTheme.color.bg,
    borderTopWidth: 1,
    borderTopColor: darkTheme.color.border,
    zIndex: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  safeArea: {
    backgroundColor: darkTheme.color.bg,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 0, // SafeAreaView handles bottom padding
  },
  startButton: {
    width: '100%',
    marginBottom: 64, // Account for navigation bar height
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
