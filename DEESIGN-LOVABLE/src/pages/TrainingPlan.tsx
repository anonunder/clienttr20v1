import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CheckCircle2, Dumbbell } from "lucide-react";
import { HorizontalDaySelector } from "@/components/workout/HorizontalDaySelector";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/common/PageHeader/PageHeader";
import { WorkoutCard } from "@/components/workouts/WorkoutCard/WorkoutCard";

const TrainingPlan = () => {
  const { planId } = useParams();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Mock data - in real app would fetch based on planId and selectedDate
  const mockPlan = {
    id: planId,
    name: "Full Body Strength",
    image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&q=80",
    weeks: 4,
    description: "Build strength and muscle with compound movements",
  };

  // Mock workouts for selected day
  const mockWorkouts = [
    {
      id: "1",
      title: "Upper Body Power",
      image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&q=80",
      duration: "45 min",
      exercises: 8,
      difficulty: "Medium",
      completed: true,
    },
    {
      id: "2",
      title: "Core & Cardio",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80",
      duration: "30 min",
      exercises: 6,
      difficulty: "Easy",
      completed: false,
    },
    {
      id: "3",
      title: "Lower Body Power",
      image: "https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=400&q=80",
      duration: "50 min",
      exercises: 10,
      difficulty: "Hard",
      completed: false,
    },
  ];

  const completedCount = mockWorkouts.filter((w) => w.completed).length;
  const totalExercises = mockWorkouts.reduce((acc, w) => acc + w.exercises, 0);

  return (
    <div className="min-h-screen bg-background pb-24">
      <PageHeader
        title={mockPlan.name}
        subtitle={`${mockPlan.weeks} weeks program`}
        image={mockPlan.image}
        onBack={() => navigate(`/programs/${planId}`)}
      />

      <div className="p-4 space-y-6">
        {/* Horizontal Day Selector */}
        <HorizontalDaySelector selectedDate={selectedDate} onDateChange={setSelectedDate} />

        {/* Progress Card */}
        <Card className="p-6 bg-card border-border">
          <h2 className="text-xl font-bold mb-4 text-foreground">Today's Progress</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {completedCount}/{mockWorkouts.length}
                  </p>
                  <p className="text-xs">Workouts Done</p>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Dumbbell className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{totalExercises}</p>
                  <p className="text-xs">Total Exercises</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Workout List */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">Today's Workouts</h2>
          <div className="grid grid-cols-1 gap-3">
            {mockWorkouts.map((workout) => (
              <WorkoutCard
                key={workout.id}
                id={workout.id}
                title={workout.title}
                image={workout.image}
                duration={workout.duration}
                exercises={workout.exercises}
                difficulty={workout.difficulty as "Easy" | "Medium" | "Hard"}
                completed={workout.completed}
                planId={planId || "1"}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingPlan;
