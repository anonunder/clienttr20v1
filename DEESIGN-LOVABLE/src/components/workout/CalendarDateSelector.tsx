import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface CalendarDateSelectorProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export function CalendarDateSelector({ selectedDate, onDateChange }: CalendarDateSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const goToPreviousDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() - 1);
    onDateChange(newDate);
  };

  const goToNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + 1);
    onDateChange(newDate);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  return (
    <div className="flex items-center justify-between gap-2 bg-card rounded-2xl p-3 border border-border">
      <Button
        variant="ghost"
        size="icon"
        onClick={goToPreviousDay}
        className="h-10 w-10 rounded-full"
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>

      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              "flex-1 justify-center text-left font-semibold h-10",
              !selectedDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedDate ? (
              <span>
                {isToday(selectedDate) ? "Today" : format(selectedDate, "EEEE, MMM d")}
              </span>
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="center">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              if (date) {
                onDateChange(date);
                setIsOpen(false);
              }
            }}
            initialFocus
            className={cn("p-3 pointer-events-auto")}
          />
        </PopoverContent>
      </Popover>

      <Button
        variant="ghost"
        size="icon"
        onClick={goToNextDay}
        className="h-10 w-10 rounded-full"
      >
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  );
}
