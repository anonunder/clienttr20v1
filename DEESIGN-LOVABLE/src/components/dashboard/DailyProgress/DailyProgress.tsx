import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface Goal {
  name: string;
  current: number;
  target: number;
  unit: string;
}

interface DailyProgressProps {
  goals: Goal[];
}

export const DailyProgress = ({ goals }: DailyProgressProps) => {
  return (
    <Card className="bg-card border-border p-6">
      <h2 className="text-xl font-semibold text-foreground mb-6">Daily Progress</h2>
      <div className="space-y-6">
        {goals.map((goal) => {
          const percentage = (goal.current / goal.target) * 100;
          return (
            <div key={goal.name} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-foreground font-medium">{goal.name}</span>
                <span className="text-muted-foreground">
                  {goal.current} / {goal.target} {goal.unit}
                </span>
              </div>
              <Progress value={percentage} className="h-2" />
            </div>
          );
        })}
      </div>
    </Card>
  );
};
