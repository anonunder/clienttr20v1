import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface GoalData {
  name: string;
  current: number;
  goal: number;
  percentage: number;
}

interface GoalsProgressChartProps {
  title: string;
  data: GoalData[];
}

export const GoalsProgressChart = ({ title, data }: GoalsProgressChartProps) => {
  return (
    <Card className="bg-card border-border p-6">
      <h3 className="text-lg font-semibold text-foreground mb-6">{title}</h3>
      <div className="space-y-6">
        {data.map((goal, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">{goal.name}</span>
              <span className="text-sm text-muted-foreground">
                {goal.current} / {goal.goal}
              </span>
            </div>
            <Progress value={goal.percentage} className="h-3" />
            <div className="text-xs text-right text-muted-foreground">
              {goal.percentage.toFixed(1)}% complete
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
