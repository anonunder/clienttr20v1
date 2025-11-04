import { Dumbbell, Apple, Heart, Clock, Flame, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface FavoriteItem {
  id: string;
  title: string;
  type: "training" | "nutrition";
  description: string;
  duration?: string;
  calories?: number;
  difficulty?: string;
  rating: number;
}

interface FavoriteCardProps {
  item: FavoriteItem;
  onUnfavorite?: (id: string) => void;
}

const getDifficultyColor = (difficulty?: string) => {
  switch (difficulty) {
    case "Beginner":
      return "bg-success/20 text-success";
    case "Intermediate":
      return "bg-warning/20 text-warning";
    case "Advanced":
      return "bg-destructive/20 text-destructive";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export const FavoriteCard = ({ item, onUnfavorite }: FavoriteCardProps) => (
  <Card className="bg-card border-border p-5 hover:shadow-lg transition-all group">
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          <div className={`p-3 rounded-lg ${item.type === "training" ? "bg-primary/10" : "bg-success/10"}`}>
            {item.type === "training" ? (
              <Dumbbell className="h-6 w-6 text-primary" />
            ) : (
              <Apple className="h-6 w-6 text-success" />
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
              {item.title}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-destructive hover:text-destructive/80"
          onClick={() => onUnfavorite?.(item.id)}
        >
          <Heart className="h-5 w-5 fill-current" />
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {item.duration && (
          <Badge variant="outline" className="gap-1">
            <Clock className="h-3 w-3" />
            {item.duration}
          </Badge>
        )}
        {item.difficulty && (
          <Badge className={getDifficultyColor(item.difficulty)}>
            {item.difficulty}
          </Badge>
        )}
        {item.calories && (
          <Badge variant="outline" className="gap-1">
            <Flame className="h-3 w-3" />
            {item.calories} kcal
          </Badge>
        )}
        <Badge variant="outline" className="gap-1 ml-auto">
          <Star className="h-3 w-3 fill-warning text-warning" />
          {item.rating}
        </Badge>
      </div>

      <Button className="w-full" variant="outline">
        View Details
      </Button>
    </div>
  </Card>
);
