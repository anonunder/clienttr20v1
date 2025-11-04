import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, ChevronRight, Play, Clock, Repeat } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Exercise {
  id: string;
  name: string;
  sets?: number;
  reps?: number;
  duration?: string;
  difficulty?: "Easy" | "Medium" | "Hard";
  videoUrl?: string;
  description?: string;
}

interface Workout {
  id: string;
  title: string;
  duration: string;
  exercises: Exercise[];
  completed?: boolean;
}

interface WorkoutListProps {
  workouts: Workout[];
  planId: string;
}

export function WorkoutList({ workouts, planId }: WorkoutListProps) {
  const navigate = useNavigate();
  const [expandedWorkout, setExpandedWorkout] = useState<string | null>(null);
  const [expandedDescriptions, setExpandedDescriptions] = useState<Set<string>>(new Set());

  const toggleWorkout = (workoutId: string) => {
    setExpandedWorkout(expandedWorkout === workoutId ? null : workoutId);
  };

  const toggleDescription = (exerciseId: string) => {
    setExpandedDescriptions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(exerciseId)) {
        newSet.delete(exerciseId);
      } else {
        newSet.add(exerciseId);
      }
      return newSet;
    });
  };

  const handleExerciseClick = (workoutId: string, exerciseId: string) => {
    navigate(`/programs/training/${planId}/workout/${workoutId}/exercise/${exerciseId}`);
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-success/20 text-success border-success/30";
      case "Medium":
        return "bg-warning/20 text-warning border-warning/30";
      case "Hard":
        return "bg-destructive/20 text-destructive border-destructive/30";
      default:
        return "bg-primary/20 text-primary border-primary/30";
    }
  };

  const getExcerpt = (text: string, wordLimit: number = 30) => {
    const words = text.split(' ');
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(' ') + '...';
  };

  return (
    <div className="space-y-3">
      {workouts.map((workout) => {
        const isExpanded = expandedWorkout === workout.id;
        
        return (
          <Card key={workout.id} className="overflow-hidden bg-card border-border">
            {/* Workout Header */}
            <button
              onClick={() => toggleWorkout(workout.id)}
              className="w-full flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1">
                <div className={cn(
                  "h-12 w-12 rounded-full flex items-center justify-center",
                  workout.completed 
                    ? "bg-primary/20 text-primary" 
                    : "bg-secondary text-muted-foreground"
                )}>
                  <Play className="h-5 w-5" />
                </div>
                
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-foreground">{workout.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground">
                      {workout.exercises.length} exercises
                    </span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">{workout.duration}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {workout.completed && (
                  <Badge className="bg-primary/20 text-primary border-primary/30">
                    Done
                  </Badge>
                )}
                {isExpanded ? (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
            </button>

            {/* Expanded Exercise List */}
            {isExpanded && (
              <div className="border-t border-border bg-secondary/20 p-3 space-y-2">
                {workout.exercises.map((exercise, idx) => (
                  <Card
                    key={exercise.id}
                    className="overflow-hidden bg-card border-border hover:bg-secondary/30 transition-all cursor-pointer"
                    onClick={() => handleExerciseClick(workout.id, exercise.id)}
                  >
                    <div className="flex items-center gap-3 p-3">
                      {/* Video Thumbnail */}
                      <div className="w-20 h-20 rounded-xl bg-muted flex items-center justify-center flex-shrink-0 overflow-hidden relative">
                        {exercise.videoUrl ? (
                          <video 
                            src={exercise.videoUrl}
                            className="w-full h-full object-cover"
                            muted
                            playsInline
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                            <Play className="h-8 w-8 text-primary" />
                          </div>
                        )}
                      </div>

                      {/* Exercise Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div className="flex-1">
                            <h4 className="font-semibold text-foreground text-sm line-clamp-1 mb-1">
                              {exercise.name}
                            </h4>
                            {exercise.description && (
                              <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                                {getExcerpt(exercise.description)}
                              </p>
                            )}
                          </div>
                          {exercise.difficulty && (
                            <Badge className={cn("text-xs flex-shrink-0", getDifficultyColor(exercise.difficulty))}>
                              {exercise.difficulty}
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                          {exercise.duration ? (
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{exercise.duration}</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1">
                              <Repeat className="h-3 w-3" />
                              <span>{exercise.sets} reps</span>
                            </div>
                          )}
                          {exercise.sets && (
                            <>
                              <span>•</span>
                              <span>{exercise.sets} sets</span>
                            </>
                          )}
                        </div>

                        <Button 
                          size="sm" 
                          className="h-7 text-xs w-full sm:w-auto bg-primary/10 text-primary hover:bg-primary/20 border border-primary/30"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleExerciseClick(workout.id, exercise.id);
                          }}
                        >
                          Start
                          <ChevronRight className="h-3 w-3 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}

