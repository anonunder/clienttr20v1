import { useParams, useNavigate } from "react-router-dom";
import { Flame } from "lucide-react";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/common/PageHeader/PageHeader";
import { MacrosDisplay } from "@/components/common/MacrosDisplay/MacrosDisplay";
import { MealCard } from "@/components/nutrition/MealCard/MealCard";

const NutritionPlan = () => {
  const { planId } = useParams();
  const navigate = useNavigate();

  const nutritionPlan = {
    id: planId,
    name: "Balanced Nutrition",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80",
    calories: 2200,
    protein: 128,
    carbs: 205,
    fat: 74,
  };

  const meals = [
    {
      id: "1",
      name: "Breakfast",
      image: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=400&q=80",
      time: "8:00 AM",
      calories: 450,
      recipes: 2,
      protein: 25,
      carbs: 50,
      fat: 15,
    },
    {
      id: "2",
      name: "Mid-Morning Snack",
      image: "https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?w=400&q=80",
      time: "11:00 AM",
      calories: 200,
      recipes: 1,
      protein: 10,
      carbs: 25,
      fat: 8,
    },
    {
      id: "3",
      name: "Lunch",
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80",
      time: "1:00 PM",
      calories: 650,
      recipes: 3,
      protein: 40,
      carbs: 60,
      fat: 20,
    },
    {
      id: "4",
      name: "Afternoon Snack",
      image: "https://images.unsplash.com/photo-1610440042544-8c8b330f8ebb?w=400&q=80",
      time: "4:00 PM",
      calories: 150,
      recipes: 1,
      protein: 8,
      carbs: 15,
      fat: 6,
    },
    {
      id: "5",
      name: "Dinner",
      image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80",
      time: "7:00 PM",
      calories: 700,
      recipes: 3,
      protein: 45,
      carbs: 55,
      fat: 25,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title={nutritionPlan.name}
        subtitle={`${nutritionPlan.calories} calories/day • ${meals.length} meals`}
        image={nutritionPlan.image}
        onBack={() => navigate(`/programs/${planId}`)}
      />

      <div className="p-4 md:p-6 space-y-6">
        {/* Nutrition Breakdown Card */}
        <Card className="bg-card border-border p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Daily Macros</h2>
          <MacrosDisplay
            protein={nutritionPlan.protein}
            carbs={nutritionPlan.carbs}
            fat={nutritionPlan.fat}
            size="lg"
          />
        </Card>

        {/* Daily Meals */}
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-foreground">Daily Meals</h2>
          <div className="grid grid-cols-1 gap-3">
            {meals.map((meal) => (
              <MealCard
                key={meal.id}
                id={meal.id}
                name={meal.name}
                image={meal.image}
                time={meal.time}
                calories={meal.calories}
                protein={meal.protein}
                carbs={meal.carbs}
                fat={meal.fat}
                recipes={meal.recipes}
                planId={planId || "1"}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NutritionPlan;
