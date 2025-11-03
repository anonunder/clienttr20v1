import React from 'react';
import { View } from 'react-native';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return <View className={`bg-card rounded-xl p-4 border border-border ${className}`}>{children}</View>;
}

