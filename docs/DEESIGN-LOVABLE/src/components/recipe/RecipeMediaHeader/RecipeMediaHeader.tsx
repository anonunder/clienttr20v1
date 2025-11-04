import { useState } from "react";
import { ArrowLeft, Clock, Users, Flame, Play, Video as VideoIcon, Heart, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Media {
  id: string;
  type: "image" | "video";
  url: string;
  thumbnail?: string;
}

interface RecipeMediaHeaderProps {
  media: Media[];
  title: string;
  difficulty: string;
  cookTime: string;
  servings: number;
  calories: number;
  onBack: () => void;
}

export const RecipeMediaHeader = ({
  media,
  title,
  difficulty,
  cookTime,
  servings,
  calories,
  onBack,
}: RecipeMediaHeaderProps) => {
  const [selectedMedia, setSelectedMedia] = useState<Media>(media[0]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isDone, setIsDone] = useState(false);

  return (
    <div className="relative h-80 overflow-hidden bg-surface">
      <div className="relative h-full w-full">
        {selectedMedia?.type === "video" ? (
          <video
            src={selectedMedia.url}
            className="w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
          />
        ) : (
          <img 
            src={selectedMedia?.url} 
            alt={title}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-background" />
        
        {selectedMedia?.type === "video" && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-16 h-16 rounded-full bg-on-surface/20 backdrop-blur-sm flex items-center justify-center">
              <Play className="h-8 w-8 text-on-surface" fill="currentColor" />
            </div>
          </div>
        )}

        <div className="absolute bottom-16 left-0 right-0 p-6 space-y-2">
          <Badge variant="outline" className="bg-success/20 text-success border-success/30">
            {difficulty}
          </Badge>
          <h1 className="text-2xl font-bold text-on-surface">
            {title}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-on-surface/90">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{cookTime}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{servings} serving</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Flame className="h-4 w-4" />
              <span>{calories} cal</span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 bg-overlay/60 backdrop-blur-sm p-2">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {media.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedMedia(item)}
                className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                  selectedMedia?.id === item.id
                    ? "border-primary scale-105"
                    : "border-on-surface/20 hover:border-on-surface/40"
                }`}
              >
                {item.type === "video" ? (
                  <>
                    <img
                      src={item.thumbnail || item.url}
                      alt="Video thumbnail"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-overlay/30">
                      <VideoIcon className="h-4 w-4 text-on-surface" />
                    </div>
                  </>
                ) : (
                  <img
                    src={item.url}
                    alt={`Media ${item.id}`}
                    className="w-full h-full object-cover"
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-full bg-background/20 backdrop-blur-sm hover:bg-background/30"
          onClick={onBack}
        >
          <ArrowLeft className="h-5 w-5 text-on-surface" />
        </Button>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full bg-background/20 backdrop-blur-sm hover:bg-background/30"
            onClick={() => {
              setIsFavorite(!isFavorite);
              toast.success(isFavorite ? "Removed from favorites" : "Added to favorites");
            }}
          >
            <Heart className={`h-5 w-5 ${isFavorite ? "fill-destructive text-destructive" : "text-on-surface"}`} />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full bg-background/20 backdrop-blur-sm hover:bg-background/30"
            onClick={() => {
              setIsDone(!isDone);
              toast.success(isDone ? "Marked as not done" : "Marked as done!");
            }}
          >
            <CheckCircle className={`h-5 w-5 ${isDone ? "fill-success text-success" : "text-on-surface"}`} />
          </Button>
        </div>
      </div>
    </div>
  );
};
