import { Card } from "@/components/ui/card";
import { AreaChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface ChartDataPoint {
  date: string;
  value: number;
  goal?: number;
}

interface ProgressLineChartProps {
  title: string;
  data: ChartDataPoint[];
  unit?: string;
  gradientId?: string;
}

const COLORS = {
  primary: "hsl(var(--primary))",
  success: "hsl(var(--success))",
  border: "hsl(var(--border))",
  mutedForeground: "hsl(var(--muted-foreground))",
  card: "hsl(var(--card))",
};

export const ProgressLineChart = ({ title, data, unit = "", gradientId = "colorDefault" }: ProgressLineChartProps) => {
  return (
    <Card className="bg-card border-border p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.3} />
              <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
          <XAxis dataKey="date" stroke={COLORS.mutedForeground} />
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
          <Area
            type="monotone"
            dataKey="value"
            stroke={COLORS.primary}
            strokeWidth={3}
            fillOpacity={1}
            fill={`url(#${gradientId})`}
            name={`${title} ${unit ? `(${unit})` : ""}`}
          />
          {data[0]?.goal !== undefined && (
            <Line
              type="monotone"
              dataKey="goal"
              stroke={COLORS.success}
              strokeWidth={2}
              strokeDasharray="5 5"
              name="Goal"
              dot={false}
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
};
