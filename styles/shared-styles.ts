import { StyleSheet } from 'react-native';
import { darkTheme } from './theme';

/**
 * Shared style patterns extracted from repetitive code across components
 * This file consolidates common styles to maintain DRY principles
 */

// =============================================================================
// LAYOUT PATTERNS
// =============================================================================
export const layoutStyles = StyleSheet.create({
  // Flexbox row patterns (most repeated)
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowCenterGap4: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rowCenterGap8: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rowCenterGap12: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rowBetweenGap8: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  
  // Column patterns
  column: {
    flexDirection: 'column',
  },
  columnGap4: {
    flexDirection: 'column',
    gap: 4,
  },
  columnGap8: {
    flexDirection: 'column',
    gap: 8,
  },
  columnGap12: {
    flexDirection: 'column',
    gap: 12,
  },
  columnGap16: {
    flexDirection: 'column',
    gap: 16,
  },
  columnGap24: {
    flexDirection: 'column',
    gap: 24,
  },
  
  // Common flex values
  flex1: {
    flex: 1,
  },
});

// =============================================================================
// SPACING PATTERNS
// =============================================================================
export const spacingStyles = StyleSheet.create({
  // Padding - all sides
  p4: { padding: 4 },
  p8: { padding: 8 },
  p12: { padding: 12 },
  p16: { padding: 16 },
  p24: { padding: 24 },
  p32: { padding: 32 },
  
  // Padding - horizontal
  px4: { paddingHorizontal: 4 },
  px8: { paddingHorizontal: 8 },
  px12: { paddingHorizontal: 12 },
  px16: { paddingHorizontal: 16 },
  px24: { paddingHorizontal: 24 },
  px32: { paddingHorizontal: 32 },
  
  // Padding - vertical
  py4: { paddingVertical: 4 },
  py8: { paddingVertical: 8 },
  py12: { paddingVertical: 12 },
  py16: { paddingVertical: 16 },
  py24: { paddingVertical: 24 },
  
  // Padding - top
  pt4: { paddingTop: 4 },
  pt8: { paddingTop: 8 },
  pt12: { paddingTop: 12 },
  pt16: { paddingTop: 16 },
  pt24: { paddingTop: 24 },
  
  // Margin - bottom (most common)
  mb4: { marginBottom: 4 },
  mb8: { marginBottom: 8 },
  mb12: { marginBottom: 12 },
  mb16: { marginBottom: 16 },
  mb24: { marginBottom: 24 },
  mb32: { marginBottom: 32 },
  
  // Margin - top
  mt4: { marginTop: 4 },
  mt8: { marginTop: 8 },
  mt16: { marginTop: 16 },
});

// =============================================================================
// BORDER PATTERNS
// =============================================================================
export const borderStyles = StyleSheet.create({
  rounded2: { borderRadius: 2 },
  rounded4: { borderRadius: 4 },
  rounded8: { borderRadius: 8 },
  rounded10: { borderRadius: 10 },
  rounded12: { borderRadius: 12 },
  roundedFull: { borderRadius: 9999 },
  
  // Border with color
  border: {
    borderWidth: 1,
    borderColor: darkTheme.color.border,
  },
  borderTop: {
    borderTopWidth: 1,
    borderTopColor: darkTheme.color.border,
  },
});

// =============================================================================
// TYPOGRAPHY PATTERNS (extracted from repeated fontSize/fontWeight/color combos)
// =============================================================================
export const textStyles = StyleSheet.create({
  // Headings
  h1: {
    fontSize: 30,
    fontWeight: '700',
    color: darkTheme.color.foreground,
  },
  h2: {
    fontSize: 24,
    fontWeight: '700',
    color: darkTheme.color.foreground,
  },
  h3: {
    fontSize: 20,
    fontWeight: '700',
    color: darkTheme.color.foreground,
  },
  h4: {
    fontSize: 18,
    fontWeight: '600',
    color: darkTheme.color.foreground,
  },
  
  // Body text
  body: {
    fontSize: 16,
    color: darkTheme.color.foreground,
  },
  bodyMedium: {
    fontSize: 16,
    fontWeight: '500',
    color: darkTheme.color.foreground,
  },
  bodyMuted: {
    fontSize: 16,
    color: darkTheme.color.mutedForeground,
  },
  
  // Small text (most repeated - fontSize: 14)
  small: {
    fontSize: 14,
    color: darkTheme.color.foreground,
  },
  smallMuted: {
    fontSize: 14,
    color: darkTheme.color.mutedForeground,
  },
  smallMedium: {
    fontSize: 14,
    fontWeight: '500',
    color: darkTheme.color.foreground,
  },
  smallSemibold: {
    fontSize: 14,
    fontWeight: '600',
    color: darkTheme.color.foreground,
  },
  
  // Label text
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: darkTheme.color.foreground,
  },
  labelMuted: {
    fontSize: 14,
    color: darkTheme.color.mutedForeground,
  },
  
  // Value/Stats text
  value: {
    fontSize: 14,
    fontWeight: '500',
    color: darkTheme.color.foreground,
  },
  valueLarge: {
    fontSize: 20,
    fontWeight: '700',
    color: darkTheme.color.foreground,
  },
  valueXLarge: {
    fontSize: 24,
    fontWeight: '700',
    color: darkTheme.color.foreground,
  },
  
  // Special text
  caption: {
    fontSize: 12,
    color: darkTheme.color.mutedForeground,
  },
});

// =============================================================================
// COMMON COMPONENT PATTERNS
// =============================================================================
export const componentStyles = StyleSheet.create({
  // Card pattern (from Card.tsx)
  card: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: darkTheme.color.border,
    backgroundColor: darkTheme.color.card,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  
  // Section header pattern (repeated in home/index.tsx, TodayMeals, TodayExercises)
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  
  // List item pattern (repeated across components)
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
    backgroundColor: `${darkTheme.color.secondary}4D`, // 30% opacity
  },
  
  // Badge patterns
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeSuccess: {
    backgroundColor: `${darkTheme.color.success}33`, // 20% opacity
  },
  badgePrimary: {
    backgroundColor: `${darkTheme.color.primary}33`, // 20% opacity
  },
  badgeInfo: {
    backgroundColor: `${darkTheme.color.info}33`, // 20% opacity
  },
  
  // Icon container
  iconContainer: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Add opacity to a hex color
 * @param color - Hex color string
 * @param opacity - Opacity value 0-1
 */
export const withOpacity = (color: string, opacity: number): string => {
  const opacityHex = Math.floor(opacity * 255)
    .toString(16)
    .padStart(2, '0')
    .toUpperCase();
  return `${color}${opacityHex}`;
};

/**
 * Compose multiple style objects, filtering out falsy values
 */
export const composeStyles = (...styles: any[]): any[] => {
  return styles.filter(Boolean);
};

