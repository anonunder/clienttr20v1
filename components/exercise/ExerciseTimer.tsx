import React, { useState, useEffect, useImperativeHandle, forwardRef, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { darkTheme } from '@/styles/theme';

export interface ExerciseTimerHandle {
  reset: () => void;
  pause: () => void;
  resume: () => void;
  start: () => void;
}

interface ExerciseTimerProps {
  duration: number; // Exercise duration in seconds
  restTime: number; // Rest duration in seconds
  startSignal: number; // Signal to start timer
  pauseSignal: number; // Signal to pause timer
  onComplete: () => void; // Called when exercise completes
  onRestComplete: () => void; // Called when rest completes
  onStart: () => void; // Called when timer starts
}

export const ExerciseTimer = forwardRef<ExerciseTimerHandle, ExerciseTimerProps>(
  ({ duration, restTime, startSignal, pauseSignal, onComplete, onRestComplete, onStart }, ref) => {
    const [timeLeft, setTimeLeft] = useState(duration);
    const [isResting, setIsResting] = useState(false);
    const [isRunning, setIsRunning] = useState(false);

    const prevStart = useRef<number>(0);
    const prevPause = useRef<number>(0);

    const progress = isResting
      ? ((restTime - timeLeft) / restTime) * 100
      : ((duration - timeLeft) / duration) * 100;

    // External start/pause controls via signals
    useEffect(() => {
      if (startSignal !== undefined && startSignal !== prevStart.current && startSignal > 0) {
        prevStart.current = startSignal;
        setIsRunning(true);
        setIsResting(false);
        setTimeLeft(duration);
        // Use setTimeout to avoid setState during render
        setTimeout(() => {
          onStart();
        }, 0);
      }
    }, [startSignal, duration, onStart]);

    useEffect(() => {
      if (pauseSignal !== undefined && pauseSignal !== prevPause.current) {
        prevPause.current = pauseSignal;
        setIsRunning(false);
      }
    }, [pauseSignal]);

    // Timer countdown logic
    useEffect(() => {
      if (!isRunning || timeLeft <= 0) return;

      const interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (!isResting) {
              // Exercise complete, start rest
              onComplete();
              setIsResting(true);
              return restTime;
            } else {
              // Rest complete
              onRestComplete();
              setIsRunning(false);
              setIsResting(false);
              return duration;
            }
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }, [isRunning, timeLeft, isResting, duration, restTime, onComplete, onRestComplete]);

    // Expose methods via ref
    useImperativeHandle(ref, () => ({
      start: () => {
        if (!isRunning) {
          setIsRunning(true);
          onStart();
        }
      },
      pause: () => {
        setIsRunning(false);
      },
      resume: () => {
        setIsRunning(true);
      },
      reset: () => {
        setTimeLeft(duration);
        setIsResting(false);
        setIsRunning(false);
      },
    }), [isRunning, duration, onStart]);

    const formatTime = (seconds: number) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const circumference = 2 * Math.PI * 42;
    const strokeDashoffset = circumference * (1 - progress / 100);

    return (
      <View style={styles.container}>
        {/* Circular Progress */}
        <View style={styles.circleContainer}>
          <Svg width={96} height={96} style={styles.svg}>
            {/* Background circle */}
            <Circle
              cx="48"
              cy="48"
              r="42"
              stroke={darkTheme.color.border}
              strokeWidth="6"
              fill="none"
            />
            {/* Progress circle */}
            <Circle
              cx="48"
              cy="48"
              r="42"
              stroke={darkTheme.color.primary}
              strokeWidth="6"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              rotation="-90"
              origin="48, 48"
            />
          </Svg>
          
          {/* Time display */}
          <View style={styles.timeContainer}>
            <Text style={styles.timeText}>{formatTime(timeLeft)}</Text>
          </View>
        </View>
      </View>
    );
  }
);

ExerciseTimer.displayName = 'ExerciseTimer';

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleContainer: {
    width: 96,
    height: 96,
    position: 'relative',
  },
  svg: {
    transform: [{ rotate: '-90deg' }],
  },
  timeContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontVariant: ['tabular-nums'],
  },
});

