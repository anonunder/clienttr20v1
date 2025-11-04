import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  image: string;
  onBack?: () => void;
  badge?: {
    text: string;
    variant?: string;
  };
  children?: ReactNode;
}

export const PageHeader = ({
  title,
  subtitle,
  image,
  onBack,
  badge,
  children,
}: PageHeaderProps) => {
  return (
    <div className="relative h-48 overflow-hidden">
      <img 
        src={image} 
        alt={title}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-background" />
      
      {onBack && (
        <div className="absolute top-4 left-4">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full bg-background/20 backdrop-blur-sm hover:bg-background/30"
            onClick={onBack}
          >
            <ArrowLeft className="h-5 w-5 text-on-surface" />
          </Button>
        </div>
      )}

      {children && (
        <div className="absolute top-4 right-4">
          {children}
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 p-6 space-y-2">
        {badge && (
          <Badge variant="outline" className={badge.variant}>
            {badge.text}
          </Badge>
        )}
        <h1 className="text-2xl font-bold text-on-surface">{title}</h1>
        {subtitle && (
          <p className="text-sm text-on-surface/90">{subtitle}</p>
        )}
      </div>
    </div>
  );
};
