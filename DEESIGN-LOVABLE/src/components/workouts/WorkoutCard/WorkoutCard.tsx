import { Link } from "react-router-dom";
import { Clock, Dumbbell, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface WorkoutCardProps {
  id: string;
  title: string;
  image: string;
  duration: string;
  exercises: number;
  difficulty: "Easy" | "Medium" | "Hard";
  completed?: boolean;
  planId: string;
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

export const WorkoutCard = ({
  id,
  title,
  image,
  duration,
  exercises,
  difficulty,
  completed = false,
  planId,
}: WorkoutCardProps) => {
  return (
    <Link to={`/programs/training/${planId}/workout/${id}`}>
      <Card className="bg-card border-border overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group">
        <div className="flex gap-4">
          <div className="relative w-24 h-24 flex-shrink-0 overflow-hidden">
            <img 
              src={image} 
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {completed && (
              <div className="absolute inset-0 bg-overlay/40 flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-success" />
              </div>
            )}
          </div>

          <div className="flex-1 py-3 pr-4 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                {title}
              </h3>
              <Badge variant="outline" className={getDifficultyColor(difficulty)}>
                {difficulty}
              </Badge>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{duration}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Dumbbell className="h-3 w-3" />
                <span>{exercises} exercises</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};
