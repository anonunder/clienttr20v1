import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Measurement } from '@/types/measurements';
import { darkTheme } from '@/styles/theme';
import { spacingStyles, textStyles, borderStyles } from '@/styles/shared-styles';

interface AddMeasurementDialogProps {
  visible: boolean;
  onClose: () => void;
  measurements: Measurement[];
  onSubmit: (values: { [key: string]: string }, images: string[]) => void;
}

export function AddMeasurementDialog({ 
  visible, 
  onClose, 
  measurements, 
  onSubmit 
}: AddMeasurementDialogProps) {
  const [formValues, setFormValues] = useState<{ [key: string]: string }>({});
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  const handleImageUpload = async () => {
    // Request permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please grant camera roll permissions to upload images.');
      return;
    }

    // Pick image
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled && result.assets) {
      const newImages = result.assets
        .filter(asset => asset.base64)
        .map(asset => `data:image/jpeg;base64,${asset.base64}`);
      setUploadedImages(prev => [...prev, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    onSubmit(formValues, uploadedImages);
    // Reset form
    setFormValues({});
    setUploadedImages([]);
  };

  const handleCancel = () => {
    setFormValues({});
    setUploadedImages([]);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      onClose={handleCancel}
      title="Add New Measurement"
      description="Fill in any measurements you want to track. All fields are optional."
    >
      <View style={styles.container}>
        {/* Date info */}
        <View style={styles.dateInfo}>
          <Ionicons name="calendar" size={16} color={darkTheme.color.primary} />
          <Text style={styles.dateText}>
            {new Date().toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })} at {new Date().toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>

        {/* Measurement Fields */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Body Measurements</Text>
          <View style={styles.fieldsGrid}>
            {measurements.map((m) => (
              <View key={m.id} style={styles.fieldContainer}>
                <Label>
                  {m.name} {m.unit && `(${m.unit})`}
                </Label>
                <Input
                  keyboardType="decimal-pad"
                  placeholder="Optional"
                  value={formValues[m.id] || ''}
                  onChangeText={(text) => 
                    setFormValues(prev => ({ ...prev, [m.id]: text }))
                  }
                />
              </View>
            ))}
          </View>
        </View>

        {/* Image Upload */}
        <View style={styles.section}>
          <Label>Progress Photos</Label>
          <View style={styles.imageSection}>
            <Pressable style={styles.uploadButton} onPress={handleImageUpload}>
              <View style={styles.uploadButtonContent}>
                <Ionicons name="cloud-upload" size={20} color={darkTheme.color.primaryForeground} />
                <Text style={styles.uploadButtonText}>Upload Images</Text>
              </View>
            </Pressable>
            <Text style={styles.imageCount}>{uploadedImages.length} image(s) selected</Text>
          </View>

          {uploadedImages.length > 0 && (
            <View style={styles.imageGrid}>
              {uploadedImages.map((img, idx) => (
                <View key={idx} style={styles.imageWrapper}>
                  <Image source={{ uri: img }} style={styles.image} resizeMode="cover" />
                  <Pressable style={styles.removeButton} onPress={() => removeImage(idx)}>
                    <Ionicons name="close" size={16} color={darkTheme.color.destructiveForeground} />
                  </Pressable>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <Pressable style={styles.actionButton} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Save Measurements</Text>
          </Pressable>
          <Pressable style={[styles.actionButton, styles.actionButtonOutline]} onPress={handleCancel}>
            <Text style={styles.buttonTextOutline}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 24,
  },
  dateInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    ...spacingStyles.p12,
    backgroundColor: `${darkTheme.color.primary}1A`,
    ...borderStyles.rounded8,
  },
  dateText: {
    ...textStyles.smallMedium,
    color: darkTheme.color.primary,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    ...textStyles.bodyMedium,
    color: darkTheme.color.foreground,
  },
  fieldsGrid: {
    gap: 16,
  },
  fieldContainer: {
    gap: 8,
  },
  imageSection: {
    gap: 8,
  },
  uploadButton: {
    backgroundColor: darkTheme.color.primary,
    ...borderStyles.rounded8,
    ...spacingStyles.p12,
  },
  uploadButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  uploadButtonText: {
    ...textStyles.bodyMedium,
    color: darkTheme.color.primaryForeground,
  },
  imageCount: {
    ...textStyles.small,
    color: darkTheme.color.mutedForeground,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  imageWrapper: {
    position: 'relative',
    width: 100,
    height: 100,
    ...borderStyles.rounded8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: darkTheme.color.border,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  removeButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: darkTheme.color.destructive,
    borderRadius: 12,
    padding: 4,
  },
  actions: {
    gap: 12,
    ...spacingStyles.pt8,
  },
  actionButton: {
    width: '100%',
    backgroundColor: darkTheme.color.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: darkTheme.color.border,
  },
  buttonText: {
    color: darkTheme.color.primaryForeground,
    ...textStyles.bodyMedium,
  },
  buttonTextOutline: {
    color: darkTheme.color.foreground,
    ...textStyles.bodyMedium,
  },
});

