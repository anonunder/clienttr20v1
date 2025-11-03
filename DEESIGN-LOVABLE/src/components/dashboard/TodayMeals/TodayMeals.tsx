import { Apple } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";

interface Meal {
  name: string;
  description: string;
  calories: number;
}

interface TodayMealsProps {
  breakfast: Meal;
  lunch: Meal;
  dinner: Meal;
  totalCalories: number;
  targetCalories: number;
}

export const TodayMeals = ({
  breakfast,
  lunch,
  dinner,
  totalCalories,
  targetCalories,
}: TodayMealsProps) => {
  const navigate = useNavigate();

  return (
    <Card className="bg-card border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Apple className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Today's Meals</h3>
        </div>
        <Button variant="ghost" size="sm" onClick={() => navigate('/nutrition-plan')}>
          View Plan
        </Button>
      </div>
      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
          <div>
            <p className="font-medium text-foreground">Breakfast</p>
            <p className="text-sm text-muted-foreground">{breakfast.description}</p>
          </div>
          <span className="text-sm font-medium text-foreground">{breakfast.calories} cal</span>
        </div>
        <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
          <div>
            <p className="font-medium text-foreground">Lunch</p>
            <p className="text-sm text-muted-foreground">{lunch.description}</p>
          </div>
          <span className="text-sm font-medium text-foreground">{lunch.calories} cal</span>
        </div>
        <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 opacity-60">
          <div>
            <p className="font-medium text-foreground">Dinner</p>
            <p className="text-sm text-muted-foreground">{dinner.description}</p>
          </div>
          <span className="text-sm font-medium text-foreground">-</span>
        </div>
      </div>
      <div className="space-y-2 pt-3 border-t border-border">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Calories</span>
          <span className="text-foreground font-medium">{totalCalories} / {targetCalories}</span>
        </div>
        <Progress value={(totalCalories / targetCalories) * 100} className="h-2" />
      </div>
    </Card>
  );
};
