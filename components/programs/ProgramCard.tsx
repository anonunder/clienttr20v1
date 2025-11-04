import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { darkTheme } from '@/styles/theme';
import { spacingStyles, layoutStyles, textStyles } from '@/styles/shared-styles';
import { Program } from '@/features/programs/programs-slice';
import { env } from '@/config/env';

interface ProgramCardProps {
  program: Program;
  onPress: (id: number) => void;
}

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'Beginner':
      return {
        backgroundColor: `${darkTheme.color.success}33`,
        borderColor: `${darkTheme.color.success}4D`,
        color: darkTheme.color.success,
      };
    case 'Intermediate':
      return {
        backgroundColor: `${darkTheme.color.warning}33`,
        borderColor: `${darkTheme.color.warning}4D`,
        color: darkTheme.color.warning,
      };
    case 'Advanced':
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

// Calculate workouts count from duration (rough estimate)
const calculateWorkouts = (duration: string | undefined | null): number => {
  if (!duration) return 0; // default if no duration
  return parseInt(duration.replace(/\D/g, ''));
};

// Construct image URL from storage path
// Storage paths like "/storage/company-1/..." need to use base server URL (not /api)
const getImageUrl = (imageUri: string | null | undefined): string => {
  if (!imageUri) {
    return 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80';
  }
  
  if (imageUri.startsWith('http')) {
    return imageUri;
  }
  
  // Extract base URL from apiBaseUrl (remove /api if present)
  // apiBaseUrl is like "http://localhost:3000/api"
  // We need "http://localhost:3000" for storage paths
  const baseUrl = env.apiBaseUrl.replace(/\/api\/?$/, '');
  
  // Ensure imageUri starts with /
  const imagePath = imageUri.startsWith('/') ? imageUri : `/${imageUri}`;
  
  return `${baseUrl}${imagePath}`;
};

export function ProgramCard({ program, onPress }: ProgramCardProps) {
  const difficultyStyle = getDifficultyColor(program.difficulty || 'Beginner');
  const workouts = calculateWorkouts(program.duration);
  
  // Construct image URL using the same logic as program detail page
  const imageUrl = getImageUrl(program.imageUri);

  return (
    <Pressable onPress={() => onPress(program.id)} style={styles.cardWrapper}>
      <Card>
        <View style={styles.cardContainer}>
          {/* Image Section */}
          <View style={styles.imageContainer}>
            <Image 
              source={{ uri: imageUrl }}
              style={styles.image}
              resizeMode="cover"
            />
            <View style={styles.badgeContainer}>
              <View style={[styles.difficultyBadge, difficultyStyle]}>
                <Text style={[styles.difficultyText, { color: difficultyStyle.color }]}>
                  {program.difficulty || 'Beginner'}
                </Text>
              </View>
            </View>
          </View>

          {/* Content Section */}
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.title} numberOfLines={1}>
                {program.title || 'Program'}
              </Text>
              <Text style={styles.description} numberOfLines={2}>
                {program.description || 'No description available'}
              </Text>
            </View>

            {/* Meta Info */}
            <View style={styles.meta}>
              <View style={layoutStyles.rowCenterGap8}>
                <Ionicons name="time-outline" size={16} color={darkTheme.color.mutedForeground} />
                <Text style={styles.metaText}>{program.duration || 'N/A'}</Text>
              </View>
              <Text style={styles.metaSeparator}>•</Text>
              <View style={layoutStyles.rowCenterGap8}>
                <Ionicons name="barbell-outline" size={16} color={darkTheme.color.mutedForeground} />
                <Text style={styles.metaText}>{workouts} workouts</Text>
              </View>
            </View>

            {/* Button */}
            <Button
              title="View Program"
              onPress={() => onPress(program.id)}
              variant="default"
            />
          </View>
        </View>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    height: '100%',
  },
  cardContainer: {
    overflow: 'hidden',
    height: '100%',
  },
  imageContainer: {
    height: 192, // h-48 equivalent
    position: 'relative',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  badgeContainer: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  difficultyBadge: {
    borderRadius: 9999, // rounded-full
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    ...spacingStyles.p16,
    gap: 12,
    flex: 1,
  },
  header: {
    gap: 4,
  },
  title: {
    ...textStyles.h4,
    fontWeight: '600',
  },
  description: {
    ...textStyles.small,
    color: darkTheme.color.mutedForeground,
  },
  meta: {
    ...layoutStyles.rowCenterGap12,
    alignItems: 'center',
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

