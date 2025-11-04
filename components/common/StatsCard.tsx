import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Card } from './Card';
import { darkTheme } from '@/styles/theme';

export interface StatsCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  iconColor?: string;
}

export function StatsCard({ label, value, icon }: StatsCardProps) {
  return (
    <Pressable style={styles.cardWrapper}>
      <Card>
        <View style={styles.cardContent}>
          <View style={styles.container}>
            <View style={styles.content}>
              <Text style={styles.label}>{label}</Text>
              <Text style={styles.value}>{value}</Text>
            </View>
            <View style={styles.iconContainer}>
              {icon}
            </View>
          </View>
        </View>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    width: '100%',
  },
  cardContent: {
    padding: 16, // p-4 = 16px
  },
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    color: darkTheme.color.mutedForeground,
    marginBottom: 4, // space-y-1 equivalent
  },
  value: {
    fontSize: 24, // text-2xl
    fontWeight: '700',
    color: darkTheme.color.foreground,
  },
  iconContainer: {
    width: 32, // h-8 w-8
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

