import React from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { darkTheme } from '@/styles/theme';
import { textStyles } from '@/styles/shared-styles';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  image?: string;
  onBack?: () => void;
  children?: React.ReactNode;
}

export function PageHeader({
  title,
  subtitle,
  image = 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&q=80',
  onBack,
  children,
}: PageHeaderProps) {
  return (
    <View style={styles.container}>
      <Image source={{ uri: image }} style={styles.image} resizeMode="cover" />
      
      {/* Gradient overlay */}
      <LinearGradient
        colors={['rgba(0,0,0,0.4)', 'rgba(0,0,0,0.6)', darkTheme.color.bg]}
        style={styles.gradient}
      />

      {/* Back button */}
      {onBack && (
        <View style={styles.backButtonContainer}>
          <Pressable
            onPress={onBack}
            style={({ pressed }) => [
              styles.backButton,
              pressed && styles.backButtonPressed,
            ]}
          >
            <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
          </Pressable>
        </View>
      )}

      {/* Right side children */}
      {children && (
        <View style={styles.rightContainer}>
          {children}
        </View>
      )}

      {/* Title and subtitle */}
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && (
          <Text style={styles.subtitle}>{subtitle}</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 192, // h-48 equivalent
    position: 'relative',
    overflow: 'hidden',
    width: '100%', // Full width of parent
    alignSelf: 'stretch', // Stretch to parent
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  backButtonContainer: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonPressed: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  rightContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
  },
  contentContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    gap: 8,
  },
  title: {
    ...textStyles.h2,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  subtitle: {
    ...textStyles.small,
    color: 'rgba(255, 255, 255, 0.9)',
  },
});

