import React, { useEffect } from 'react';
import { View, Text, StyleSheet, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/Button';
import { ReportCard } from '@/components/reports';
import { darkTheme } from '@/styles/theme';
import { textStyles, layoutStyles } from '@/styles/shared-styles';
import { useResponsive } from '@/hooks/use-responsive';
import { useReportsData } from '@/hooks/reports';
import type { Report } from '@/features/reports';

/**
 * 📝 Reports Screen
 * 
 * Displays pending and completed reports list.
 * Uses Redux for state management and API integration.
 */
export default function ReportsScreen() {
  const { isTablet, isDesktop } = useResponsive();
  const isTabletOrDesktop = isTablet || isDesktop;
  
  // Redux state and actions
  const {
    pendingReports,
    completedReports,
    loading,
    isRefreshing,
    isInitializing,
    error,
    initializeReports,
    refresh,
  } = useReportsData();

  // Initialize reports on mount
  useEffect(() => {
    initializeReports().catch((error) => {
      console.error('Failed to initialize reports:', error);
    });
  }, [initializeReports]);

  const handleReportPress = (report: Report) => {
    // Navigate to report detail page
    router.push(`/(protected)/(tabs)/reports/${report.responseId}` as any);
  };

  // Show loading state on initial load
  if ((loading || isInitializing) && pendingReports.length === 0 && completedReports.length === 0) {
    return (
      <MainLayout title="Reports" description="Track and submit your progress reports">
        <View style={styles.centerContainer}>
          <Text style={styles.loadingText}>Loading reports...</Text>
        </View>
      </MainLayout>
    );
  }

  // Show error state (but still allow refresh)
  if (error && pendingReports.length === 0 && completedReports.length === 0) {
    return (
      <MainLayout
        title="Reports"
        description="Unable to load reports"
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refresh}
            tintColor={darkTheme.color.primary}
          />
        }
      >
        <View style={styles.centerContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={darkTheme.color.destructive} />
          <Text style={styles.errorText}>{error}</Text>
          <Button onPress={refresh} title="Retry" />
        </View>
      </MainLayout>
    );
  }

  // Reports List View
  return (
    <MainLayout 
      title="Reports"
      description="Track and submit your progress reports"
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={refresh}
          tintColor={darkTheme.color.primary}
        />
      }
    >
      <View style={styles.listContainer}>
        {/* Header */}
        <View style={styles.pageHeader}>
          <Text style={[styles.pageTitle, isTabletOrDesktop && styles.pageTitleTablet]}>Reports</Text>
          <Text style={styles.pageDescription}>Complete forms sent by your trainer</Text>
        </View>

        {/* Pending Reports */}
        {pendingReports.length > 0 && (
          <View style={styles.reportsSection}>
            <View style={styles.sectionHeaderRow}>
              <Ionicons name="time-outline" size={20} color={darkTheme.color.warning} />
              <Text style={styles.sectionTitleLarge}>
                Pending Reports ({pendingReports.length})
              </Text>
            </View>

            <View
              style={[
                styles.reportsGrid,
                isTabletOrDesktop && styles.reportsGridTablet,
              ]}
            >
              {pendingReports.map((report) => (
                <View
                  key={report.responseId}
                  style={[
                    styles.reportCardItem,
                    isTabletOrDesktop && styles.reportCardItemTablet,
                  ]}
                >
                  <ReportCard
                    report={{
                      id: report.responseId.toString(),
                      title: report.title,
                      description: report.description,
                      dueDate: new Date(report.sentDate).toLocaleDateString(),
                      status: report.status || 'pending', // Use actual status from backend
                      createdBy:  report.trainerName,
                    }}
                    onPress={() => handleReportPress(report)}
                  />
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Completed Reports */}
        {completedReports.length > 0 && (
          <View style={styles.reportsSection}>
            <View style={styles.sectionHeaderRow}>
              <Ionicons name="checkmark-circle-outline" size={20} color={darkTheme.color.success} />
              <Text style={styles.sectionTitleLarge}>Completed Reports</Text>
            </View>

            <View
              style={[
                styles.reportsGrid,
                isTabletOrDesktop && styles.reportsGridTablet,
              ]}
            >
              {completedReports.map((report) => (
                <View
                  key={report.responseId}
                  style={[
                    styles.reportCardItem,
                    isTabletOrDesktop && styles.reportCardItemTablet,
                  ]}
                >
                  <ReportCard
                    report={{
                      id: report.responseId.toString(),
                      title: report.title,
                      description: report.description,
                      dueDate: new Date(report.sentDate).toLocaleDateString(),
                      status: report.status || 'completed', // Use actual status from backend
                      createdBy: report.trainerName,
                    }}
                    onPress={() => handleReportPress(report)}
                  />
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Empty State */}
        {pendingReports.length === 0 && completedReports.length === 0 && !loading && (
          <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={64} color={darkTheme.color.mutedForeground} />
            <Text style={styles.emptyText}>No reports available</Text>
            <Text style={styles.emptySubtext}>Your trainer will send you reports to complete</Text>
          </View>
        )}
      </View>
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  // Common
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

  // List View Styles
  listContainer: {
    width: '100%',
  },
  pageHeader: {
    gap: 8,
    marginBottom: 24,
  },
  pageTitle: {
    ...textStyles.h1,
    fontSize: 32,
    lineHeight: 40,
  },
  pageTitleTablet: {
    fontSize: 40,
    lineHeight: 48,
  },
  pageDescription: {
    ...textStyles.body,
    color: darkTheme.color.mutedForeground,
  },
  reportsSection: {
    gap: 16,
    marginBottom: 24,
  },
  sectionHeaderRow: {
    ...layoutStyles.rowCenterGap8,
  },
  sectionTitleLarge: {
    ...textStyles.h3,
    fontSize: 20,
    lineHeight: 28,
  },
  reportsGrid: {
    gap: 16,
  },
  reportsGridTablet: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  reportCardItem: {
    gap: 16,
  },
  reportCardItemTablet: {
    flexBasis: '48%',
    flexGrow: 0,
    flexShrink: 0,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
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
