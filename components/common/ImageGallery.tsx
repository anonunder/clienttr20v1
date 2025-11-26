import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { Card } from '@/components/ui/Card';
import { ImageLightbox } from '@/components/common/ImageLightbox';
import { darkTheme } from '@/styles/theme';
import { textStyles } from '@/styles/shared-styles';
import { env } from '@/config/env';
import { useResponsive } from '@/hooks/use-responsive';

interface ImageGalleryProps {
  images: string[];
  title?: string;
}

// Construct image URL from storage path
const getImageUrl = (imageUri: string | null | undefined): string => {
  if (!imageUri) {
    return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80';
  }
  
  const baseUrl = env.apiBaseUrl.replace(/\/api\/?$/, '');
  const imagePath = imageUri.startsWith('/') ? imageUri : `/${imageUri}`;
  
  return `${baseUrl}${imagePath}`;
};

// Separate component for each gallery image to prevent caching issues
const GalleryImage = ({ 
  imageUrl, 
  size, 
  onPress 
}: { 
  imageUrl: string; 
  size: number; 
  onPress: () => void;
}) => {
  return (
    <Pressable
      style={[styles.imageContainer, { width: size, height: size }]}
      onPress={onPress}
    >
      {({ pressed }) => (
        <Image
          source={imageUrl}
          style={[styles.image, pressed && styles.imagePressed]}
          contentFit="cover"
          cachePolicy="none"
          transition={200}
        />
      )}
    </Pressable>
  );
};

export function ImageGallery({ images, title = 'Gallery' }: ImageGalleryProps) {
  const { isMobile } = useResponsive();
  const [lightboxVisible, setLightboxVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Responsive image sizing
  const imageSize = useMemo(() => {
    return isMobile ? 120 : 140;
  }, [isMobile]);

  // Convert all images to full URLs
  const imageUrls = useMemo(() => {
    const urls = images.map(getImageUrl);
    console.log('🖼️ ImageGallery - Processing images:', {
      inputImages: images,
      outputUrls: urls,
      count: urls.length
    });
    return urls;
  }, [images]);

  const handleImagePress = (index: number) => {
    setSelectedImageIndex(index);
    setLightboxVisible(true);
  };

  const handleCloseLightbox = () => {
    setLightboxVisible(false);
  };

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <>
      <Card>
        <View style={styles.container}>
          <Text style={styles.title}>{title}</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            style={styles.scrollView}
          >
            {imageUrls.map((imageUrl, index) => (
              <GalleryImage
                key={`${imageUrl}-${index}`}
                imageUrl={imageUrl}
                size={imageSize}
                onPress={() => handleImagePress(index)}
              />
            ))}
          </ScrollView>
        </View>
      </Card>

      <ImageLightbox
        images={imageUrls}
        initialIndex={selectedImageIndex}
        visible={lightboxVisible}
        onClose={handleCloseLightbox}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
    padding: 16,
  },
  title: {
    ...textStyles.h3,
    fontSize: 16,
    fontWeight: '600',
    color: darkTheme.color.foreground,
  },
  scrollView: {
    width: '100%',
    marginHorizontal: -16, // Extend to edges
  },
  scrollContent: {
    gap: 12,
    paddingHorizontal: 16,
    paddingRight: 16,
  },
  imageContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: darkTheme.color.bgMuted,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePressed: {
    opacity: 0.8,
  },
});

