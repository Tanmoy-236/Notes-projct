import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useApp } from '../../context/AppContext';
import { SPACING, RADIUS, FONTS } from '../../constants/theme';
import { getCurrentWeekDays } from '../../utils/dateUtils';

interface CalendarStripProps {
  selectedDate: string; // YYYY-MM-DD
  onSelectDate: (date: string) => void;
  taskDates?: string[];
}

export const CalendarStrip: React.FC<CalendarStripProps> = ({
  selectedDate,
  onSelectDate,
  taskDates = [],
}) => {
  const { theme } = useApp();
  const weekDays = getCurrentWeekDays(selectedDate);

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {weekDays.map((day) => {
          const isSelected = day.dateString === selectedDate;
          const hasTasks = taskDates.includes(day.dateString);

          return (
            <TouchableOpacity
              key={day.dateString}
              style={[
                styles.dayItem,
                {
                  backgroundColor: isSelected ? theme.primary : theme.card,
                  borderColor: isSelected ? theme.primary : theme.cardBorder,
                },
              ]}
              onPress={() => onSelectDate(day.dateString)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.dayName,
                  { color: isSelected ? 'rgba(255,255,255,0.8)' : theme.textSecondary },
                ]}
              >
                {day.dayName.slice(0, 3)}
              </Text>

              <Text
                style={[
                  styles.dayNumber,
                  { color: isSelected ? '#FFFFFF' : theme.text },
                ]}
              >
                {day.dayNumber}
              </Text>

              {/* Dot indicator if has tasks or is today */}
              <View style={styles.dotContainer}>
                {hasTasks && (
                  <View
                    style={[
                      styles.taskDot,
                      { backgroundColor: isSelected ? '#FFFFFF' : theme.primary },
                    ]}
                  />
                )}
                {day.isToday && !hasTasks && (
                  <View
                    style={[
                      styles.todayDot,
                      { backgroundColor: isSelected ? '#FFFFFF' : theme.secondary },
                    ]}
                  />
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: SPACING.xs,
  },
  scrollContent: {
    paddingHorizontal: SPACING.base,
    gap: 8,
    justifyContent: 'space-between',
    width: '100%',
  },
  dayItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    minWidth: 42,
  },
  dayName: {
    fontSize: 11,
    ...FONTS.medium,
    marginBottom: 4,
  },
  dayNumber: {
    fontSize: 16,
    ...FONTS.bold,
  },
  dotContainer: {
    height: 6,
    marginTop: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  todayDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
});
