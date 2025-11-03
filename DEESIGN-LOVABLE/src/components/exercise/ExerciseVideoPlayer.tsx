import React, { useEffect, useRef } from "react";
import { Play, Pause } from "lucide-react";

interface ExerciseVideoPlayerProps {
  videoUrl?: string;
  isPlaying: boolean;
  onTogglePlay: () => void;
  aspectRatio: "16:9" | "9:16";
}

export function ExerciseVideoPlayer({
  videoUrl,
  isPlaying,
  onTogglePlay,
  aspectRatio,
}: ExerciseVideoPlayerProps) {
  const isVertical = aspectRatio === "9:16";
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    if (isPlaying) {
      // Ensure autoplay works on mobile by muting
      el.muted = true;
      el.play().catch(() => {
        /* Ignore autoplay errors */
      });
    } else {
      el.pause();
    }
  }, [isPlaying]);

  return (
    <div
      className={`relative flex items-center justify-center ${
        isVertical ? "h-full w-full bg-surface" : "aspect-video w-full bg-surface overflow-hidden"
      }`}
    >
      {videoUrl ? (
        <>
          {/* Blurred background for 16:9 videos */}
          {!isVertical && (
            <video
              className="absolute inset-0 w-full h-full object-cover blur-3xl opacity-50 scale-110"
              src={videoUrl}
              loop
              playsInline
              muted
              autoPlay={isPlaying}
            />
          )}
          
          {/* Main video */}
          <video
            ref={videoRef}
            className={`relative z-10 ${isVertical ? "h-full w-full object-cover" : "w-full h-full object-contain"}`}
            src={videoUrl}
            loop
            playsInline
            muted
            autoPlay={isPlaying}
          />
        </>
      ) : (
        <div className="text-muted-foreground text-sm">No video available</div>
      )}

      {/* Tap to pause when playing */}
      <button
        onClick={onTogglePlay}
        className="absolute inset-0 z-20"
        aria-label={isPlaying ? "Pause" : "Play"}
      />
    </div>
  );
}
