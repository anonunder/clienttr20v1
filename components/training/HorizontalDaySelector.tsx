import React, { useRef, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { darkTheme } from '@/styles/theme';
import { useResponsive } from '@/hooks/use-responsive';

interface HorizontalDaySelectorProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  startDate?: Date | string | null;
  endDate?: Date | string | null;
  completedDates?: Set<string>; // Set of date strings (YYYY-MM-DD) that have all workouts completed
}

export function HorizontalDaySelector({ 
  selectedDate, 
  onDateChange,
  startDate,
  endDate,
  completedDates = new Set(),
}: HorizontalDaySelectorProps) {
  const scrollRef = useRef<ScrollView>(null);
  const scrollPositionRef = useRef(0);
  const { isMobile, isTablet, width } = useResponsive();
  
  // Responsive sizing
  const dayButtonWidth = useMemo(() => {
    if (isMobile) return 56; // Smaller on mobile
    if (isTablet) return 60; // Standard on tablet
    return 64; // Larger on desktop
  }, [isMobile, isTablet]);
  
  const dayButtonHeight = useMemo(() => {
    if (isMobile) return 66; // Smaller on mobile
    if (isTablet) return 70; // Standard on tablet
    return 74; // Larger on desktop
  }, [isMobile, isTablet]);
  
  const gap = useMemo(() => {
    if (isMobile) return 6; // Smaller gap on mobile
    return 8; // Standard gap
  }, [isMobile]);
  
  const itemWidth = dayButtonWidth + gap;

  // Parse dates
  const parseDate = (date: Date | string | null | undefined): Date | null => {
    if (!date) return null;
    if (date instanceof Date) return date;
    return new Date(date);
  };

  const programStartDate = parseDate(startDate);
  const programEndDate = parseDate(endDate);

  // Generate days based on program dates or default to 60 days around today
  const generateDays = () => {
    const days = [];
    
    if (programStartDate && programEndDate) {
      // Generate days from program start to end date
      const start = new Date(programStartDate);
      const end = new Date(programEndDate);
      
      // Set time to midnight for accurate day calculations
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);
      
      const currentDate = new Date(start);
      while (currentDate <= end) {
        days.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }
    } else {
      // Fallback: Generate 60 days - 30 before and after today
      const today = new Date();
      for (let i = -30; i <= 30; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        days.push(date);
      }
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
        // Calculate approximate scroll position based on responsive item width
        const scrollPosition = selectedIndex * itemWidth;
        scrollPositionRef.current = scrollPosition - (width * 0.2); // 20% of screen width offset
        scrollRef.current.scrollTo({ x: scrollPositionRef.current, animated: true });
      }
    }
  }, [selectedDate, days, itemWidth, width]);

  const scrollAmount = useMemo(() => width * 0.5, [width]); // Scroll 50% of screen width
  
  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollPositionRef.current = Math.max(0, scrollPositionRef.current - scrollAmount);
      scrollRef.current.scrollTo({ x: scrollPositionRef.current, animated: true });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollPositionRef.current = scrollPositionRef.current + scrollAmount;
      scrollRef.current.scrollTo({ x: scrollPositionRef.current, animated: true });
    }
  };

  const handleScroll = (event: any) => {
    scrollPositionRef.current = event.nativeEvent.contentOffset.x;
  };

  // Calculate day number relative to program start (1-based)
  const getDayNumber = (date: Date): number | null => {
    if (!programStartDate) return null;
    const start = new Date(programStartDate);
    start.setHours(0, 0, 0, 0);
    const current = new Date(date);
    current.setHours(0, 0, 0, 0);
    
    const diffTime = current.getTime() - start.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays + 1; // 1-based day number
  };

  const formatDay = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  const formatDate = (date: Date) => {
    return date.getDate().toString().padStart(2, '0');
  };

  const isSelected = (date: Date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  const isToday = (date: Date) => {
    return date.toDateString() === new Date().toDateString();
  };

  // Check if a date has all workouts completed
  const isCompleted = (date: Date): boolean => {
    if (completedDates.size === 0) return false;
    // Normalize date to YYYY-MM-DD string for comparison (using local time)
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    return completedDates.has(dateStr);
  };

  return (
    <View style={styles.container}>
      {/* Scroll buttons */}
      <Pressable
        onPress={scrollLeft}
        style={({ pressed }) => [
          styles.scrollButton,
          styles.scrollButtonLeft,
          pressed && styles.scrollButtonPressed,
        ]}
      >
        <Ionicons name="chevron-back" size={16} color={darkTheme.color.foreground} />
      </Pressable>
      <Pressable
        onPress={scrollRight}
        style={({ pressed }) => [
          styles.scrollButton,
          styles.scrollButtonRight,
          pressed && styles.scrollButtonPressed,
        ]}
      >
        <Ionicons name="chevron-forward" size={16} color={darkTheme.color.foreground} />
      </Pressable>

      {/* Day selector */}
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { gap }]}
        style={styles.scrollView}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        scrollEnabled={true}
        bounces={true}
        decelerationRate="fast"
        snapToInterval={itemWidth}
        snapToAlignment="start"
        disableIntervalMomentum={true}
        pagingEnabled={false}
      >
        {days.map((date, index) => {
          const selected = isSelected(date);
          const today = isToday(date);
          const dayNumber = getDayNumber(date);
          const isBeforeStart = programStartDate && date < programStartDate;
          const isAfterEnd = programEndDate && date > programEndDate;
          const isDisabled = isBeforeStart || isAfterEnd;
          const completed = isCompleted(date);
          
          return (
            <Pressable
              key={index}
              onPress={() => !isDisabled && onDateChange(date)}
              disabled={isDisabled}
              style={({ pressed }) => [
                styles.dayButton,
                { width: dayButtonWidth, height: dayButtonHeight },
                selected && styles.dayButtonSelected,
                completed && !selected && styles.dayButtonCompleted,
                today && !selected && !completed && styles.dayButtonToday,
                isDisabled && styles.dayButtonDisabled,
                pressed && !isDisabled && styles.dayButtonPressed,
              ]}
            >
              {dayNumber && (
                <Text style={[
                  styles.dayNumberText,
                  selected && styles.dayNumberTextSelected,
                  isDisabled && styles.dayNumberTextDisabled,
                ]}>
                  Day {dayNumber}
                </Text>
              )}
              <Text style={[
                styles.dayText,
                selected && styles.dayTextSelected,
                completed && !selected && styles.dayTextCompleted,
                today && !selected && !completed && styles.dayTextToday,
                isDisabled && styles.dayTextDisabled,
              ]}>
                {formatDay(date)}
              </Text>
              <Text style={[
                styles.dateText,
                selected && styles.dateTextSelected,
                completed && !selected && styles.dateTextCompleted,
                today && !selected && !completed && styles.dateTextToday,
                isDisabled && styles.dateTextDisabled,
              ]}>
                {formatDate(date)}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    marginVertical: 8,
    width: '100%',
  },
  scrollView: {
    width: '100%',
  },
  scrollContent: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  scrollButton: {
    position: 'absolute',
    top: '50%',
    transform: [{ translateY: -16 }],
    zIndex: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: `${darkTheme.color.bg}CC`, // 80% opacity
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scrollButtonLeft: {
    left: 8,
  },
  scrollButtonRight: {
    right: 8,
  },
  scrollButtonPressed: {
    opacity: 0.7,
  },
  dayButton: {
    flexShrink: 0,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${darkTheme.color.secondary}80`, // 50% opacity
  },
  dayButtonSelected: {
    backgroundColor: darkTheme.color.primary,
    transform: [{ scale: 1.05 }],
  },
  dayButtonToday: {
    backgroundColor: `${darkTheme.color.primary}33`, // 20% opacity
  },
  dayButtonCompleted: {
    backgroundColor: `${darkTheme.color.success}33`, // 20% opacity green
    borderWidth: 2,
    borderColor: darkTheme.color.success,
  },
  dayButtonPressed: {
    opacity: 0.8,
  },
  dayText: {
    fontSize: 12,
    fontWeight: '500',
    color: darkTheme.color.mutedForeground,
    textTransform: 'uppercase',
  },
  dayTextSelected: {
    color: darkTheme.color.primaryForeground,
  },
  dayTextToday: {
    color: darkTheme.color.primary,
  },
  dayTextCompleted: {
    color: darkTheme.color.success,
  },
  dateText: {
    fontSize: 24,
    fontWeight: '700',
    color: darkTheme.color.mutedForeground,
    marginTop: 4,
  },
  dateTextSelected: {
    color: darkTheme.color.primaryForeground,
  },
  dateTextToday: {
    color: darkTheme.color.primary,
  },
  dateTextCompleted: {
    color: darkTheme.color.success,
  },
  dayButtonDisabled: {
    opacity: 0.4,
    backgroundColor: `${darkTheme.color.bgMuted}40`,
  },
  dayNumberText: {
    fontSize: 10,
    fontWeight: '600',
    color: darkTheme.color.mutedForeground,
    marginBottom: 2,
  },
  dayNumberTextSelected: {
    color: darkTheme.color.primaryForeground,
  },
  dayNumberTextDisabled: {
    color: darkTheme.color.mutedForeground,
    opacity: 0.5,
  },
  dayTextDisabled: {
    color: darkTheme.color.mutedForeground,
    opacity: 0.5,
  },
  dateTextDisabled: {
    color: darkTheme.color.mutedForeground,
    opacity: 0.5,
  },
});

