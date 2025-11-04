import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Dumbbell, Target, Calendar } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader/PageHeader";
import { PlanCard } from "@/components/programs/PlanCard/PlanCard";

const ProgramDetail = () => {
  const { programId } = useParams();
  const navigate = useNavigate();

  // Mock data - would fetch based on programId
  const mockProgram = {
    id: programId,
    name: "Beginner Full-Body",
    description: "Perfect for getting started with strength training and building foundational fitness",
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80",
    duration: "4 weeks",
    difficulty: "Beginner",
    hasTraining: true,
    hasNutrition: true,
    trainingPlan: {
      id: "1",
      name: "Full Body Strength",
      image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&q=80",
      weeks: 4,
      workouts: 12,
      difficulty: "Beginner",
    },
    nutritionPlan: {
      id: "1",
      name: "Balanced Nutrition",
      image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&q=80",
      calories: 2200,
      meals: 5,
    },
  };

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        image={mockProgram.image}
        title={mockProgram.name}
        subtitle={mockProgram.description}
        onBack={() => navigate("/programs")}
      >
        <div className="flex items-center gap-1 text-sm text-white/80">
          <Calendar className="h-4 w-4" />
          <span>{mockProgram.duration}</span>
        </div>
      </PageHeader>

      {/* Plans Section */}
      <div className="p-4 md:p-6 space-y-6">
        {/* Training Plan */}
        {mockProgram.hasTraining && (
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">TRAININGS</h2>
            <PlanCard
              to={`/programs/training/${mockProgram.trainingPlan.id}`}
              image={mockProgram.trainingPlan.image}
              name={mockProgram.trainingPlan.name}
              info={[
                { icon: Calendar, text: `${mockProgram.trainingPlan.weeks} weeks` },
                { icon: Dumbbell, text: `${mockProgram.trainingPlan.workouts} workouts` },
              ]}
            />
          </div>
        )}

        {/* Nutrition Plan */}
        {mockProgram.hasNutrition && (
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">NUTRITION</h2>
            <PlanCard
              to={`/programs/nutrition/${mockProgram.nutritionPlan.id}`}
              image={mockProgram.nutritionPlan.image}
              name={mockProgram.nutritionPlan.name}
              info={[
                { icon: Target, text: `${mockProgram.nutritionPlan.calories} cal/day` },
              ]}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgramDetail;
