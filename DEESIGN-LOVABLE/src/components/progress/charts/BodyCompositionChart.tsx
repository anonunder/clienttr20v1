import { Card } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

interface CompositionData {
  name: string;
  value: number;
  color: string;
  unit?: string;
}

interface BodyCompositionChartProps {
  title: string;
  data: CompositionData[];
}

export const BodyCompositionChart = ({ title, data }: BodyCompositionChartProps) => {
  return (
    <Card className="bg-card border-border p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">{title}</h3>
      <div className="grid md:grid-cols-2 gap-6">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value, unit }) => `${name}: ${value}${unit || ""}`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                color: "hsl(var(--foreground))",
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        <div className="flex flex-col justify-center space-y-4">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-foreground">{item.name}</span>
              </div>
              <span className="font-bold text-foreground">
                {item.value}
                {item.unit || ""}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
