import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { darkTheme } from '@/styles/theme';
import { textStyles, borderStyles, layoutStyles } from '@/styles/shared-styles';

export interface UploadedImage {
  uri: string;
  base64?: string;
  fileName?: string;
  mimeType?: string;
}

interface ImageUploadProps {
  images: UploadedImage[];
  onImagesChange: (images: UploadedImage[]) => void;
  maxImages?: number;
  label?: string;
}

/**
 * Reusable Image Upload Component
 * Works on Web, Android, and iOS
 */
export function ImageUpload({
  images,
  onImagesChange,
  maxImages = 5,
  label = 'Progress Photos',
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePickImages = async () => {
    try {
      // On web, trigger the file input
      if (Platform.OS === 'web') {
        fileInputRef.current?.click();
        return;
      }

      // Request permission for media library access (mobile only)
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        alert('Permission to access media library is required!');
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
        base64: true, // Get base64 for upload
        exif: false,
      });

      if (!result.canceled) {
        const newImages: UploadedImage[] = result.assets.map((asset) => ({
          uri: asset.uri,
          base64: asset.base64 || undefined,
          fileName: asset.fileName || `image_${Date.now()}.jpg`,
          mimeType: asset.mimeType || 'image/jpeg',
        }));

        // Limit the number of images
        const totalImages = [...images, ...newImages];
        const limitedImages = totalImages.slice(0, maxImages);

        onImagesChange(limitedImages);
      }
    } catch (error) {
      console.error('Error picking images:', error);
      alert('Failed to pick images. Please try again.');
    }
  };

  const handleWebFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const totalFiles = files.length;
    console.log('📸 Files selected:', totalFiles);
    
    const newImages: UploadedImage[] = [];
    let filesProcessed = 0;
    
    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const base64Data = base64String.split(',')[1]; // Remove data:image/... prefix
        
        const newImage: UploadedImage = {
          uri: base64String, // For display (includes data:image prefix)
          base64: base64Data, // For upload (base64 only)
          fileName: file.name,
          mimeType: file.type,
        };
        
        newImages.push(newImage);
        filesProcessed++;
        
        console.log(`📸 Processed ${filesProcessed}/${totalFiles}:`, newImage.fileName);
        
        // Update images when all files are read
        if (filesProcessed === totalFiles) {
          const totalImages = [...images, ...newImages];
          const limitedImages = totalImages.slice(0, maxImages);
          console.log('📸 Total images after update:', limitedImages.length, limitedImages);
          onImagesChange(limitedImages);
        }
      };
      reader.onerror = (error) => {
        console.error('📸 Error reading file:', file.name, error);
        filesProcessed++;
        // Still check if all files are processed even if one fails
        if (filesProcessed === totalFiles) {
          const totalImages = [...images, ...newImages];
          const limitedImages = totalImages.slice(0, maxImages);
          onImagesChange(limitedImages);
        }
      };
      reader.readAsDataURL(file);
    });

    // Reset input value so same file can be selected again
    if (event.target) {
      event.target.value = '';
    }
  };

  const handleTakePhoto = async () => {
    try {
      // Request camera permission
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

      if (!permissionResult.granted) {
        alert('Permission to access camera is required!');
        return;
      }

      // Launch camera
      const result = await ImagePicker.launchCameraAsync({
        quality: 0.8,
        base64: true,
        exif: false,
      });

      if (!result.canceled && result.assets[0]) {
        const newImage: UploadedImage = {
          uri: result.assets[0].uri,
          base64: result.assets[0].base64 || undefined,
          fileName: result.assets[0].fileName || `photo_${Date.now()}.jpg`,
          mimeType: result.assets[0].mimeType || 'image/jpeg',
        };

        // Limit the number of images
        const totalImages = [...images, newImage];
        const limitedImages = totalImages.slice(0, maxImages);

        onImagesChange(limitedImages);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      alert('Failed to take photo. Please try again.');
    }
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    onImagesChange(updatedImages);
  };

  const canAddMore = images.length < maxImages;

  return (
    <View style={styles.container}>
      {/* Label */}
      {label && <Text style={styles.label}>{label}</Text>}

      {/* Upload Buttons */}
      <View style={styles.buttonRow}>
        {canAddMore && (
          <>
            {Platform.OS === 'web' ? (
              <>
                <label htmlFor="image-upload" style={{ cursor: 'pointer' }}>
                  <View style={styles.uploadButton}>
                    <Ionicons name="cloud-upload-outline" size={16} color={darkTheme.color.primaryForeground} />
                    <Text style={styles.uploadButtonText}>Upload Images</Text>
                  </View>
                </label>
                <input
                  id="image-upload"
                  ref={fileInputRef as any}
                  type="file"
                  accept="image/*"
                  multiple
                  style={{ display: 'none' }}
                  onChange={handleWebFileInput as any}
                />
              </>
            ) : (
              <>
                <TouchableOpacity
                  style={styles.uploadButton}
                  onPress={handlePickImages}
                  activeOpacity={0.7}
                >
                  <Ionicons name="images-outline" size={16} color={darkTheme.color.primaryForeground} />
                  <Text style={styles.uploadButtonText}>Upload Images</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.cameraButton}
                  onPress={handleTakePhoto}
                  activeOpacity={0.7}
                >
                  <Ionicons name="camera-outline" size={16} color={darkTheme.color.foreground} />
                </TouchableOpacity>
              </>
            )}
          </>
        )}
        <Text style={styles.imageCount}>
          {images.length} image(s) selected
        </Text>
      </View>

      {/* Preview Grid - 3 columns like Progress.tsx */}
      {images.length > 0 && (
        <View style={styles.previewGrid}>
          {images.map((image, index) => (
            <View key={index} style={styles.imageWrapper}>
              <Image 
                source={{ uri: image.uri }} 
                style={styles.image}
                resizeMode="cover"
              />
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemoveImage(index)}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={16} color={darkTheme.color.destructiveForeground} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  label: {
    ...textStyles.small,
    fontWeight: '600',
    color: darkTheme.color.foreground,
    marginBottom: 8,
  },
  buttonRow: {
    ...layoutStyles.rowCenterGap8,
    flexWrap: 'wrap',
  },
  uploadButton: {
    ...layoutStyles.rowCenterGap8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: darkTheme.color.primary,
    ...borderStyles.rounded8,
  },
  cameraButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: darkTheme.color.border,
    ...borderStyles.rounded8,
  },
  uploadButtonText: {
    ...textStyles.small,
    color: darkTheme.color.primaryForeground,
  },
  imageCount: {
    ...textStyles.small,
    color: darkTheme.color.mutedForeground,
    marginLeft: 'auto',
  },
  previewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  imageWrapper: {
    position: 'relative',
    width: '31.5%', // 3 columns with gaps
    aspectRatio: 1,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: darkTheme.color.border,
  },
  removeButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: darkTheme.color.destructive,
    borderRadius: 12,
    opacity: 0.9,
  },
});

