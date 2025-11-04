import React from 'react';
import { View, Text, StyleSheet, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProgramCard } from '@/components/programs';
import { Button } from '@/components/ui/Button';
import { useProgramsData } from '@/hooks/programs/use-programs-data';
import { useResponsive } from '@/hooks/use-responsive';
import { RootState } from '@/state/store';
import { darkTheme } from '@/styles/theme';
import { textStyles } from '@/styles/shared-styles';

/**
 * 📋 Programs Screen
 * 
 * Displays list of fitness programs following the dashboard pattern.
 * Data is fetched from Redux store via useProgramsData hook.
 */
export default function ProgramsScreen() {
  const { isTablet, isDesktop } = useResponsive();
  const selectedCompanyId = useSelector((state: RootState) => state.auth.selectedCompanyId);
  const {
    programs,
    loading,
    isRefreshing,
    isInitializing,
    error,
    initializePrograms,
    refresh,
  } = useProgramsData();

  // Initialize programs on mount and when company changes
  const hasInitialized = React.useRef(false);
  const lastCompanyId = React.useRef<string | undefined>(undefined);
  
  React.useEffect(() => {
    if (!selectedCompanyId) {
      return; // Wait for company to be selected
    }

    // If company changed, reset initialization flag
    if (lastCompanyId.current && lastCompanyId.current !== selectedCompanyId) {
      hasInitialized.current = false;
    }
    lastCompanyId.current = selectedCompanyId;

    if (!hasInitialized.current) {
      hasInitialized.current = true;
      initializePrograms().catch((error) => {
        console.error('Failed to initialize programs:', error);
        hasInitialized.current = false; // Reset on error to allow retry
      });
    }
  }, [selectedCompanyId, initializePrograms]);

  // Handle program card press
  const handleProgramPress = (id: number) => {
    router.push(`/(protected)/(tabs)/programs/${id}` as any);
  };

  // Determine grid columns based on screen size
  const getGridColumns = () => {
    if (isDesktop) return 3;
    if (isTablet) return 2;
    return 1;
  };

  // Show loading state on initial load
  if ((loading || isInitializing) && programs.length === 0) {
    return (
      <MainLayout title="Programs" description="Choose your fitness program">
        <View style={styles.centerContainer}>
          <Text style={styles.loadingText}>Loading programs...</Text>
        </View>
      </MainLayout>
    );
  }

  // Show error state (but still allow refresh)
  if (error && programs.length === 0) {
    return (
      <MainLayout 
        title="Programs" 
        description="Unable to load programs"
        refreshControl={
          <RefreshControl 
            refreshing={isRefreshing} 
            onRefresh={() => refresh(1)}
            tintColor={darkTheme.color.primary}
          />
        }
      >
        <View style={styles.centerContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={darkTheme.color.destructive} />
          <Text style={styles.errorText}>{error}</Text>
          <Button onPress={() => refresh(1)} title="Retry" />
        </View>
      </MainLayout>
    );
  }

  return (
    <MainLayout 
      title="Programs" 
      description="Choose your fitness program"
      refreshControl={
        <RefreshControl 
          refreshing={isRefreshing} 
          onRefresh={() => refresh(1)}
          tintColor={darkTheme.color.primary}
        />
      }
    >
      <View style={styles.container}>
        <View style={styles.content}>
          {programs.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="fitness-outline" size={64} color={darkTheme.color.mutedForeground} />
              <Text style={styles.emptyText}>No programs available</Text>
              <Text style={styles.emptySubtext}>Check back later for new programs</Text>
            </View>
          ) : (
            <View style={[
              styles.grid,
              getGridColumns() === 3 && styles.gridDesktop,
              getGridColumns() === 2 && styles.gridTablet,
              getGridColumns() === 1 && styles.gridMobile,
            ]}>
              {programs.map((program) => (
                <View 
                  key={program.id}
                  style={[
                    styles.cardItem,
                    getGridColumns() === 3 && styles.cardItemDesktop,
                    getGridColumns() === 2 && styles.cardItemTablet,
                    getGridColumns() === 1 && styles.cardItemMobile,
                  ]}
                >
                  <ProgramCard
                    program={program}
                    onPress={handleProgramPress}
                  />
                </View>
              ))}
            </View>
          )}
        </View>
      </View>
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  content: {
    width: '100%',
    maxWidth: 1152, // max-w-6xl (1152px)
    alignSelf: 'center',
    gap: 24, // space-y-6
  },
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
  grid: {
    gap: 16, // gap-4
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
  cardItem: {
    gap: 16,
  },
  cardItemMobile: {
    width: '100%',
  },
  cardItemTablet: {
    flexBasis: '48%',
    flexGrow: 0,
    flexShrink: 0,
  },
  cardItemDesktop: {
    flexBasis: '31%',
    flexGrow: 0,
    flexShrink: 0,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 48,
    gap: 16,
  },
  emptyText: {
    ...textStyles.h4,
    color: darkTheme.color.foreground,
  },
  emptySubtext: {
    ...textStyles.body,
    color: darkTheme.color.mutedForeground,
    textAlign: 'center',
  },
});
