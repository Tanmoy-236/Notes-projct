import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Task } from '../../types';
import { useApp } from '../../context/AppContext';
import { SPACING, RADIUS, FONTS, SHADOWS } from '../../constants/theme';
import { TaskCard } from '../tasks/TaskCard';

interface TimeBlockCardProps {
  period: 'morning' | 'afternoon' | 'evening';
  title: string;
  timeRange: string;
  energyLevel: string;
  aiTip?: string;
  tasks: Task[];
  onAddTask: () => void;
  onEditTask: (task: Task) => void;
}

export const TimeBlockCard: React.FC<TimeBlockCardProps> = ({
  period,
  title,
  timeRange,
  energyLevel,
  aiTip,
  tasks,
  onAddTask,
  onEditTask,
}) => {
  const { theme } = useApp();

  const getPeriodTheme = () => {
    switch (period) {
      case 'morning':
        return {
          icon: 'sunny' as const,
          color: '#F59E0B',
          bg: '#FFFBEB',
          badgeText: 'Peak Energy Focus',
        };
      case 'afternoon':
        return {
          icon: 'partly-sunny' as const,
          color: '#4F46E5',
          bg: '#EEF2FF',
          badgeText: 'Execution & Sync',
        };
      case 'evening':
      default:
        return {
          icon: 'moon' as const,
          color: '#8B5CF6',
          bg: '#F5F3FF',
          badgeText: 'Wellness & Wrap-Up',
        };
    }
  };

  const periodTheme = getPeriodTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.card,
          borderColor: theme.cardBorder,
        },
        SHADOWS.soft,
      ]}
    >
      {/* Block Header */}
      <View style={styles.header}>
        <View style={styles.leftTitleRow}>
          <View style={[styles.iconBox, { backgroundColor: periodTheme.bg }]}>
            <Ionicons name={periodTheme.icon} size={20} color={periodTheme.color} />
          </View>
          <View>
            <View style={styles.nameRow}>
              <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
              <Text style={[styles.timeRange, { color: theme.textTertiary }]}>{timeRange}</Text>
            </View>
            <View style={[styles.energyBadge, { backgroundColor: periodTheme.bg }]}>
              <Text style={[styles.energyText, { color: periodTheme.color }]}>{energyLevel}</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.addBtn} onPress={onAddTask}>
          <Ionicons name="add-circle-outline" size={24} color={theme.primary} />
        </TouchableOpacity>
      </View>

      {/* AI Strategy Tip */}
      {aiTip && (
        <View style={[styles.tipBox, { backgroundColor: theme.cardAlt }]}>
          <Ionicons name="sparkles" size={13} color={theme.primary} />
          <Text style={[styles.tipText, { color: theme.textSecondary }]}>{aiTip}</Text>
        </View>
      )}

      {/* Tasks in block */}
      <View style={styles.tasksContainer}>
        {tasks.length === 0 ? (
          <View style={styles.emptySlot}>
            <Text style={[styles.emptyText, { color: theme.textTertiary }]}>
              No tasks scheduled for {title.toLowerCase()}. Tap + to slot one in!
            </Text>
          </View>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onPress={() => onEditTask(task)}
              onEdit={() => onEditTask(task)}
              compact
            />
          ))
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    padding: SPACING.md,
    marginVertical: SPACING.xs + 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  leftTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  title: {
    fontSize: 16,
    ...FONTS.bold,
  },
  timeRange: {
    fontSize: 12,
    ...FONTS.regular,
  },
  energyBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.xs,
    marginTop: 2,
  },
  energyText: {
    fontSize: 10,
    ...FONTS.bold,
  },
  addBtn: {
    padding: 4,
  },
  tipBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: SPACING.sm,
    borderRadius: RADIUS.sm,
    marginVertical: SPACING.xs,
  },
  tipText: {
    fontSize: 11,
    ...FONTS.medium,
    flex: 1,
  },
  tasksContainer: {
    marginTop: SPACING.xs,
    gap: 4,
  },
  emptySlot: {
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 12,
    ...FONTS.regular,
    fontStyle: 'italic',
  },
});
