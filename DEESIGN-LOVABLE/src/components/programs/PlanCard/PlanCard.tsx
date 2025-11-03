import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface PlanCardProps {
  to: string;
  image: string;
  name: string;
  info: Array<{
    icon: LucideIcon;
    text: string;
  }>;
}

export const PlanCard = ({ to, image, name, info }: PlanCardProps) => {
  return (
    <Link to={to}>
      <Card className="bg-card border-border overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group">
        <div className="flex gap-4">
          <div className="relative w-32 h-32 flex-shrink-0 overflow-hidden">
            <img 
              src={image} 
              alt={name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>

          <div className="flex-1 p-4 space-y-2">
            <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
              {name}
            </h3>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              {info.map((item, index) => (
                <div key={index} className="flex items-center gap-1">
                  {index > 0 && <span className="mr-2">•</span>}
                  <item.icon className="h-4 w-4" />
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};
