import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useApp } from '../../context/AppContext';
import { SPACING, RADIUS, FONTS, SHADOWS } from '../../constants/theme';
import Ionicons from '@expo/vector-icons/Ionicons';

interface TaskProgressRingProps {
  completedCount: number;
  totalCount: number;
  subtitle?: string;
}

export const TaskProgressRing: React.FC<TaskProgressRingProps> = ({
  completedCount,
  totalCount,
  subtitle = "Today's Progress",
}) => {
  const { theme } = useApp();
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const remaining = Math.max(0, totalCount - completedCount);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.card,
          borderColor: theme.cardBorder,
        },
        SHADOWS.card,
      ]}
    >
      <View style={styles.leftInfo}>
        <View style={styles.headerTag}>
          <Ionicons name="sparkles" size={14} color={theme.primary} />
          <Text style={[styles.subtitle, { color: theme.primary }]}>{subtitle}</Text>
        </View>

        <Text style={[styles.mainMetric, { color: theme.text }]}>
          {completedCount} of {totalCount} tasks
        </Text>

        <Text style={[styles.subText, { color: theme.textSecondary }]}>
          {remaining === 0 ? '✨ All clear for today! Excellent job!' : `${remaining} tasks remaining`}
        </Text>

        {/* Linear bar representation */}
        <View style={[styles.barTrack, { backgroundColor: theme.cardAlt }]}>
          <View
            style={[
              styles.barFill,
              {
                backgroundColor: percentage === 100 ? theme.success : theme.primary,
                width: `${percentage}%`,
              },
            ]}
          />
        </View>
      </View>

      {/* Visual Ring Badge */}
      <View style={[styles.ringContainer, { borderColor: theme.primarySoft, backgroundColor: theme.primarySoft }]}>
        <Text style={[styles.percentNumber, { color: theme.primary }]}>{percentage}%</Text>
        <Text style={[styles.percentLabel, { color: theme.textSecondary }]}>DONE</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.base,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    marginVertical: SPACING.xs,
  },
  leftInfo: {
    flex: 1,
    marginRight: SPACING.md,
  },
  headerTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    ...FONTS.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  mainMetric: {
    fontSize: 20,
    ...FONTS.bold,
    letterSpacing: -0.3,
  },
  subText: {
    fontSize: 12,
    ...FONTS.medium,
    marginTop: 2,
    marginBottom: SPACING.sm,
  },
  barTrack: {
    height: 6,
    borderRadius: RADIUS.full,
    width: '100%',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: RADIUS.full,
  },
  ringContainer: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentNumber: {
    fontSize: 17,
    ...FONTS.bold,
  },
  percentLabel: {
    fontSize: 9,
    ...FONTS.bold,
    letterSpacing: 0.5,
  },
});
