import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { darkTheme } from '@/styles/theme';

interface ExerciseActionButtonsProps {
  onLike: () => void;
  onShare: () => void;
  onSave: () => void;
  onComment: () => void;
  onInfo: () => void;
  isLiked?: boolean;
  isSaved?: boolean;
}

export function ExerciseActionButtons({
  onLike,
  onShare,
  onSave,
  onComment,
  onInfo,
  isLiked = false,
  isSaved = false,
}: ExerciseActionButtonsProps) {
  return (
    <View style={styles.container}>
      {/* Like Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={onLike}
        activeOpacity={0.7}
      >
        <Ionicons
          name={isLiked ? 'heart' : 'heart-outline'}
          size={28}
          color={isLiked ? darkTheme.color.destructive : '#FFFFFF'}
        />
      </TouchableOpacity>

      {/* Share Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={onShare}
        activeOpacity={0.7}
      >
        <Ionicons name="share-outline" size={26} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Save/Bookmark Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={onSave}
        activeOpacity={0.7}
      >
        <Ionicons
          name={isSaved ? 'bookmark' : 'bookmark-outline'}
          size={26}
          color={isSaved ? darkTheme.color.warning : '#FFFFFF'}
        />
      </TouchableOpacity>

      {/* Comment Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={onComment}
        activeOpacity={0.7}
      >
        <Ionicons name="chatbubble-outline" size={26} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Info Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={onInfo}
        activeOpacity={0.7}
      >
        <Ionicons name="information-circle-outline" size={28} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
    alignItems: 'center',
  },
  button: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});

