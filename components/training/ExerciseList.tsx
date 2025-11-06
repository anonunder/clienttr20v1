import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/ui/Card';
import { darkTheme } from '@/styles/theme';
import { textStyles } from '@/styles/shared-styles';
import { env } from '@/config/env';

export interface WorkoutExercise {
  term_taxonomy_id: number;
  term_id: number;
  description?: string;
  term?: {
    name?: string;
    meta?: {
      sets?: any[];
      [key: string]: any;
    };
  };
  media?: {
    exercise_thumbnail_media_id?: {
      post_content?: string;
      post_mime_type?: string;
    };
    demo_media_id?: {
      post_content?: string;
      post_mime_type?: string;
    };
  };
}

interface ExerciseListProps {
  exercises: WorkoutExercise[];
  onExercisePress?: (exercise: WorkoutExercise, index: number) => void;
  showHeader?: boolean;
}

// Construct image URL from storage path
const getImageUrl = (imageUri: string | null | undefined): string => {
  if (!imageUri) {
    return '';
  }
  
  if (imageUri.startsWith('http')) {
    return imageUri;
  }
  
  const baseUrl = env.apiBaseUrl.replace(/\/api\/?$/, '');
  const imagePath = imageUri.startsWith('/') ? imageUri : `/${imageUri}`;
  
  return `${baseUrl}${imagePath}`;
};

// Strip HTML tags from description
const stripHtml = (html: string | undefined): string => {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
};

// Extract text excerpt from description
const getExcerpt = (text: string, wordLimit: number = 25): string => {
  if (!text) return '';
  const words = text.split(' ');
  if (words.length <= wordLimit) return text;
  return words.slice(0, wordLimit).join(' ') + '...';
};

export function ExerciseList({ exercises, onExercisePress, showHeader = true }: ExerciseListProps) {
  if (!exercises || exercises.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      {showHeader && (
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Exercises</Text>
          <Text style={styles.headerCount}>{exercises.length}</Text>
        </View>
      )}
      
      <View style={styles.exercisesList}>
        {exercises.map((exercise, index) => {
          const exerciseName = exercise.term?.name || `Exercise ${index + 1}`;
          const exerciseDescription = stripHtml(exercise.description);
          const exerciseExcerpt = getExcerpt(exerciseDescription);
          const thumbnailMedia = exercise.media?.exercise_thumbnail_media_id || exercise.media?.demo_media_id;
          const thumbnailUrl = thumbnailMedia?.post_content 
            ? getImageUrl(thumbnailMedia.post_content)
            : null;
          const sets = exercise.term?.meta?.sets || [];
          const isVideo = thumbnailMedia?.post_mime_type === 'video';

          return (
            <ExerciseItem
              key={exercise.term_taxonomy_id || index}
              index={index}
              exerciseName={exerciseName}
              exerciseExcerpt={exerciseExcerpt}
              thumbnailUrl={thumbnailUrl}
              isVideo={isVideo}
              sets={sets}
              onPress={() => onExercisePress?.(exercise, index)}
            />
          );
        })}
      </View>
    </View>
  );
}

// Separate component for exercise item to handle video state
function ExerciseItem({
  index,
  exerciseName,
  exerciseExcerpt,
  thumbnailUrl,
  isVideo,
  sets,
  onPress,
}: {
  index: number;
  exerciseName: string;
  exerciseExcerpt: string;
  thumbnailUrl: string | null;
  isVideo: boolean;
  sets: any[];
  onPress: () => void;
}) {
  const videoRef = useRef<Video>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const handleVideoPress = () => {
    if (isVideo && videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pauseAsync();
        setIsVideoPlaying(false);
      } else {
        videoRef.current.playAsync();
        setIsVideoPlaying(true);
      }
    } else {
      onPress();
    }
  };

  return (
    <Pressable
      style={styles.exerciseItem}
      onPress={handleVideoPress}
    >
      <Card>
        <View style={styles.exerciseContent}>
          {/* Exercise Thumbnail/Video */}
          <View style={styles.exerciseThumbnail}>
            {thumbnailUrl ? (
              <>
                {isVideo ? (
                  <>
                    <Video
                      ref={videoRef}
                      source={{ uri: thumbnailUrl }}
                      style={styles.exerciseVideo}
                      resizeMode={ResizeMode.COVER}
                      isLooping
                      isMuted
                      shouldPlay={false}
                      useNativeControls={false}
                      positionMillis={0}
                    />
                    {!isVideoPlaying && (
                      <View style={styles.videoOverlay}>
                        <View style={styles.playButtonContainer}>
                          <Ionicons name="play-circle" size={40} color="#FFFFFF" />
                        </View>
                      </View>
                    )}
                  </>
                ) : (
                  <Image 
                    source={{ uri: thumbnailUrl }} 
                    style={styles.exerciseImage}
                    resizeMode="cover"
                  />
                )}
              </>
            ) : (
              <View style={styles.exercisePlaceholder}>
                <Ionicons name="barbell-outline" size={28} color={darkTheme.color.mutedForeground} />
              </View>
            )}
          </View>

          {/* Exercise Info */}
          <View style={styles.exerciseInfo}>
            <View style={styles.exerciseHeader}>
              <Text style={styles.exerciseName} numberOfLines={1}>
                {exerciseName}
              </Text>
              <View style={styles.exerciseNumber}>
                <Text style={styles.exerciseNumberText}>{index + 1}</Text>
              </View>
            </View>
            
            {exerciseExcerpt && (
              <Text style={styles.exerciseDescription} numberOfLines={2}>
                {exerciseExcerpt}
              </Text>
            )}
            
            {sets.length > 0 && (
              <View style={styles.exerciseMeta}>
                <Ionicons name="repeat-outline" size={14} color={darkTheme.color.mutedForeground} />
                <Text style={styles.exerciseMetaText}>
                  {sets.length} {sets.length === 1 ? 'set' : 'sets'}
                </Text>
              </View>
            )}
          </View>

          {/* Chevron */}
          <Ionicons 
            name="chevron-forward" 
            size={20} 
            color={darkTheme.color.mutedForeground} 
          />
        </View>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  headerTitle: {
    ...textStyles.body,
    fontWeight: '600',
    color: darkTheme.color.foreground,
  },
  headerCount: {
    ...textStyles.small,
    color: darkTheme.color.mutedForeground,
    backgroundColor: darkTheme.color.bgMuted,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  exercisesList: {
    gap: 10,
  },
  exerciseItem: {
    width: '100%',
  },
  exerciseContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
  },
  exerciseThumbnail: {
    width: 350,
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: darkTheme.color.bgMuted,
    flexShrink: 0,
    position: 'relative',
  },
  exerciseImage: {
    width: '100%',
    height: '100%',
  },
  exerciseVideo: {
    width: '100%',
    height: '100%',
  },
  video:{
    width: '100%',
    height: '100%',
  },
  videoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  playButtonContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  exercisePlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: darkTheme.color.bgMuted,
  },
  exerciseInfo: {
    flex: 1,
    gap: 6,
  },
  exerciseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  exerciseName: {
    ...textStyles.body,
    fontWeight: '600',
    flex: 1,
    color: darkTheme.color.foreground,
  },
  exerciseNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: darkTheme.color.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  exerciseNumberText: {
    ...textStyles.small,
    fontWeight: '700',
    color: darkTheme.color.primary,
    fontSize: 11,
  },
  exerciseDescription: {
    ...textStyles.small,
    color: darkTheme.color.mutedForeground,
    lineHeight: 18,
  },
  exerciseMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  exerciseMetaText: {
    ...textStyles.small,
    color: darkTheme.color.mutedForeground,
    fontSize: 12,
  },
});

