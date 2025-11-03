import React, { useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HorizontalDaySelectorProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export function HorizontalDaySelector({ selectedDate, onDateChange }: HorizontalDaySelectorProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Generate 60 days - 30 before and after today
  const generateDays = () => {
    const days = [];
    const today = new Date();
    for (let i = -30; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const days = generateDays();

  useEffect(() => {
    // Scroll to selected date
    if (scrollRef.current) {
      const selectedIndex = days.findIndex(
        (d) => d.toDateString() === selectedDate.toDateString()
      );
      if (selectedIndex !== -1) {
        const button = scrollRef.current.children[selectedIndex] as HTMLElement;
        if (button) {
          button.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
        }
      }
    }
  }, [selectedDate]);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  const formatDay = (date: Date) => {
    return date.toLocaleDateString("en-US", { weekday: "short" });
  };

  const formatDate = (date: Date) => {
    return date.getDate().toString().padStart(2, "0");
  };

  const isSelected = (date: Date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  const isToday = (date: Date) => {
    return date.toDateString() === new Date().toDateString();
  };

  return (
    <div className="relative">
      {/* Scroll buttons */}
      <Button
        variant="ghost"
        size="icon"
        onClick={scrollLeft}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={scrollRight}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      {/* Day selector */}
      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto scrollbar-hide px-8 py-2"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {days.map((date, index) => {
          const selected = isSelected(date);
          const today = isToday(date);
          return (
            <button
              key={index}
              onClick={() => onDateChange(date)}
              className={`
                flex-shrink-0 flex flex-col items-center justify-center
                min-w-[60px] h-[70px] rounded-2xl transition-all
                ${
                  selected
                    ? "bg-primary text-primary-foreground scale-105"
                    : today
                    ? "bg-primary/20 text-primary"
                    : "bg-secondary/50 text-muted-foreground hover:bg-secondary"
                }
              `}
            >
              <span className="text-xs font-medium">{formatDay(date)}</span>
              <span className="text-2xl font-bold mt-1">{formatDate(date)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
