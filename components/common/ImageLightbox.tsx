import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Modal,
  StyleSheet,
  Pressable,
  ScrollView,
  Dimensions,
  Platform,
  StatusBar,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { darkTheme } from '@/styles/theme';

interface ImageLightboxProps {
  images: string[];
  initialIndex: number;
  visible: boolean;
  onClose: () => void;
}

export function ImageLightbox({ images, initialIndex, visible, onClose }: ImageLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const scrollViewRef = useRef<ScrollView>(null);
  const { width, height } = Dimensions.get('window');

  const handleScroll = useCallback((event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / width);
    setCurrentIndex(index);
  }, [width]);

  // Scroll to initial index when modal opens or initialIndex changes
  useEffect(() => {
    if (visible && scrollViewRef.current) {
      console.log('🖼️ ImageLightbox - Scrolling to index:', initialIndex, 'width:', width, 'offset:', initialIndex * width);
      console.log('🖼️ ImageLightbox - Images:', images);
      // Small delay to ensure ScrollView is rendered
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({
          x: initialIndex * width,
          y: 0,
          animated: false,
        });
        setCurrentIndex(initialIndex);
      }, 50);
    }
  }, [visible, initialIndex, width, images]);

  if (!visible) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.closeButton} onPress={onClose}>
            {({ pressed }) => (
              <Ionicons
                name="close"
                size={28}
                color={darkTheme.color.foreground}
                style={[pressed && styles.closeButtonPressed]}
              />
            )}
          </Pressable>
          {images.length > 1 && (
            <View style={styles.counterContainer}>
              <Ionicons name="images-outline" size={20} color={darkTheme.color.foreground} />
            </View>
          )}
        </View>

        {/* Image Carousel */}
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          style={styles.scrollView}
        >
          {images.map((imageUri, index) => (
            <View key={`lightbox-${index}-${imageUri}`} style={[styles.imageContainer, { width, height }]}>
              <Pressable onPress={onClose} style={styles.imagePressable}>
                <Image
                  source={imageUri}
                  style={styles.image}
                  contentFit="contain"
                  cachePolicy="none"
                />
              </Pressable>
            </View>
          ))}
        </ScrollView>

        {/* Navigation Dots */}
        {images.length > 1 && (
          <View style={styles.dotsContainer}>
            {images.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  index === currentIndex && styles.dotActive,
                ]}
              />
            ))}
          </View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
  },
  header: {
    position: 'absolute',
    top: Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 44,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    zIndex: 10,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonPressed: {
    opacity: 0.7,
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePressable: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  dotsContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  dotActive: {
    backgroundColor: darkTheme.color.primary,
    width: 24,
  },
});

