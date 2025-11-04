import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import AnimatedComponent, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, withSequence, withDelay, Easing } from 'react-native-reanimated';
import { Image } from 'expo-image';
import { Progress } from '@/components/ui/Progress';
import { darkTheme } from '@/styles/theme';

const loadingSteps = [
  { text: 'Initializing app...', progress: 15 },
  { text: 'Loading companies...', progress: 30 },
  { text: 'Fetching training programs...', progress: 50 },
  { text: 'Loading nutrition plans...', progress: 70 },
  { text: 'Preparing your dashboard...', progress: 85 },
  { text: 'Almost ready...', progress: 100 },
];

export default function LoadingScreen() {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const fadeAnim = useSharedValue(0);
  const scaleAnim = useSharedValue(0.95);
  const bounceAnim1 = useSharedValue(0);
  const bounceAnim2 = useSharedValue(0);
  const bounceAnim3 = useSharedValue(0);
  const pulseOpacity1 = useSharedValue(1);
  const pulseOpacity2 = useSharedValue(1);
  const pulseOpacity3 = useSharedValue(1);

  useEffect(() => {
    const stepDuration = 350; // ms per step

    // Fade in animation
    fadeAnim.value = withTiming(1, { duration: 300, easing: Easing.out(Easing.ease) });
    
    // Scale in animation for logo
    scaleAnim.value = withTiming(1, { duration: 300, easing: Easing.out(Easing.ease) });

    // Pulse animations for background circles with delays
    const pulseSequence = withRepeat(
      withSequence(
        withTiming(0.3, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      -1
    );

    pulseOpacity1.value = pulseSequence;
    pulseOpacity2.value = withDelay(1000, pulseSequence);
    pulseOpacity3.value = withDelay(500, pulseSequence);

    // Bounce animations for dots with delays
    const bounceSequence = withRepeat(
      withSequence(
        withTiming(-8, { duration: 400, easing: Easing.out(Easing.ease) }),
        withTiming(0, { duration: 400, easing: Easing.in(Easing.ease) })
      ),
      -1
    );

    bounceAnim1.value = bounceSequence;
    bounceAnim2.value = withDelay(100, bounceSequence);
    bounceAnim3.value = withDelay(200, bounceSequence);

    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < loadingSteps.length - 1) {
          const nextStep = prev + 1;
          setProgress(loadingSteps[nextStep].progress);
          return nextStep;
        }
        return prev;
      });
    }, stepDuration);

    const totalDuration = stepDuration * loadingSteps.length;
    const timer = setTimeout(() => {
      router.replace('/(auth)/login');
    }, totalDuration);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fadeStyle = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
  }));

  const scaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleAnim.value }],
  }));

  const bounceStyle1 = useAnimatedStyle(() => ({
    transform: [{ translateY: bounceAnim1.value }],
  }));

  const bounceStyle2 = useAnimatedStyle(() => ({
    transform: [{ translateY: bounceAnim2.value }],
  }));

  const bounceStyle3 = useAnimatedStyle(() => ({
    transform: [{ translateY: bounceAnim3.value }],
  }));

  const pulseStyle1 = useAnimatedStyle(() => ({
    opacity: pulseOpacity1.value,
  }));

  const pulseStyle2 = useAnimatedStyle(() => ({
    opacity: pulseOpacity2.value,
  }));

  const pulseStyle3 = useAnimatedStyle(() => ({
    opacity: pulseOpacity3.value,
  }));

  return (
    <View style={styles.container}>
      {/* Animated Background Gradient Overlay */}
      <LinearGradient
        colors={[
          `${darkTheme.color.primary}1A`,
          `${darkTheme.color.accent}1A`,
          `${darkTheme.color.primary}1A`,
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientOverlay}
      />

      {/* Animated Background Circles */}
      <View style={styles.circlesContainer}>
        <AnimatedComponent.View style={[styles.circle, styles.circle1, pulseStyle1]}>
          <View style={styles.circleBlur} />
        </AnimatedComponent.View>
        <AnimatedComponent.View style={[styles.circle, styles.circle2, pulseStyle2]}>
          <View style={styles.circleBlur} />
        </AnimatedComponent.View>
        <AnimatedComponent.View style={[styles.circle, styles.circle3, pulseStyle3]}>
          <View style={styles.circleBlur} />
        </AnimatedComponent.View>
      </View>

      <AnimatedComponent.View style={[styles.content, fadeStyle]}>
        {/* Logo with Scale Animation */}
        <AnimatedComponent.View style={scaleStyle}>
          <Image
            source={require('@/assets/images/fitness-logo.png')}
            style={styles.logoImage}
            contentFit="contain"
          />
        </AnimatedComponent.View>

        {/* App Title */}
        <Text style={styles.titleText}>FITNESS APP</Text>

        {/* Loading Status Text */}
        <View style={styles.statusContainer}>
          <Text key={currentStep} style={styles.statusText}>
            {loadingSteps[currentStep].text}
          </Text>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <Progress value={progress} />
          <View style={styles.progressLabels}>
            <Text style={styles.progressLabel}>Loading...</Text>
            <Text style={styles.progressPercent}>{progress}%</Text>
          </View>
        </View>

        {/* Animated Dots */}
        <View style={styles.dotsContainer}>
          <AnimatedComponent.View style={[styles.dot, styles.dot1, bounceStyle1]} />
          <AnimatedComponent.View style={[styles.dot, styles.dot2, bounceStyle2]} />
          <AnimatedComponent.View style={[styles.dot, styles.dot3, bounceStyle3]} />
        </View>
      </AnimatedComponent.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkTheme.color.bg,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  circlesContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  circle: {
    position: 'absolute',
    borderRadius: 9999,
  },
  circleBlur: {
    width: '100%',
    height: '100%',
    borderRadius: 9999,
  },
  circle1: {
    top: '25%',
    left: '25%',
    width: 256,
    height: 256,
    backgroundColor: `${darkTheme.color.primary}1A`,
  },
  circle2: {
    bottom: '25%',
    right: '25%',
    width: 384,
    height: 384,
    backgroundColor: `${darkTheme.color.accent}1A`,
  },
  circle3: {
    top: '50%',
    right: '33%',
    width: 192,
    height: 192,
    backgroundColor: `${darkTheme.color.primary}0D`,
  },
  content: {
    alignItems: 'center',
    maxWidth: 448,
    width: '100%',
    position: 'relative',
    zIndex: 10,
    gap: 32,
  },
  logoImage: {
    width: 160,
    height: 160,
    marginBottom: 0,
  },
  titleText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: darkTheme.color.primary,
    textAlign: 'center',
    letterSpacing: 2,
    marginBottom: 0,
  },
  statusContainer: {
    minHeight: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 0,
  },
  statusText: {
    color: `${darkTheme.color.foreground}CC`,
    textAlign: 'center',
    fontWeight: '500',
    fontSize: 18,
  },
  progressContainer: {
    width: '100%',
    maxWidth: 320,
    marginBottom: 0,
    gap: 12,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabel: {
    color: darkTheme.color.mutedForeground,
    fontSize: 14,
    fontWeight: '500',
  },
  progressPercent: {
    color: darkTheme.color.primary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 0,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  dot1: {
    backgroundColor: darkTheme.color.primary,
  },
  dot2: {
    backgroundColor: darkTheme.color.accent,
  },
  dot3: {
    backgroundColor: darkTheme.color.primary,
  },
});

