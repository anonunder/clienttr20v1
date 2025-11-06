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
import { ExerciseVideoPlayer } from '@/components/exercise/ExerciseVideoPlayer';
import { ExerciseTimer, ExerciseTimerHandle } from '@/components/exercise/ExerciseTimer';
import { ExerciseInfo } from '@/components/exercise/ExerciseInfo';
import { ExerciseActionButtons } from '@/components/exercise/ExerciseActionButtons';
import { Loading } from '@/components/common/Loading';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { darkTheme } from '@/styles/theme';
import { textStyles } from '@/styles/shared-styles';
import { env } from '@/config/env';
import { WorkoutExercise } from '@/features/programs/programs-slice';
import { useTrainingPlan } from '@/hooks/programs/use-training-plan';

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
  
  const { trainingPlan, loading } = useTrainingPlan(programId || '');

  // UI State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [isResting, setIsResting] = useState(false);
  const [timerStartSignal, setTimerStartSignal] = useState(0);
  const [timerPauseSignal, setTimerPauseSignal] = useState(0);
  const [showCommentRating, setShowCommentRating] = useState(false);
  const [showNextExercisePreview, setShowNextExercisePreview] = useState(false);
  const [previewVideoPlaying, setPreviewVideoPlaying] = useState(false);
  
  const timerRef = useRef<ExerciseTimerHandle | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const previewVideoRef = useRef<Video>(null);
  const isTransitioning = useRef(false);

  // Get all exercises from the workout
  const exercises: WorkoutExercise[] = [];
  if (trainingPlan?.trainingPlanDays) {
    for (const day of trainingPlan.trainingPlanDays) {
      for (const workout of day.trainingPlanDayWorkouts) {
        if (workout.id === parseInt(workoutId || '0', 10)) {
          exercises.push(...(workout.workoutExercises || []));
          break;
        }
      }
    }
  }

  const nextExercise = currentIndex < exercises.length - 1 ? exercises[currentIndex + 1] : null;

  // Set initial index based on exerciseId
  useEffect(() => {
    if (exerciseId && exercises.length > 0) {
      const idx = exercises.findIndex((ex) => ex.term_taxonomy_id === parseInt(exerciseId, 10));
      if (idx !== -1) {
        setCurrentIndex(idx);
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

  // Parse description for exercise details
  const parseDescription = (description: string) => {
    let duration = 60;
    let restTime = 15;
    let sets = 3;
    let reps = 12;

    const durationMatch = description.match(/Trajanje:\s*(\d+)\s*min/i);
    if (durationMatch) {
      duration = parseInt(durationMatch[1], 10) * 60;
    }

    const repsMatch = description.match(/(\d+)\s*ponavljanja/i);
    if (repsMatch) {
      reps = parseInt(repsMatch[1], 10);
    }

    return { duration, restTime, sets, reps };
  };

  // Clean HTML from description
  const cleanDescription = (html: string | undefined) => {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
  };

  // Handle set complete
  const handleSetComplete = () => {
    setIsResting(true);
    setIsPlaying(false);
    playNotificationSound('rest');
    Alert.alert('Set Complete!', 'Rest time started.');
  };

  // Handle rest complete
  const handleRestComplete = () => {
    setIsResting(false);
    playNotificationSound('rest');
    Alert.alert('Rest Complete!', 'Moving to next exercise...');
    goToNextExercise();
  };

  // Go to next exercise
  const goToNextExercise = () => {
    if (isTransitioning.current) return;

    const nextIndex = currentIndex + 1;
    
    if (nextIndex > exercises.length) return; // Don't go beyond completion screen

    isTransitioning.current = true;
    setIsPlaying(false);

    // Scroll to next exercise
    scrollViewRef.current?.scrollTo({ 
      y: nextIndex * SCREEN_HEIGHT, 
      animated: true 
    });

    setTimeout(() => {
      setCurrentIndex(nextIndex);
      isTransitioning.current = false;
    }, 500);
  };

  // Handle scroll end
  const handleScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (isPlaying || isResting || isTransitioning.current) return;

    const offsetY = event.nativeEvent.contentOffset.y;
    const newIndex = Math.round(offsetY / SCREEN_HEIGHT);

    if (newIndex !== currentIndex && newIndex <= exercises.length) {
      setCurrentIndex(newIndex);
      
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
  if (loading) {
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
              const { duration } = parseDescription(ex.description || '');
              return sum + duration;
            }, 0);
            
            const totalTime = exercises.reduce((sum, ex) => {
              const { duration, restTime } = parseDescription(ex.description || '');
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

          const videoUrl = exercise?.media?.demo_media_id?.post_content
            ? getVideoUrl(exercise.media.demo_media_id.post_content)
            : undefined;

          const { duration, restTime, sets, reps } = parseDescription(exercise.description || '');

          return (
            <View key={exercise.term_taxonomy_id || index} style={styles.snapItem}>
              {/* Header - Only show on active exercise when not playing */}
              {isActive && !isPlaying && (
                <SafeAreaView edges={['top']} style={styles.header}>
                  <TouchableOpacity style={styles.headerButton} onPress={handleBack}>
                    <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
                  </TouchableOpacity>
                  
                  <View style={styles.headerRight}>
                    <TouchableOpacity
                      style={styles.headerButton}
                      onPress={() => {
                        setIsLiked(!isLiked);
                        Alert.alert(isLiked ? 'Removed from favorites' : 'Added to favorites');
                      }}
                    >
                      <Ionicons
                        name={isLiked ? 'star' : 'star-outline'}
                        size={24}
                        color={isLiked ? darkTheme.color.warning : '#FFFFFF'}
                      />
                    </TouchableOpacity>
                  </View>
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
              {isActive && (isPlaying || isResting) && (
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
              {isActive && isResting && (
                <View style={styles.restOverlay}>
                  <Text style={styles.restText}>REST TIME</Text>
                </View>
              )}

              {/* Action Buttons - Only when not playing */}
              {isActive && !isPlaying && (
                <View style={styles.actionButtons}>
                  <ExerciseActionButtons
                    onLike={() => setIsLiked(!isLiked)}
                    onShare={() => Alert.alert('Share', 'Share functionality')}
                    onSave={() => {
                      setIsSaved(!isSaved);
                      Alert.alert(isSaved ? 'Removed from saved' : 'Saved');
                    }}
                    onComment={() => setShowCommentRating(!showCommentRating)}
                    onInfo={() => setShowInfo(!showInfo)}
                    isLiked={isLiked}
                    isSaved={isSaved}
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

              {/* Bottom Info Panel - Only when not playing */}
              {isActive && !isPlaying && (
                <SafeAreaView edges={['bottom']} style={styles.bottomPanel}>
                  <View style={styles.bottomContent}>
                    <ScrollView 
                      style={styles.infoScroll}
                      contentContainerStyle={styles.infoScrollContent}
                      showsVerticalScrollIndicator={false}
                    >
                      <ExerciseInfo
                        name={exercise.term?.name || 'Exercise'}
                        description={cleanDescription(exercise.description)}
                        difficulty="Medium"
                        sets={sets}
                        reps={reps}
                        muscles={showInfo ? ['Full Body'] : undefined}
                        instructions={
                          showInfo
                            ? cleanDescription(exercise.description).split('.').filter(s => s.trim())
                            : undefined
                        }
                      />
                    </ScrollView>

                    {/* Start Button */}
                    <TouchableOpacity
                      style={styles.startButton}
                      onPress={() => {
                        setIsPlaying(true);
                        setTimerStartSignal((s) => s + 1);
                      }}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.startButtonText}>START</Text>
                    </TouchableOpacity>
                  </View>
                </SafeAreaView>
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

            {nextExercise && (
              <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
                {/* Video Preview */}
                <View style={styles.previewVideoContainer}>
                  <Video
                    ref={previewVideoRef}
                    source={{ uri: getVideoUrl(nextExercise.media?.demo_media_id?.post_content) || '' }}
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
                    <Text style={styles.previewTitle}>{nextExercise.term?.name || 'Exercise'}</Text>
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
                      <Text style={styles.previewStatValue}>{parseDescription(nextExercise.description || '').sets}</Text>
                    </View>
                    <View style={styles.previewStatCard}>
                      <Text style={styles.previewStatLabel}>Reps</Text>
                      <Text style={styles.previewStatValue}>{parseDescription(nextExercise.description || '').reps}</Text>
                    </View>
                    <View style={styles.previewStatCard}>
                      <Text style={styles.previewStatLabel}>Duration</Text>
                      <Text style={styles.previewStatValue}>{parseDescription(nextExercise.description || '').duration}s</Text>
                    </View>
                    <View style={styles.previewStatCard}>
                      <Text style={styles.previewStatLabel}>Rest</Text>
                      <Text style={styles.previewStatValue}>{parseDescription(nextExercise.description || '').restTime}s</Text>
                    </View>
                  </View>

                  {/* Description */}
                  <View style={styles.previewSection}>
                    <Text style={styles.previewDescription}>
                      {cleanDescription(nextExercise.description)}
                    </Text>
                  </View>

                  {/* Instructions */}
                  <View style={styles.previewSection}>
                    <Text style={styles.previewSectionTitle}>INSTRUCTIONS</Text>
                    {cleanDescription(nextExercise.description).split('.').filter(s => s.trim()).map((instruction, idx) => (
                      <View key={idx} style={styles.previewInstruction}>
                        <Text style={styles.previewInstructionNumber}>{idx + 1}.</Text>
                        <Text style={styles.previewInstructionText}>{instruction}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </ScrollView>
            )}
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
    flex: 1,
    width: '100%',
    height: '100%',
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
  bottomPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 30,
  },
  bottomContent: {
    paddingHorizontal: 16,
    paddingTop: 32,
    paddingBottom: 16,
    gap: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  infoScroll: {
    maxHeight: 240,
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
