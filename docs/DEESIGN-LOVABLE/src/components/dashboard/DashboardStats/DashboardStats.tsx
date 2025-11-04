import { Activity, Flame, Target, TrendingUp } from "lucide-react";
import { StatsCard } from "@/components/common/StatsCard/StatsCard";

export const DashboardStats = () => {
  const stats = [
    { label: "Calories Burned", value: "2,234", icon: Flame, color: "text-warning" },
    { label: "Active Days", value: "35", icon: Activity, color: "text-success" },
    { label: "Goals Hit", value: "12/15", icon: Target, color: "text-info" },
    { label: "Streak", value: "7 days", icon: TrendingUp, color: "text-primary" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <StatsCard
          key={stat.label}
          label={stat.label}
          value={stat.value}
          icon={stat.icon}
          iconColor={stat.color}
        />
      ))}
    </div>
  );
};
