import { useState } from "react";
import { Heart, Dumbbell, Apple, Star, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import { FavoriteCard } from "@/components/favorites/FavoriteCard/FavoriteCard";

interface FavoriteItem {
  id: string;
  title: string;
  type: "training" | "nutrition";
  description: string;
  duration?: string;
  calories?: number;
  difficulty?: string;
  rating: number;
  image?: string;
}

const Favorites = () => {
  const [favorites] = useState<FavoriteItem[]>([
    {
      id: "1",
      title: "HIIT Cardio Blast",
      type: "training",
      description: "High-intensity interval training for maximum fat burn",
      duration: "30 min",
      difficulty: "Advanced",
      rating: 4.8,
    },
    {
      id: "2",
      title: "Strength Training Full Body",
      type: "training",
      description: "Complete workout targeting all major muscle groups",
      duration: "45 min",
      difficulty: "Intermediate",
      rating: 4.9,
    },
    {
      id: "3",
      title: "Yoga Flow for Flexibility",
      type: "training",
      description: "Gentle yoga session to improve flexibility and balance",
      duration: "60 min",
      difficulty: "Beginner",
      rating: 4.7,
    },
    {
      id: "4",
      title: "High Protein Meal Plan",
      type: "nutrition",
      description: "Balanced meal plan for muscle building and recovery",
      calories: 2400,
      rating: 4.9,
    },
    {
      id: "5",
      title: "Keto Diet Plan",
      type: "nutrition",
      description: "Low-carb, high-fat diet for weight loss",
      calories: 1800,
      rating: 4.6,
    },
    {
      id: "6",
      title: "Mediterranean Diet",
      type: "nutrition",
      description: "Heart-healthy eating plan with fresh ingredients",
      calories: 2000,
      rating: 4.8,
    },
  ]);

  const trainingFavorites = favorites.filter((item) => item.type === "training");
  const nutritionFavorites = favorites.filter((item) => item.type === "nutrition");

  return (
    <div className="min-h-screen bg-background">
      <Header title="Favorites" description="Quick access to your favorite workouts and meal plans" />
      
      <div className="container px-4 py-8 md:px-6 pb-24">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Page Header */}
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-primary/10">
              <Heart className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">Favorites</h1>
              <p className="text-muted-foreground mt-1">
                Quick access to your favorite workouts and meal plans
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-card border-border p-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Dumbbell className="h-5 w-5 text-primary" />
                  <p className="text-sm">Training Programs</p>
                </div>
                <p className="text-4xl font-bold text-primary">{trainingFavorites.length}</p>
                <p className="text-sm text-success flex items-center gap-1">
                  <TrendingUp className="h-4 w-4" />
                  Saved workouts
                </p>
              </div>
            </Card>

            <Card className="bg-card border-border p-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Apple className="h-5 w-5 text-success" />
                  <p className="text-sm">Nutrition Plans</p>
                </div>
                <p className="text-4xl font-bold text-success">{nutritionFavorites.length}</p>
                <p className="text-sm text-muted-foreground">Meal plans</p>
              </div>
            </Card>

            <Card className="bg-card border-border p-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Star className="h-5 w-5 text-warning" />
                  <p className="text-sm">Average Rating</p>
                </div>
                <p className="text-4xl font-bold text-warning">
                  {(favorites.reduce((acc, item) => acc + item.rating, 0) / favorites.length).toFixed(1)}
                </p>
                <p className="text-sm text-muted-foreground">Highly rated</p>
              </div>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="all" className="space-y-6">
            <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-3">
              <TabsTrigger value="all">All ({favorites.length})</TabsTrigger>
              <TabsTrigger value="training">Training ({trainingFavorites.length})</TabsTrigger>
              <TabsTrigger value="nutrition">Nutrition ({nutritionFavorites.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {favorites.map((item) => (
                  <FavoriteCard key={item.id} item={item} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="training" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {trainingFavorites.map((item) => (
                  <FavoriteCard key={item.id} item={item} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="nutrition" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {nutritionFavorites.map((item) => (
                  <FavoriteCard key={item.id} item={item} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Favorites;
