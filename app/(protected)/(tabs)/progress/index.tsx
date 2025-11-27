import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, RefreshControl, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { RootState } from '@/state/store';
import { useResponsive } from '@/hooks/use-responsive';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/Card';
import { MeasurementCard } from '@/components/measurements/MeasurementCard';
import { MeasurementDialog } from '@/components/measurements/MeasurementDialog';
import { AddMeasurementDialog } from '@/components/measurements/AddMeasurementDialog';
import { ProgressCharts } from '@/components/measurements/ProgressCharts';
import { EntryDetailsDialog } from '@/components/measurements/EntryDetailsDialog';
import { ImageLightbox } from '@/components/common/ImageLightbox';
import { useMeasurements } from '@/hooks/measurements/use-measurements';
import { Measurement, MeasurementHistory, MeasurementEntry } from '@/types/measurements';
import { darkTheme } from '@/styles/theme';
import { spacingStyles, textStyles } from '@/styles/shared-styles';
import { env } from '@/config/env';

/**
 * Helper function to get full image URL from path
 * Storage paths like "/storage/company-1/..." need to use base server URL (not /api)
 */
const getImageUrl = (path: string): string => {
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

/**
 * 📊 Measurements Screen
 * 
 * Displays body measurements with three tabs: Trends, Analytics, and History
 * Connected to real API via Redux
 */
export default function ProgressScreen() {
  const {
    templates,
    templatesLoading,
    history,
    historyLoading,
    historyPagination,
    loadHistory,
    submitting,
    submitNewMeasurement,
  } = useMeasurements();

  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedMeasurement, setSelectedMeasurement] = useState<Measurement | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<MeasurementEntry | null>(null);
  const [bottomTab, setBottomTab] = useState<'trends' | 'analytics' | 'history'>('trends');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [lightboxInitialIndex, setLightboxInitialIndex] = useState(0);
  const [lightboxVisible, setLightboxVisible] = useState(false);

  // Get companyId from auth state
  const selectedCompanyId = useSelector((state: RootState) => state.auth.selectedCompanyId);
  
  // Responsive grid
  const { isTablet, isDesktop } = useResponsive();
  const getGridColumns = () => {
    if (isDesktop) return 4;
    if (isTablet) return 2;
    return 1;
  };

  // Convert template fields to Measurement format for display
  const measurements = useMemo((): Measurement[] => {
    const template = templates[0]; // Use first template for now
    if (!template) return [];

    // Map template fields to Measurement objects
    return template.selectedFields.map((field, index) => {
      // Build history for this field (sorted by date descending)
      const fieldHistory = history
        .filter(entry => entry.measurements[field.field] !== undefined)
        .map(entry => ({
          date: entry.date,
          value: entry.measurements[field.field]!,
        }));

      // Get the latest value for THIS SPECIFIC FIELD (not from the latest entry)
      const latestFieldEntry = fieldHistory[0];
      const currentValue = latestFieldEntry?.value || 0;
      const currentDate = latestFieldEntry?.date || new Date().toISOString();
      
      // Calculate change from previous entry for this field
      let change: number | undefined;
      if (fieldHistory.length > 1) {
        const previousValue = fieldHistory[1].value;
        change = currentValue - previousValue;
      }

      return {
        id: String(index + 1),
        name: field.label,
        value: currentValue,
        unit: field.unit,
        date: currentDate,
        change,
        history: fieldHistory,
      };
    });
  }, [history, templates]);

  const getMeasurement = (id: string) => measurements.find((m) => m.id === id);

  const getMeasurementHistory = (measurementId: string): MeasurementHistory[] => {
    const measurement = getMeasurement(measurementId);
    if (!measurement || !measurement.history) return [];

    return measurement.history.map(h => ({
      date: h.date,
      time: new Date(h.date).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      value: h.value,
      images: [],
    }));
  };

  // Handle clicking on a history entry - show all measurements from that entry
  const handleHistoryEntryClick = (entryId: number) => {
    const entry = history.find(e => e.id === entryId);
    if (!entry) return;
    
    setSelectedEntry(entry);
  };

  // Handle clicking on an image - open lightbox
  const handleImageClick = (images: { path: string }[], initialIndex: number) => {
    const imagePaths = images.map(img => getImageUrl(img.path));
    setLightboxImages(imagePaths);
    setLightboxInitialIndex(initialIndex);
    setLightboxVisible(true);
  };

  const handleSubmitNewMeasurement = async (values: { [key: string]: string }, images: string[]) => {
    if (!templates[0]) {
      Alert.alert('Error', 'No measurement template available');
      return;
    }

    if (!selectedCompanyId) {
      Alert.alert('Error', 'Company ID not found');
      return;
    }

    const template = templates[0];
    const companyId = parseInt(selectedCompanyId, 10);

    if (isNaN(companyId)) {
      Alert.alert('Error', 'Invalid company ID');
      return;
    }

    // Convert form values to measurements object
    const measurementsData: { [key: string]: number } = {};
    Object.entries(values).forEach(([measurementId, value]) => {
      const measurement = getMeasurement(measurementId);
      if (measurement && value) {
        // Map measurement ID back to field name
        const field = template.selectedFields.find(f => f.label === measurement.name);
        if (field) {
          measurementsData[field.field] = parseFloat(value);
        }
      }
    });

    // Prepare image data
    const imageData = images.map((img, idx) => ({
      data: img,
      fileName: `measurement-${Date.now()}-${idx}.jpg`,
      mimeType: 'image/jpeg' as const,
    }));

    try {
      await submitNewMeasurement({
        companyId,
        templateId: template.id,
        measurements: measurementsData,
        images: imageData.length > 0 ? imageData : undefined,
      });

      Alert.alert('Success', 'Measurements saved successfully!');
      setShowAddForm(false);
      
      // Refresh history
      await loadHistory();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to submit measurements');
    }
  };

  // Handle quick add measurement from detail dialog
  const handleQuickAddMeasurement = async (measurementId: string, value: number, images?: string[]) => {
    if (!templates[0]) {
      throw new Error('No measurement template available');
    }

    if (!selectedCompanyId) {
      throw new Error('Company ID not found');
    }

    const template = templates[0];
    const companyId = parseInt(selectedCompanyId, 10);

    if (isNaN(companyId)) {
      throw new Error('Invalid company ID');
    }

    const measurement = getMeasurement(measurementId);
    if (!measurement) {
      throw new Error('Measurement not found');
    }

    // Map measurement ID back to field name
    const field = template.selectedFields.find(f => f.label === measurement.name);
    if (!field) {
      throw new Error('Field not found in template');
    }

    const measurementsData: { [key: string]: number } = {
      [field.field]: value,
    };

    // Prepare image data if images are provided
    const imageData = images?.map((img, idx) => ({
      data: img,
      fileName: `measurement-${Date.now()}-${idx}.jpg`,
      mimeType: 'image/jpeg' as const,
    }));

    await submitNewMeasurement({
      companyId,
      templateId: template.id,
      measurements: measurementsData,
      images: imageData && imageData.length > 0 ? imageData : undefined,
    });

    // Refresh history
    await loadHistory();
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    await loadHistory();
    setIsRefreshing(false);
  };

  // Load history on mount
  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  // Categorize measurements by type
  const categorizedMeasurements = useMemo(() => {
    const categories = {
      bodyComposition: [] as Measurement[],
      upperBody: [] as Measurement[],
      coreWaist: [] as Measurement[],
      lowerBody: [] as Measurement[],
      other: [] as Measurement[],
    };

    measurements.forEach((m) => {
      const name = m.name.toLowerCase();
      
      // Body Composition
      if (
        name.includes('weight') ||
        name.includes('body fat') ||
        name.includes('muscle mass') ||
        name.includes('bmi') ||
        name.includes('body water') ||
        name.includes('bone mass') ||
        name.includes('visceral fat') ||
        name.includes('metabolic age') ||
        name.includes('protein') ||
        name.includes('bmr')
      ) {
        categories.bodyComposition.push(m);
      }
      // Upper Body
      else if (
        name.includes('neck') ||
        name.includes('shoulder') ||
        name.includes('chest') ||
        name.includes('bicep') ||
        name.includes('forearm') ||
        name.includes('wrist')
      ) {
        categories.upperBody.push(m);
      }
      // Core & Waist
      else if (
        name.includes('waist') ||
        name.includes('hip') ||
        name.includes('abdomen')
      ) {
        categories.coreWaist.push(m);
      }
      // Lower Body
      else if (
        name.includes('thigh') ||
        name.includes('calf') ||
        name.includes('calve') ||
        name.includes('ankle')
      ) {
        categories.lowerBody.push(m);
      }
      // Other
      else {
        categories.other.push(m);
      }
    });

    return categories;
  }, [measurements]);

  // Stats
  const totalMetrics = measurements.length;
  const improvedMetrics = measurements.filter((m) => (m.change ?? 0) > 0).length;
  const metricsWithGoals = measurements.filter((m) => m.goal !== undefined).length;
  const totalEntries = history.length;

  // Loading state
  if (templatesLoading && templates.length === 0) {
    return (
      <MainLayout title="Measurements" description="Loading templates...">
        <View style={styles.centerContainer}>
          <Text style={styles.loadingText}>Loading measurement templates...</Text>
        </View>
      </MainLayout>
    );
  }

  // No templates state
  if (templates.length === 0) {
    return (
      <MainLayout title="Measurements" description="No templates available">
        <View style={styles.centerContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={darkTheme.color.mutedForeground} />
          <Text style={styles.emptyText}>No measurement templates available</Text>
          <Text style={styles.emptySubtext}>Ask your trainer to create a template</Text>
        </View>
      </MainLayout>
    );
  }

  return (
    <MainLayout 
        title="Measurements" 
        description="Track your body metrics and progress"
        refreshControl={
          <RefreshControl 
            refreshing={isRefreshing} 
            onRefresh={onRefresh}
            tintColor={darkTheme.color.primary}
          />
        }
      >
        {/* Add New Measurement Button */}
        <View style={styles.addButtonContainer}>
          <Pressable 
            onPress={() => setShowAddForm(true)} 
            style={styles.addButton}
            disabled={submitting}
          >
            {submitting ? (
              <Text style={styles.addButtonText}>Submitting...</Text>
            ) : (
              <>
                <Ionicons name="add" size={20} color={darkTheme.color.primaryForeground} />
                <Text style={styles.addButtonText}>Add New Measurement</Text>
              </>
            )}
          </Pressable>
        </View>

      {/* Content based on selected tab */}
      {bottomTab === 'analytics' ? (
        <View style={styles.content}>
          <ProgressCharts measurements={measurements} />
        </View>
      ) : bottomTab === 'history' ? (
        <View style={styles.content}>
          <View style={styles.historyHeader}>
            <Text style={styles.sectionTitle}>Measurement History</Text>
            {history.length > 0 && (
              <Text style={styles.historyCount}>
                {history.length} {history.length === 1 ? 'entry' : 'entries'}
              </Text>
            )}
          </View>
          {historyLoading && history.length === 0 ? (
            <View style={styles.centerContainer}>
              <Text style={styles.loadingText}>Loading history...</Text>
            </View>
          ) : history.length === 0 ? (
            <View style={styles.centerContainer}>
              <Ionicons name="calendar-outline" size={48} color={darkTheme.color.mutedForeground} />
              <Text style={styles.emptyText}>No measurements yet</Text>
              <Text style={styles.emptySubtext}>Tap the button above to add your first measurement</Text>
            </View>
          ) : (
            <View style={[
              styles.historyList,
              getGridColumns() === 4 && styles.gridDesktop,
              getGridColumns() === 2 && styles.gridTablet,
              getGridColumns() === 1 && styles.gridMobile,
            ]}>
              {history.map((entry) => (
                <View
                  key={entry.id}
                  style={[
                    styles.historyItem,
                    getGridColumns() === 4 && styles.measurementItemDesktop,
                    getGridColumns() === 2 && styles.measurementItemTablet,
                    getGridColumns() === 1 && styles.measurementItemMobile,
                  ]}
                >
                  <Pressable onPress={() => handleHistoryEntryClick(entry.id)}>
                    <Card style={styles.historyCard}>
                    <View style={styles.historyCardContent}>
                      <View style={styles.historyCardHeader}>
                        <View style={styles.historyCardDate}>
                          <Ionicons name="calendar" size={16} color={darkTheme.color.primary} />
                          <Text style={styles.historyCardDateText}>
                            {new Date(entry.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </Text>
                        </View>
                        <View style={styles.historyCardStats}>
                          {entry.images.length > 0 && (
                            <View style={styles.historyCardImageCount}>
                              <Ionicons name="image" size={14} color={darkTheme.color.primary} />
                              <Text style={styles.historyCardImageText}>
                                {entry.images.length}
                              </Text>
                            </View>
                          )}
                        </View>
                      </View>

                      <View style={styles.historyCardValues}>
                        {Object.entries(entry.measurements)
                          .slice(0, 4)
                          .map(([fieldName, value]) => {
                            const field = templates[0]?.selectedFields.find(f => f.field === fieldName);
                            return field ? (
                              <View key={fieldName} style={styles.historyValue}>
                                <Text style={styles.historyValueLabel}>{field.label}: </Text>
                                <Text style={styles.historyValueText}>
                                  {value}{field.unit}
                                </Text>
                              </View>
                            ) : null;
                          })}
                        {Object.keys(entry.measurements).length > 4 && (
                          <Text style={styles.historyMoreText}>
                            +{Object.keys(entry.measurements).length - 4} more
                          </Text>
                        )}
                      </View>

                      {entry.images.length > 0 && (
                        <View style={styles.historyImages}>
                          {entry.images.slice(0, 3).map((img, imgIdx) => (
                            <Pressable
                              key={imgIdx}
                              onPress={() => handleImageClick(entry.images, imgIdx)}
                            >
                              <Image
                                source={{ uri: getImageUrl(img.path) }}
                                style={styles.historyImage}
                                resizeMode="cover"
                              />
                            </Pressable>
                          ))}
                          {entry.images.length > 3 && (
                            <Pressable 
                              style={styles.historyImageMore}
                              onPress={() => handleImageClick(entry.images, 3)}
                            >
                              <Text style={styles.historyImageMoreText}>
                                +{entry.images.length - 3}
                              </Text>
                            </Pressable>
                          )}
                        </View>
                      )}
                    </View>
                    </Card>
                  </Pressable>
                </View>
              ))}
              {historyPagination?.hasMore && (
                <Pressable
                  style={styles.loadMoreButton}
                  onPress={() => loadHistory({ offset: history.length })}
                >
                  <Text style={styles.loadMoreText}>Load More</Text>
                </Pressable>
              )}
            </View>
          )}
        </View>
      ) : (
        <View style={styles.content}>
          {/* Stats Overview */}
          <View style={[
            styles.statsGrid,
            getGridColumns() === 4 && styles.gridDesktop,
            getGridColumns() === 2 && styles.gridTablet,
            getGridColumns() === 1 && styles.gridMobile,
          ]}>
            <View style={[
              styles.statItem,
              getGridColumns() === 4 && styles.measurementItemDesktop,
              getGridColumns() === 2 && styles.measurementItemTablet,
              getGridColumns() === 1 && styles.measurementItemMobile,
            ]}>
              <Card style={[styles.statCard, styles.statCardPrimary]}>
                <View style={styles.statContent}>
                  <View style={styles.statIcon}>
                    <Ionicons name="analytics" size={20} color={darkTheme.color.primary} />
                  </View>
                  <View>
                    <Text style={styles.statLabel}>Total Metrics</Text>
                    <Text style={styles.statValue}>{totalMetrics}</Text>
                  </View>
                </View>
              </Card>
            </View>

            <View style={[
              styles.statItem,
              getGridColumns() === 4 && styles.measurementItemDesktop,
              getGridColumns() === 2 && styles.measurementItemTablet,
              getGridColumns() === 1 && styles.measurementItemMobile,
            ]}>
              <Card style={[styles.statCard, styles.statCardSuccess]}>
                <View style={styles.statContent}>
                  <View style={[styles.statIcon, styles.statIconSuccess]}>
                    <Ionicons name="trending-up" size={20} color={darkTheme.color.success} />
                  </View>
                  <View>
                    <Text style={styles.statLabel}>Improved</Text>
                    <Text style={styles.statValue}>{improvedMetrics}</Text>
                  </View>
                </View>
              </Card>
            </View>

            <View style={[
              styles.statItem,
              getGridColumns() === 4 && styles.measurementItemDesktop,
              getGridColumns() === 2 && styles.measurementItemTablet,
              getGridColumns() === 1 && styles.measurementItemMobile,
            ]}>
              <Card style={[styles.statCard, styles.statCardWarning]}>
                <View style={styles.statContent}>
                  <View style={[styles.statIcon, styles.statIconWarning]}>
                    <Ionicons name="flag" size={20} color={darkTheme.color.warning} />
                  </View>
                  <View>
                    <Text style={styles.statLabel}>With Goals</Text>
                    <Text style={styles.statValue}>{metricsWithGoals}</Text>
                  </View>
                </View>
              </Card>
            </View>

            <View style={[
              styles.statItem,
              getGridColumns() === 4 && styles.measurementItemDesktop,
              getGridColumns() === 2 && styles.measurementItemTablet,
              getGridColumns() === 1 && styles.measurementItemMobile,
            ]}>
              <Card style={[styles.statCard, styles.statCardInfo]}>
                <View style={styles.statContent}>
                  <View style={[styles.statIcon, styles.statIconInfo]}>
                    <Ionicons name="time" size={20} color={darkTheme.color.info} />
                  </View>
                  <View>
                    <Text style={styles.statLabel}>Tracked</Text>
                    <Text style={styles.statValue}>{totalEntries}</Text>
                  </View>
                </View>
              </Card>
            </View>
          </View>

          {measurements.length === 0 ? (
            <View style={styles.centerContainer}>
              <Ionicons name="body-outline" size={48} color={darkTheme.color.mutedForeground} />
              <Text style={styles.emptyText}>No measurements yet</Text>
              <Text style={styles.emptySubtext}>Add your first measurement to start tracking</Text>
            </View>
          ) : (
            <>
              {/* Body Composition */}
              {categorizedMeasurements.bodyComposition.length > 0 && (
                <View style={styles.category}>
                  <View style={styles.categoryHeader}>
                    <View style={styles.categoryIndicator} />
                    <Text style={styles.categoryTitle}>Body Composition</Text>
                  </View>
                  <View style={[
                    styles.categoryGrid,
                    getGridColumns() === 4 && styles.gridDesktop,
                    getGridColumns() === 2 && styles.gridTablet,
                    getGridColumns() === 1 && styles.gridMobile,
                  ]}>
                    {categorizedMeasurements.bodyComposition.map((m) => (
                      <View
                        key={m.id}
                        style={[
                          styles.measurementItem,
                          getGridColumns() === 4 && styles.measurementItemDesktop,
                          getGridColumns() === 2 && styles.measurementItemTablet,
                          getGridColumns() === 1 && styles.measurementItemMobile,
                        ]}
                      >
                        <MeasurementCard
                          measurement={m}
                          onClick={() => setSelectedMeasurement(m)}
                        />
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* Upper Body */}
              {categorizedMeasurements.upperBody.length > 0 && (
                <View style={styles.category}>
                  <View style={styles.categoryHeader}>
                    <View style={styles.categoryIndicator} />
                    <Text style={styles.categoryTitle}>Upper Body</Text>
                  </View>
                  <View style={[
                    styles.categoryGrid,
                    getGridColumns() === 4 && styles.gridDesktop,
                    getGridColumns() === 2 && styles.gridTablet,
                    getGridColumns() === 1 && styles.gridMobile,
                  ]}>
                    {categorizedMeasurements.upperBody.map((m) => (
                      <View
                        key={m.id}
                        style={[
                          styles.measurementItem,
                          getGridColumns() === 4 && styles.measurementItemDesktop,
                          getGridColumns() === 2 && styles.measurementItemTablet,
                          getGridColumns() === 1 && styles.measurementItemMobile,
                        ]}
                      >
                        <MeasurementCard
                          measurement={m}
                          onClick={() => setSelectedMeasurement(m)}
                        />
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* Core & Waist */}
              {categorizedMeasurements.coreWaist.length > 0 && (
                <View style={styles.category}>
                  <View style={styles.categoryHeader}>
                    <View style={styles.categoryIndicator} />
                    <Text style={styles.categoryTitle}>Core & Waist</Text>
                  </View>
                  <View style={[
                    styles.categoryGrid,
                    getGridColumns() === 4 && styles.gridDesktop,
                    getGridColumns() === 2 && styles.gridTablet,
                    getGridColumns() === 1 && styles.gridMobile,
                  ]}>
                    {categorizedMeasurements.coreWaist.map((m) => (
                      <View
                        key={m.id}
                        style={[
                          styles.measurementItem,
                          getGridColumns() === 4 && styles.measurementItemDesktop,
                          getGridColumns() === 2 && styles.measurementItemTablet,
                          getGridColumns() === 1 && styles.measurementItemMobile,
                        ]}
                      >
                        <MeasurementCard
                          measurement={m}
                          onClick={() => setSelectedMeasurement(m)}
                        />
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* Lower Body */}
              {categorizedMeasurements.lowerBody.length > 0 && (
                <View style={styles.category}>
                  <View style={styles.categoryHeader}>
                    <View style={styles.categoryIndicator} />
                    <Text style={styles.categoryTitle}>Lower Body</Text>
                  </View>
                  <View style={[
                    styles.categoryGrid,
                    getGridColumns() === 4 && styles.gridDesktop,
                    getGridColumns() === 2 && styles.gridTablet,
                    getGridColumns() === 1 && styles.gridMobile,
                  ]}>
                    {categorizedMeasurements.lowerBody.map((m) => (
                      <View
                        key={m.id}
                        style={[
                          styles.measurementItem,
                          getGridColumns() === 4 && styles.measurementItemDesktop,
                          getGridColumns() === 2 && styles.measurementItemTablet,
                          getGridColumns() === 1 && styles.measurementItemMobile,
                        ]}
                      >
                        <MeasurementCard
                          measurement={m}
                          onClick={() => setSelectedMeasurement(m)}
                        />
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* Other Metrics */}
              {categorizedMeasurements.other.length > 0 && (
                <View style={styles.category}>
                  <View style={styles.categoryHeader}>
                    <View style={styles.categoryIndicator} />
                    <Text style={styles.categoryTitle}>Other Metrics</Text>
                  </View>
                  <View style={[
                    styles.categoryGrid,
                    getGridColumns() === 4 && styles.gridDesktop,
                    getGridColumns() === 2 && styles.gridTablet,
                    getGridColumns() === 1 && styles.gridMobile,
                  ]}>
                    {categorizedMeasurements.other.map((m) => (
                      <View
                        key={m.id}
                        style={[
                          styles.measurementItem,
                          getGridColumns() === 4 && styles.measurementItemDesktop,
                          getGridColumns() === 2 && styles.measurementItemTablet,
                          getGridColumns() === 1 && styles.measurementItemMobile,
                        ]}
                      >
                        <MeasurementCard
                          measurement={m}
                          onClick={() => setSelectedMeasurement(m)}
                        />
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* Progress Images */}
              {(() => {
                // Collect all images from history
                const allImages: Array<{ entryId: number; image: typeof history[0]['images'][0]; imageIndex: number }> = [];
                history.forEach(entry => {
                  entry.images.forEach((img, imgIdx) => {
                    allImages.push({ entryId: entry.id, image: img, imageIndex: imgIdx });
                  });
                });

                if (allImages.length === 0) return null;

                return (
                  <View style={styles.category}>
                    <View style={styles.categoryHeader}>
                      <View style={styles.categoryIndicator} />
                      <Text style={styles.categoryTitle}>Progress Images</Text>
                      <Text style={styles.categoryCount}>({allImages.length})</Text>
                    </View>
                    <View style={[
                      styles.progressImagesGrid,
                      getGridColumns() === 4 && styles.progressImagesGridDesktop,
                      getGridColumns() === 2 && styles.progressImagesGridTablet,
                      getGridColumns() === 1 && styles.progressImagesGridMobile,
                    ]}>
                      {allImages.map(({ entryId, image, imageIndex }, idx) => {
                        const entry = history.find(e => e.id === entryId);
                        if (!entry) return null;

                        return (
                          <Pressable
                            key={`${entryId}-${imageIndex}-${idx}`}
                            style={[
                              styles.progressImageItem,
                              getGridColumns() === 4 && styles.progressImageItemDesktop,
                              getGridColumns() === 2 && styles.progressImageItemTablet,
                              getGridColumns() === 1 && styles.progressImageItemMobile,
                            ]}
                            onPress={() => handleImageClick(entry.images, imageIndex)}
                          >
                            <Image
                              source={{ uri: getImageUrl(image.path) }}
                              style={styles.progressImage}
                              resizeMode="cover"
                            />
                            <View style={styles.progressImageOverlay}>
                              <Text style={styles.progressImageDate}>
                                {new Date(entry.date).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                })}
                              </Text>
                            </View>
                          </Pressable>
                        );
                      })}
                    </View>
                  </View>
                );
              })()}
            </>
          )}
        </View>
      )}

      {/* Floating Tab Navigation */}
      <View style={styles.floatingNav}>
        <Pressable
          onPress={() => setBottomTab('trends')}
          style={[styles.navButton, bottomTab === 'trends' && styles.navButtonActive]}
        >
          <Ionicons 
            name="analytics" 
            size={20} 
            color={bottomTab === 'trends' ? darkTheme.color.primaryForeground : darkTheme.color.mutedForeground} 
          />
        </Pressable>
        <Pressable
          onPress={() => setBottomTab('analytics')}
          style={[styles.navButton, bottomTab === 'analytics' && styles.navButtonActive]}
        >
          <Ionicons 
            name="bar-chart" 
            size={20} 
            color={bottomTab === 'analytics' ? darkTheme.color.primaryForeground : darkTheme.color.mutedForeground} 
          />
        </Pressable>
        <Pressable
          onPress={() => setBottomTab('history')}
          style={[styles.navButton, bottomTab === 'history' && styles.navButtonActive]}
        >
          <Ionicons 
            name="time" 
            size={20} 
            color={bottomTab === 'history' ? darkTheme.color.primaryForeground : darkTheme.color.mutedForeground} 
          />
        </Pressable>
      </View>

      {/* Dialogs */}
      <AddMeasurementDialog
        visible={showAddForm}
        onClose={() => setShowAddForm(false)}
        measurements={measurements}
        onSubmit={handleSubmitNewMeasurement}
      />

      <MeasurementDialog
        visible={!!selectedMeasurement}
        onClose={() => setSelectedMeasurement(null)}
        measurement={selectedMeasurement}
        history={selectedMeasurement ? getMeasurementHistory(selectedMeasurement.id) : []}
        onQuickAdd={handleQuickAddMeasurement}
      />

      <EntryDetailsDialog
        visible={!!selectedEntry}
        onClose={() => setSelectedEntry(null)}
        entry={selectedEntry}
        template={templates[0] || null}
      />

      <ImageLightbox
        images={lightboxImages}
        initialIndex={lightboxInitialIndex}
        visible={lightboxVisible}
        onClose={() => setLightboxVisible(false)}
      />
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    ...spacingStyles.p24,
    gap: 12,
  },
  loadingText: {
    ...textStyles.body,
    color: darkTheme.color.mutedForeground,
  },
  emptyText: {
    ...textStyles.body,
    color: darkTheme.color.mutedForeground,
    textAlign: 'center',
  },
  emptySubtext: {
    ...textStyles.small,
    color: darkTheme.color.mutedForeground,
    textAlign: 'center',
  },
  addButtonContainer: {
    ...spacingStyles.p16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: darkTheme.color.border,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: darkTheme.color.primary,
    padding: 16,
    borderRadius: 8,
  },
  addButtonText: {
    ...textStyles.bodyMedium,
    color: darkTheme.color.primaryForeground,
  },
  content: {
    flex: 1,
    ...spacingStyles.p16,
  },
  sectionTitle: {
    ...textStyles.h3,
    color: darkTheme.color.foreground,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...spacingStyles.mb16,
  },
  historyCount: {
    ...textStyles.small,
    color: darkTheme.color.mutedForeground,
  },
  statsGrid: {
    gap: 12,
    ...spacingStyles.mb24,
  },
  statItem: {
    gap: 12,
  },
  statCard: {
    marginBottom: 0,
  },
  statCardPrimary: {
    backgroundColor: `${darkTheme.color.primary}1A`,
    borderColor: `${darkTheme.color.primary}33`,
  },
  statCardSuccess: {
    backgroundColor: `${darkTheme.color.success}1A`,
    borderColor: `${darkTheme.color.success}33`,
  },
  statCardWarning: {
    backgroundColor: `${darkTheme.color.warning}1A`,
    borderColor: `${darkTheme.color.warning}33`,
  },
  statCardInfo: {
    backgroundColor: `${darkTheme.color.info}1A`,
    borderColor: `${darkTheme.color.info}33`,
  },
  statContent: {
    ...spacingStyles.p16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: `${darkTheme.color.primary}1A`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statIconSuccess: {
    backgroundColor: `${darkTheme.color.success}1A`,
  },
  statIconWarning: {
    backgroundColor: `${darkTheme.color.warning}1A`,
  },
  statIconInfo: {
    backgroundColor: `${darkTheme.color.info}1A`,
  },
  statLabel: {
    ...textStyles.small,
    color: darkTheme.color.mutedForeground,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: darkTheme.color.foreground,
  },
  category: {
    ...spacingStyles.mb32,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    ...spacingStyles.mb16,
  },
  categoryIndicator: {
    width: 32,
    height: 4,
    backgroundColor: darkTheme.color.primary,
    borderRadius: 2,
  },
  categoryTitle: {
    ...textStyles.h3,
    color: darkTheme.color.foreground,
  },
  categoryCount: {
    ...textStyles.body,
    color: darkTheme.color.mutedForeground,
  },
  categoryGrid: {
    gap: 16,
  },
  gridMobile: {
    flexDirection: 'column',
  },
  gridTablet: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  gridDesktop: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  measurementItem: {
    gap: 16,
  },
  measurementItemMobile: {
    width: '100%',
  },
  measurementItemTablet: {
    flexBasis: '48%',
    flexGrow: 0,
    flexShrink: 0,
  },
  measurementItemDesktop: {
    flexBasis: '23%',
    flexGrow: 0,
    flexShrink: 0,
  },
  progressImagesGrid: {
    gap: 12,
  },
  progressImagesGridMobile: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  progressImagesGridTablet: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  progressImagesGridDesktop: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  progressImageItem: {
    position: 'relative',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: darkTheme.color.border,
  },
  progressImageItemMobile: {
    width: '48%',
    aspectRatio: 1,
  },
  progressImageItemTablet: {
    width: '23.5%',
    aspectRatio: 1,
  },
  progressImageItemDesktop: {
    width: '18%',
    aspectRatio: 1,
  },
  progressImage: {
    width: '100%',
    height: '100%',
  },
  progressImageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 8,
  },
  progressImageDate: {
    ...textStyles.small,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  historyList: {
    gap: 16,
  },
  historyItem: {
    gap: 16,
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
    alignItems: 'flex-start',
    ...spacingStyles.mb8,
  },
  historyCardDate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  historyCardDateText: {
    ...textStyles.bodyMedium,
    color: darkTheme.color.foreground,
  },
  historyCardStats: {
    alignItems: 'flex-end',
    gap: 4,
  },
  historyCardCount: {
    ...textStyles.small,
    color: darkTheme.color.mutedForeground,
  },
  historyCardImageCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  historyCardImageText: {
    ...textStyles.small,
    color: darkTheme.color.primary,
    fontWeight: '600',
  },
  historyCardValues: {
    gap: 8,
  },
  historyValue: {
    flexDirection: 'row',
  },
  historyValueLabel: {
    ...textStyles.small,
    color: darkTheme.color.mutedForeground,
  },
  historyValueText: {
    ...textStyles.smallMedium,
    color: darkTheme.color.foreground,
  },
  historyMoreText: {
    ...textStyles.small,
    color: darkTheme.color.mutedForeground,
  },
  historyImages: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  historyImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: darkTheme.color.border,
  },
  historyImageMore: {
    width: 80,
    height: 80,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: darkTheme.color.border,
    backgroundColor: `${darkTheme.color.primary}1A`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyImageMoreText: {
    ...textStyles.bodyMedium,
    color: darkTheme.color.primary,
    fontWeight: '700',
  },
  loadMoreButton: {
    ...spacingStyles.p16,
    backgroundColor: darkTheme.color.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: darkTheme.color.border,
    alignItems: 'center',
  },
  loadMoreText: {
    ...textStyles.bodyMedium,
    color: darkTheme.color.primary,
  },
  floatingNav: {
    position: 'absolute',
    right: 16,
    top: 150, // Above the bottom navigation
    gap: 8,
    zIndex: 50,
  },
  navButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${darkTheme.color.card}CC`,
    borderWidth: 1,
    borderColor: darkTheme.color.border,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  navButtonActive: {
    backgroundColor: darkTheme.color.primary,
    borderColor: darkTheme.color.primary,
    shadowColor: darkTheme.color.primary,
    shadowOpacity: 0.5,
  },
});
