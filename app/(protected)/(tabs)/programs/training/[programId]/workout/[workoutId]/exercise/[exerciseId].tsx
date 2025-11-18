import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Platform,
  Alert,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Modal,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Video, ResizeMode, Audio } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector } from 'react-redux';
import { ExerciseVideoPlayer } from '@/components/exercise/ExerciseVideoPlayer';
import { ExerciseTimer, ExerciseTimerHandle } from '@/components/exercise/ExerciseTimer';
import { ExerciseActionButtons } from '@/components/exercise/ExerciseActionButtons';
import { Loading } from '@/components/common/Loading';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { darkTheme } from '@/styles/theme';
import { textStyles } from '@/styles/shared-styles';
import { env } from '@/config/env';
import { useTrainingPlan } from '@/hooks/programs/use-training-plan';
import { ExerciseDetail } from '@/features/exercise/exercise-slice';
import { api } from '@/services/api-client';
import { endpoints } from '@/services/api-client/endpoints';
import { RootState } from '@/state/store';
import { useFavorites } from '@/hooks/favorites/use-favorites';
import { useComments } from '@/hooks/comments/use-comments';
import { useWorkoutSession } from '@/hooks/workout-session/use-workout-session';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

/**
 * Exercise Screen - TikTok-style vertical scrolling
 * Matches design from Exercise.tsx reference 1:1
 */
export default function ExerciseScreen() {
  const router = useRouter();
  const { programId, workoutId, exerciseId } = useLocalSearchParams<{
    programId: string;
    workoutId: string;
    exerciseId: string;
  }>();
  
  const { trainingPlan, loading: trainingPlanLoading } = useTrainingPlan(programId || '');
  const selectedCompanyId = useSelector((state: RootState) => state.auth.selectedCompanyId);
  const companyId = selectedCompanyId ? parseInt(selectedCompanyId, 10) : null;

  // Favorites and Comments hooks
  const { 
    isExerciseFavorited, 
    toggleExercise, 
    exerciseFavoritesLoading,
    fetchExercises: fetchFavoriteExercises
  } = useFavorites();
  const { 
    addExercise: addExerciseComment,
    fetchExercise: fetchExerciseComments,
    getExerciseComments,
    exerciseCommentsLoading
  } = useComments();
  
  // Workout session hook
  const {
    currentSession,
    hasActiveSession,
    startSession,
    updateSession,
    finishSession,
    startExercise,
    finishExercise,
    addExercise: addSessionExercise,
    updateExercise: updateSessionExercise,
  } = useWorkoutSession();

  // UI State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1); // Track current set
  const [isPlaying, setIsPlaying] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [isResting, setIsResting] = useState(false);
  const [timerStartSignal, setTimerStartSignal] = useState(0);
  const [timerPauseSignal, setTimerPauseSignal] = useState(0);
  const [showCommentRating, setShowCommentRating] = useState(false);
  const [showNextExercisePreview, setShowNextExercisePreview] = useState(false);
  const [previewVideoPlaying, setPreviewVideoPlaying] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [hasStarted, setHasStarted] = useState(false); // Track if exercise has been started at least once
  
  const timerRef = useRef<ExerciseTimerHandle | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const previewVideoRef = useRef<Video>(null);
  const isTransitioning = useRef(false);

  // Fetch exercise details for all exercises in this workout
  const [exerciseDetails, setExerciseDetails] = useState<ExerciseDetail[]>([]);
  const [loadingExercises, setLoadingExercises] = useState(true);

  // Fetch favorites on mount to know which exercises are already favorited
  useEffect(() => {
    if (companyId) {
      fetchFavoriteExercises(companyId).catch(console.error);
    }
  }, [companyId]);

  useEffect(() => {
    const fetchAllExercises = async () => {
      if (!programId || !workoutId || !trainingPlan) {
        setLoadingExercises(false);
        return;
      }

      // Get all exercise IDs from the workout
      const exerciseIds: number[] = [];
      if (trainingPlan.trainingPlanDays) {
        for (const day of trainingPlan.trainingPlanDays) {
          for (const workout of day.trainingPlanDayWorkouts) {
            if (workout.id === parseInt(workoutId || '0', 10)) {
              exerciseIds.push(...(workout.workoutExercises?.map(e => e.term_taxonomy_id) || []));
              break;
            }
          }
        }
      }

      console.log('🏋️ Exercise IDs found:', exerciseIds);
      console.log('🏋️ Workout ID:', workoutId);

      if (exerciseIds.length === 0) {
        console.warn('⚠️ No exercise IDs found for workout:', workoutId);
        setLoadingExercises(false);
        return;
      }

      try {
        // Note: loadingExercises is already initialized to true, no need to set again
        
        const promises = exerciseIds.map(async (exId) => {
          try {
            const endpoint = endpoints.programs.exercise(
              parseInt(programId, 10),
              parseInt(workoutId, 10),
              exId,
              companyId || 0
            );
            
            const response = await api<{ success: boolean; data: ExerciseDetail }>(endpoint);
            
            return response.success ? response.data : null;
          } catch (error) {
            console.error('❌ Failed to fetch exercise:', exId, error);
            return null;
          }
        });

        const results = await Promise.all(promises);
        const validExercises = results.filter((ex): ex is ExerciseDetail => ex !== null);
        setExerciseDetails(validExercises);
      } catch (error) {
        console.error('❌ Failed to fetch exercises:', error);
      } finally {
        setLoadingExercises(false);
      }
    };

    fetchAllExercises();
  }, [programId, workoutId, trainingPlan, companyId]);

  const exercises = exerciseDetails;
  const nextExercise = currentIndex < exercises.length - 1 ? exercises[currentIndex + 1] : null;
  const currentExercise = exercises[currentIndex];
  const currentExerciseIsFavorited = currentExercise ? isExerciseFavorited(currentExercise.term_taxonomy_id) : false;

  // Start workout session when first exercise starts
  useEffect(() => {
    const initSession = async () => {
      if (isPlaying && !hasActiveSession && workoutId && companyId) {
        try {
          console.log('🏋️ Starting workout session...');
          await startSession(parseInt(workoutId, 10), companyId);
        } catch (error) {
          console.error('Failed to start workout session:', error);
        }
      }
    };
    initSession();
  }, [isPlaying, hasActiveSession, workoutId, companyId]);

  // Handle favorite toggle
  const handleFavoriteToggle = async () => {
    if (!currentExercise || !companyId || exerciseFavoritesLoading) return;
    
    try {
      await toggleExercise(currentExercise.term_taxonomy_id, companyId);
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      Alert.alert('Error', 'Failed to update favorite');
    }
  };

  // Handle comment submit
  const handleCommentSubmit = async () => {
    if (!currentExercise || !companyId || !commentText.trim() || exerciseCommentsLoading) return;
    
    try {
      await addExerciseComment(currentExercise.term_taxonomy_id, companyId, commentText.trim());
      setCommentText('');
      Alert.alert('Success', 'Comment added!');
      setShowCommentRating(false);
    } catch (error) {
      console.error('Failed to add comment:', error);
      Alert.alert('Error', 'Failed to add comment');
    }
  };

  // Set initial index based on exerciseId
  useEffect(() => {
    if (exerciseId && exercises.length > 0) {
      const idx = exercises.findIndex((ex) => ex.term_taxonomy_id === parseInt(exerciseId, 10));
      if (idx !== -1) {
        setCurrentIndex(idx);
        setCurrentSet(1); // Reset to first set when changing exercise
        setHasStarted(false); // Reset on new exercise
        setIsPlaying(false); // Ensure not playing on load
        setIsResting(false); // Ensure not resting on load
        // Scroll to the exercise
        setTimeout(() => {
          scrollViewRef.current?.scrollTo({ y: idx * SCREEN_HEIGHT, animated: false });
        }, 100);
      }
    }
  }, [exerciseId, exercises.length]);

  // Play notification sound
  const playNotificationSound = async (_type: 'rest' | 'complete') => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('@/utils/notificaitonsound.wav'),
        { shouldPlay: true }
      );
      await sound.playAsync();
      
      // Unload the sound after playing
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync();
        }
      });
    } catch (error) {
      console.log('Audio play error:', error);
    }
  };

  // Construct video URL from storage path
  const getVideoUrl = (path: string | undefined | null): string | undefined => {
    if (!path) return undefined;
    
    if (path.startsWith('http')) {
      return path;
    }
    
    const baseUrl = env.apiBaseUrl.replace(/\/api\/?$/, '');
    const videoPath = path.startsWith('/') ? path : `/${path}`;
    
    return `${baseUrl}${videoPath}`;
  };

  // Parse exercise data from API response
  const parseExerciseData = (exercise: ExerciseDetail) => {
    // Get sets from meta
    const sets = exercise.term?.meta?.sets || [];
    const numSets = sets.length > 0 ? sets.length : 1;
    
    // Get reps from first set's effort value
    let reps = 12;
    if (sets.length > 0 && sets[0]?.effort?.value) {
      reps = parseInt(sets[0].effort.value, 10) || 12;
    }
    
    // Get rest time from first set's rest value (already in seconds)
    let restTime = 15;
    if (sets.length > 0 && sets[0]?.rest) {
      restTime = parseInt(sets[0].rest, 10) || 15;
    }
    
    // Parse duration from description
    let duration = 60;
    const description = exercise.description || '';
    const durationMatch = description.match(/Trajanje:\s*oko\s*(\d+)\s*min/i);
    if (durationMatch) {
      duration = parseInt(durationMatch[1], 10) * 60;
    }
    
    // Get video URL - prefer exercise_thumbnail_media_id over demo_media_id
    const videoUrl = exercise.media?.exercise_thumbnail_media_id?.post_content
      ? getVideoUrl(exercise.media.exercise_thumbnail_media_id.post_content)
      : exercise.media?.demo_media_id?.post_content
        ? getVideoUrl(exercise.media.demo_media_id.post_content)
        : undefined;
    
    // Get exercise name
    const name = exercise.term?.name || 'Exercise';
    
    return {
      name,
      videoUrl,
      duration,
      restTime,
      sets: numSets,
      reps,
      description: exercise.description,
    };
  };

  // Clean HTML from description
  const cleanDescription = (html: string | undefined) => {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
  };

  // Handle set complete
  const handleSetComplete = () => {
    setIsPlaying(false);
    
    // Get current exercise details
    const exercise = exercises[currentIndex];
    if (!exercise) return;
    
    const { sets } = parseExerciseData(exercise);
    
    // Track exercise completion in session
    if (currentSession && currentExercise) {
      finishExercise(currentExercise.term_taxonomy_id);
    }
    
    // Check if this is the last set
    if (currentSet >= sets) {
      // Last set complete - DON'T auto-switch, let user see buttons and choose
      playNotificationSound('complete');
      Alert.alert('Exercise Complete!', 'Great job! Ready for the next exercise?');
      
      // Reset set counter for when they move to next
      setCurrentSet(1);
    } else {
      // Not last set - start rest on current exercise
      setIsResting(true);
      playNotificationSound('rest');
      Alert.alert('Set Complete!', 'Rest time started.');
    }
  };

  // Handle rest complete
  const handleRestComplete = () => {
    setIsResting(false);
    playNotificationSound('rest');
    
    // Get current exercise details
    const exercise = exercises[currentIndex];
    if (!exercise) return;
    
    const { sets } = parseExerciseData(exercise);
    
    // Check if there are more sets
    if (currentSet < sets) {
      // Move to next set
      setCurrentSet(prev => prev + 1);
      Alert.alert('Rest Complete!', `Ready for Set ${currentSet + 1}/${sets}!`);
    } else {
      // All sets complete - this shouldn't happen normally since we handle it in handleSetComplete
      // But keep as fallback
      setCurrentSet(1); // Reset for next exercise
      Alert.alert('Exercise Complete!', 'Ready for next exercise.');
    }
  };

  // Go to next exercise
  const goToNextExercise = () => {
    if (isTransitioning.current) return;

    const nextIndex = currentIndex + 1;
    
    if (nextIndex > exercises.length) return; // Don't go beyond completion screen

    isTransitioning.current = true;
    setIsPlaying(false);
    setIsResting(false);
    setHasStarted(false); // Reset for new exercise
    setCurrentSet(1); // Reset set counter for next exercise

    // Scroll to next exercise
    scrollViewRef.current?.scrollTo({ 
      y: nextIndex * SCREEN_HEIGHT, 
      animated: true 
    });

    setTimeout(() => {
      setCurrentIndex(nextIndex);
      isTransitioning.current = false;
      
      // Update URL
      if (nextIndex < exercises.length) {
        const nextEx = exercises[nextIndex];
        router.replace(
          `/programs/training/${programId}/workout/${workoutId}/exercise/${nextEx.term_taxonomy_id}`
        );
      }
    }, 500);
  };

  // Handle scroll end
  const handleScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (isPlaying || isResting || isTransitioning.current) return;

    const offsetY = event.nativeEvent.contentOffset.y;
    const newIndex = Math.round(offsetY / SCREEN_HEIGHT);

    if (newIndex !== currentIndex && newIndex <= exercises.length) {
      setCurrentIndex(newIndex);
      setCurrentSet(1); // Reset to first set when manually scrolling
      setHasStarted(false); // Reset for new exercise
      setIsPlaying(false); // Ensure not playing
      setIsResting(false); // Ensure not resting
      
      // Update URL if not on completion screen
      if (newIndex < exercises.length) {
        const exercise = exercises[newIndex];
        router.replace(
          `/programs/training/${programId}/workout/${workoutId}/exercise/${exercise.term_taxonomy_id}`
        );
      }
    }
  };

  // Disable scroll when playing or resting
  const scrollEnabled = !isPlaying && !isResting;

  // Handle preview video
  useEffect(() => {
    if (previewVideoPlaying && previewVideoRef.current) {
      previewVideoRef.current.playAsync().catch(console.error);
    } else if (previewVideoRef.current) {
      previewVideoRef.current.pauseAsync().catch(console.error);
    }
  }, [previewVideoPlaying]);

  // Close preview when playing
  useEffect(() => {
    if (isPlaying) {
      setShowNextExercisePreview(false);
      setPreviewVideoPlaying(false);
    }
  }, [isPlaying]);

  // Play completion sound when workout is done
  useEffect(() => {
    if (currentIndex === exercises.length && exercises.length > 0) {
      playNotificationSound('complete');
    }
  }, [currentIndex, exercises.length]);

  // Handle back navigation
  const handleBack = () => {
    router.back();
  };

  // Loading state
  if (trainingPlanLoading || loadingExercises) {
    return (
      <View style={styles.loadingContainer}>
        <Loading message="Loading exercises..." />
      </View>
    );
  }

  // Error state
  if (!trainingPlan || exercises.length === 0) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={64} color={darkTheme.color.destructive} />
        <Text style={styles.errorText}>No exercises found</Text>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const aspectRatio: '9:16' | '16:9' = '9:16';

  return (
    <View style={styles.container}>
      {/* Snap Scroll Container - TikTok Style */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        pagingEnabled
        scrollEnabled={scrollEnabled}
        onMomentumScrollEnd={handleScrollEnd}
        snapToInterval={SCREEN_HEIGHT}
        snapToAlignment="start"
        decelerationRate="fast"
      >
        {/* Render all exercises + completion screen */}
        {[...exercises, null].map((exercise, index) => {
          const isActive = index === currentIndex;
          const isCompletionScreen = exercise === null;

          if (isCompletionScreen) {
            // Calculate total time
            const totalDuration = exercises.reduce((sum, ex) => {
              const { duration } = parseExerciseData(ex);
              return sum + duration;
            }, 0);
            
            const totalTime = exercises.reduce((sum, ex) => {
              const { duration, restTime } = parseExerciseData(ex);
              return sum + duration + restTime;
            }, 0);

            return (
              <View key="completion" style={[styles.snapItem, styles.completionScreen]}>
                <View style={styles.completionContent}>
                  <View style={styles.completionIcon}>
                    <Text style={styles.completionCheckmark}>✓</Text>
                  </View>

                  <View style={styles.completionTextContainer}>
                    <Text style={styles.completionTitle}>Workout Complete!</Text>
                    <Text style={styles.completionSubtitle}>Great job finishing all exercises</Text>
                  </View>

                  <Card>
                    <View style={styles.statsGrid}>
                      <View style={styles.statItem}>
                        <Text style={styles.statLabel}>Active Time</Text>
                        <Text style={styles.statValue}>
                          {Math.floor(totalDuration / 60)}m {totalDuration % 60}s
                        </Text>
                      </View>
                      <View style={styles.statItem}>
                        <Text style={styles.statLabel}>Total Time</Text>
                        <Text style={styles.statValue}>
                          {Math.floor(totalTime / 60)}m {totalTime % 60}s
                        </Text>
                      </View>
                    </View>
                  </Card>

                  <View style={styles.completionButtons}>
                    <Button
                      title="Finish Workout"
                      onPress={() => {
                        Alert.alert('Workout completed! Great job!');
                        router.back();
                      }}
                      variant="default"
                      size="lg"
                    />
                    <Button
                      title="Go Back"
                      onPress={() => router.back()}
                      variant="outline"
                      size="lg"
                    />
                  </View>
                </View>
              </View>
            );
          }

          // Exercise details
          const exerciseData = parseExerciseData(exercise);
          const { name, videoUrl, duration, restTime, sets, reps, description } = exerciseData;
          
          // Use isFavorited from API response (backend already checks this)
          const isThisExerciseFavorited = exercise.isFavorited ?? isExerciseFavorited(exercise.term_taxonomy_id);

          return (
            <View key={exercise.term_taxonomy_id || index} style={styles.snapItem}>
              {/* Header - Show when not playing AND not resting */}
              {!isPlaying && !isResting && (
                <SafeAreaView edges={['top']} style={styles.header}>
                  <TouchableOpacity style={styles.headerButton} onPress={handleBack}>
                    <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
                  </TouchableOpacity>
                </SafeAreaView>
              )}

              {/* Video Container - Full Screen (100% height) */}
              <View style={styles.videoContainerFull}>
                <ExerciseVideoPlayer
                  videoUrl={videoUrl}
                  isPlaying={isActive && isPlaying}
                  onTogglePlay={() => {
                    if (isActive) {
                      if (!isPlaying) {
                        setIsPlaying(true);
                        setHasStarted(true); // Mark as started
                        setTimerStartSignal((s) => s + 1);
                      } else {
                        setIsPlaying(false);
                        setTimerPauseSignal((s) => s + 1);
                      }
                    }
                  }}
                  aspectRatio={aspectRatio}
                />
              </View>

              {/* Timer Overlay - Only when playing or resting */}
              {(isPlaying || isResting) && (
                <View style={styles.timerOverlay}>
                  <ExerciseTimer
                    ref={timerRef}
                    duration={duration}
                    restTime={restTime}
                    startSignal={timerStartSignal}
                    pauseSignal={timerPauseSignal}
                    onComplete={handleSetComplete}
                    onRestComplete={handleRestComplete}
                    onStart={() => setIsPlaying(true)}
                  />
                </View>
              )}

              {/* REST TIME Overlay */}
              {isResting && (
                <View style={styles.restOverlay}>
                  <Text style={styles.restText}>REST TIME</Text>
                </View>
              )}

              {/* Action Buttons - Show when not playing AND not resting */}
              {!isPlaying && !isResting && (
                <View style={styles.actionButtons}>
                  <ExerciseActionButtons
                    onLike={() => {
                      // Use the exercise from this slide
                      if (!companyId || exerciseFavoritesLoading) return;
                      try {
                        toggleExercise(exercise.term_taxonomy_id, companyId);
                      } catch (error) {
                        console.error('Failed to toggle favorite:', error);
                        Alert.alert('Error', 'Failed to update favorite');
                      }
                    }}
                    onShare={() => Alert.alert('Share', 'Share functionality')}
                    onSave={() => {
                      // Use the exercise from this slide
                      if (!companyId || exerciseFavoritesLoading) return;
                      try {
                        toggleExercise(exercise.term_taxonomy_id, companyId);
                      } catch (error) {
                        console.error('Failed to toggle favorite:', error);
                        Alert.alert('Error', 'Failed to update favorite');
                      }
                    }}
                    onComment={() => setShowCommentRating(!showCommentRating)}
                    onInfo={() => setShowInfo(!showInfo)}
                    isLiked={isThisExerciseFavorited}
                    isSaved={isThisExerciseFavorited}
                  />

                  {/* Up Next Exercise Button */}
                  {nextExercise && (
                    <TouchableOpacity 
                      style={styles.nextExerciseButton}
                      onPress={() => setShowNextExercisePreview(true)}
                    >
                      <Ionicons name="chevron-up" size={24} color={darkTheme.color.primaryForeground} />
                    </TouchableOpacity>
                  )}
                </View>
              )}

              {/* Bottom Info Panel - Show when not playing AND not resting */}
              {!isPlaying && !isResting && (
                <View style={styles.bottomPanelContainer} pointerEvents="box-none">
                  {/* Gradient Background */}
                  <LinearGradient
                    colors={
                      showInfo
                        ? ['transparent', 'rgba(0, 0, 0, 0.7)', 'rgba(0, 0, 0, 0.9)']
                        : ['transparent', 'rgba(0, 0, 0, 0.3)', 'rgba(0, 0, 0, 0.6)']
                    }
                    locations={[0, 0.3, 1]}
                    style={styles.gradient}
                    pointerEvents="none"
                  />
                  
                  <SafeAreaView edges={['bottom']} style={styles.bottomPanel}>
                    <View style={styles.bottomContent}>
                      {/* Set Counter - only show if not first time */}
                      {currentSet > 1 && (
                        <View style={styles.setCounter}>
                          <Text style={styles.setCounterText}>
                            NEXT SET {currentSet}/{sets}
                          </Text>
                        </View>
                      )}

                      {/* Exercise Name */}
                      <Text style={styles.exerciseName}>{name}</Text>

                      {/* Description */}
                      <Text style={styles.exerciseDescription} numberOfLines={showInfo ? undefined : 2}>
                        {cleanDescription(description)}
                      </Text>

                      {/* Badges Row */}
                      <View style={styles.badgesRow}>
                        <View style={styles.difficultyBadge}>
                          <Text style={styles.badgeText}>Medium</Text>
                        </View>
                        <View style={styles.statsBadge}>
                          <Text style={styles.badgeText}>{sets} sets × {reps} reps</Text>
                        </View>
                      </View>

                      {/* Expandable Info */}
                      {showInfo && (
                        <ScrollView 
                          style={styles.infoScroll}
                          contentContainerStyle={styles.infoScrollContent}
                          showsVerticalScrollIndicator={false}
                        >
                          <View style={styles.expandedInfo}>
                            <Text style={styles.sectionLabel}>TARGET MUSCLES</Text>
                            <View style={styles.musclesList}>
                              <Text style={styles.muscleItem}>Full Body</Text>
                            </View>

                            <Text style={styles.sectionLabel}>INSTRUCTIONS</Text>
                            {cleanDescription(description).split('.').filter(s => s.trim()).map((instruction, idx) => (
                              <View key={idx} style={styles.instructionItem}>
                                <Text style={styles.instructionNumber}>{idx + 1}.</Text>
                                <Text style={styles.instructionText}>{instruction}</Text>
                              </View>
                            ))}
                          </View>
                        </ScrollView>
                      )}

                      {/* Start Button */}
                      <TouchableOpacity
                        style={styles.startButton}
                        onPress={() => {
                          setIsPlaying(true);
                          setHasStarted(true);
                          setTimerStartSignal((s) => s + 1);
                        }}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.startButtonText}>
                          {hasStarted ? 'CONTINUE' : 'START'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </SafeAreaView>
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>

      {/* Next Exercise Preview Modal */}
      <Modal
        visible={showNextExercisePreview}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          setShowNextExercisePreview(false);
          setPreviewVideoPlaying(false);
        }}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity 
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => {
              setShowNextExercisePreview(false);
              setPreviewVideoPlaying(false);
            }}
          />
          
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Up Next</Text>
                <Text style={styles.modalSubtitle}>Preview next exercise</Text>
              </View>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => {
                  setShowNextExercisePreview(false);
                  setPreviewVideoPlaying(false);
                }}
              >
                <Ionicons name="close" size={24} color={darkTheme.color.foreground} />
              </TouchableOpacity>
            </View>

            {nextExercise && (() => {
              const nextData = parseExerciseData(nextExercise);
              return (
              <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
                {/* Video Preview */}
                <View style={styles.previewVideoContainer}>
                  <Video
                    ref={previewVideoRef}
                    source={{ uri: nextData.videoUrl || '' }}
                    style={styles.previewVideo}
                    resizeMode={ResizeMode.CONTAIN}
                    isLooping
                    isMuted
                    shouldPlay={previewVideoPlaying}
                    useNativeControls={false}
                  />
                  <TouchableOpacity
                    style={styles.previewVideoOverlay}
                    onPress={() => setPreviewVideoPlaying(!previewVideoPlaying)}
                    activeOpacity={0.9}
                  >
                    <View style={styles.previewPlayButton}>
                      <Ionicons
                        name={previewVideoPlaying ? 'pause' : 'play'}
                        size={64}
                        color="#FFFFFF"
                      />
                    </View>
                  </TouchableOpacity>
                </View>

                {/* Exercise Details */}
                <View style={styles.previewDetails}>
                  {/* Title and Difficulty */}
                  <View style={styles.previewTitleSection}>
                    <Text style={styles.previewTitle}>{nextData.name}</Text>
                    <View style={styles.previewBadges}>
                      <View style={styles.previewDifficultyBadge}>
                        <Text style={styles.previewBadgeText}>Medium</Text>
                      </View>
                    </View>
                  </View>

                  {/* Stats Grid */}
                  <View style={styles.previewStatsGrid}>
                    <View style={styles.previewStatCard}>
                      <Text style={styles.previewStatLabel}>Sets</Text>
                      <Text style={styles.previewStatValue}>{nextData.sets}</Text>
                    </View>
                    <View style={styles.previewStatCard}>
                      <Text style={styles.previewStatLabel}>Reps</Text>
                      <Text style={styles.previewStatValue}>{nextData.reps}</Text>
                    </View>
                    <View style={styles.previewStatCard}>
                      <Text style={styles.previewStatLabel}>Duration</Text>
                      <Text style={styles.previewStatValue}>{nextData.duration}s</Text>
                    </View>
                    <View style={styles.previewStatCard}>
                      <Text style={styles.previewStatLabel}>Rest</Text>
                      <Text style={styles.previewStatValue}>{nextData.restTime}s</Text>
                    </View>
                  </View>

                  {/* Description */}
                  <View style={styles.previewSection}>
                    <Text style={styles.previewDescription}>
                      {cleanDescription(nextData.description)}
                    </Text>
                  </View>

                  {/* Instructions */}
                  <View style={styles.previewSection}>
                    <Text style={styles.previewSectionTitle}>INSTRUCTIONS</Text>
                    {cleanDescription(nextData.description).split('.').filter(s => s.trim()).map((instruction, idx) => (
                      <View key={idx} style={styles.previewInstruction}>
                        <Text style={styles.previewInstructionNumber}>{idx + 1}.</Text>
                        <Text style={styles.previewInstructionText}>{instruction}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </ScrollView>
              );
            })()}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkTheme.color.bg,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  snapItem: {
    height: SCREEN_HEIGHT,
    width: SCREEN_WIDTH,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: darkTheme.color.bg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    backgroundColor: darkTheme.color.bg,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 16,
  },
  errorText: {
    ...textStyles.body,
    color: darkTheme.color.destructive,
    textAlign: 'center',
  },
  backButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: darkTheme.color.primary,
    borderRadius: 8,
    marginTop: 16,
  },
  backButtonText: {
    ...textStyles.body,
    color: darkTheme.color.primaryForeground,
    fontWeight: '600',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  headerRight: {
    flexDirection: 'row',
    gap: 8,
  },
  videoContainerFull: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  timerOverlay: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 80 : 60,
    left: 0,
    right: 0,
    zIndex: 50,
    alignItems: 'center',
  },
  restOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  restText: {
    fontSize: 56,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  actionButtons: {
    position: 'absolute',
    right: 16,
    bottom: Platform.OS === 'ios' ? 280 : 260,
    zIndex: 40,
    gap: 16,
  },
  nextExerciseButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${darkTheme.color.primary}CC`, // 80% opacity
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    borderWidth: 1,
    borderColor: `${darkTheme.color.primary}80`, // 50% opacity
    shadowColor: darkTheme.color.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  bottomPanelContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 30,
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 500,
  },
  bottomPanel: {
    position: 'relative',
  },
  bottomContent: {
    paddingHorizontal: 16,
    paddingTop: 32,
    paddingBottom: 16,
    gap: 12,
  },
  exerciseName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  exerciseDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20,
  },
  badgesRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(251, 191, 36, 0.2)', // warning color with opacity
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.4)',
  },
  statsBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  setCounter: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: darkTheme.color.primary,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: `${darkTheme.color.primary}60`,
    marginBottom: 8,
  },
  setCounterText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: darkTheme.color.primaryForeground,
    letterSpacing: 1,
  },
  expandedInfo: {
    gap: 12,
    paddingTop: 8,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 0.6)',
    letterSpacing: 1.5,
    marginTop: 8,
  },
  musclesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  muscleItem: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: `${darkTheme.color.primary}20`,
    borderWidth: 1,
    borderColor: `${darkTheme.color.primary}40`,
    fontSize: 12,
    color: darkTheme.color.primary,
  },
  instructionItem: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  instructionNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: darkTheme.color.primary,
  },
  instructionText: {
    flex: 1,
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 20,
  },
  infoScroll: {
    maxHeight: 200,
  },
  infoScrollContent: {
    paddingBottom: 8,
  },
  startButton: {
    width: '100%',
    height: 56,
    backgroundColor: darkTheme.color.primary,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: darkTheme.color.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
    marginTop: 8,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: darkTheme.color.primaryForeground,
    letterSpacing: 1.5,
  },
  // Completion Screen Styles
  completionScreen: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: darkTheme.color.bg,
  },
  completionContent: {
    width: '100%',
    maxWidth: 400,
    padding: 24,
    gap: 24,
    alignItems: 'center',
  },
  completionIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: `${darkTheme.color.success}30`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completionCheckmark: {
    fontSize: 56,
    color: darkTheme.color.success,
  },
  completionTextContainer: {
    gap: 8,
    alignItems: 'center',
  },
  completionTitle: {
    ...textStyles.h2,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  completionSubtitle: {
    ...textStyles.body,
    color: darkTheme.color.mutedForeground,
    textAlign: 'center',
  },
  statsCard: {
    padding: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 16,
    padding: 16,
  },
  statItem: {
    flex: 1,
    gap: 4,
  },
  statLabel: {
    fontSize: 12,
    color: darkTheme.color.mutedForeground,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: darkTheme.color.foreground,
  },
  completionButtons: {
    width: '100%',
    gap: 12,
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalOverlay: {
    flex: 1,
  },
  modalContent: {
    height: '70%',
    backgroundColor: darkTheme.color.bg,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: 2,
    borderTopColor: darkTheme.color.border,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: darkTheme.color.border,
    backgroundColor: `${darkTheme.color.bg}F2`,
  },
  modalTitle: {
    ...textStyles.h4,
    fontWeight: 'bold',
  },
  modalSubtitle: {
    ...textStyles.small,
    color: darkTheme.color.mutedForeground,
  },
  modalCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalScroll: {
    flex: 1,
  },
  previewVideoContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#000',
    position: 'relative',
  },
  previewVideo: {
    width: '100%',
    height: '100%',
  },
  previewVideoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  previewPlayButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewDetails: {
    padding: 16,
    gap: 16,
  },
  previewTitleSection: {
    gap: 8,
  },
  previewTitle: {
    ...textStyles.h3,
    fontWeight: 'bold',
  },
  previewBadges: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  previewDifficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: `${darkTheme.color.warning}30`,
  },
  previewBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: darkTheme.color.warning,
  },
  previewStatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  previewStatCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: `${darkTheme.color.bgMuted}80`,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: darkTheme.color.border,
  },
  previewStatLabel: {
    fontSize: 12,
    color: darkTheme.color.mutedForeground,
    marginBottom: 4,
  },
  previewStatValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: darkTheme.color.foreground,
  },
  previewSection: {
    gap: 8,
  },
  previewDescription: {
    fontSize: 14,
    color: darkTheme.color.mutedForeground,
    lineHeight: 20,
  },
  previewSectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: darkTheme.color.mutedForeground,
    letterSpacing: 1,
  },
  previewInstruction: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  previewInstructionNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: darkTheme.color.primary,
  },
  previewInstructionText: {
    flex: 1,
    fontSize: 14,
    color: darkTheme.color.foreground,
    lineHeight: 20,
  },
});
