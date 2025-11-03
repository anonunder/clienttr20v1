import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { CommentRating } from "@/components/shared/CommentRating";
import { WorkoutPageHeader } from "@/components/workouts/WorkoutPageHeader/WorkoutPageHeader";
import { ExerciseCard } from "@/components/exercises/ExerciseCard/ExerciseCard";

const Workout = () => {
  const { planId, workoutId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [highlightExerciseId, setHighlightExerciseId] = useState<string | null>(null);
  const highlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (location.state?.highlightExerciseId) {
      setHighlightExerciseId(location.state.highlightExerciseId);
      setTimeout(() => {
        setHighlightExerciseId(null);
      }, 3000);
      
      // Scroll to highlighted exercise
      setTimeout(() => {
        highlightRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  }, [location.state]);

  const workout = {
    id: workoutId,
    name: "Upper Body Power",
    image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&q=80",
    duration: "45 min",
    difficulty: "Medium",
  };

  const [exercises, setExercises] = useState([
    {
      id: "1",
      name: "Dumbbell Shoulder Press",
      image: "https://images.unsplash.com/photo-1574680088814-a26f9b6e2d02?w=400&q=80",
      sets: 3,
      reps: "12 reps",
      duration: "30 sec",
      difficulty: "Easy",
      alternatives: [
        {
          id: "1a",
          name: "Seated Dumbbell Press",
          image: "https://images.unsplash.com/photo-1574680088814-a26f9b6e2d02?w=400&q=80",
          sets: 3,
          reps: "12 reps",
          duration: "30 sec",
          difficulty: "Easy",
        },
        {
          id: "1b",
          name: "Arnold Press",
          image: "https://images.unsplash.com/photo-1574680088814-a26f9b6e2d02?w=400&q=80",
          sets: 3,
          reps: "12 reps",
          duration: "30 sec",
          difficulty: "Hard",
        },
      ],
    },
    {
      id: "2",
      name: "Bench Press",
      image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=400&q=80",
      sets: 4,
      reps: "10 reps",
      duration: "30 sec",
      difficulty: "Medium",
      alternatives: [
        {
          id: "2a",
          name: "Dumbbell Bench Press",
          image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=400&q=80",
          sets: 4,
          reps: "10 reps",
          duration: "30 sec",
          difficulty: "Medium",
        },
        {
          id: "2b",
          name: "Push-Ups",
          image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=400&q=80",
          sets: 3,
          reps: "15 reps",
          duration: "30 sec",
          difficulty: "Easy",
        },
      ],
    },
    {
      id: "3",
      name: "Battle Ropes",
      image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&q=80",
      sets: 3,
      reps: "8 reps",
      duration: "30 sec",
      difficulty: "Hard",
    },
    {
      id: "4",
      name: "Seated Dumbbell Shoulder Press",
      image: "https://images.unsplash.com/photo-1583454155184-870a1f63aedb?w=400&q=80",
      sets: 3,
      reps: "12 reps",
      duration: "30 sec",
      difficulty: "Hard",
      alternatives: [
        {
          id: "4a",
          name: "Standing Military Press",
          image: "https://images.unsplash.com/photo-1583454155184-870a1f63aedb?w=400&q=80",
          sets: 3,
          reps: "10 reps",
          duration: "30 sec",
          difficulty: "Medium",
        },
      ],
    },
  ]);

  const handleSwitchExercise = (exerciseId: string, alternative: any) => {
    setExercises(prev => prev.map(ex => {
      if (ex.id === exerciseId) {
        return { ...alternative, alternatives: ex.alternatives };
      }
      return ex;
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <WorkoutPageHeader
        image={workout.image}
        name={workout.name}
        duration={workout.duration}
        difficulty={workout.difficulty}
        onBack={() => navigate(`/programs/training/${planId}`)}
      />

      <div className="p-4 md:p-6 space-y-6">
        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-3">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            All
          </Button>
          <Button variant="outline" className="border-border text-foreground hover:bg-secondary">
            Strength
          </Button>
          <Button variant="outline" className="border-border text-foreground hover:bg-secondary">
            Stretching
          </Button>
          <Button variant="outline" className="border-border text-foreground hover:bg-secondary">
            Fat loss
          </Button>
        </div>

        {/* Exercises List */}
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-foreground">Exercises</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {exercises.map((exercise) => (
              <ExerciseCard
                key={exercise.id}
                id={exercise.id}
                name={exercise.name}
                image={exercise.image}
                sets={exercise.sets}
                reps={exercise.reps}
                duration={exercise.duration}
                difficulty={exercise.difficulty as "Easy" | "Medium" | "Hard"}
                planId={planId!}
                workoutId={workoutId!}
                alternatives={exercise.alternatives?.map(alt => ({
                  id: alt.id,
                  name: alt.name,
                  difficulty: alt.difficulty,
                }))}
                onSwitchExercise={handleSwitchExercise}
                isHighlighted={highlightExerciseId === exercise.id}
              />
            ))}
          </div>
        </div>

        {/* Start Workout Button */}
        <Button 
          className="w-full h-12 text-lg font-semibold bg-primary hover:bg-primary/90"
          onClick={() => window.location.href = `/programs/training/${planId}/workout/${workoutId}/exercise/${exercises[0].id}`}
        >
          Start Workout
        </Button>

        {/* Comment & Rating Section */}
        <CommentRating itemType="workout" itemId={workoutId || "1"} />
      </div>
    </div>
  );
};

export default Workout;
