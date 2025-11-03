import { LucideIcon } from "lucide-react";

interface InfoRowProps {
  icon: LucideIcon;
  text: string;
  iconColor?: string;
}

export const InfoRow = ({ icon: Icon, text, iconColor = "text-muted-foreground" }: InfoRowProps) => {
  return (
    <div className="flex items-center gap-1">
      <Icon className={`h-3 w-3 ${iconColor}`} />
      <span>{text}</span>
    </div>
  );
};
