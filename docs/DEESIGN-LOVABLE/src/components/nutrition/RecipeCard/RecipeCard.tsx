import { Link } from "react-router-dom";
import { ChefHat, Flame } from "lucide-react";
import { Card } from "@/components/ui/card";

interface RecipeCardProps {
  id: string;
  title: string;
  image: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  cookTime: string;
  planId: string;
  mealId: string;
}

export const RecipeCard = ({
  id,
  title,
  image,
  calories,
  protein,
  carbs,
  fat,
  cookTime,
  planId,
  mealId,
}: RecipeCardProps) => {
  return (
    <Link to={`/programs/nutrition/${planId}/meal/${mealId}/recipe/${id}`}>
      <Card className="bg-card border-border overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group h-full">
        <div className="relative h-40 overflow-hidden">
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>

        <div className="p-4 space-y-2">
          <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
            {title}
          </h3>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <ChefHat className="h-3 w-3" />
              <span>{cookTime}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Flame className="h-3 w-3" />
              <span>{calories} cal</span>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="text-primary">P: {protein}g</span>
            <span className="text-info">C: {carbs}g</span>
            <span className="text-warning">F: {fat}g</span>
          </div>
        </div>
      </Card>
    </Link>
  );
};
