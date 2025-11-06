import React from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/ui/Card';
import { darkTheme } from '@/styles/theme';
import { textStyles, spacingStyles, layoutStyles } from '@/styles/shared-styles';
import { env } from '@/config/env';

interface WorkoutCardProps {
  id: number | string;
  title: string;
  image: string | null;
  duration?: string;
  exercises?: number;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  completed?: boolean;
  onPress?: () => void;
}

const getDifficultyColor = (difficulty: 'Easy' | 'Medium' | 'Hard' | undefined) => {
  switch (difficulty) {
    case 'Easy':
      return {
        backgroundColor: `${darkTheme.color.success}33`,
        borderColor: `${darkTheme.color.success}4D`,
        color: darkTheme.color.success,
      };
    case 'Medium':
      return {
        backgroundColor: `${darkTheme.color.warning}33`,
        borderColor: `${darkTheme.color.warning}4D`,
        color: darkTheme.color.warning,
      };
    case 'Hard':
      return {
        backgroundColor: `${darkTheme.color.destructive}33`,
        borderColor: `${darkTheme.color.destructive}4D`,
        color: darkTheme.color.destructive,
      };
    default:
      return {
        backgroundColor: darkTheme.color.bgMuted,
        borderColor: darkTheme.color.border,
        color: darkTheme.color.mutedForeground,
      };
  }
};

// Construct image URL from storage path
const getImageUrl = (imageUri: string | null | undefined): string => {
  if (!imageUri) {
    return 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&q=80';
  }
  
  if (imageUri.startsWith('http')) {
    return imageUri;
  }
  
  const baseUrl = env.apiBaseUrl.replace(/\/api\/?$/, '');
  const imagePath = imageUri.startsWith('/') ? imageUri : `/${imageUri}`;
  
  return `${baseUrl}${imagePath}`;
};

export function WorkoutCard({
  id,
  title,
  image,
  duration,
  exercises,
  difficulty,
  completed = false,
  onPress,
}: WorkoutCardProps) {
  const difficultyStyle = getDifficultyColor(difficulty);
  const imageUrl = getImageUrl(image);

  return (
    <Pressable onPress={onPress} style={styles.pressable}>
      <Card>
        <View style={styles.container}>
          {/* Image */}
          <View style={styles.imageContainer}>
            <Image 
              source={{ uri: imageUrl }} 
              style={styles.image}
              resizeMode="cover"
            />
            {completed && (
              <View style={styles.completedOverlay}>
                <Ionicons name="checkmark-circle" size={32} color={darkTheme.color.success} />
              </View>
            )}
          </View>

          {/* Content */}
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.title} numberOfLines={2}>
                {title}
              </Text>
              {difficulty && (
                <View style={[styles.difficultyBadge, {
                  backgroundColor: difficultyStyle.backgroundColor,
                  borderColor: difficultyStyle.borderColor,
                }]}>
                  <Text style={[styles.difficultyText, { color: difficultyStyle.color }]}>
                    {difficulty}
                  </Text>
                </View>
              )}
            </View>
            {(duration || exercises !== undefined) && (
              <View style={styles.meta}>
                {duration && (
                  <>
                    <View style={layoutStyles.rowCenterGap8}>
                      <Ionicons name="time-outline" size={14} color={darkTheme.color.mutedForeground} />
                      <Text style={styles.metaText}>{duration}</Text>
                    </View>
                    {exercises !== undefined && <Text style={styles.metaSeparator}>•</Text>}
                  </>
                )}
                {exercises !== undefined && (
                  <View style={layoutStyles.rowCenterGap8}>
                    <Ionicons name="barbell-outline" size={14} color={darkTheme.color.mutedForeground} />
                    <Text style={styles.metaText}>{exercises} exercises</Text>
                  </View>
                )}
              </View>
            )}
          </View>
        </View>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    width: '100%',
  },
  container: {
    flexDirection: 'row',
    gap: 16,
    overflow: 'hidden',
  },
  imageContainer: {
    width: 96, // w-24 equivalent
    height: 96, // h-24 equivalent
    flexShrink: 0,
    overflow: 'hidden',
    borderRadius: 8,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  completedOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundColor: `${darkTheme.color.overlay}66`, // 40% opacity
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    padding: 12,
    gap: 8,
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  title: {
    ...textStyles.body,
    fontWeight: '600',
    flex: 1,
  },
  difficultyBadge: {
    flexShrink: 0,
    borderRadius: 4,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '600',
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
  },
  metaText: {
    ...textStyles.small,
    color: darkTheme.color.mutedForeground,
  },
  metaSeparator: {
    ...textStyles.small,
    color: darkTheme.color.mutedForeground,
  },
});

