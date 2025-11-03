import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";

interface ProgressImageCardProps {
  title: string;
  images: { src: string; date: string; label?: string }[];
}

export const ProgressImageCard = ({ title, images }: ProgressImageCardProps) => {
  return (
    <Card className="bg-card border-border p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">{title}</h3>
      <div className="grid grid-cols-2 gap-4">
        {images.map((image, index) => (
          <div key={index} className="space-y-2">
            <div className="relative aspect-square rounded-lg overflow-hidden border border-border">
              <img
                src={image.src}
                alt={`${title} ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>{image.date}</span>
              </div>
              {image.label && (
                <Badge variant="secondary" className="text-xs">
                  {image.label}
                </Badge>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
