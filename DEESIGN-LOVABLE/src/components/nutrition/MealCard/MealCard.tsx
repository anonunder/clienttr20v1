import { Link } from "react-router-dom";
import { Clock, Flame } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface MealCardProps {
  id: string;
  name: string;
  image: string;
  time: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  recipes: number;
  planId: string;
}

export const MealCard = ({
  id,
  name,
  image,
  time,
  calories,
  protein,
  carbs,
  fat,
  recipes,
  planId,
}: MealCardProps) => {
  return (
    <Link to={`/programs/nutrition/${planId}/meal/${id}`}>
      <Card className="bg-card border-border overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group">
        <div className="flex gap-4">
          <div className="relative w-24 h-24 flex-shrink-0 overflow-hidden">
            <img 
              src={image} 
              alt={name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>

          <div className="flex-1 py-3 pr-4 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                {name}
              </h3>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                {recipes} {recipes === 1 ? 'recipe' : 'recipes'}
              </Badge>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{time}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Flame className="h-3 w-3" />
                <span>{calories} cal</span>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="text-primary">P: {protein}g</span>
              <span className="text-info">C: {carbs}g</span>
              <span className="text-warning">F: {fat}g</span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};
