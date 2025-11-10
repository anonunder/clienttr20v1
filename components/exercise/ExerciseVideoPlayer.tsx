import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Platform, Dimensions } from 'react-native';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { darkTheme } from '@/styles/theme';

interface ExerciseVideoPlayerProps {
  videoUrl?: string;
  isPlaying: boolean;
  onTogglePlay: () => void;
  aspectRatio: '16:9' | '9:16';
}

export function ExerciseVideoPlayer({
  videoUrl,
  isPlaying,
  onTogglePlay,
  aspectRatio,
}: ExerciseVideoPlayerProps) {
  const isVertical = aspectRatio === '9:16';
  const videoRef = useRef<Video>(null);
  const [isBuffering, setIsBuffering] = useState(false);

  useEffect(() => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.playAsync().catch((error) => {
        console.error('Video play error:', error);
      });
    } else {
      videoRef.current.pauseAsync().catch((error) => {
        console.error('Video pause error:', error);
      });
    }
  }, [isPlaying]);

  const handlePlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      setIsBuffering(status.isBuffering || false);
    }
  };

  if (!videoUrl) {
    return (
      <View style={[styles.container, isVertical ? styles.verticalContainer : styles.horizontalContainer]}>
        <View style={styles.placeholderContainer}>
          <Ionicons name="videocam-outline" size={48} color={darkTheme.color.mutedForeground} />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, isVertical ? styles.verticalContainer : styles.horizontalContainer]}>
      {/* Blurred background for horizontal videos */}
      {!isVertical && (
        <Video
          source={{ uri: videoUrl }}
          style={styles.backgroundVideo}
          resizeMode={ResizeMode.COVER}
          isLooping
          isMuted
          shouldPlay={isPlaying}
        />
      )}
      
      {/* Main video - Wrapped in centering container */}
      <View style={styles.videoWrapper}>
        <Video
          ref={videoRef}
          source={{ uri: videoUrl }}
          style={isVertical ? styles.verticalVideo : styles.horizontalVideo}
          resizeMode={isVertical ? ResizeMode.COVER : ResizeMode.CONTAIN}
          isLooping
          isMuted
          shouldPlay={isPlaying}
          onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
          useNativeControls={false}
        />
      </View>

      {/* Tap to pause/play overlay */}
      <TouchableOpacity
        style={styles.overlay}
        onPress={onTogglePlay}
        activeOpacity={1}
      >
        {/* Show play icon when paused */}
        {!isPlaying && (
          <View style={styles.playIconContainer}>
            <Ionicons name="play-circle" size={80} color="rgba(255, 255, 255, 0.8)" />
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    backgroundColor: darkTheme.color.bg,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  verticalContainer: {
    width: '100%',
    height: '100%',
  },
  horizontalContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
  },
  videoWrapper: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  verticalVideo: {
    width: '100%',
    height: '100%',
  },
  horizontalVideo: {
    width: '100%',
    height: '100%',
  },
  backgroundVideo: {
    position: 'absolute',
    width: '110%',
    height: '110%',
    opacity: 0.5,
    zIndex: 0,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: darkTheme.color.card,
  },
});

