import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Video, ResizeMode } from 'expo-av';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { darkTheme } from '@/styles/theme';
import { FavoriteItem } from '@/types/favorites';
import { env } from '@/config/env';

interface FavoriteCardProps {
  item: FavoriteItem;
  onUnfavorite?: (id: string) => void;
  onViewDetails?: (item: FavoriteItem) => void;
}

const getDifficultyVariant = (difficulty?: string): 'success' | 'warning' | 'destructive' => {
  switch (difficulty) {
    case 'Beginner':
      return 'success';
    case 'Intermediate':
      return 'warning';
    case 'Advanced':
      return 'destructive';
    default:
      return 'success';
  }
};

export function FavoriteCard({ item, onUnfavorite, onViewDetails }: FavoriteCardProps) {
  const isTraining = item.type === 'training';
  const videoRef = useRef<Video>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  
  // Extract base URL from apiBaseUrl (remove /api if present)
  // apiBaseUrl is like "http://localhost:3000/api"
  // We need "http://localhost:3000" for storage paths
  const baseUrl = env.apiBaseUrl.replace(/\/api\/?$/, '');
  
  // Check if thumbnail is actually a video file
  const isVideoThumbnail = item.thumbnailUrl?.toLowerCase().match(/\.(mp4|webm|mov|avi)$/);
  const hasVideo = item.videoUrl || isVideoThumbnail;
  
  // Get proper URLs for images and videos
  const imageUrl = item.thumbnailUrl && !isVideoThumbnail ? `${baseUrl}${item.thumbnailUrl}` : null;
  const videoUrl = isVideoThumbnail && item.thumbnailUrl ? `${baseUrl}${item.thumbnailUrl}` : null;
  
  const handleVideoPress = (e: any) => {
    e.stopPropagation();
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pauseAsync();
        setIsVideoPlaying(false);
      } else {
        videoRef.current.playAsync();
        setIsVideoPlaying(true);
      }
    }
  };
  
  return (
    <Card style={styles.card}>
      <View style={styles.cardContent}>
        {/* Thumbnail Image or Video */}
        {imageUrl ? (
          // Regular image thumbnail
          <View style={styles.thumbnailContainer}>
            <Image 
              source={{ uri: imageUrl }}
              style={styles.thumbnail}
              resizeMode="cover"
            />
            {hasVideo && (
              <View style={styles.playIconContainer}>
                <Ionicons name="play-circle" size={48} color="rgba(255, 255, 255, 0.95)" />
              </View>
            )}
          </View>
        ) : videoUrl ? (
          // Video thumbnail - show first frame
          <Pressable onPress={handleVideoPress} style={styles.thumbnailContainer}>
            <Video
              ref={videoRef}
              source={{ uri: videoUrl }}
              style={styles.thumbnail}
              resizeMode={ResizeMode.COVER}
              shouldPlay={false}
              isLooping={true}
              isMuted={true}
              useNativeControls={false}
              positionMillis={0}
            />
            {!isVideoPlaying && (
              <View style={styles.videoOverlay}>
                <View style={styles.playButtonContainer}>
                  <Ionicons name="play-circle" size={48} color="#FFFFFF" />
                </View>
              </View>
            )}
          </Pressable>
        ) : null}
        
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {!imageUrl && (
              <View style={[
                styles.iconContainer,
                { backgroundColor: isTraining ? `${darkTheme.color.primary}1A` : `${darkTheme.color.success}1A` }
              ]}>
                <Ionicons 
                  name={isTraining ? 'barbell' : 'nutrition'} 
                  size={24} 
                  color={isTraining ? darkTheme.color.primary : darkTheme.color.success} 
                />
              </View>
            )}
            <View style={styles.titleContainer}>
              <Text style={styles.title} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={styles.description} numberOfLines={2}>
                {item.description}
              </Text>
            </View>
          </View>
          <Pressable 
            onPress={() => onUnfavorite?.(item.id)}
            style={styles.favoriteButton}
          >
            <Ionicons 
              name="heart" 
              size={20} 
              color={darkTheme.color.destructive} 
            />
          </Pressable>
        </View>

        {/* Badges */}
        <View style={styles.badgesContainer}>
          {item.duration && (
            <Badge variant="outline" style={styles.badge}>
              <Ionicons name="time-outline" size={12} color={darkTheme.color.foreground} />
              <Text style={styles.badgeText}>{item.duration}</Text>
            </Badge>
          )}
          {item.difficulty && (
            <Badge variant={getDifficultyVariant(item.difficulty)} style={styles.badge}>
              <Text style={[styles.badgeText, { 
                color: item.difficulty === 'Beginner' ? darkTheme.color.success :
                       item.difficulty === 'Intermediate' ? darkTheme.color.warning :
                       darkTheme.color.destructive 
              }]}>
                {item.difficulty}
              </Text>
            </Badge>
          )}
          {item.calories && (
            <Badge variant="outline" style={styles.badge}>
              <Ionicons name="flame-outline" size={12} color={darkTheme.color.foreground} />
              <Text style={styles.badgeText}>{item.calories} kcal</Text>
            </Badge>
          )}
          {item.rating && (
            <Badge variant="outline" style={[styles.badge, { marginLeft: 'auto' }]}>
              <Ionicons name="star" size={12} color={darkTheme.color.warning} />
              <Text style={styles.badgeText}>{item.rating}</Text>
            </Badge>
          )}
        </View>

        {/* View Details Button */}
        <Button 
          variant="outline" 
          title="View Details"
          onPress={() => onViewDetails?.(item)}
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 20,
    marginBottom: 16,
  },
  cardContent: {
    gap: 16,
  },
  thumbnailContainer: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: darkTheme.color.muted,
    position: 'relative',
  },
  thumbnail: {
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
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIconContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -24 }, { translateY: -24 }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  videoPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  videoPlaceholderText: {
    fontSize: 14,
    fontWeight: '600',
    color: darkTheme.color.mutedForeground,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    flex: 1,
  },
  iconContainer: {
    padding: 12,
    borderRadius: 8,
  },
  titleContainer: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: darkTheme.color.foreground,
  },
  description: {
    fontSize: 14,
    color: darkTheme.color.mutedForeground,
    lineHeight: 20,
  },
  favoriteButton: {
    padding: 8,
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: darkTheme.color.foreground,
  },
});

