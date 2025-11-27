import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Pressable, TextInput, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Modal } from '@/components/ui/Modal';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Measurement, MeasurementHistory } from '@/types/measurements';
import { darkTheme } from '@/styles/theme';
import { spacingStyles, textStyles, layoutStyles } from '@/styles/shared-styles';

interface MeasurementDialogProps {
  visible: boolean;
  onClose: () => void;
  measurement: Measurement | null;
  history: MeasurementHistory[];
  onQuickAdd?: (measurementId: string, value: number, images?: string[]) => Promise<void>;
}

export function MeasurementDialog({ visible, onClose, measurement, history, onQuickAdd }: MeasurementDialogProps) {
  const [quickAddValue, setQuickAddValue] = useState('');
  const [quickAddImages, setQuickAddImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!measurement) return null;

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets) {
        const base64Images = result.assets
          .filter(asset => asset.base64)
          .map(asset => `data:image/jpeg;base64,${asset.base64}`);
        
        setQuickAddImages(prev => [...prev, ...base64Images]);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleRemoveImage = (index: number) => {
    setQuickAddImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleQuickAdd = async () => {
    if (!quickAddValue.trim()) {
      Alert.alert('Error', 'Please enter a value');
      return;
    }

    const numValue = parseFloat(quickAddValue);
    if (isNaN(numValue)) {
      Alert.alert('Error', 'Please enter a valid number');
      return;
    }

    if (!onQuickAdd) {
      Alert.alert('Error', 'Quick add is not available');
      return;
    }

    try {
      setIsSubmitting(true);
      await onQuickAdd(measurement.id, numValue, quickAddImages.length > 0 ? quickAddImages : undefined);
      setQuickAddValue('');
      setQuickAddImages([]);
      Alert.alert('Success', 'Measurement added successfully!');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to add measurement');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      title={measurement.name}
      description="View measurement history and progress photos"
    >
      <View style={styles.container}>
        {/* Quick Add Section */}
        <Card style={styles.quickAddCard}>
          <View style={styles.quickAddContent}>
            <View style={styles.quickAddHeader}>
              <Ionicons name="flash" size={20} color={darkTheme.color.primary} />
              <Text style={styles.quickAddTitle}>Quick Add</Text>
            </View>
            
            <View style={styles.quickAddForm}>
              <View style={styles.inputRow}>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder={`Enter value`}
                    placeholderTextColor={darkTheme.color.mutedForeground}
                    keyboardType="decimal-pad"
                    value={quickAddValue}
                    onChangeText={setQuickAddValue}
                    editable={!isSubmitting}
                  />
                  <Text style={styles.inputUnit}>{measurement.unit}</Text>
                </View>
                
                <Pressable
                  style={styles.imageButton}
                  onPress={handlePickImage}
                  disabled={isSubmitting}
                >
                  <Ionicons 
                    name="camera" 
                    size={20} 
                    color={darkTheme.color.primary} 
                  />
                </Pressable>

                <Pressable
                  style={[styles.quickAddButton, isSubmitting && styles.quickAddButtonDisabled]}
                  onPress={handleQuickAdd}
                  disabled={isSubmitting}
                >
                  <Ionicons 
                    name="checkmark" 
                    size={20} 
                    color={darkTheme.color.primaryForeground} 
                  />
                </Pressable>
              </View>

              {/* Image Previews */}
              {quickAddImages.length > 0 && (
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  style={styles.imagePreviewScroll}
                >
                  <View style={styles.imagePreviewContainer}>
                    {quickAddImages.map((img, idx) => (
                      <View key={idx} style={styles.imagePreviewWrapper}>
                        <Image 
                          source={{ uri: img }} 
                          style={styles.imagePreview}
                          resizeMode="cover"
                        />
                        <Pressable
                          style={styles.removeImageButton}
                          onPress={() => handleRemoveImage(idx)}
                        >
                          <Ionicons name="close" size={14} color="#FFF" />
                        </Pressable>
                      </View>
                    ))}
                  </View>
                </ScrollView>
              )}
            </View>
          </View>
        </Card>

        {/* Current Value */}
        <Card style={styles.currentValueCard}>
          <View style={styles.currentValueContent}>
            <View style={styles.currentValueLeft}>
              <Text style={styles.currentValueLabel}>Current Value</Text>
              <Text style={styles.currentValue}>
                {measurement.value}
                <Text style={styles.currentUnit}> {measurement.unit}</Text>
              </Text>
              <Text style={styles.currentDate}>
                {new Date(measurement.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </Text>
            </View>
            {measurement.goal && (
              <View style={styles.currentValueRight}>
                <Text style={styles.goalLabel}>Goal</Text>
                <Text style={styles.goalValue}>
                  {measurement.goal}
                  <Text style={styles.goalUnit}> {measurement.unit}</Text>
                </Text>
              </View>
            )}
          </View>
        </Card>

        {/* History */}
        {history.length > 0 ? (
          <View style={styles.historySection}>
            <View style={styles.historyHeader}>
              <Ionicons name="time-outline" size={20} color={darkTheme.color.foreground} />
              <Text style={styles.historyTitle}>History ({history.length} entries)</Text>
            </View>
            
            <View style={styles.historyList}>
              {history.map((entry, idx) => {
                const prevEntry = history[idx + 1];
                let changeAmount = 0;
                let changeDirection: 'up' | 'down' | 'same' = 'same';
                
                if (prevEntry) {
                  changeAmount = entry.value - prevEntry.value;
                  if (changeAmount > 0) changeDirection = 'up';
                  else if (changeAmount < 0) changeDirection = 'down';
                }

                return (
                  <Card key={idx} style={styles.historyCard}>
                    <View style={styles.historyCardContent}>
                      <View style={styles.historyCardHeader}>
                        <View style={styles.historyCardLeft}>
                          <Text style={styles.historyValue}>
                            {entry.value}
                            <Text style={styles.historyUnit}> {measurement.unit}</Text>
                          </Text>
                          <Text style={styles.historyDate}>
                            {new Date(entry.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })} at {entry.time}
                          </Text>
                        </View>
                        
                        <View style={styles.historyCardRight}>
                          {idx < history.length - 1 && (
                            <Badge variant={
                              changeDirection === 'up' ? 'default' : 
                              changeDirection === 'down' ? 'destructive' : 
                              'secondary'
                            }>
                              <View style={styles.badgeContent}>
                                <Ionicons 
                                  name={
                                    changeDirection === 'up' ? 'trending-up' : 
                                    changeDirection === 'down' ? 'trending-down' : 
                                    'remove'
                                  } 
                                  size={12} 
                                  color={
                                    changeDirection === 'up' ? darkTheme.color.primaryForeground : 
                                    changeDirection === 'down' ? darkTheme.color.destructiveForeground : 
                                    darkTheme.color.secondaryForeground
                                  } 
                                />
                                <Text style={styles.badgeText}>
                                  {Math.abs(changeAmount).toFixed(1)}
                                </Text>
                              </View>
                            </Badge>
                          )}
                          
                          <Pressable
                            style={styles.deleteButton}
                            onPress={() => {
                              // TODO: Implement delete functionality
                              Alert.alert(
                                'Delete Entry',
                                'Are you sure you want to delete this measurement?',
                                [
                                  { text: 'Cancel', style: 'cancel' },
                                  { text: 'Delete', style: 'destructive', onPress: () => {
                                    Alert.alert('Info', 'Delete functionality coming soon!');
                                  }},
                                ]
                              );
                            }}
                          >
                            <Ionicons name="trash-outline" size={18} color={darkTheme.color.destructive} />
                          </Pressable>
                        </View>
                      </View>

                      {entry.images.length > 0 && (
                        <View style={styles.imageGrid}>
                          {entry.images.map((img, imgIdx) => (
                            <Pressable 
                              key={imgIdx}
                              style={styles.imageWrapper}
                              onPress={() => {
                                // TODO: Open full-screen image viewer
                                console.log('Open image:', img.path);
                              }}
                            >
                              <Image 
                                source={{ uri: img.path }} 
                                style={styles.image}
                                resizeMode="cover"
                              />
                            </Pressable>
                          ))}
                        </View>
                      )}
                    </View>
                  </Card>
                );
              })}
            </View>
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="time-outline" size={48} color={darkTheme.color.mutedForeground} />
            <Text style={styles.emptyText}>No history available for this measurement</Text>
          </View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 24,
  },
  quickAddCard: {
    backgroundColor: `${darkTheme.color.primary}0D`,
    borderColor: `${darkTheme.color.primary}33`,
  },
  quickAddContent: {
    ...spacingStyles.p16,
    gap: 12,
  },
  quickAddHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  quickAddTitle: {
    ...textStyles.bodyMedium,
    color: darkTheme.color.foreground,
    fontWeight: '600',
  },
  quickAddForm: {
    gap: 12,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: darkTheme.color.bg,
    borderWidth: 1,
    borderColor: darkTheme.color.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
    gap: 8,
  },
  input: {
    flex: 1,
    ...textStyles.body,
    color: darkTheme.color.foreground,
    fontSize: 16,
    fontWeight: '600',
  },
  inputUnit: {
    ...textStyles.body,
    color: darkTheme.color.mutedForeground,
    fontWeight: '500',
  },
  imageButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${darkTheme.color.primary}1A`,
    borderWidth: 1,
    borderColor: `${darkTheme.color.primary}33`,
    width: 48,
    height: 48,
    borderRadius: 8,
  },
  quickAddButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: darkTheme.color.primary,
    width: 48,
    height: 48,
    borderRadius: 8,
  },
  quickAddButtonDisabled: {
    opacity: 0.5,
  },
  imagePreviewScroll: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  imagePreviewContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  imagePreviewWrapper: {
    position: 'relative',
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: darkTheme.color.border,
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  removeImageButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: darkTheme.color.destructive,
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  currentValueCard: {
    backgroundColor: `${darkTheme.color.primary}1A`,
    borderColor: `${darkTheme.color.primary}33`,
  },
  currentValueContent: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  currentValueLeft: {
    flex: 1,
    gap: 4,
  },
  currentValueLabel: {
    ...textStyles.small,
    color: darkTheme.color.mutedForeground,
  },
  currentValue: {
    fontSize: 36,
    fontWeight: '700',
    color: darkTheme.color.foreground,
  },
  currentUnit: {
    fontSize: 20,
    fontWeight: '400',
    color: darkTheme.color.mutedForeground,
  },
  currentDate: {
    ...textStyles.small,
    color: darkTheme.color.mutedForeground,
  },
  currentValueRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  goalLabel: {
    ...textStyles.small,
    color: darkTheme.color.mutedForeground,
  },
  goalValue: {
    fontSize: 24,
    fontWeight: '700',
    color: darkTheme.color.primary,
  },
  goalUnit: {
    fontSize: 14,
    fontWeight: '400',
  },
  historySection: {
    gap: 16,
  },
  historyHeader: {
    ...layoutStyles.rowCenterGap8,
  },
  historyTitle: {
    ...textStyles.bodyMedium,
    color: darkTheme.color.foreground,
  },
  historyList: {
    gap: 12,
  },
  historyCard: {
    marginBottom: 0,
  },
  historyCardContent: {
    ...spacingStyles.p16,
    gap: 12,
  },
  historyCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  historyCardLeft: {
    flex: 1,
  },
  historyCardRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  historyValue: {
    fontSize: 18,
    fontWeight: '600',
    color: darkTheme.color.foreground,
  },
  historyUnit: {
    ...textStyles.small,
    fontWeight: '400',
    color: darkTheme.color.mutedForeground,
  },
  historyDate: {
    ...textStyles.small,
    color: darkTheme.color.mutedForeground,
    marginTop: 2,
  },
  deleteButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: `${darkTheme.color.destructive}1A`,
  },
  badgeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  imageWrapper: {
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: darkTheme.color.border,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    gap: 12,
  },
  emptyText: {
    ...textStyles.body,
    color: darkTheme.color.mutedForeground,
    textAlign: 'center',
  },
});

