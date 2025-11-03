import React, { useEffect, useImperativeHandle, useState, forwardRef, useRef } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExerciseTimerProps {
  duration: number; // in seconds
  restTime: number; // in seconds
  onComplete?: () => void;
  onRestComplete?: () => void;
  onStart?: () => void; // fired when timer transitions to running
  startSignal?: number; // increment to trigger start from parent
  pauseSignal?: number; // increment to trigger pause from parent
}

export type ExerciseTimerHandle = {
  start: () => void;
  pause: () => void;
  reset: () => void;
};

export const ExerciseTimer = forwardRef<ExerciseTimerHandle, ExerciseTimerProps>(function ExerciseTimer(
  { duration, restTime, onComplete, onRestComplete, onStart, startSignal, pauseSignal }: ExerciseTimerProps,
  ref,
) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(false);
  const [isResting, setIsResting] = useState(false);

  const progress = isResting
    ? ((restTime - timeLeft) / restTime) * 100
    : ((duration - timeLeft) / duration) * 100;

  useImperativeHandle(
    ref,
    () => ({
      start: () => {
        if (!isRunning) {
          setIsRunning(true);
          onStart?.();
        }
      },
      pause: () => setIsRunning(false),
      reset: () => {
        setIsRunning(false);
        setIsResting(false);
        setTimeLeft(duration);
      },
    }),
    [isRunning, duration, onStart],
  );

  // External start/pause controls via signals (detect increments)
  const prevStart = useRef(startSignal);
  const prevPause = useRef(pauseSignal);

  useEffect(() => {
    if (startSignal !== undefined && startSignal !== prevStart.current) {
      prevStart.current = startSignal;
      setIsRunning(true);
      onStart?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startSignal]);

  useEffect(() => {
    if (pauseSignal !== undefined && pauseSignal !== prevPause.current) {
      prevPause.current = pauseSignal;
      setIsRunning(false);
    }
  }, [pauseSignal]);

  // Auto start when component mounts (overlay visible only when playing)
  useEffect(() => {
    setIsRunning(true);
    onStart?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let interval: number | undefined;
    if (isRunning && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (!isResting) {
              // Completed exercise: continue directly into rest
              setIsResting(true);
              onComplete?.();
              return restTime;
            } else {
              // Completed rest: stop and reset for next exercise
              setIsResting(false);
              setIsRunning(false);
              onRestComplete?.();
              return duration;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) window.clearInterval(interval);
    };
  }, [isRunning, timeLeft, duration, restTime, isResting, onComplete, onRestComplete]);

  const toggleTimer = () => {
    if (isRunning) {
      setIsRunning(false);
    } else {
      setIsRunning(true);
      onStart?.();
    }
  };

  const resetTimer = () => {
    setIsRunning(false);
    setIsResting(false);
    setTimeLeft(duration);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      {/* Circular Progress */}
      <div className="relative w-24 h-24">
        <svg className="w-full h-full -rotate-90">
          <circle
            cx="48"
            cy="48"
            r="42"
            stroke="hsl(var(--border))"
            strokeWidth="6"
            fill="none"
          />
          <circle
            cx="48"
            cy="48"
            r="42"
            stroke="hsl(var(--primary))"
            strokeWidth="6"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 42}`}
            strokeDashoffset={`${2 * Math.PI * 42 * (1 - progress / 100)}`}
            className="transition-all duration-300"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-2xl font-bold text-on-surface">
            {formatTime(timeLeft)}
          </div>
        </div>
      </div>
      
      {/* Pause/Continue Button */}
      {isRunning ? (
        <button
          onClick={() => {
            setIsRunning(false);
          }}
          className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
          aria-label="Pause"
        >
          <Pause className="h-3 w-3" />
        </button>
      ) : (
        <button
          onClick={() => {
            setIsRunning(true);
            onStart?.();
          }}
          className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
          aria-label="Continue"
        >
          <Play className="h-3 w-3" />
        </button>
      )}
    </div>
  );
});