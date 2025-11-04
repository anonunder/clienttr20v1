import React from "react";
import { Heart, Share2, Bookmark, Info, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExerciseActionButtonsProps {
  onLike?: () => void;
  onShare?: () => void;
  onSave?: () => void;
  onInfo?: () => void;
  onComment?: () => void;
  isLiked?: boolean;
  isSaved?: boolean;
}

export function ExerciseActionButtons({
  onLike,
  onShare,
  onSave,
  onInfo,
  onComment,
  isLiked,
  isSaved,
}: ExerciseActionButtonsProps) {
  return (
    <div className="flex flex-col gap-4">
      <Button
        variant="ghost"
        size="icon"
        className="h-12 w-12 rounded-full bg-background/20 backdrop-blur-sm hover:bg-background/30"
        onClick={onLike}
      >
        <Heart
          className={`h-6 w-6 ${isLiked ? "fill-primary text-primary" : "text-on-surface"}`}
        />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="h-12 w-12 rounded-full bg-background/20 backdrop-blur-sm hover:bg-background/30"
        onClick={onShare}
      >
        <Share2 className="h-6 w-6 text-on-surface" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="h-12 w-12 rounded-full bg-background/20 backdrop-blur-sm hover:bg-background/30"
        onClick={onSave}
      >
        <Bookmark
          className={`h-6 w-6 ${isSaved ? "fill-primary text-primary" : "text-on-surface"}`}
        />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="h-12 w-12 rounded-full bg-background/20 backdrop-blur-sm hover:bg-background/30"
        onClick={onComment}
      >
        <MessageSquare className="h-6 w-6 text-on-surface" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="h-12 w-12 rounded-full bg-background/20 backdrop-blur-sm hover:bg-background/30"
        onClick={onInfo}
      >
        <Info className="h-6 w-6 text-on-surface" />
      </Button>
    </div>
  );
}
