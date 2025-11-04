import React from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { darkTheme } from '@/styles/theme';

export interface ProgressProps {
  value: number; // 0-100
  className?: string;
}

export function Progress({ value, className = '' }: ProgressProps) {
  const [animatedValue] = React.useState(new Animated.Value(0));

  React.useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: value,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [value, animatedValue]);

  const width = animatedValue.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.progressBar,
          {
            width: width,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    height: 8,
    width: '100%',
    overflow: 'hidden',
    borderRadius: 9999,
    backgroundColor: darkTheme.color.secondary,
  },
  progressBar: {
    height: 8,
    backgroundColor: darkTheme.color.primary,
    borderRadius: 9999,
  },
});
