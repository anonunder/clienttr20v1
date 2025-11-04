import React from "react";
import { Badge } from "@/components/ui/badge";

interface ExerciseInfoProps {
  name: string;
  description?: string;
  difficulty?: "Easy" | "Medium" | "Hard";
  sets?: number;
  reps?: number;
  instructions?: string[];
  muscles?: string[];
}

export function ExerciseInfo({
  name,
  description,
  difficulty = "Medium",
  sets,
  reps,
  instructions,
  muscles,
}: ExerciseInfoProps) {
  const difficultyColor = {
    Easy: "bg-success/20 text-success border-success/30",
    Medium: "bg-warning/20 text-warning border-warning/30",
    Hard: "bg-destructive/20 text-destructive border-destructive/30",
  };

  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-xl font-bold text-on-surface mb-1">{name}</h1>
          {description && (
            <p className="text-sm text-on-surface/80 mb-2">{description}</p>
          )}
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className={difficultyColor[difficulty]}>{difficulty}</Badge>
            {sets && reps && (
              <Badge variant="outline" className="bg-background/20 text-on-surface border-on-surface/30">
                {sets} sets × {reps} reps
              </Badge>
            )}
          </div>
        </div>
      </div>

      {muscles && muscles.length > 0 && (
        <div className="space-y-1">
          <p className="text-xs text-on-surface/60 uppercase tracking-wide">Target Muscles</p>
          <div className="flex flex-wrap gap-2">
            {muscles.map((muscle, idx) => (
              <span
                key={idx}
                className="text-sm text-on-surface/80 bg-on-surface/10 px-2 py-1 rounded-md"
              >
                {muscle}
              </span>
            ))}
          </div>
        </div>
      )}

      {instructions && instructions.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-on-surface/60 uppercase tracking-wide">Instructions</p>
          <ul className="space-y-1 text-sm text-on-surface/90">
            {instructions.map((instruction, idx) => (
              <li key={idx} className="flex gap-2">
                <span className="text-primary font-semibold">{idx + 1}.</span>
                <span>{instruction}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
