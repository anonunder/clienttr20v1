import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { darkTheme } from '@/styles/theme';
import { textStyles } from '@/styles/shared-styles';

interface HorizontalDaySelectorProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export function HorizontalDaySelector({ selectedDate, onDateChange }: HorizontalDaySelectorProps) {
  const scrollRef = useRef<ScrollView>(null);

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
        // Calculate approximate scroll position (60px per item + 8px gap)
        const scrollPosition = selectedIndex * 68;
        scrollRef.current.scrollTo({ x: scrollPosition - 100, animated: true });
      }
    }
  }, [selectedDate]);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ x: -200, animated: true });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      // Use a ref to track current position or use scrollBy
      // For now, we'll use a simple approach - scroll incrementally
      scrollRef.current.scrollTo({ x: 200, animated: true });
    }
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
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
      >
        {days.map((date, index) => {
          const selected = isSelected(date);
          const today = isToday(date);
          return (
            <Pressable
              key={index}
              onPress={() => onDateChange(date)}
              style={({ pressed }) => [
                styles.dayButton,
                selected && styles.dayButtonSelected,
                today && !selected && styles.dayButtonToday,
                pressed && styles.dayButtonPressed,
              ]}
            >
              <Text style={[
                styles.dayText,
                selected && styles.dayTextSelected,
                today && !selected && styles.dayTextToday,
              ]}>
                {formatDay(date)}
              </Text>
              <Text style={[
                styles.dateText,
                selected && styles.dateTextSelected,
                today && !selected && styles.dateTextToday,
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
  },
  scrollView: {
    paddingHorizontal: 32,
  },
  scrollContent: {
    gap: 8,
    paddingVertical: 8,
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
    left: 0,
  },
  scrollButtonRight: {
    right: 0,
  },
  scrollButtonPressed: {
    opacity: 0.7,
  },
  dayButton: {
    flexShrink: 0,
    width: 60,
    height: 70,
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
});

