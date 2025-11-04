import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/programs/[programId]/PageHeader';
import { PlanCard } from '@/components/programs/PlanCard';
import { Button } from '@/components/ui/Button';
import { useProgramDetail } from '@/hooks/programs/use-program-detail';
import { darkTheme } from '@/styles/theme';
import { textStyles } from '@/styles/shared-styles';
import { env } from '@/config/env';


/**
 * Program Detail Screen
 * Displays program details with training and nutrition plans
 */
export default function ProgramDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { programDetail, loading, error } = useProgramDetail(id || '');

  // Construct image URL from storage path
  // Storage paths like "/storage/company-1/..." need to use base server URL (not /api)
  const getImageUrl = (imageUri: string | null | undefined): string => {
    if (!imageUri) {
      return 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80';
    }
    
    if (imageUri.startsWith('http')) {
      return imageUri;
    }
    
    // Extract base URL from apiBaseUrl (remove /api if present)
    // apiBaseUrl is like "http://localhost:3000/api"
    // We need "http://localhost:3000" for storage paths
    const baseUrl = env.apiBaseUrl.replace(/\/api\/?$/, '');
    
    // Ensure imageUri starts with /
    const imagePath = imageUri.startsWith('/') ? imageUri : `/${imageUri}`;
    
    return `${baseUrl}${imagePath}`;
  };
  
  const imageUrl = getImageUrl(programDetail?.imageUri);

  // Calculate duration string
  const duration = programDetail?.duration || 'N/A';
  
  // Calculate weeks from duration (if available)
  const calculateWeeks = (durationStr: string | null): number => {
    if (!durationStr) return 0;
    const weeks = parseInt(durationStr.replace(/\D/g, ''));
    return weeks || 0;
  };
  
  const weeks = calculateWeeks(programDetail?.duration || null);
  const workouts = weeks * 3; // ~3 workouts per week

  // Calculate full-width header container styles
  // Must be called before any conditional returns to follow Rules of Hooks
  const headerContainerStyle = useMemo(() => {
    const screenWidth = Dimensions.get('window').width;
    const maxWidth = 1200;
    const padding = 16;
    
    // When screen is wider than maxWidth, content is centered
    // Calculate negative margins to break out to full screen width
    const marginLeft = screenWidth > maxWidth 
      ? -(screenWidth - maxWidth) / 2 - padding
      : -padding;
    const marginRight = screenWidth > maxWidth
      ? -(screenWidth - maxWidth) / 2 - padding
      : -padding;
    
    return {
      width: screenWidth,
      marginTop: -32,
      marginLeft,
      marginRight,
      marginBottom: -24,
    };
  }, []);

  // Handle back navigation
  const handleBack = () => {
    router.back();
  };

  // Handle training plan press
  const handleTrainingPress = () => {
    if (programDetail?.trainingPlanId) {
      router.push(`/(protected)/(tabs)/programs/training/${programDetail.trainingPlanId}` as any);
    }
  };

  // Handle nutrition plan press
  const handleNutritionPress = () => {
    if (programDetail?.nutritionPlanId) {
      router.push(`/(protected)/(tabs)/programs/nutrition/${programDetail.nutritionPlanId}` as any);
    }
  };

  // Loading state
  if (loading) {
    return (
      <MainLayout title="Program" hideNavigation={true}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={darkTheme.color.primary} />
          <Text style={styles.loadingText}>Loading program...</Text>
        </View>
      </MainLayout>
    );
  }

  // Error state
  if (error || !programDetail) {
    return (
      <MainLayout title="Program" hideNavigation={true}>
        <View style={styles.centerContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={darkTheme.color.destructive} />
          <Text style={styles.errorText}>{error || 'Program not found'}</Text>
          <Button onPress={handleBack} title="Go Back" />
        </View>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="" hideNavigation={false}>
      {/* Page Header - Full Width */}
      <View style={headerContainerStyle}>
        <PageHeader
          image={imageUrl}
          title={programDetail.title || 'Program'}
          subtitle={programDetail.description || undefined}
          onBack={handleBack}
        >
          <View style={styles.headerMeta}>
            <Ionicons name="calendar-outline" size={16} color="rgba(255, 255, 255, 0.8)" />
            <Text style={styles.headerMetaText}>{duration}</Text>
          </View>
        </PageHeader>
      </View>

      {/* Plans Section */}
      <View style={styles.content}>
        {/* Training Plan */}
        {programDetail.hasTrainingPlan && programDetail.trainingPlan && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>TRAININGS</Text>
            <PlanCard
              onPress={handleTrainingPress}
              image="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&q=80"
              name={programDetail.trainingPlan.title}
              info={[
                { icon: 'calendar-outline', text: weeks > 0 ? `${weeks} weeks` : duration },
                { icon: 'barbell-outline', text: workouts > 0 ? `${workouts} workouts` : 'Workouts' },
              ]}
            />
          </View>
        )}

        {/* Nutrition Plan */}
        {programDetail.hasNutritionPlan && programDetail.nutritionPlan && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>NUTRITION</Text>
            <PlanCard
              onPress={handleNutritionPress}
              image="https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&q=80"
              name={programDetail.nutritionPlan.title}
              info={[
                { icon: 'restaurant-outline', text: 'Meal Plans' },
              ]}
            />
          </View>
        )}
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
    minHeight: 400,
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
  headerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  headerMetaText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  content: {
    padding: 16,
    gap: 24,
    backgroundColor: darkTheme.color.bg,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    ...textStyles.h4,
    fontWeight: '700',
  },
});

