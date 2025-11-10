import React, { useMemo, useState, useRef } from 'react';
import { View, Text, StyleSheet, Image, Pressable, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/ui/Card';
import { darkTheme } from '@/styles/theme';
import { textStyles } from '@/styles/shared-styles';
import { env } from '@/config/env';
import { MacrosDisplay } from './MacrosDisplay';
import { useResponsive } from '@/hooks/use-responsive';

interface RecipeCardProps {
  id: number | string;
  title: string;
  image: string | null;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  cookTime?: string;
  onPress?: () => void;
}

// Construct image URL from storage path
const getImageUrl = (imageUri: string | null | undefined): string => {
  if (!imageUri) {
    return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80';
  }
  
  if (imageUri.startsWith('http')) {
    return imageUri;
  }
  
  const baseUrl = env.apiBaseUrl.replace(/\/api\/?$/, '');
  const imagePath = imageUri.startsWith('/') ? imageUri : `/${imageUri}`;
  
  return `${baseUrl}${imagePath}`;
};

export function RecipeCard({
  title,
  image,
  calories,
  protein,
  carbs,
  fat,
  cookTime,
  onPress,
}: RecipeCardProps) {
  const { isMobile } = useResponsive();
  const imageUrl = getImageUrl(image);
  const hasMacros = protein !== undefined && carbs !== undefined && fat !== undefined;
  
  // State for favorite toggle
  const [isFavorited, setIsFavorited] = useState(false);
  
  // Animation values
  const scaleAnim = useRef(new Animated.Value(1)).current;
  
  // Responsive sizing
  const imageHeight = useMemo(() => {
    return isMobile ? 160 : 180;
  }, [isMobile]);

  const handleHeartPress = (e: any) => {
    e.stopPropagation();
    
    // Pop animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.7,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        tension: 100,
        useNativeDriver: true,
      }),
    ]).start();
    
    setIsFavorited(!isFavorited);
    console.log('Recipe favorited:', !isFavorited);
  };

  return (
    <Pressable onPress={onPress} disabled={!onPress}>
      {({ pressed }) => (
        <Card style={[styles.card, pressed && onPress && styles.cardPressed]}>
          {/* Image */}
          <View style={[styles.imageContainer, { height: imageHeight }]}>
            <Image 
              source={{ uri: imageUrl }} 
              style={styles.image}
              resizeMode="cover"
            />
            {/* Overlay gradient for text readability */}
            <View style={styles.imageOverlay} />
            
            {/* Heart Icon */}
            <Pressable 
              style={[styles.heartButton, isFavorited && styles.heartButtonActive]}
              onPress={handleHeartPress}
            >
              {({ pressed: heartPressed }) => (
                <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                  <Ionicons 
                    name={isFavorited ? 'heart' : 'heart-outline'}
                    size={24} 
                    color={isFavorited ? '#EF4444' : '#FFFFFF'}
                    style={[styles.heartIcon, heartPressed && styles.heartIconPressed]}
                  />
                </Animated.View>
              )}
            </Pressable>
          </View>

          {/* Content */}
          <View style={styles.content}>
            {/* Title */}
            <Text style={styles.title} numberOfLines={2}>
              {title}
            </Text>
            
            {/* Cook Time and Calories */}
            {(cookTime || calories !== undefined) && (
              <View style={styles.meta}>
                {cookTime && (
                  <View style={styles.metaItem}>
                    <Ionicons name="time-outline" size={14} color={darkTheme.color.mutedForeground} />
                    <Text style={styles.metaText}>{cookTime}</Text>
                  </View>
                )}
                {calories !== undefined && (
                  <View style={styles.metaItem}>
                    <Ionicons name="flame-outline" size={14} color={darkTheme.color.mutedForeground} />
                    <Text style={styles.metaText}>{calories} cal</Text>
                  </View>
                )}
              </View>
            )}
            
            {/* Macros Display */}
            {hasMacros && (
              <View style={styles.macrosContainer}>
                <MacrosDisplay 
                  protein={protein!}
                  carbs={carbs!}
                  fat={fat!}
                  size="sm"
                />
              </View>
            )}
          </View>
        </Card>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
    padding: 0,
  },
  cardPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  imageContainer: {
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '30%',
    background: 'linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.3))',
  },
  heartButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  heartButtonActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  heartIcon: {
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  heartIconPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.95 }],
  },
  content: {
    padding: 16,
    gap: 12,
  },
  title: {
    ...textStyles.h3,
    fontSize: 16,
    fontWeight: '600',
    color: darkTheme.color.foreground,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flexWrap: 'wrap',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 13,
    color: darkTheme.color.mutedForeground,
  },
  macrosContainer: {
    marginTop: 4,
  },
});

