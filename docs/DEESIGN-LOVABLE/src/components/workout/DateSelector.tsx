import React from "react";
import { cn } from "@/lib/utils";

interface DateSelectorProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export function DateSelector({ selectedDate, onDateChange }: DateSelectorProps) {
  const today = new Date();
  const dates: Date[] = [];

  // Generate 7 days starting from today
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push(date);
  }

  const formatDay = (date: Date) => {
    return date.toLocaleDateString("en-US", { weekday: "short" });
  };

  const formatDate = (date: Date) => {
    return date.getDate().toString().padStart(2, "0");
  };

  const isSameDay = (d1: Date, d2: Date) => {
    return (
      d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear()
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {dates.map((date, idx) => {
          const isSelected = isSameDay(date, selectedDate);
          return (
            <button
              key={idx}
              onClick={() => onDateChange(date)}
              className={cn(
                "flex flex-col items-center justify-center min-w-[60px] h-[72px] rounded-2xl transition-all",
                isSelected
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-muted-foreground hover:bg-secondary"
              )}
            >
              <span className="text-xs font-medium mb-1">{formatDay(date)}</span>
              <span className="text-xl font-bold">{formatDate(date)}</span>
            </button>
          );
        })}
      </div>
      
      {/* Progress Bar */}
      <div className="relative h-1 bg-border rounded-full overflow-hidden">
        <div 
          className="absolute h-full bg-primary rounded-full transition-all duration-300"
          style={{ width: `${((dates.findIndex(d => isSameDay(d, selectedDate)) + 1) / dates.length) * 100}%` }}
        />
      </div>
    </div>
  );
}
