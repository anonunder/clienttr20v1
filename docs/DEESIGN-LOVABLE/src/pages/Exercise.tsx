import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Star, RefreshCw, ChevronUp, X, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ExerciseVideoPlayer } from "@/components/exercise/ExerciseVideoPlayer";
import { ExerciseTimer, type ExerciseTimerHandle } from "@/components/exercise/ExerciseTimer";
import { ExerciseActionButtons } from "@/components/exercise/ExerciseActionButtons";
import { ExerciseInfo } from "@/components/exercise/ExerciseInfo";
import { toast } from "sonner";
import { CommentRating } from "@/components/shared/CommentRating";

// Mock exercises data
const mockExercises = [
  {
    id: "1",
    name: "Dumbbell Shoulder Press",
    description: "Press dumbbells overhead to build shoulder strength with controlled movement.",
    videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    aspectRatio: "9:16" as const,
    duration: 5,
    restTime: 15,
    sets: 3,
    reps: 12,
    isCircuit: false,
    difficulty: "Medium" as const,
    muscles: ["Shoulders", "Triceps", "Upper Chest"],
    instructions: [
      "Sit or stand with dumbbells at shoulder height",
      "Press weights up and bring arms overhead",
      "Extend arms fully then lower back down",
      "Shoulders remain level, avoid using momentum",
      "Keep core tight throughout the movement",
    ],
    alternatives: [
      {
        id: "1a",
        name: "Seated Dumbbell Press",
        description: "Seated variation for more stability and focus on shoulders.",
        videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
        aspectRatio: "9:16" as const,
        duration: 5,
        restTime: 15,
        sets: 3,
        reps: 12,
        isCircuit: false,
        difficulty: "Easy" as const,
        muscles: ["Shoulders", "Triceps"],
        instructions: [
          "Sit on bench with back support",
          "Hold dumbbells at shoulder height",
          "Press overhead in controlled motion",
          "Lower back to starting position",
        ],
      },
      {
        id: "1b",
        name: "Arnold Press",
        description: "Rotational press for complete shoulder development.",
        videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
        aspectRatio: "9:16" as const,
        duration: 5,
        restTime: 15,
        sets: 3,
        reps: 12,
        isCircuit: false,
        difficulty: "Hard" as const,
        muscles: ["Shoulders", "Triceps", "Upper Chest"],
        instructions: [
          "Start with palms facing you",
          "Rotate palms outward as you press up",
          "Fully extend arms overhead",
          "Reverse motion to return",
        ],
      },
    ],
  },
  {
    id: "2",
    name: "Barbell Squats",
    description: "Build lower-body power by squatting with good depth and tight core.",
    videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    aspectRatio: "9:16" as const,
    duration: 5,
    restTime: 20,
    sets: 4,
    reps: 10,
    isCircuit: true,
    difficulty: "Hard" as const,
    muscles: ["Quads", "Glutes", "Hamstrings"],
    instructions: [
      "Position barbell on upper back",
      "Stand with feet shoulder-width apart",
      "Lower by bending knees and hips",
      "Keep chest up and core engaged",
      "Drive through heels to return to start",
    ],
    alternatives: [
      {
        id: "2a",
        name: "Goblet Squats",
        description: "Easier variation using a dumbbell or kettlebell.",
        videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
        aspectRatio: "9:16" as const,
        duration: 5,
        restTime: 15,
        sets: 4,
        reps: 12,
        isCircuit: false,
        difficulty: "Easy" as const,
        muscles: ["Quads", "Glutes"],
        instructions: [
          "Hold weight at chest level",
          "Feet shoulder-width apart",
          "Squat down keeping chest up",
          "Drive through heels to stand",
        ],
      },
    ],
  },
  {
    id: "3",
    name: "Bench Press",
    description: "Strengthen chest and triceps by pressing the bar with stable shoulders.",
    videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    aspectRatio: "9:16" as const,
    duration: 10,
    restTime: 18,
    sets: 5,
    reps: 8,
    isCircuit: false,
    difficulty: "Medium" as const,
    muscles: ["Chest", "Triceps", "Shoulders"],
    instructions: [
      "Lie flat on bench with feet planted",
      "Grip barbell slightly wider than shoulders",
      "Lower bar to mid-chest with control",
      "Press up explosively",
      "Keep shoulder blades retracted",
    ],
    alternatives: [
      {
        id: "3a",
        name: "Dumbbell Bench Press",
        description: "Dumbbell variation for greater range of motion.",
        videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
        aspectRatio: "9:16" as const,
        duration: 10,
        restTime: 18,
        sets: 3,
        reps: 10,
        isCircuit: false,
        difficulty: "Medium" as const,
        muscles: ["Chest", "Triceps", "Shoulders"],
        instructions: [
          "Lie on bench with dumbbells",
          "Start with arms extended",
          "Lower weights to chest level",
          "Press back up to start",
        ],
      },
      {
        id: "3b",
        name: "Push-Ups",
        description: "Bodyweight alternative requiring no equipment.",
        videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
        aspectRatio: "9:16" as const,
        duration: 10,
        restTime: 15,
        sets: 3,
        reps: 15,
        isCircuit: false,
        difficulty: "Easy" as const,
        muscles: ["Chest", "Triceps", "Shoulders"],
        instructions: [
          "Start in plank position",
          "Lower body until chest near floor",
          "Push back up to start",
          "Keep body in straight line",
        ],
      },
    ],
  },
];

const Exercise = () => {
  const { planId, workoutId, exerciseId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [currentIndex, setCurrentIndex] = useState(() => {
    const idx = mockExercises.findIndex((ex) => ex.id === exerciseId);
    return idx !== -1 ? idx : 0;
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [timerStartSignal, setTimerStartSignal] = useState(0);
  const [timerPauseSignal, setTimerPauseSignal] = useState(0);
  const timerRef = useRef<ExerciseTimerHandle | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isTransitioning = useRef(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isResting, setIsResting] = useState(false);
  const [shouldHighlight, setShouldHighlight] = useState(false);
  const [showCommentRating, setShowCommentRating] = useState(false);
  const [showNextExercisePreview, setShowNextExercisePreview] = useState(false);
  const [previewVideoPlaying, setPreviewVideoPlaying] = useState(false);
  const previewVideoRef = useRef<HTMLVideoElement>(null);

  const currentExercise = mockExercises[currentIndex];
  const nextExercise = currentIndex < mockExercises.length - 1 ? mockExercises[currentIndex + 1] : null;

  // Audio notifications
  const playNotificationSound = (type: "rest" | "complete") => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    if (type === "rest") {
      // Double beep for rest complete
      oscillator.frequency.value = 800;
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.2);

      // Second beep
      setTimeout(() => {
        const osc2 = audioContext.createOscillator();
        const gain2 = audioContext.createGain();
        osc2.connect(gain2);
        gain2.connect(audioContext.destination);
        osc2.frequency.value = 800;
        gain2.gain.setValueAtTime(0.3, audioContext.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        osc2.start(audioContext.currentTime);
        osc2.stop(audioContext.currentTime + 0.2);
      }, 250);
    } else {
      // Triple beep for workout complete
      oscillator.frequency.value = 1000;
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);

      setTimeout(() => {
        const osc2 = audioContext.createOscillator();
        const gain2 = audioContext.createGain();
        osc2.connect(gain2);
        gain2.connect(audioContext.destination);
        osc2.frequency.value = 1000;
        gain2.gain.setValueAtTime(0.3, audioContext.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        osc2.start(audioContext.currentTime);
        osc2.stop(audioContext.currentTime + 0.3);
      }, 350);

      setTimeout(() => {
        const osc3 = audioContext.createOscillator();
        const gain3 = audioContext.createGain();
        osc3.connect(gain3);
        gain3.connect(audioContext.destination);
        osc3.frequency.value = 1200;
        gain3.gain.setValueAtTime(0.3, audioContext.currentTime);
        gain3.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        osc3.start(audioContext.currentTime);
        osc3.stop(audioContext.currentTime + 0.5);
      }, 700);
    }
  };

  // Handle highlight state from navigation
  useEffect(() => {
    if (location.state?.highlight) {
      setShouldHighlight(true);
      // Remove highlight after animation
      const timer = setTimeout(() => {
        setShouldHighlight(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  const handleSetComplete = () => {
    setIsResting(true);
    setIsPlaying(false);
    toast.success("Set complete! Rest time started.", {
      duration: 2000,
    });
  };

  const handleRestComplete = () => {
    setIsResting(false);
    playNotificationSound("rest");
    toast.success("Rest complete! Moving to next exercise...", {
      duration: 2000,
    });
    goToNextExercise();
  };

  const goToNextExercise = () => {
    if (isTransitioning.current) return;

    const nextIndex = currentIndex + 1;
    const scrollContainer = scrollContainerRef.current;

    if (!scrollContainer) return;

    isTransitioning.current = true;
    setIsPlaying(false);

    // Scroll to next exercise with smooth animation
    const targetScrollTop = nextIndex * window.innerHeight;
    scrollContainer.scrollTo({ top: targetScrollTop, behavior: "smooth" });

    setTimeout(() => {
      isTransitioning.current = false;
    }, 500);
  };

  // TikTok-style snap scrolling
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  // Preload videos for current, next, and previous exercises
  useEffect(() => {
    const videosToPreload = [
      currentIndex - 1, // Previous
      currentIndex, // Current
      currentIndex + 1, // Next
    ].filter((idx) => idx >= 0 && idx < mockExercises.length);

    videosToPreload.forEach((idx) => {
      const exercise = mockExercises[idx];
      const video = document.createElement("video");
      video.src = exercise.videoUrl;
      video.preload = "auto";
      video.load();
    });
  }, [currentIndex]);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer || isPlaying || isResting) return;

    const handleScroll = () => {
      // Calculate which exercise is currently in view based on scroll position
      const scrollTop = scrollContainer.scrollTop;
      const viewportHeight = window.innerHeight;
      const newIndex = Math.round(scrollTop / viewportHeight);

      // Update current index if it changed
      if (newIndex !== currentIndex && newIndex <= mockExercises.length) {
        setCurrentIndex(newIndex);

        // Update URL for non-completion screens
        if (newIndex < mockExercises.length) {
          const exercise = mockExercises[newIndex];
          navigate(`/programs/training/${planId}/workout/${workoutId}/exercise/${exercise.id}`, { replace: true });
        }
      }
    };

    scrollContainer.addEventListener("scrollend", handleScroll);

    return () => {
      scrollContainer.removeEventListener("scrollend", handleScroll);
    };
  }, [currentIndex, isPlaying, isResting, planId, workoutId, navigate]);

  // Scroll to current exercise on mount or when coming back from alternative
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const scrollTop = currentIndex * window.innerHeight;
    scrollContainer.scrollTo({ top: scrollTop, behavior: "instant" as ScrollBehavior });
  }, []);

  // Disable scroll when playing or resting
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    if (isPlaying || isResting) {
      scrollContainer.style.overflow = "hidden";
    } else {
      scrollContainer.style.overflow = "auto";
    }
  }, [isPlaying, isResting]);

  // Handle preview video playback
  useEffect(() => {
    const video = previewVideoRef.current;
    if (!video) return;

    if (previewVideoPlaying) {
      video.play().catch((err) => console.log("Preview video play failed:", err));
    } else {
      video.pause();
    }
  }, [previewVideoPlaying]);

  // Close preview when main video starts playing
  useEffect(() => {
    if (isPlaying) {
      setShowNextExercisePreview(false);
      setPreviewVideoPlaying(false);
    }
  }, [isPlaying]);

  const isCompletion = currentIndex === mockExercises.length;
  const isVertical = !isCompletion && currentExercise?.aspectRatio === "9:16";

  // Play completion sound when workout is done
  useEffect(() => {
    if (isCompletion) {
      playNotificationSound("complete");
    }
  }, [isCompletion]);
  return (
    <div ref={containerRef} className="fixed inset-0 bg-background">
      {/* Snap Scroll Container - TikTok Style */}
      <div
        ref={scrollContainerRef}
        className="h-screen w-full overflow-y-auto snap-y snap-mandatory scroll-smooth"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {/* Hide scrollbar */}
        <style>{`
          .snap-y::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        {/* Render all exercises + completion screen */}
        {[...mockExercises, null].map((exercise, index) => {
          const isActive = index === currentIndex;
          const isCompletionScreen = exercise === null;

          if (isCompletionScreen) {
            return (
              <div key="completion" className="h-screen w-full snap-start snap-always flex items-center justify-center">
                {/* Completion screen */}
                <div className="relative h-full w-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-background to-primary/5">
                  <div className="max-w-md w-full space-y-6">
                    <div className="flex justify-center">
                      <div className="w-24 h-24 rounded-full bg-success/20 flex items-center justify-center">
                        <span className="text-5xl">✓</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h1 className="text-3xl font-bold text-foreground">Workout Complete!</h1>
                      <p className="text-muted-foreground">Great job finishing all exercises</p>
                    </div>

                    <Card className="bg-card border-border p-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Active Time</p>
                          <p className="text-lg font-bold text-foreground">
                            {Math.floor(mockExercises.reduce((s, e) => s + e.duration, 0) / 60)}m{" "}
                            {mockExercises.reduce((s, e) => s + e.duration, 0) % 60}s
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Total Time</p>
                          <p className="text-lg font-bold text-foreground">
                            {Math.floor(mockExercises.reduce((s, e) => s + e.duration + e.restTime, 0) / 60)}m{" "}
                            {mockExercises.reduce((s, e) => s + e.duration + e.restTime, 0) % 60}s
                          </p>
                        </div>
                      </div>
                    </Card>

                    <div className="px-4">
                      <CommentRating itemType="workout" itemId={`${planId}-${workoutId}`} />
                    </div>

                    <div className="flex flex-col gap-3 px-4">
                      <Button
                        onClick={() => {
                          toast.success("Workout completed! Great job!");
                          navigate(`/programs/training/${planId}/workout/${workoutId}`);
                        }}
                        className="w-full h-12 text-lg font-semibold"
                      >
                        Finish Workout
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => navigate(`/programs/training/${planId}/workout/${workoutId}`)}
                        className="w-full"
                      >
                        Go Back
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          const exerciseIsVertical = exercise.aspectRatio === "9:16";
          const shouldShowHighlight = isActive && shouldHighlight;

          return (
            <div key={exercise.id} className="h-screen w-full snap-start snap-always relative overflow-hidden">
              {/* Header - Only show on active exercise */}
              {isActive && !isPlaying && (
                <div className="absolute top-0 left-0 right-0 z-40 p-4 flex items-center justify-between">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background/90 border border-border/50"
                    onClick={() => navigate(`/programs/training/${planId}/workout/${workoutId}`)}
                  >
                    <ArrowLeft className="h-5 w-5 text-foreground" />
                  </Button>

                  <div className="flex items-center gap-2">
                    {exercise.alternatives && exercise.alternatives.length > 0 && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background/90 border border-border/50"
                          >
                            <RefreshCw className="h-5 w-5 text-foreground" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-64">
                          <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                            Alternative Exercises
                          </div>
                          {exercise.alternatives.map((alt) => (
                            <DropdownMenuItem
                              key={alt.id}
                              className="cursor-pointer"
                              onClick={() => {
                                toast.success(`Switched to ${alt.name}`);
                              }}
                            >
                              <div className="flex flex-col gap-1">
                                <span className="font-medium">{alt.name}</span>
                                <span className="text-xs text-muted-foreground">{alt.difficulty}</span>
                              </div>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background/90 border border-border/50"
                      onClick={() => {
                        setIsLiked(!isLiked);
                        toast.success(isLiked ? "Removed from liked" : "Added to liked");
                      }}
                    >
                      <Star className={`h-5 w-5 ${isLiked ? "fill-warning text-warning" : "text-foreground"}`} />
                    </Button>
                  </div>
                </div>
              )}

              {/* Video Container */}
              <div
                className={`video-swipe-area h-full w-full ${
                  exerciseIsVertical ? "flex items-center justify-center" : "flex items-center justify-center bg-black"
                } ${shouldShowHighlight ? "relative" : ""}`}
              >
                {shouldShowHighlight && (
                  <div className="absolute inset-0 border-4 border-primary rounded-lg animate-pulse z-50 pointer-events-none" />
                )}

                {/* Video Player with aspect ratio handling */}
                <div
                  className={
                    exerciseIsVertical ? "w-full h-full" : "w-full max-w-full aspect-video border-4 border-border/30"
                  }
                >
                  {/* Always render video player but only make it visible/interactive when active */}
                  <ExerciseVideoPlayer
                    videoUrl={exercise.videoUrl}
                    isPlaying={isActive && isPlaying}
                    onTogglePlay={() => {
                      if (isActive) {
                        if (!isPlaying) {
                          setIsPlaying(true);
                          setTimerStartSignal((s) => s + 1);
                        } else {
                          setIsPlaying(false);
                          setTimerPauseSignal((s) => s + 1);
                        }
                      }
                    }}
                    aspectRatio={exercise.aspectRatio}
                  />
                </div>
              </div>

              {/* Timer Overlay - Only on active exercise */}
              {isActive && (isPlaying || isResting) && (
                <div className="absolute top-8 left-0 right-0 z-50 flex justify-center pointer-events-none">
                  <div className="pointer-events-auto">
                    <ExerciseTimer
                      ref={timerRef}
                      duration={exercise.duration}
                      restTime={exercise.restTime}
                      startSignal={timerStartSignal}
                      pauseSignal={timerPauseSignal}
                      onComplete={handleSetComplete}
                      onRestComplete={handleRestComplete}
                      onStart={() => setIsPlaying(true)}
                    />
                  </div>
                </div>
              )}

              {/* REST TIME Overlay */}
              {isActive && isResting && (
                <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                  <h2 className="text-4xl md:text-6xl font-bold text-white">REST TIME</h2>
                </div>
              )}

              {/* Action Buttons - Only on active exercise */}
              {isActive && !isPlaying && (
                <>
                  <div className="absolute right-4 bottom-32 z-40">
                    <ExerciseActionButtons
                      onLike={() => setIsLiked(!isLiked)}
                      onShare={() => console.log("Share")}
                      onSave={() => setIsSaved(!isSaved)}
                      onComment={() => setShowCommentRating(!showCommentRating)}
                      onInfo={() => setShowInfo(!showInfo)}
                      isLiked={isLiked}
                      isSaved={isSaved}
                    />

                    {/* Next Exercise Preview Button - positioned below INFO icon */}
                    {nextExercise && (
                      <div className="mt-4">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => setShowNextExercisePreview(true)}
                          className="h-12 w-12 rounded-full bg-primary/80 backdrop-blur-sm hover:bg-primary/90 border border-primary/50 shadow-lg"
                        >
                          <ChevronUp className="h-6 w-6 text-primary-foreground" />
                        </Button>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Comment & Rating Panel */}
              {isActive && !isPlaying && showCommentRating && (
                <div className="absolute bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md p-4 max-h-[60vh] overflow-y-auto">
                  <CommentRating itemType="exercise" itemId={exercise.id} />
                </div>
              )}

              {/* Bottom Info Panel */}
              {isActive && !isPlaying && (
                <div
                  className={`absolute bottom-0 left-0 right-0 z-30 ${shouldShowHighlight ? "animate-fade-in" : ""}`}
                >
                  {shouldShowHighlight && (
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-50 animate-bounce">
                      <div className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold shadow-glow">
                        Continue from here! 🎯
                      </div>
                    </div>
                  )}
                  <div className="bg-gradient-to-t from-black/90 via-black/70 to-transparent backdrop-blur-sm px-4 pt-8 pb-6 space-y-4">
                    <ExerciseInfo
                      name={exercise.name}
                      description={exercise.description}
                      difficulty={exercise.difficulty}
                      sets={exercise.sets}
                      reps={exercise.reps}
                      muscles={showInfo ? exercise.muscles : undefined}
                      instructions={showInfo ? exercise.instructions : undefined}
                    />

                    <div className="flex justify-center">
                      <Button
                        onClick={() => {
                          setIsPlaying(true);
                          setTimerStartSignal((s) => s + 1);
                        }}
                        size="lg"
                        className="h-14 px-12 rounded-full text-lg font-semibold"
                      >
                        START
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Next Exercise Preview Sheet */}
      <Sheet open={showNextExercisePreview} onOpenChange={setShowNextExercisePreview}>
        <SheetContent
          side="bottom"
          className="h-[70vh] p-0 bg-background border-t-2 border-border z-[100] [&>button]:hidden"
        >
          <div className="h-full flex flex-col">
            {/* Header */}
            <SheetHeader className="p-4 border-b border-border bg-background/95 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div>
                  <SheetTitle className="text-lg font-bold">Up Next</SheetTitle>
                  <SheetDescription className="text-sm text-muted-foreground">Preview next exercise</SheetDescription>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setShowNextExercisePreview(false);
                    setPreviewVideoPlaying(false);
                  }}
                  className="h-8 w-8 rounded-full"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </SheetHeader>

            {nextExercise && (
              <div className="flex-1 overflow-y-auto">
                {/* Video Preview */}
                <div className="relative bg-black aspect-video">
                  <video
                    ref={previewVideoRef}
                    src={nextExercise.videoUrl}
                    className="w-full h-full object-contain"
                    loop
                    playsInline
                  />
                  <button
                    onClick={() => setPreviewVideoPlaying(!previewVideoPlaying)}
                    className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors"
                  >
                    {previewVideoPlaying ? (
                      <Pause className="h-16 w-16 text-white" />
                    ) : (
                      <Play className="h-16 w-16 text-white" />
                    )}
                  </button>
                </div>

                {/* Exercise Details */}
                <div className="p-4 space-y-4">
                  {/* Title and Difficulty */}
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-foreground">{nextExercise.name}</h3>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          nextExercise.difficulty === "Hard"
                            ? "bg-destructive/20 text-destructive"
                            : nextExercise.difficulty === "Medium"
                              ? "bg-warning/20 text-warning"
                              : "bg-success/20 text-success"
                        }`}
                      >
                        {nextExercise.difficulty}
                      </span>
                      {nextExercise.isCircuit && (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/20 text-primary border border-primary/30">
                          Circuit Exercise
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-muted/50 rounded-lg p-3 border border-border">
                      <p className="text-xs text-muted-foreground mb-1">Sets</p>
                      <p className="text-lg font-bold text-foreground">{nextExercise.sets}</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3 border border-border">
                      <p className="text-xs text-muted-foreground mb-1">Reps</p>
                      <p className="text-lg font-bold text-foreground">{nextExercise.reps}</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3 border border-border">
                      <p className="text-xs text-muted-foreground mb-1">Duration</p>
                      <p className="text-lg font-bold text-foreground">{nextExercise.duration}s</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3 border border-border">
                      <p className="text-xs text-muted-foreground mb-1">Rest</p>
                      <p className="text-lg font-bold text-foreground">{nextExercise.restTime}s</p>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <p className="text-sm text-muted-foreground">{nextExercise.description}</p>
                  </div>

                  {/* Muscles */}
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-2">TARGET MUSCLES</p>
                    <div className="flex flex-wrap gap-2">
                      {nextExercise.muscles.map((muscle, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-md border border-primary/20"
                        >
                          {muscle}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Instructions */}
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-2">INSTRUCTIONS</p>
                    <ol className="space-y-2">
                      {nextExercise.instructions.map((instruction, idx) => (
                        <li key={idx} className="text-sm text-foreground flex gap-2">
                          <span className="font-semibold text-primary">{idx + 1}.</span>
                          <span>{instruction}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Exercise;
