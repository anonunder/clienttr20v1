import { Link } from "react-router-dom";
import { Clock, Dumbbell } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ProgramCardProps {
  id: string;
  name: string;
  description: string;
  image: string;
  duration: string;
  workouts: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
}

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "Beginner":
      return "bg-success/20 text-success border-success/30";
    case "Intermediate":
      return "bg-warning/20 text-warning border-warning/30";
    case "Advanced":
      return "bg-destructive/20 text-destructive border-destructive/30";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export const ProgramCard = ({
  id,
  name,
  description,
  image,
  duration,
  workouts,
  difficulty,
}: ProgramCardProps) => {
  return (
    <Link to={`/programs/${id}`}>
      <Card className="bg-card border-border overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group h-full">
        <div className="relative h-48 overflow-hidden">
          <img 
            src={image} 
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 right-3">
            <Badge variant="outline" className={getDifficultyColor(difficulty)}>
              {difficulty}
            </Badge>
          </div>
        </div>

        <div className="p-4 space-y-3">
          <div>
            <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-1">
              {name}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {description}
            </p>
          </div>

          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{duration}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Dumbbell className="h-4 w-4" />
              <span>{workouts} workouts</span>
            </div>
          </div>

          <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
            Start Training
          </Button>
        </div>
      </Card>
    </Link>
  );
};
