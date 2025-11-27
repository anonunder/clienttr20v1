import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/ui/Card';
import { darkTheme } from '@/styles/theme';

interface StatsCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  label: string;
  value: number;
  subtitle: string;
  subtitleIcon?: keyof typeof Ionicons.glyphMap;
  subtitleColor?: string;
}

export function StatsCard({ 
  icon, 
  iconColor, 
  label, 
  value, 
  subtitle,
  subtitleIcon,
  subtitleColor = darkTheme.color.mutedForeground
}: StatsCardProps) {
  return (
    <Card style={styles.card}>
      <View style={styles.content}>
        <View style={styles.labelRow}>
          <Ionicons name={icon} size={20} color={iconColor} />
          <Text style={styles.label}>{label}</Text>
        </View>
        <Text style={[styles.value, { color: iconColor }]}>{value}</Text>
        <View style={styles.subtitleRow}>
          {subtitleIcon && (
            <Ionicons name={subtitleIcon} size={16} color={subtitleColor} />
          )}
          <Text style={[styles.subtitle, { color: subtitleColor }]}>
            {subtitle}
          </Text>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 24,
  },
  content: {
    gap: 8,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    fontSize: 14,
    color: darkTheme.color.mutedForeground,
  },
  value: {
    fontSize: 36,
    fontWeight: '700',
    lineHeight: 40,
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  subtitle: {
    fontSize: 14,
  },
});

