import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Label } from '@/components/ui/Label';
import { Separator } from '@/components/ui/Separator';
import {
  InfoQuestion,
  TextQuestion,
  TextareaQuestion,
  OptionsQuestion,
  StarsQuestion,
} from '@/components/reports';
import { MeasurementCard } from '@/components/reports/MeasurementCard';
import { ImageUpload, UploadedImage } from '@/components/common/ImageUpload';
import { darkTheme } from '@/styles/theme';
import { textStyles, spacingStyles, layoutStyles, borderStyles } from '@/styles/shared-styles';
import { useResponsive } from '@/hooks/use-responsive';
import { useReportsData } from '@/hooks/reports';
import { QUESTION_TYPES } from '@/constants/reports';
import type { ReportQuestion, ReportResponse } from '@/features/reports';

/**
 * 📝 Report Detail Screen
 * 
 * Displays a single report with form submission functionality.
 */
export default function ReportDetailScreen() {
  const { responseId } = useLocalSearchParams<{ responseId: string }>();
  const { isTablet, isDesktop } = useResponsive();
  const isTabletOrDesktop = isTablet || isDesktop;

  const {
    selectedReport,
    loadingDetail,
    submitting,
    submitError,
    selectReport,
    submitReport,
    clearReport,
  } = useReportsData();

  const [formData, setFormData] = useState<Record<string, string | string[]>>({});
  const [measurementData, setMeasurementData] = useState<Record<string, string>>({});
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);

  // Load report on mount
  useEffect(() => {
    if (responseId) {
      const loadReport = async () => {
        try {
          await selectReport(parseInt(responseId, 10));
        } catch (error) {
          console.error('Failed to load report:', error);
          // Navigate back if report fails to load
          router.back();
        }
      };
      
      loadReport();
    }

    // Cleanup on unmount
    return () => {
      clearReport();
    };
  }, [responseId]);

  // Clear form when selected report changes
  useEffect(() => {
    if (!selectedReport) {
      setFormData({});
      setMeasurementData({});
      setUploadedImages([]);
    }
  }, [selectedReport]);

  const handleInputChange = (questionText: string, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [questionText]: value }));
  };

  const handleMeasurementChange = (fieldKey: string, value: string) => {
    setMeasurementData((prev) => ({ ...prev, [fieldKey]: value }));
  };

  const handleSubmit = async (isDraft: boolean = false) => {
    if (!selectedReport) return;

    // Filter out info questions from validation (they don't require input)
    const inputQuestions = selectedReport.questions.filter(q => q.type !== QUESTION_TYPES.INFO);
    const infoQuestions = selectedReport.questions.filter(q => q.type === QUESTION_TYPES.INFO);

    // Validate required fields only if not draft and there are non-info questions
    if (!isDraft && inputQuestions.length > 0) {
      const missingFields = inputQuestions
        .filter((q) => q.required && !formData[q.text])
        .map((q) => q.text);

      if (missingFields.length > 0) {
        console.warn(`Please fill in required fields: ${missingFields.join(', ')}`);
        // You can add a toast notification here
        return;
      }
    }

    // Build responses array
    const responses: ReportResponse[] = [];
    
    // Add input question responses
    inputQuestions.forEach((question) => {
      responses.push({
        question: question.text,
        answer: formData[question.text] || (question.type === 'checkbox' ? [] : ''),
      });
    });

    // If report only has info questions or has info questions, include them with true
    if (infoQuestions.length > 0) {
      infoQuestions.forEach((question) => {
        responses.push({
          question: question.text,
          answer: true, // Send true for info questions
        });
      });
    }

    try {
      await submitReport(
        selectedReport.responseId,
        responses,
        measurementData,
        uploadedImages,
        isDraft ? 'draft' : 'completed'
      );
      
      // If completed, clear form and navigate back
      if (!isDraft) {
        setFormData({});
        setMeasurementData({});
        setUploadedImages([]);
        router.back();
      }
      // If draft, keep the form data so user can continue editing
      // The report status will be updated in Redux automatically
      
      // You can add a success toast here
      console.log(isDraft ? 'Report saved as draft' : 'Report submitted successfully');
    } catch (error) {
      console.error('Failed to submit report:', error);
      // Error is handled by Redux, but you can add a toast here
    }
  };

  const handleBackToList = () => {
    router.back();
  };

  // Render question input based on type
  const renderQuestionInput = (question: ReportQuestion, index: number) => {
    const value = formData[question.text] || '';

    switch (question.type) {
      case QUESTION_TYPES.INFO:
        return <InfoQuestion key={index} text={question.text} />;

      case QUESTION_TYPES.TEXT:
      case QUESTION_TYPES.NUMBER:
        return (
          <TextQuestion
            key={index}
            text={question.text}
            value={value as string}
            required={question.required}
            type={question.type}
            onChangeText={(val) => handleInputChange(question.text, val)}
          />
        );

      case QUESTION_TYPES.TEXTAREA:
        return (
          <TextareaQuestion
            key={index}
            text={question.text}
            value={value as string}
            required={question.required}
            onChangeText={(val) => handleInputChange(question.text, val)}
          />
        );

      case QUESTION_TYPES.RADIO:
      case QUESTION_TYPES.SELECT:
        return (
          <OptionsQuestion
            key={index}
            text={question.text}
            value={value as string}
            options={question.options}
            required={question.required}
            multiSelect={false}
            onSelect={(val) => handleInputChange(question.text, val)}
          />
        );

      case QUESTION_TYPES.CHECKBOX:
        return (
          <OptionsQuestion
            key={index}
            text={question.text}
            value={(value as string[]) || []}
            options={question.options}
            required={question.required}
            multiSelect={true}
            onSelect={(val) => handleInputChange(question.text, val)}
          />
        );

      case QUESTION_TYPES.STARS:
        return (
          <StarsQuestion
            key={index}
            text={question.text}
            value={value as string}
            options={question.options}
            required={question.required}
            onSelect={(val) => handleInputChange(question.text, val)}
          />
        );

      default:
        return null;
    }
  };

  // Loading state
  if (loadingDetail || !selectedReport) {
    return (
      <MainLayout title="Loading..." description="">
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={darkTheme.color.primary} />
          <Text style={styles.loadingText}>Loading report...</Text>
        </View>
      </MainLayout>
    );
  }

  const isCompleted = selectedReport.status === 'completed';
  const isDraft = selectedReport.status === 'draft';

  return (
    <MainLayout
      title={selectedReport.title}
      description={selectedReport.description}
      hideNavigation={false}
    >
      <View style={[styles.detailContainer, isDesktop && styles.detailContainerWeb]}>
        {/* Back Button */}
        <Button variant="ghost" onPress={handleBackToList} size="sm">
          <View style={layoutStyles.rowCenterGap8}>
            <Ionicons name="arrow-back" size={20} color={darkTheme.color.foreground} />
            <Text style={styles.backButtonText}>Back to Reports</Text>
          </View>
        </Button>

        {/* Report Card */}
        <Card style={styles.detailCard}>
          <View style={styles.detailCardContent}>
            {/* Header */}
            <View style={styles.detailHeader}>
              <View style={layoutStyles.rowBetween}>
                <Text style={styles.detailTitle}>{selectedReport.title}</Text>
                {isDraft && (
                  <Badge variant="outline">
                    <Text style={styles.draftBadgeText}>Draft</Text>
                  </Badge>
                )}
              </View>
              <Text style={styles.detailDescription}>{selectedReport.description}</Text>
            </View>

            {/* Meta Information */}
            <View style={[styles.metaRow, isTabletOrDesktop && styles.metaRowTablet]}>
              <View style={styles.metaItem}>
                <Ionicons name="calendar-outline" size={16} color={darkTheme.color.mutedForeground} />
                <Text style={styles.metaText}>
                  Sent: {new Date(selectedReport.sentDate).toLocaleDateString()}
                </Text>
              </View>
              {isCompleted && selectedReport.submittedAt && (
                <View style={styles.metaItem}>
                  <Ionicons name="checkmark-circle-outline" size={16} color={darkTheme.color.success} />
                  <Text style={styles.metaText}>
                    Submitted: {new Date(selectedReport.submittedAt).toLocaleDateString()}
                  </Text>
                </View>
              )}
            </View>

            <Separator />

            {/* Form Fields Section */}
            {isCompleted && selectedReport.responses ? (
              <View style={styles.section}>
                <Badge variant="outline">
                  <View style={styles.completedBadge}>
                    <Text style={styles.completedBadgeText}>Completed</Text>
                  </View>
                </Badge>
                {selectedReport.responses.map((response, index) => (
                  <View key={index} style={styles.fieldGroup}>
                    <Label>{response.question}</Label>
                    <View style={styles.submittedValueContainer}>
                      <Text style={styles.submittedValue}>
                        {Array.isArray(response.answer)
                          ? response.answer.join(', ')
                          : response.answer || 'Not provided'}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.formSection}>
                {selectedReport.questions.map((question, index) =>
                  renderQuestionInput(question, index)
                )}

                {/* Detail Statistics Section */}
                {selectedReport.detailsStatistic && selectedReport.detailStatisticsFields && selectedReport.detailStatisticsFields.length > 0 && (
                  <View style={styles.statisticsSection}>
                    <Text style={styles.sectionTitle}>Body Measurements</Text>
                    <View style={styles.measurementsGrid}>
                      {selectedReport.detailStatisticsFields
                        .filter(field => field.enabled)
                        .sort((a, b) => a.order - b.order)
                        .map((field) => (
                          <View key={field.key} style={styles.measurementItem}>
                            <MeasurementCard
                              field={field}
                              value={measurementData[field.key] || ''}
                              onChange={(value) => handleMeasurementChange(field.key, value)}
                            />
                          </View>
                        ))}
                    </View>
                  </View>
                )}

                {/* Image Upload Section */}
                {selectedReport.uploadImage && (
                  <View style={styles.imageSection}>
                    <ImageUpload
                      images={uploadedImages}
                      onImagesChange={setUploadedImages}
                      maxImages={5}
                      label="Progress Photos"
                    />
                  </View>
                )}

                {/* Action Buttons */}
                <View style={styles.actionButtons}>
                  <Button
                    onPress={() => handleSubmit(false)}
                    size="lg"
                    disabled={submitting}
                    loading={submitting}
                  >
                    <View style={layoutStyles.rowCenterGap8}>
                      <Ionicons name="send" size={16} color={darkTheme.color.primaryForeground} />
                      <Text style={styles.submitButtonText}>
                        {submitting ? 'Submitting...' : 'Submit Report'}
                      </Text>
                    </View>
                  </Button>

                  <Button
                    onPress={() => handleSubmit(true)}
                    size="lg"
                    variant="outline"
                    disabled={submitting}
                  >
                    <View style={layoutStyles.rowCenterGap8}>
                      <Ionicons name="save-outline" size={16} color={darkTheme.color.foreground} />
                      <Text style={styles.draftButtonText}>Save as Draft</Text>
                    </View>
                  </Button>
                </View>

                {submitError && (
                  <View style={styles.errorContainer}>
                    <Ionicons name="alert-circle" size={20} color={darkTheme.color.destructive} />
                    <Text style={styles.errorText}>{submitError}</Text>
                  </View>
                )}
              </View>
            )}
          </View>
        </Card>
      </View>
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 16,
  },
  loadingText: {
    ...textStyles.body,
    color: darkTheme.color.mutedForeground,
  },
  errorText: {
    ...textStyles.body,
    color: darkTheme.color.destructive,
    textAlign: 'center',
    marginTop: 8,
  },
  errorContainer: {
    ...layoutStyles.rowCenterGap8,
    ...spacingStyles.p12,
    backgroundColor: `${darkTheme.color.destructive}1A`,
    ...borderStyles.rounded8,
    marginTop: 8,
  },
  detailContainer: {
    gap: 24,
  },
  detailContainerWeb: {
    maxWidth: 768,
    alignSelf: 'center',
    width: '100%',
  },
  backButtonText: {
    ...textStyles.body,
    color: darkTheme.color.foreground,
  },
  detailCard: {
    ...spacingStyles.p24,
  },
  detailCardContent: {
    gap: 16,
  },
  detailHeader: {
    gap: 8,
  },
  detailTitle: {
    ...textStyles.h2,
    fontSize: 24,
    lineHeight: 32,
  },
  detailDescription: {
    ...textStyles.small,
    color: darkTheme.color.mutedForeground,
    marginTop: 4,
  },
  metaRow: {
    gap: 16,
  },
  metaRowTablet: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  metaItem: {
    ...layoutStyles.rowCenterGap4,
  },
  metaText: {
    ...textStyles.small,
    color: darkTheme.color.mutedForeground,
  },
  section: {
    gap: 16,
  },
  completedBadge: {
    backgroundColor: `${darkTheme.color.success}33`,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  completedBadgeText: {
    color: darkTheme.color.success,
    fontSize: 12,
    fontWeight: '600',
  },
  formSection: {
    gap: 24,
  },
  statisticsSection: {
    gap: 16,
    marginTop: 16,
  },
  sectionTitle: {
    ...textStyles.body,
    fontSize: 16,
    fontWeight: '600',
    color: darkTheme.color.foreground,
    marginBottom: 16,
  },
  measurementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  measurementItem: {
    width: '48%', // 2 columns with gap
  },
  imageSection: {
    marginTop: 16,
  },
  actionButtons: {
    gap: 12,
  },
  draftButtonText: {
    color: darkTheme.color.foreground,
    fontSize: 16,
    fontWeight: '600',
  },
  draftBadgeText: {
    color: darkTheme.color.warning,
    fontSize: 12,
    fontWeight: '600',
  },
  fieldGroup: {
    gap: 8,
  },
  submittedValueContainer: {
    ...spacingStyles.p12,
    backgroundColor: `${darkTheme.color.secondary}4D`,
    ...borderStyles.rounded8,
  },
  submittedValue: {
    ...textStyles.body,
    color: darkTheme.color.foreground,
  },
  submitButtonText: {
    color: darkTheme.color.primaryForeground,
    fontSize: 16,
    fontWeight: '600',
  },
});

