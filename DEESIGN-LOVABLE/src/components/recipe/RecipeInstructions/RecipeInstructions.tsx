interface RecipeInstructionsProps {
  instructions: string[];
}

export const RecipeInstructions = ({ instructions }: RecipeInstructionsProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">Instructions</h2>
      <ol className="space-y-3">
        {instructions.map((instruction, index) => (
          <li key={index} className="flex items-start gap-3 text-muted-foreground">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary text-sm font-semibold flex-shrink-0">
              {index + 1}
            </span>
            <span className="pt-0.5">{instruction}</span>
          </li>
        ))}
      </ol>
    </div>
  );
};
