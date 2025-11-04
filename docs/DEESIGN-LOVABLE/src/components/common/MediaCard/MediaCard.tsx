import { Card } from "@/components/ui/card";
import { ReactNode } from "react";

interface MediaCardProps {
  image: string;
  title: string;
  imageHeight?: string;
  badge?: ReactNode;
  children?: ReactNode;
  onClick?: () => void;
  className?: string;
}

export const MediaCard = ({
  image,
  title,
  imageHeight = "h-40",
  badge,
  children,
  onClick,
  className = "",
}: MediaCardProps) => {
  return (
    <Card 
      className={`bg-card border-border overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group ${className}`}
      onClick={onClick}
    >
      <div className={`relative ${imageHeight} overflow-hidden`}>
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        {badge && (
          <div className="absolute top-3 right-3">
            {badge}
          </div>
        )}
      </div>
      {children && (
        <div className="p-4 space-y-2">
          {children}
        </div>
      )}
    </Card>
  );
};
