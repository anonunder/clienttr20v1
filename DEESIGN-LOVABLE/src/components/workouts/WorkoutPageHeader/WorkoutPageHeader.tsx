import { ArrowLeft, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface WorkoutPageHeaderProps {
  image: string;
  name: string;
  duration: string;
  difficulty: string;
  onBack: () => void;
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

export const WorkoutPageHeader = ({
  image,
  name,
  duration,
  difficulty,
  onBack,
}: WorkoutPageHeaderProps) => {
  return (
    <div className="relative h-48 overflow-hidden">
      <img 
        src={image} 
        alt={name}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-background" />
      
      <div className="absolute top-4 left-4">
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-full bg-background/20 backdrop-blur-sm hover:bg-background/30"
          onClick={onBack}
        >
          <ArrowLeft className="h-5 w-5 text-on-surface" />
        </Button>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 space-y-2">
        <Badge variant="outline" className={getDifficultyColor(difficulty)}>
          {difficulty}
        </Badge>
        <h1 className="text-2xl font-bold text-on-surface">
          {name}
        </h1>
        <div className="flex items-center gap-2 text-sm text-on-surface/90">
          <Clock className="h-4 w-4" />
          <span>{duration}</span>
        </div>
      </div>
    </div>
  );
};
