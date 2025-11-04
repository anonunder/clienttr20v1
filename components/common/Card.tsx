import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { darkTheme } from '@/styles/theme';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <View style={styles.card}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 8, // rounded-lg
    borderWidth: 1,
    borderColor: darkTheme.color.border,
    backgroundColor: darkTheme.color.card,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
});

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function CardHeader({ children, className = '' }: CardHeaderProps) {
  return (
    <View className={`flex flex-col space-y-1.5 p-6 ${className}`}>
      {children}
    </View>
  );
}

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

export function CardTitle({ children, className = '' }: CardTitleProps) {
  return (
    <Text className={`text-2xl font-semibold leading-none tracking-tight text-card-foreground ${className}`}>
      {children}
    </Text>
  );
}

interface CardDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export function CardDescription({ children, className = '' }: CardDescriptionProps) {
  return (
    <Text className={`text-sm text-muted-foreground ${className}`}>
      {children}
    </Text>
  );
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export function CardContent({ children, className = '' }: CardContentProps) {
  return (
    <View className={`p-6 pt-0 ${className}`}>
      {children}
    </View>
  );
}

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function CardFooter({ children, className = '' }: CardFooterProps) {
  return (
    <View className={`flex flex-row items-center p-6 pt-0 ${className}`}>
      {children}
    </View>
  );
}

