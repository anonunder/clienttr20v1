import { Dumbbell, Activity } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  completed: boolean;
}

interface TodayExercisesProps {
  exercises: Exercise[];
}

export const TodayExercises = ({ exercises }: TodayExercisesProps) => {
  const navigate = useNavigate();

  return (
    <Card className="bg-card border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Dumbbell className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Today's Exercises</h3>
        </div>
        <Button variant="ghost" size="sm" onClick={() => navigate('/programs/training')}>
          View All
        </Button>
      </div>
      <div className="space-y-3">
        {exercises.map((exercise) => (
          <div key={exercise.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
            <div className="flex-1">
              <p className={`font-medium ${exercise.completed ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                {exercise.name}
              </p>
              <p className="text-sm text-muted-foreground">{exercise.sets} sets × {exercise.reps} reps</p>
            </div>
            {exercise.completed && (
              <div className="h-6 w-6 rounded-full bg-success/20 flex items-center justify-center">
                <Activity className="h-4 w-4 text-success" />
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};
