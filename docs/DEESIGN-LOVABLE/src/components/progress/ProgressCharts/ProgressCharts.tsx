import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProgressLineChart } from "../charts/ProgressLineChart";
import { BodyCompositionChart } from "../charts/BodyCompositionChart";
import { GoalsProgressChart } from "../charts/GoalsProgressChart";
import { ComparisonLineChart } from "../charts/ComparisonLineChart";
import { ProgressImageCard } from "../charts/ProgressImageCard";
import bodyFemale from "@/assets/body-female.png";
import bodyMale from "@/assets/body-male.png";

interface Measurement {
  id: string;
  name: string;
  value: number;
  unit: string;
  date: string;
  goal?: number;
  change?: number;
}

interface ProgressChartsProps {
  measurements: Measurement[];
}

const COLORS = {
  primary: "hsl(var(--primary))",
  success: "hsl(var(--success))",
  warning: "hsl(var(--warning))",
  info: "hsl(var(--info))",
  destructive: "hsl(var(--destructive))",
  accent: "hsl(var(--accent))",
};

export const ProgressCharts = ({ measurements }: ProgressChartsProps) => {
  const [selectedMetric, setSelectedMetric] = useState("1"); // Default to Weight

  const currentMeasurement = measurements.find((m) => m.id === selectedMetric);

  // Generate mock historical data for the selected metric
  const generateHistoricalData = (measurementId: string) => {
    const measurement = measurements.find((m) => m.id === measurementId);
    if (!measurement) return [];

    const baseValue = measurement.value;
    const change = measurement.change || 0;

    return [
      { date: "Oct 1", value: baseValue + change * 4, goal: measurement.goal },
      { date: "Oct 8", value: baseValue + change * 3, goal: measurement.goal },
      { date: "Oct 15", value: baseValue + change * 2, goal: measurement.goal },
      { date: "Oct 22", value: baseValue + change, goal: measurement.goal },
      { date: "Oct 29", value: baseValue, goal: measurement.goal },
    ];
  };

  const historicalData = generateHistoricalData(selectedMetric);

  // Body composition data
  const bodyComposition = [
    { name: "Muscle Mass", value: 58.5, color: COLORS.success, unit: "kg" },
    { name: "Body Fat", value: 18.5, color: COLORS.warning, unit: "%" },
    { name: "Water", value: 58, color: COLORS.info, unit: "%" },
    { name: "Bone Mass", value: 3.2, color: COLORS.primary, unit: "kg" },
  ];

  // Macronutrient breakdown
  const macroBreakdown = [
    { name: "Protein", value: 30, color: COLORS.primary, unit: "%" },
    { name: "Carbs", value: 45, color: COLORS.info, unit: "%" },
    { name: "Fats", value: 25, color: COLORS.warning, unit: "%" },
  ];

  // Measurements progress (goals)
  const goalsProgress = measurements
    .filter((m) => m.goal !== undefined)
    .slice(0, 6)
    .map((m) => ({
      name: m.name,
      current: m.value,
      goal: m.goal!,
      percentage: Math.min(100, (m.value / m.goal!) * 100),
    }));

  // Body measurements comparison
  const bodyMeasurementsData = [
    { part: "Chest", current: 106, previous: 105, goal: 110 },
    { part: "Waist", current: 82, previous: 84, goal: 78 },
    { part: "Hips", current: 98, previous: 98.5, goal: 95 },
    { part: "Biceps", current: 37, previous: 36.5, goal: 40 },
    { part: "Thighs", current: 58, previous: 57.7, goal: 60 },
  ];

  // Weekly progress comparison
  const weeklyProgressData = [
    { part: "Week 1", current: 75.7, previous: 76.2, goal: 70 },
    { part: "Week 2", current: 75.5, previous: 75.7, goal: 70 },
    { part: "Week 3", current: 75.2, previous: 75.5, goal: 70 },
    { part: "Week 4", current: 75.0, previous: 75.2, goal: 70 },
  ];

  // Progress images
  const frontProgressImages = [
    { src: bodyFemale, date: "Oct 1", label: "Start" },
    { src: bodyFemale, date: "Oct 29", label: "Current" },
  ];

  const sideProgressImages = [
    { src: bodyMale, date: "Oct 1", label: "Start" },
    { src: bodyMale, date: "Oct 29", label: "Current" },
  ];

  return (
    <div className="space-y-6">
      {/* Metric Selector */}
      <Card className="bg-card border-border p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <h3 className="text-lg font-semibold text-foreground">Progress Analytics</h3>
          <div className="w-full md:w-64">
            <Select value={selectedMetric} onValueChange={setSelectedMetric}>
              <SelectTrigger>
                <SelectValue placeholder="Select metric" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Weight</SelectItem>
                <SelectItem value="3">Body Fat</SelectItem>
                <SelectItem value="4">Muscle Mass</SelectItem>
                <SelectItem value="5">BMI</SelectItem>
                <SelectItem value="6">Chest</SelectItem>
                <SelectItem value="7">Waist</SelectItem>
                <SelectItem value="8">Hips</SelectItem>
                <SelectItem value="9">Shoulders</SelectItem>
                <SelectItem value="11">Biceps (L)</SelectItem>
                <SelectItem value="15">Thighs (L)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Weight Progress - Full Row */}
      <ProgressLineChart
        title={`${currentMeasurement?.name} Progress`}
        data={historicalData}
        unit={currentMeasurement?.unit}
        gradientId="colorWeight"
      />

      {/* Charts Grid - 2 per row on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BodyCompositionChart title="Body Composition" data={bodyComposition} />

        <BodyCompositionChart title="Macronutrient Breakdown" data={macroBreakdown} />

        <ComparisonLineChart title="Body Measurements Comparison" data={bodyMeasurementsData} />

        <ComparisonLineChart title="Weekly Weight Progress" data={weeklyProgressData} />

        <ProgressImageCard title="Front Progress Photos" images={frontProgressImages} />

        <ProgressImageCard title="Side Progress Photos" images={sideProgressImages} />
      </div>
    </div>
  );
};
