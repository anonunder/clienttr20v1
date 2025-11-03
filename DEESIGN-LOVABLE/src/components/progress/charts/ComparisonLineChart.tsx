import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface ComparisonDataPoint {
  part: string;
  current: number;
  previous: number;
  goal?: number;
}

interface ComparisonLineChartProps {
  title: string;
  data: ComparisonDataPoint[];
}

const COLORS = {
  primary: "hsl(var(--primary))",
  warning: "hsl(var(--warning))",
  success: "hsl(var(--success))",
  border: "hsl(var(--border))",
  mutedForeground: "hsl(var(--muted-foreground))",
  card: "hsl(var(--card))",
};

export const ComparisonLineChart = ({ title, data }: ComparisonLineChartProps) => {
  return (
    <Card className="bg-card border-border p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
          <XAxis dataKey="part" stroke={COLORS.mutedForeground} />
          <YAxis stroke={COLORS.mutedForeground} />
          <Tooltip
            contentStyle={{
              backgroundColor: COLORS.card,
              border: `1px solid ${COLORS.border}`,
              borderRadius: "8px",
              color: "hsl(var(--foreground))",
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="current"
            stroke={COLORS.primary}
            strokeWidth={3}
            name="Current (cm)"
            dot={{ r: 5 }}
          />
          <Line
            type="monotone"
            dataKey="previous"
            stroke={COLORS.warning}
            strokeWidth={2}
            name="Previous (cm)"
            dot={{ r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="goal"
            stroke={COLORS.success}
            strokeWidth={2}
            strokeDasharray="5 5"
            name="Goal (cm)"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};
