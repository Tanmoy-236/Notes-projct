import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useApp } from '../../context/AppContext';
import { SPACING, RADIUS, FONTS, SHADOWS } from '../../constants/theme';
import { getMonthDays, CalendarDay } from '../../utils/dateUtils';

interface MonthCalendarProps {
  selectedDate: string;
  onSelectDate: (date: string) => void;
  taskDates?: string[];
  noteDates?: string[];
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];
const WEEK_DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export const MonthCalendar: React.FC<MonthCalendarProps> = ({
  selectedDate,
  onSelectDate,
  taskDates = [],
  noteDates = [],
}) => {
  const { theme } = useApp();
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());

  const days: CalendarDay[] = getMonthDays(currentYear, currentMonth);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.card, borderColor: theme.cardBorder }, SHADOWS.soft]}>
      {/* Month Navigator Header */}
      <View style={styles.headerRow}>
        <Text style={[styles.monthTitle, { color: theme.text }]}>
          {MONTH_NAMES[currentMonth]} {currentYear}
        </Text>
        <View style={styles.navButtons}>
          <TouchableOpacity onPress={handlePrevMonth} style={styles.navBtn}>
            <Ionicons name="chevron-back" size={18} color={theme.text} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleNextMonth} style={styles.navBtn}>
            <Ionicons name="chevron-forward" size={18} color={theme.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Weekday names */}
      <View style={styles.weekRow}>
        {WEEK_DAYS.map((d) => (
          <Text key={d} style={[styles.weekDayText, { color: theme.textTertiary }]}>
            {d}
          </Text>
        ))}
      </View>

      {/* Month Grid */}
      <View style={styles.grid}>
        {days.map((item, idx) => {
          const isSelected = item.dateString === selectedDate;
          const hasTasks = taskDates.includes(item.dateString);
          const hasNotes = noteDates.includes(item.dateString);

          return (
            <TouchableOpacity
              key={`${item.dateString}-${idx}`}
              style={[
                styles.dayCell,
                isSelected && { backgroundColor: theme.primary, borderRadius: RADIUS.md },
              ]}
              onPress={() => onSelectDate(item.dateString)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.dayNumText,
                  {
                    color: isSelected
                      ? '#FFFFFF'
                      : !item.isCurrentMonth
                      ? theme.textTertiary
                      : item.isToday
                      ? theme.primary
                      : theme.text,
                    fontWeight: isSelected || item.isToday ? '700' : '400',
                  },
                ]}
              >
                {item.dayNumber}
              </Text>

              {/* Event indicators */}
              <View style={styles.indicatorsRow}>
                {hasTasks && (
                  <View
                    style={[
                      styles.indicatorDot,
                      { backgroundColor: isSelected ? '#FFFFFF' : theme.primary },
                    ]}
                  />
                )}
                {hasNotes && (
                  <View
                    style={[
                      styles.indicatorDot,
                      { backgroundColor: isSelected ? '#FFFFFF' : theme.secondary },
                    ]}
                  />
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    borderWidth: 1,
    marginVertical: SPACING.xs,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  monthTitle: {
    fontSize: 16,
    ...FONTS.bold,
  },
  navButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  navBtn: {
    padding: 6,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F030',
  },
  weekDayText: {
    width: `${100 / 7}%`,
    textAlign: 'center',
    fontSize: 11,
    ...FONTS.bold,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  dayCell: {
    width: `${100 / 7}%`,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 1,
  },
  dayNumText: {
    fontSize: 13,
  },
  indicatorsRow: {
    flexDirection: 'row',
    gap: 2,
    position: 'absolute',
    bottom: 3,
  },
  indicatorDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
});
