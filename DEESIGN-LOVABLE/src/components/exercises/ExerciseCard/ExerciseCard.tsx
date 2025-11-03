import { Link, useNavigate } from "react-router-dom";
import { Clock, Zap, RefreshCw, Play } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Alternative {
  id: string;
  name: string;
  difficulty: string;
}

interface ExerciseCardProps {
  id: string;
  name: string;
  image: string;
  sets: number;
  reps: string;
  duration: string;
  difficulty: "Easy" | "Medium" | "Hard";
  planId: string;
  workoutId: string;
  alternatives?: Alternative[];
  onSwitchExercise?: (exerciseId: string, alternative: Alternative) => void;
  isHighlighted?: boolean;
}

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "Easy":
      return "bg-success/20 text-success border-success/30";
    case "Medium":
      return "bg-warning/20 text-warning border-warning/30";
    case "Hard":
      return "bg-destructive/20 text-destructive border-destructive/30";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export const ExerciseCard = ({
  id,
  name,
  image,
  sets,
  reps,
  duration,
  difficulty,
  planId,
  workoutId,
  alternatives = [],
  onSwitchExercise,
  isHighlighted = false,
}: ExerciseCardProps) => {
  return (
    <Link to={`/programs/training/${planId}/workout/${workoutId}/exercise/${id}`}>
      <div className="relative">
        {isHighlighted && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-50 animate-bounce">
            <div className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold shadow-glow whitespace-nowrap">
              Continue from here! 🎯
            </div>
          </div>
        )}
        <Card className={`bg-card border-border overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group ${
          isHighlighted ? 'ring-4 ring-primary animate-pulse' : ''
        }`}>
          <div className="relative h-40 overflow-hidden">
            <img 
              src={image} 
              alt={name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute top-3 right-3">
              <Badge variant="outline" className={getDifficultyColor(difficulty)}>
                {difficulty}
              </Badge>
            </div>
          </div>

          <div className="p-4 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors flex-1">
                {name}
              </h3>
              {alternatives.length > 0 && onSwitchExercise && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.preventDefault()}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full hover:bg-primary/10 hover:text-primary shrink-0"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64">
                    <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                      Alternative Exercises
                    </div>
                    {alternatives.map((alt) => (
                      <DropdownMenuItem
                        key={alt.id}
                        className="cursor-pointer"
                        onClick={(e) => {
                          e.preventDefault();
                          onSwitchExercise(id, alt);
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
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{duration}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Zap className="h-3 w-3" />
                <span>{reps}</span>
              </div>
            </div>
          </div>

          <div className="absolute bottom-4 right-4">
            <Button
              size="sm"
              className="rounded-full bg-primary hover:bg-primary/90"
              onClick={(e) => {
                e.preventDefault();
              }}
            >
              <Play className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      </div>
    </Link>
  );
};
