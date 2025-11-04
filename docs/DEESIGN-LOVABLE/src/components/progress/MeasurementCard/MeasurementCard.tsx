import { TrendingUp, TrendingDown, Clock, Target, Activity, Minus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface Measurement {
  id: string;
  name: string;
  value: number;
  unit: string;
  date: string;
  goal?: number;
  change?: number;
}

interface MeasurementCardProps {
  measurement: Measurement | undefined;
  onClick?: () => void;
}

export const MeasurementCard = ({ measurement, onClick }: MeasurementCardProps) => {
  if (!measurement) return null;

  const hasGoal = measurement.goal !== undefined;
  const progressPercentage = hasGoal ? Math.min(100, Math.max(0, (measurement.value / measurement.goal!) * 100)) : 0;
  const isPositiveChange = (measurement.change ?? 0) > 0;
  const isNegativeChange = (measurement.change ?? 0) < 0;

  return (
    <Card
      className="bg-gradient-to-br from-card to-card/50 border-border hover:shadow-lg hover:scale-[1.02] transition-all duration-300 cursor-pointer overflow-hidden group"
      onClick={onClick}
    >
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Activity className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">{measurement.name}</h3>
            </div>
            <p className="text-3xl font-bold text-foreground tracking-tight">
              {measurement.value}
              <span className="text-sm text-muted-foreground ml-1.5 font-normal">{measurement.unit}</span>
            </p>
          </div>

          {measurement.change !== undefined && (
            <Badge
              variant={isPositiveChange ? "default" : isNegativeChange ? "destructive" : "secondary"}
              className="flex items-center gap-1 px-2 py-1"
            >
              {isPositiveChange ? (
                <TrendingUp className="h-3 w-3" />
              ) : isNegativeChange ? (
                <TrendingDown className="h-3 w-3" />
              ) : (
                <Minus className="h-3 w-3" />
              )}
              <span className="text-xs font-semibold">
                {Math.abs(measurement.change)}
                {measurement.unit}
              </span>
            </Badge>
          )}
        </div>

        {hasGoal && (
          <div className="space-y-2 pt-2 border-t border-border/50">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Target className="h-3 w-3" />
                <span>
                  Goal: {measurement.goal}
                  {measurement.unit}
                </span>
              </div>
              <span className="font-semibold text-primary">{progressPercentage.toFixed(0)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-1.5" />
          </div>
        )}

        <div className="flex items-center gap-1 text-xs text-muted-foreground pt-1">
          <Clock className="h-3 w-3" />
          <span>{format(new Date(measurement.date), "MMM dd, yyyy")}</span>
        </div>
      </div>

      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </Card>
  );
};
