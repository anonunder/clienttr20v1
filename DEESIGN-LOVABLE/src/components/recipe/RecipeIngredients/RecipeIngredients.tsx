import { ChefHat } from "lucide-react";

interface RecipeIngredientsProps {
  ingredients: string[];
}

export const RecipeIngredients = ({ ingredients }: RecipeIngredientsProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
        <ChefHat className="h-5 w-5 text-primary" />
        Ingredients
      </h2>
      <ul className="space-y-2">
        {ingredients.map((ingredient, index) => (
          <li key={index} className="flex items-start gap-3 text-muted-foreground">
            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
            <span>{ingredient}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
