import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/ui/Card';
import { darkTheme } from '@/styles/theme';
import { textStyles, spacingStyles, layoutStyles } from '@/styles/shared-styles';

export interface Report {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'completed' | 'draft' | 'submitted';
  createdBy: string;
}

export interface ReportCardProps {
  report: Report;
  onPress: () => void;
}

/**
 * ReportCard Component
 * 
 * A reusable card component for displaying report information.
 * Supports both pending and completed states with visual indicators.
 */
export const ReportCard = ({ report, onPress }: ReportCardProps) => {
  const isPending = report.status === 'pending';
  const isDraft = report.status === 'draft';
  const isCompleted = report.status === 'completed' || report.status === 'submitted';
  // Check if due date is today (only for pending/draft reports)
  const isDueToday = () => {
    if (!report.dueDate || isCompleted) return false;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Parse the due date (assuming format like "11/18/2025" from toLocaleDateString)
    const dueDate = new Date(report.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    
    return dueDate.getTime() === today.getTime();
  };

  const dueToday = isDueToday();

  // Get badge text and style based on status
  const getBadgeText = () => {
    if (isDraft) return 'Draft';
    if (isPending) return 'New';
    return 'Done';
  };

  const getBadgeStyle = () => {
    if (isDraft) return styles.badgeDraft;
    if (isPending) return styles.badgePending;
    return styles.badgeCompleted;
  };

  const getBadgeTextStyle = () => {
    if (isDraft) return styles.badgeTextDraft;
    if (isPending) return styles.badgeTextPending;
    return styles.badgeTextCompleted;
  };

  return (
    <Pressable onPress={onPress} style={styles.pressableContainer}>
      {({ pressed }) => (
        <Card style={[
          styles.card,
          isCompleted && styles.cardCompleted,
          pressed && styles.cardPressed,
        ]}>
          <View style={styles.cardContent}>
            {/* Badge - Absolutely positioned in top-right */}
            <View style={styles.badgeContainer}>
              <View style={[
                styles.badgeContent,
                getBadgeStyle(),
              ]}>
                <Text style={[
                  styles.badgeText,
                  getBadgeTextStyle(),
                ]}>
                  {getBadgeText()}
                </Text>
              </View>
            </View>

            {/* Title Section */}
            <View style={styles.titleSection}>
              <Text style={styles.title} numberOfLines={2}>
                {report.title}
              </Text>
              <Text style={styles.description} numberOfLines={2}>
                {report.description}
              </Text>
            </View>

            {/* Footer Section */}
            <View style={styles.footer}>
              <View style={styles.footerItem}>
                <Ionicons 
                  name="calendar-outline" 
                  size={16} 
                  color={dueToday ? darkTheme.color.destructive : darkTheme.color.mutedForeground} 
                />
                <Text style={[
                  styles.footerText,
                  dueToday && styles.footerTextDueToday,
                ]}>
                  Due: {report.dueDate}
                </Text>
              </View>
              <View style={styles.footerItem}>
                <Ionicons name="document-text-outline" size={16} color={darkTheme.color.mutedForeground} />
                <Text style={styles.footerText}>{report.createdBy}</Text>
              </View>
            </View>

            {/* Today reminder message */}
            {dueToday && (
              <View style={styles.todayReminder}>
                <Text style={styles.todayReminderText}>
                  Today is the day to answer this report
                </Text>
              </View>
            )}
          </View>
        </Card>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  pressableContainer: {
    width: '100%',
  },
  card: {
    ...spacingStyles.p24,
    position: 'relative',
  },
  cardCompleted: {
    opacity: 0.75,
  },
  cardPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  cardContent: {
    gap: 16,
  },
  badgeContainer: {
    position: 'absolute',
    top: 24,
    right: 24,
    zIndex: 10,
  },
  badgeContent: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  badgePending: {
    backgroundColor: `${darkTheme.color.warning}33`, // 20% opacity
  },
  badgeDraft: {
    backgroundColor: `${darkTheme.color.primary}33`, // 20% opacity
  },
  badgeCompleted: {
    backgroundColor: `${darkTheme.color.success}33`, // 20% opacity
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  badgeTextPending: {
    color: darkTheme.color.warning,
  },
  badgeTextDraft: {
    color: darkTheme.color.primary,
  },
  badgeTextCompleted: {
    color: darkTheme.color.success,
  },
  titleSection: {
    gap: 8,
    paddingRight: 60, // Make room for badge
  },
  title: {
    ...textStyles.h4,
    fontSize: 18,
    lineHeight: 24,
    color: darkTheme.color.foreground,
  },
  description: {
    ...textStyles.small,
    color: darkTheme.color.mutedForeground,
    lineHeight: 18,
  },
  footer: {
    ...layoutStyles.rowBetween,
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 8,
  },
  footerItem: {
    ...layoutStyles.rowCenterGap4,
  },
  footerText: {
    ...textStyles.small,
    color: darkTheme.color.mutedForeground,
  },
  footerTextDueToday: {
    color: darkTheme.color.destructive,
    fontWeight: '600',
  },
  todayReminder: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: `${darkTheme.color.mutedForeground}33`,
  },
  todayReminderText: {
    ...textStyles.small,
    fontSize: 12,
    fontStyle: 'italic',
    color: darkTheme.color.mutedForeground,
  },
});

