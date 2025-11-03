import { LucideIcon, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";

interface SettingsItem {
  label: string;
  action: () => void;
}

interface SettingsSectionProps {
  title: string;
  icon: LucideIcon;
  items: SettingsItem[];
}

export const SettingsSection = ({ title, icon: Icon, items }: SettingsSectionProps) => {
  return (
    <Card className="bg-card border-border overflow-hidden">
      <div className="p-4 bg-secondary/50">
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        </div>
      </div>
      <div className="divide-y divide-border">
        {items.map((item, index) => (
          <button
            key={index}
            onClick={item.action}
            className="w-full p-4 flex items-center justify-between hover:bg-secondary/50 transition-colors group"
          >
            <span className="text-foreground group-hover:text-primary transition-colors">{item.label}</span>
            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </button>
        ))}
      </div>
    </Card>
  );
};
