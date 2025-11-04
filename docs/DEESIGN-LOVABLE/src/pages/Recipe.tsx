import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CommentRating } from "@/components/shared/CommentRating";
import { RecipeMediaHeader } from "@/components/recipe/RecipeMediaHeader/RecipeMediaHeader";
import { NutritionFactsCard } from "@/components/recipe/NutritionFactsCard/NutritionFactsCard";
import { RecipeIngredients } from "@/components/recipe/RecipeIngredients/RecipeIngredients";
import { RecipeInstructions } from "@/components/recipe/RecipeInstructions/RecipeInstructions";


interface Media {
  id: string;
  type: "image" | "video";
  url: string;
  thumbnail?: string;
}

const Recipe = () => {
  const { planId, mealId, recipeId } = useParams();
  const navigate = useNavigate();


  const recipe = {
    id: "1",
    title: "Protein Oatmeal Bowl",
    media: [
      { id: "1", type: "image", url: "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=800&q=80" },
      { id: "2", type: "video", url: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4", thumbnail: "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=400&q=80" },
      { id: "3", type: "image", url: "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=800&q=80" },
      { id: "4", type: "image", url: "https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=800&q=80" },
    ] as Media[],
    cookTime: "10 min",
    servings: 1,
    calories: 320,
    protein: 18,
    carbs: 45,
    fat: 8,
    difficulty: "Easy",
    fiber: 8,
    sugar: 12,
  };

  const ingredients = [
    "1 cup rolled oats",
    "1 scoop protein powder (vanilla)",
    "1 cup almond milk",
    "1 banana, sliced",
    "1 tbsp honey",
    "1 tbsp almond butter",
    "Pinch of cinnamon",
  ];

  const instructions = [
    "Cook oats in almond milk according to package directions",
    "Stir in protein powder until well combined",
    "Top with sliced banana and almond butter",
    "Drizzle with honey and sprinkle cinnamon",
    "Serve warm and enjoy!",
  ];

  return (
    <div className="min-h-screen bg-background">
      <RecipeMediaHeader
        media={recipe.media}
        title={recipe.title}
        difficulty={recipe.difficulty}
        cookTime={recipe.cookTime}
        servings={recipe.servings}
        calories={recipe.calories}
        onBack={() => navigate(`/programs/nutrition/${planId}/meal/${mealId}`)}
      />

      <div className="p-4 md:p-6 max-w-3xl mx-auto space-y-6">
        <NutritionFactsCard
          protein={recipe.protein}
          carbs={recipe.carbs}
          fat={recipe.fat}
          calories={recipe.calories}
          fiber={recipe.fiber}
          sugar={recipe.sugar}
          servings={recipe.servings}
        />

        <Card className="bg-card border-border p-6 space-y-6">
          <RecipeIngredients ingredients={ingredients} />
          <Separator className="bg-border" />
          <RecipeInstructions instructions={instructions} />
        </Card>

        {/* Tip Card */}
        <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20 p-6">
          <p className="text-sm text-foreground text-center leading-relaxed">
            💡 <strong>Tip:</strong> You can prepare this the night before as overnight oats for a quick morning meal!
          </p>
        </Card>

        {/* Comment & Rating Section */}
        <CommentRating itemType="recipe" itemId={recipeId || "1"} />
      </div>
    </div>
  );
};

export default Recipe;
