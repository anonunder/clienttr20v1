import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Modal } from '@/components/ui/Modal';
import { Card } from '@/components/ui/Card';
import { ImageLightbox } from '@/components/common/ImageLightbox';
import { MeasurementEntry, MeasurementTemplate } from '@/types/measurements';
import { darkTheme } from '@/styles/theme';
import { spacingStyles, textStyles, layoutStyles } from '@/styles/shared-styles';
import { env } from '@/config/env';

/**
 * Helper function to get full image URL from path
 * Storage paths like "/storage/company-1/..." need to use base server URL (not /api)
 */
const getImageUrl = (path: string): string => {
  if (!path) {
    return '';
  }
  
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // Extract base URL from apiBaseUrl (remove /api if present)
  // apiBaseUrl is like "http://localhost:3000/api"
  // We need "http://localhost:3000" for storage paths
  const baseUrl = env.apiBaseUrl.replace(/\/api\/?$/, '');
  
  // Ensure path starts with /
  const imagePath = path.startsWith('/') ? path : `/${path}`;
  
  return `${baseUrl}${imagePath}`;
};

interface EntryDetailsDialogProps {
  visible: boolean;
  onClose: () => void;
  entry: MeasurementEntry | null;
  template: MeasurementTemplate | null;
}

export function EntryDetailsDialog({ visible, onClose, entry, template }: EntryDetailsDialogProps) {
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [lightboxInitialIndex, setLightboxInitialIndex] = useState(0);
  const [lightboxVisible, setLightboxVisible] = useState(false);

  if (!entry || !template) return null;

  const handleImageClick = (index: number) => {
    const imagePaths = entry.images.map(img => getImageUrl(img.path));
    setLightboxImages(imagePaths);
    setLightboxInitialIndex(index);
    setLightboxVisible(true);
  };

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      title="Measurement Details"
      description={new Date(entry.date).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })}
    >
      <View style={styles.container}>
        {/* Time Badge */}
        <View style={styles.timeBadge}>
          <Ionicons name="time" size={16} color={darkTheme.color.info} />
          <Text style={styles.timeText}>
            {new Date(entry.date).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>

        {/* All Measurements Grid */}
        <View style={styles.measurementsGrid}>
          {Object.entries(entry.measurements).map(([fieldName, value]) => {
            const field = template.selectedFields.find(f => f.field === fieldName);
            if (!field) return null;

            return (
              <Card key={fieldName} style={styles.measurementCard}>
                <View style={styles.measurementContent}>
                  <Text style={styles.measurementLabel}>{field.label}</Text>
                  <Text style={styles.measurementValue}>
                    {value}
                    <Text style={styles.measurementUnit}> {field.unit}</Text>
                  </Text>
                </View>
              </Card>
            );
          })}
        </View>

        {/* Progress Photos */}
        {entry.images.length > 0 && (
          <View style={styles.imagesSection}>
            <View style={styles.imagesSectionHeader}>
              <Ionicons name="images" size={20} color={darkTheme.color.foreground} />
              <Text style={styles.imagesSectionTitle}>Progress Photos ({entry.images.length})</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imagesScroll}>
              <View style={styles.imagesGrid}>
                {entry.images.map((img, idx) => (
                  <Pressable
                    key={idx}
                    style={styles.imageWrapper}
                    onPress={() => handleImageClick(idx)}
                  >
                    <Image 
                      source={{ uri: getImageUrl(img.path) }} 
                      style={styles.image}
                      resizeMode="cover"
                    />
                  </Pressable>
                ))}
              </View>
            </ScrollView>
          </View>
        )}

        {/* Summary Stats */}
        <Card style={styles.summaryCard}>
          <View style={styles.summaryContent}>
            <View style={styles.summaryRow}>
              <Ionicons name="fitness" size={20} color={darkTheme.color.primary} />
              <Text style={styles.summaryText}>
                {Object.keys(entry.measurements).length} measurements recorded
              </Text>
            </View>
            {entry.images.length > 0 && (
              <View style={styles.summaryRow}>
                <Ionicons name="camera" size={20} color={darkTheme.color.success} />
                <Text style={styles.summaryText}>
                  {entry.images.length} progress photos attached
                </Text>
              </View>
            )}
          </View>
        </Card>
      </View>

      <ImageLightbox
        images={lightboxImages}
        initialIndex={lightboxInitialIndex}
        visible={lightboxVisible}
        onClose={() => setLightboxVisible(false)}
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 24,
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    ...spacingStyles.p12,
    backgroundColor: `${darkTheme.color.info}1A`,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  timeText: {
    ...textStyles.smallMedium,
    color: darkTheme.color.info,
  },
  measurementsGrid: {
    gap: 12,
  },
  measurementCard: {
    marginBottom: 0,
  },
  measurementContent: {
    ...spacingStyles.p16,
    gap: 4,
  },
  measurementLabel: {
    ...textStyles.small,
    color: darkTheme.color.mutedForeground,
  },
  measurementValue: {
    fontSize: 28,
    fontWeight: '700',
    color: darkTheme.color.foreground,
  },
  measurementUnit: {
    fontSize: 16,
    fontWeight: '400',
    color: darkTheme.color.mutedForeground,
  },
  imagesSection: {
    gap: 12,
  },
  imagesSectionHeader: {
    ...layoutStyles.rowCenterGap8,
  },
  imagesSectionTitle: {
    ...textStyles.bodyMedium,
    color: darkTheme.color.foreground,
  },
  imagesScroll: {
    marginHorizontal: -24, // Extend to edges
    paddingHorizontal: 24,
  },
  imagesGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  imageWrapper: {
    width: 200,
    height: 200,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: darkTheme.color.border,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  summaryCard: {
    backgroundColor: `${darkTheme.color.primary}0D`,
    borderColor: `${darkTheme.color.primary}33`,
    marginBottom: 0,
  },
  summaryContent: {
    ...spacingStyles.p16,
    gap: 12,
  },
  summaryRow: {
    ...layoutStyles.rowCenterGap8,
  },
  summaryText: {
    ...textStyles.body,
    color: darkTheme.color.foreground,
  },
});

