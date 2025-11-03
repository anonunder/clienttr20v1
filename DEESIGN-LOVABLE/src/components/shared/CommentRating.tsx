import { useState } from "react";
import { Star, Send } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

interface CommentRatingProps {
  itemType: "exercise" | "workout" | "meal" | "recipe";
  itemId: string;
}

export const CommentRating = ({ itemType, itemId }: CommentRatingProps) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [savedRating, setSavedRating] = useState(0);
  const [savedComment, setSavedComment] = useState("");

  const handleSubmit = () => {
    if (rating === 0 && comment.trim() === "") {
      toast.error("Please add a rating or comment");
      return;
    }

    setSavedRating(rating);
    setSavedComment(comment);
    toast.success("Feedback saved successfully!");
  };

  const handleClear = () => {
    setRating(0);
    setComment("");
    setSavedRating(0);
    setSavedComment("");
    toast.success("Feedback cleared");
  };

  return (
    <Card className="bg-card border-border p-6 space-y-4">
      <h3 className="text-lg font-semibold text-foreground">Rate & Comment</h3>
      
      {/* Rating */}
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Your Rating</p>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="transition-transform hover:scale-110"
            >
              <Star
                className={`h-8 w-8 transition-colors ${
                  star <= (hoverRating || rating)
                    ? "fill-warning text-warning"
                    : "text-muted-foreground"
                }`}
              />
            </button>
          ))}
        </div>
        {rating > 0 && (
          <p className="text-sm text-foreground font-medium">
            {rating} {rating === 1 ? "star" : "stars"}
          </p>
        )}
      </div>

      <Separator className="bg-border" />

      {/* Comment */}
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Your Comment</p>
        <Textarea
          placeholder={`Share your thoughts about this ${itemType}...`}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="min-h-24 resize-none bg-secondary/30 border-border focus:border-primary"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button
          onClick={handleSubmit}
          className="flex-1 bg-primary hover:bg-primary/90"
        >
          <Send className="h-4 w-4 mr-2" />
          Save Feedback
        </Button>
        {(savedRating > 0 || savedComment) && (
          <Button
            variant="outline"
            onClick={handleClear}
            className="border-border hover:bg-secondary"
          >
            Clear
          </Button>
        )}
      </div>

      {/* Saved Feedback Display */}
      {(savedRating > 0 || savedComment) && (
        <>
          <Separator className="bg-border" />
          <div className="space-y-2 p-3 rounded-lg bg-secondary/30">
            <p className="text-sm font-medium text-foreground">Your Saved Feedback</p>
            {savedRating > 0 && (
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${
                      star <= savedRating
                        ? "fill-warning text-warning"
                        : "text-muted-foreground"
                    }`}
                  />
                ))}
              </div>
            )}
            {savedComment && (
              <p className="text-sm text-muted-foreground italic">"{savedComment}"</p>
            )}
          </div>
        </>
      )}
    </Card>
  );
};
