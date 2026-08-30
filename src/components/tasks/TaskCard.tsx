import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Task } from '../../types';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';
import { SPACING, RADIUS, FONTS, SHADOWS } from '../../constants/theme';
import { getRelativeDateLabel } from '../../utils/dateUtils';

interface TaskCardProps {
  task: Task;
  onPress?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onToggleComplete?: () => void;
  onSubtaskToggle?: (subtaskId: string) => void;
  onAiBreakdown?: () => void;
  compact?: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onPress,
  onEdit,
  onDelete,
  onToggleComplete,
  onSubtaskToggle,
  onAiBreakdown,
  compact = false,
}) => {
  const { theme, toggleTaskComplete, toggleSubtask } = useApp();

  const handleCheckbox = () => {
    if (onToggleComplete) {
      onToggleComplete();
    } else {
      toggleTaskComplete(task.id);
    }
  };

  const completedSubtasks = task.subtasks.filter((s) => s.completed).length;
  const totalSubtasks = task.subtasks.length;

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: theme.card,
          borderColor: task.completed ? theme.cardBorder : theme.cardBorder,
          opacity: task.completed ? 0.75 : 1,
        },
        SHADOWS.soft,
      ]}
      onPress={onPress || onEdit}
      activeOpacity={0.8}
    >
      <View style={styles.mainRow}>
        {/* Animated-styled Checkbox */}
        <TouchableOpacity
          style={[
            styles.checkbox,
            {
              borderColor: task.completed ? theme.success : theme.textTertiary,
              backgroundColor: task.completed ? theme.success : 'transparent',
            },
          ]}
          onPress={handleCheckbox}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          {task.completed && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
        </TouchableOpacity>

        <View style={styles.contentCol}>
          <View style={styles.titleRow}>
            <Text
              style={[
                styles.title,
                {
                  color: task.completed ? theme.textSecondary : theme.text,
                  textDecorationLine: task.completed ? 'line-through' : 'none',
                },
              ]}
              numberOfLines={compact ? 1 : 2}
            >
              {task.title}
            </Text>
          </View>

          {task.description && !compact && (
            <Text
              style={[
                styles.description,
                { color: theme.textSecondary },
                task.completed && { textDecorationLine: 'line-through' },
              ]}
              numberOfLines={2}
            >
              {task.description}
            </Text>
          )}

          {/* Subtasks summary preview */}
          {totalSubtasks > 0 && !compact && (
            <View style={styles.subtaskPreview}>
              <Ionicons name="git-commit-outline" size={13} color={theme.textTertiary} />
              <Text style={[styles.subtaskCountText, { color: theme.textSecondary }]}>
                {completedSubtasks}/{totalSubtasks} subtasks
              </Text>
            </View>
          )}

          {/* Metadata Badges Row */}
          <View style={styles.metaRow}>
            <Badge label={task.priority.toUpperCase()} type="priority" priority={task.priority} size="sm" />
            <Badge label={task.category} category={task.category} size="sm" />

            {task.dueTime && (
              <View style={[styles.metaPill, { backgroundColor: theme.cardAlt }]}>
                <Ionicons name="time-outline" size={11} color={theme.textSecondary} />
                <Text style={[styles.metaText, { color: theme.textSecondary }]}>
                  {task.dueTime}
                </Text>
              </View>
            )}

            {task.dueDate && (
              <View style={[styles.metaPill, { backgroundColor: theme.cardAlt }]}>
                <Ionicons name="calendar-outline" size={11} color={theme.textSecondary} />
                <Text style={[styles.metaText, { color: theme.textSecondary }]}>
                  {getRelativeDateLabel(task.dueDate)}
                </Text>
              </View>
            )}

            {task.reminder && task.reminder !== 'none' && (
              <Ionicons name="alarm-outline" size={13} color={theme.warning} style={styles.reminderIcon} />
            )}
          </View>
        </View>

        {/* Action Menu button */}
        {(onEdit || onDelete || onAiBreakdown) && (
          <TouchableOpacity
            style={styles.moreBtn}
            onPress={onEdit}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="chevron-forward" size={16} color={theme.textTertiary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Expanded subtasks interactive checklist if not compact */}
      {totalSubtasks > 0 && !compact && (
        <View style={[styles.subtasksContainer, { borderTopColor: theme.divider }]}>
          {task.subtasks.map((st) => (
            <TouchableOpacity
              key={st.id}
              style={styles.subtaskRow}
              onPress={() => {
                if (onSubtaskToggle) onSubtaskToggle(st.id);
                else toggleSubtask(task.id, st.id);
              }}
            >
              <Ionicons
                name={st.completed ? 'checkmark-circle' : 'ellipse-outline'}
                size={14}
                color={st.completed ? theme.success : theme.textTertiary}
              />
              <Text
                style={[
                  styles.subtaskText,
                  {
                    color: st.completed ? theme.textTertiary : theme.textMuted,
                    textDecorationLine: st.completed ? 'line-through' : 'none',
                  },
                ]}
                numberOfLines={1}
              >
                {st.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    padding: SPACING.md,
    marginVertical: 5,
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: RADIUS.xs + 1,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
    marginTop: 2,
  },
  contentCol: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 15,
    ...FONTS.semibold,
    lineHeight: 20,
  },
  description: {
    fontSize: 12,
    ...FONTS.regular,
    marginTop: 4,
    lineHeight: 16,
  },
  subtaskPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  subtaskCountText: {
    fontSize: 11,
    ...FONTS.medium,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: SPACING.sm,
  },
  metaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: RADIUS.full,
  },
  metaText: {
    fontSize: 11,
    ...FONTS.medium,
  },
  reminderIcon: {
    marginLeft: 2,
  },
  moreBtn: {
    padding: SPACING.xs,
    marginLeft: SPACING.xs,
  },
  subtasksContainer: {
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    gap: 6,
  },
  subtaskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 2,
  },
  subtaskText: {
    fontSize: 12,
    ...FONTS.regular,
    flex: 1,
  },
});
