interface MacrosDisplayProps {
  protein: number;
  carbs: number;
  fat: number;
  size?: "sm" | "md" | "lg";
}

export const MacrosDisplay = ({ protein, carbs, fat, size = "md" }: MacrosDisplayProps) => {
  const textSize = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-2xl",
  };

  const labelSize = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-sm",
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="text-center space-y-1">
        <p className={`font-bold text-primary ${textSize[size]}`}>{protein}g</p>
        <p className={`text-muted-foreground ${labelSize[size]}`}>Protein</p>
      </div>
      <div className="text-center space-y-1">
        <p className={`font-bold text-info ${textSize[size]}`}>{carbs}g</p>
        <p className={`text-muted-foreground ${labelSize[size]}`}>Carbs</p>
      </div>
      <div className="text-center space-y-1">
        <p className={`font-bold text-warning ${textSize[size]}`}>{fat}g</p>
        <p className={`text-muted-foreground ${labelSize[size]}`}>Fat</p>
      </div>
    </div>
  );
};
