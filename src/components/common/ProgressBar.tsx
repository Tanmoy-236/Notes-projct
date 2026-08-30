import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useApp } from '../../context/AppContext';
import { RADIUS, FONTS, SPACING } from '../../constants/theme';

interface ProgressBarProps {
  progress: number; // 0 to 1
  label?: string;
  subLabel?: string;
  showPercent?: boolean;
  height?: number;
  color?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  label,
  subLabel,
  showPercent = true,
  height = 8,
  color,
}) => {
  const { theme } = useApp();
  const clamped = Math.min(Math.max(progress, 0), 1);
  const percentage = Math.round(clamped * 100);
  const barColor = color || theme.primary;

  return (
    <View style={styles.container}>
      {(label || showPercent) && (
        <View style={styles.headerRow}>
          {label ? (
            <Text style={[styles.label, { color: theme.text }]}>
              {label}
            </Text>
          ) : null}
          {showPercent && (
            <Text style={[styles.percent, { color: theme.textSecondary }]}>
              {percentage}%
            </Text>
          )}
        </View>
      )}

      <View style={[styles.track, { backgroundColor: theme.cardAlt, height }]}>
        <View
          style={[
            styles.fill,
            {
              backgroundColor: barColor,
              width: `${percentage}%`,
              height,
            },
          ]}
        />
      </View>

      {subLabel ? (
        <Text style={[styles.subLabel, { color: theme.textSecondary }]}>
          {subLabel}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: SPACING.xs,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  label: {
    fontSize: 13,
    ...FONTS.semibold,
  },
  percent: {
    fontSize: 13,
    ...FONTS.bold,
  },
  track: {
    width: '100%',
    borderRadius: RADIUS.full,
    overflow: 'hidden',
  },
  fill: {
    borderRadius: RADIUS.full,
  },
  subLabel: {
    fontSize: 12,
    ...FONTS.regular,
    marginTop: SPACING.xs,
  },
});
