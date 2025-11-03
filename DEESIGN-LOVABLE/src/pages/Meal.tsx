import { useParams, useNavigate } from "react-router-dom";
import { Clock, Flame } from "lucide-react";
import { Card } from "@/components/ui/card";
import { CommentRating } from "@/components/shared/CommentRating";
import { PageHeader } from "@/components/common/PageHeader/PageHeader";
import { MacrosDisplay } from "@/components/common/MacrosDisplay/MacrosDisplay";
import { RecipeCard } from "@/components/nutrition/RecipeCard/RecipeCard";
import { InfoRow } from "@/components/common/InfoRow/InfoRow";

const Meal = () => {
  const { planId, mealId } = useParams();
  const navigate = useNavigate();

  const meal = {
    id: mealId,
    name: "Breakfast",
    image: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=800&q=80",
    time: "8:00 AM",
    calories: 450,
    protein: 25,
    carbs: 50,
    fat: 15,
  };

  const recipes = [
    {
      id: "1",
      title: "Protein Oatmeal Bowl",
      image: "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=400&q=80",
      calories: 320,
      protein: 18,
      carbs: 45,
      fat: 8,
      cookTime: "10 min",
    },
    {
      id: "2",
      title: "Greek Yogurt Parfait",
      image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&q=80",
      calories: 130,
      protein: 7,
      carbs: 5,
      fat: 7,
      cookTime: "5 min",
    },
  ];

  const subtitle = (
    <div className="flex items-center gap-3">
      <InfoRow icon={Clock} text={meal.time} iconColor="text-white/90" />
      <span>•</span>
      <InfoRow icon={Flame} text={`${meal.calories} calories`} iconColor="text-white/90" />
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title={meal.name}
        subtitle={subtitle as any}
        image={meal.image}
        onBack={() => navigate(`/programs/nutrition/${planId}`)}
      />

      <div className="p-4 md:p-6 space-y-6">
        {/* Macros Card */}
        <Card className="bg-card border-border p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Macros</h2>
          <MacrosDisplay
            protein={meal.protein}
            carbs={meal.carbs}
            fat={meal.fat}
            size="lg"
          />
        </Card>

        {/* Recipes */}
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-foreground">Recipes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                id={recipe.id}
                title={recipe.title}
                image={recipe.image}
                calories={recipe.calories}
                protein={recipe.protein}
                carbs={recipe.carbs}
                fat={recipe.fat}
                cookTime={recipe.cookTime}
                planId={planId || "1"}
                mealId={mealId || "1"}
              />
            ))}
          </div>
        </div>

        {/* Comment & Rating Section */}
        <CommentRating itemType="meal" itemId={mealId || "1"} />
      </div>
    </div>
  );
};

export default Meal;
