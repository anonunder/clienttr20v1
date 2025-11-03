import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  iconColor?: string;
}

export const StatsCard = ({ label, value, icon: Icon, iconColor = "text-primary" }: StatsCardProps) => {
  return (
    <Card className="bg-card border-border p-4 hover:bg-secondary/50 transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
        </div>
        <Icon className={`h-8 w-8 ${iconColor}`} />
      </div>
    </Card>
  );
};
