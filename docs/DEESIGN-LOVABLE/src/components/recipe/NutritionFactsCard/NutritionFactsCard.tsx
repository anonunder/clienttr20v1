import { Card } from "@/components/ui/card";

interface NutritionFactsCardProps {
  protein: number;
  carbs: number;
  fat: number;
  calories: number;
  fiber: number;
  sugar: number;
  servings: number;
}

export const NutritionFactsCard = ({
  protein,
  carbs,
  fat,
  calories,
  fiber,
  sugar,
  servings,
}: NutritionFactsCardProps) => {
  return (
    <Card className="bg-card border-border p-6">
      <h2 className="text-xl font-semibold text-foreground mb-4">Nutrition Facts</h2>
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-4 pb-4 border-b border-border">
          <div className="text-center space-y-1">
            <p className="text-2xl font-bold text-primary">{protein}g</p>
            <p className="text-sm text-muted-foreground">Protein</p>
          </div>
          <div className="text-center space-y-1">
            <p className="text-2xl font-bold text-info">{carbs}g</p>
            <p className="text-sm text-muted-foreground">Carbs</p>
          </div>
          <div className="text-center space-y-1">
            <p className="text-2xl font-bold text-warning">{fat}g</p>
            <p className="text-sm text-muted-foreground">Fat</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Calories</span>
            <span className="font-semibold text-foreground">{calories}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Fiber</span>
            <span className="font-semibold text-foreground">{fiber}g</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Sugar</span>
            <span className="font-semibold text-foreground">{sugar}g</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Servings</span>
            <span className="font-semibold text-foreground">{servings}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
