import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Modal,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Task, Priority, TaskCategory, SubTask } from '../../types';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';
import { SPACING, RADIUS, FONTS, SHADOWS } from '../../constants/theme';
import { AIEngine } from '../../utils/aiEngine';

interface TaskEditorModalProps {
  visible: boolean;
  onClose: () => void;
  taskToEdit?: Task | null;
  initialCategory?: TaskCategory;
  initialDate?: string;
}

const CATEGORIES: TaskCategory[] = ['Work', 'Personal', 'Study', 'Ideas', 'Health', 'Finance', 'Important'];
const PRIORITIES: { label: string; value: Priority; color: string; icon: string }[] = [
  { label: 'High', value: 'high', color: '#EF4444', icon: 'flame' },
  { label: 'Medium', value: 'medium', color: '#F59E0B', icon: 'alert-circle' },
  { label: 'Low', value: 'low', color: '#10B981', icon: 'leaf' },
];

const REMINDER_OPTIONS = ['none', 'At time', '15m before', '1 hour before', '1 day before'];
const REPEAT_OPTIONS: ('none' | 'daily' | 'weekly' | 'monthly')[] = ['none', 'daily', 'weekly', 'monthly'];

export const TaskEditorModal: React.FC<TaskEditorModalProps> = ({
  visible,
  onClose,
  taskToEdit,
  initialCategory = 'Work',
  initialDate,
}) => {
  const { theme, addTask, updateTask, deleteTask } = useApp();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(initialDate || new Date().toISOString().split('T')[0]);
  const [dueTime, setDueTime] = useState('10:00 AM');
  const [priority, setPriority] = useState<Priority>('medium');
  const [category, setCategory] = useState<TaskCategory>(initialCategory);
  const [reminder, setReminder] = useState('15m before');
  const [repeat, setRepeat] = useState<'none' | 'daily' | 'weekly' | 'monthly'>('none');
  const [subtasks, setSubtasks] = useState<SubTask[]>([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description || '');
      setDueDate(taskToEdit.dueDate);
      setDueTime(taskToEdit.dueTime || '10:00 AM');
      setPriority(taskToEdit.priority);
      setCategory(taskToEdit.category);
      setReminder(taskToEdit.reminder || 'none');
      setRepeat(taskToEdit.repeat || 'none');
      setSubtasks(taskToEdit.subtasks || []);
    } else {
      setTitle('');
      setDescription('');
      setDueDate(initialDate || new Date().toISOString().split('T')[0]);
      setDueTime('10:00 AM');
      setPriority('medium');
      setCategory(initialCategory);
      setReminder('15m before');
      setRepeat('none');
      setSubtasks([]);
    }
  }, [taskToEdit, visible, initialCategory, initialDate]);

  const handleAddSubtask = () => {
    if (!newSubtaskTitle.trim()) return;
    const newSub: SubTask = {
      id: `st-${Date.now()}-${Math.random().toString(36).substr(2, 3)}`,
      title: newSubtaskTitle.trim(),
      completed: false,
    };
    setSubtasks((prev) => [...prev, newSub]);
    setNewSubtaskTitle('');
  };

  const handleRemoveSubtask = (id: string) => {
    setSubtasks((prev) => prev.filter((s) => s.id !== id));
  };

  const handleAiAutoSubtasks = async () => {
    if (!title.trim()) {
      Alert.alert('Task Title Needed', 'Please enter a task title first so LifeFlow AI can generate smart subtasks.');
      return;
    }

    setIsAiGenerating(true);
    try {
      const generated = await AIEngine.generateSubtasks(title, category);
      const newItems: SubTask[] = generated.map((t) => ({
        id: `st-ai-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        title: t,
        completed: false,
      }));
      setSubtasks((prev) => [...prev, ...newItems]);
    } catch (e) {
      console.warn('AI subtask error', e);
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handleSave = (addAnother = false) => {
    if (!title.trim()) {
      Alert.alert('Task Title Required', 'Please enter a title for this task.');
      return;
    }

    if (taskToEdit) {
      updateTask(taskToEdit.id, {
        title: title.trim(),
        description: description.trim(),
        dueDate,
        dueTime,
        priority,
        category,
        reminder,
        repeat,
        subtasks,
      });
    } else {
      addTask({
        title: title.trim(),
        description: description.trim(),
        dueDate,
        dueTime,
        priority,
        category,
        completed: false,
        reminder,
        repeat,
        subtasks,
      });
    }

    if (addAnother) {
      setTitle('');
      setDescription('');
      setSubtasks([]);
    } else {
      onClose();
    }
  };

  const handleDelete = () => {
    if (taskToEdit) {
      deleteTask(taskToEdit.id);
      onClose();
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: theme.background }]}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: theme.divider, backgroundColor: theme.card }]}>
          <TouchableOpacity onPress={onClose} style={styles.headerBtn}>
            <Ionicons name="close" size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.text }]}>
            {taskToEdit ? 'Edit Task' : 'New Task'}
          </Text>
          {taskToEdit ? (
            <TouchableOpacity onPress={handleDelete} style={styles.headerBtn}>
              <Ionicons name="trash-outline" size={20} color={theme.error} />
            </TouchableOpacity>
          ) : (
            <View style={{ width: 32 }} />
          )}
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Title Input */}
          <View style={[styles.cardSection, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
            <TextInput
              style={[styles.titleInput, { color: theme.text }]}
              placeholder="What needs to be done?"
              placeholderTextColor={theme.textTertiary}
              value={title}
              onChangeText={setTitle}
              autoFocus={!taskToEdit}
            />

            <TextInput
              style={[styles.descInput, { color: theme.text }]}
              placeholder="Add description, context or notes..."
              placeholderTextColor={theme.textTertiary}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
            />
          </View>

          {/* Priority Picker */}
          <View style={[styles.cardSection, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
            <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>Priority Level</Text>
            <View style={styles.priorityRow}>
              {PRIORITIES.map((p) => {
                const isSelected = priority === p.value;
                return (
                  <TouchableOpacity
                    key={p.value}
                    style={[
                      styles.priorityOption,
                      {
                        backgroundColor: isSelected ? `${p.color}18` : theme.cardAlt,
                        borderColor: isSelected ? p.color : 'transparent',
                      },
                    ]}
                    onPress={() => setPriority(p.value)}
                  >
                    <Ionicons name={p.icon as any} size={16} color={p.color} />
                    <Text
                      style={[
                        styles.priorityText,
                        { color: isSelected ? p.color : theme.textSecondary, fontWeight: isSelected ? '700' : '500' },
                      ]}
                    >
                      {p.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Category Picker */}
          <View style={[styles.cardSection, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
            <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>Category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
              {CATEGORIES.map((cat) => {
                const isSelected = category === cat;
                return (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.categoryChip,
                      {
                        backgroundColor: isSelected ? theme.primary : theme.cardAlt,
                        borderColor: isSelected ? theme.primary : theme.cardBorder,
                      },
                    ]}
                    onPress={() => setCategory(cat)}
                  >
                    <Text
                      style={[
                        styles.categoryText,
                        { color: isSelected ? '#FFFFFF' : theme.textMuted, fontWeight: isSelected ? '700' : '500' },
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Date & Time Settings */}
          <View style={[styles.cardSection, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
            <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>Schedule & Timing</Text>
            
            {/* Date Quick Shortcuts */}
            <View style={styles.dateShortcuts}>
              <TouchableOpacity
                style={[
                  styles.shortcutBtn,
                  dueDate === new Date().toISOString().split('T')[0] && { backgroundColor: theme.primarySoft, borderColor: theme.primary },
                ]}
                onPress={() => setDueDate(new Date().toISOString().split('T')[0])}
              >
                <Text style={[styles.shortcutText, { color: theme.text }]}>Today</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.shortcutBtn,
                  dueDate === new Date(Date.now() + 86400000).toISOString().split('T')[0] && {
                    backgroundColor: theme.primarySoft,
                    borderColor: theme.primary,
                  },
                ]}
                onPress={() => setDueDate(new Date(Date.now() + 86400000).toISOString().split('T')[0])}
              >
                <Text style={[styles.shortcutText, { color: theme.text }]}>Tomorrow</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.shortcutBtn,
                  dueDate === new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0] && {
                    backgroundColor: theme.primarySoft,
                    borderColor: theme.primary,
                  },
                ]}
                onPress={() => setDueDate(new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0])}
              >
                <Text style={[styles.shortcutText, { color: theme.text }]}>Next Week</Text>
              </TouchableOpacity>
            </View>

            {/* Time Presets */}
            <View style={styles.timeRow}>
              <Ionicons name="time-outline" size={18} color={theme.textSecondary} />
              <TextInput
                style={[styles.timeInput, { color: theme.text, backgroundColor: theme.cardAlt }]}
                value={dueTime}
                onChangeText={setDueTime}
                placeholder="e.g. 10:00 AM"
                placeholderTextColor={theme.textTertiary}
              />
            </View>

            {/* Reminder & Repeat */}
            <View style={styles.optionsRow}>
              <View style={styles.halfOption}>
                <Text style={[styles.subLabel, { color: theme.textSecondary }]}>Reminder</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {REMINDER_OPTIONS.map((opt) => (
                    <TouchableOpacity
                      key={opt}
                      style={[
                        styles.miniPill,
                        {
                          backgroundColor: reminder === opt ? theme.primarySoft : theme.cardAlt,
                          borderColor: reminder === opt ? theme.primary : 'transparent',
                        },
                      ]}
                      onPress={() => setReminder(opt)}
                    >
                      <Text style={[styles.miniPillText, { color: reminder === opt ? theme.primary : theme.textMuted }]}>
                        {opt}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>

            <View style={[styles.optionsRow, { marginTop: SPACING.sm }]}>
              <View style={styles.halfOption}>
                <Text style={[styles.subLabel, { color: theme.textSecondary }]}>Repeat</Text>
                <View style={styles.repeatChips}>
                  {REPEAT_OPTIONS.map((rep) => (
                    <TouchableOpacity
                      key={rep}
                      style={[
                        styles.miniPill,
                        {
                          backgroundColor: repeat === rep ? theme.primarySoft : theme.cardAlt,
                          borderColor: repeat === rep ? theme.primary : 'transparent',
                        },
                      ]}
                      onPress={() => setRepeat(rep)}
                    >
                      <Text style={[styles.miniPillText, { color: repeat === rep ? theme.primary : theme.textMuted }]}>
                        {rep.toUpperCase()}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          </View>

          {/* Subtasks with AI Auto Breakdown */}
          <View style={[styles.cardSection, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
            <View style={styles.subtaskHeader}>
              <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>Subtasks Checklist</Text>
              <Button
                title="✨ AI Breakdown"
                onPress={handleAiAutoSubtasks}
                variant="secondary"
                size="sm"
                loading={isAiGenerating}
              />
            </View>

            {subtasks.map((st) => (
              <View key={st.id} style={styles.subtaskItemRow}>
                <Ionicons name="checkbox-outline" size={16} color={theme.primary} />
                <Text style={[styles.subtaskTitle, { color: theme.text }]}>{st.title}</Text>
                <TouchableOpacity onPress={() => handleRemoveSubtask(st.id)} style={styles.removeSubtaskBtn}>
                  <Ionicons name="close-circle-outline" size={18} color={theme.textTertiary} />
                </TouchableOpacity>
              </View>
            ))}

            <View style={styles.addSubtaskRow}>
              <TextInput
                style={[styles.addSubtaskInput, { color: theme.text, backgroundColor: theme.cardAlt }]}
                placeholder="Add a step / subtask..."
                placeholderTextColor={theme.textTertiary}
                value={newSubtaskTitle}
                onChangeText={setNewSubtaskTitle}
                onSubmitEditing={handleAddSubtask}
                returnKeyType="done"
              />
              <TouchableOpacity
                style={[styles.addSubtaskBtn, { backgroundColor: theme.primary }]}
                onPress={handleAddSubtask}
              >
                <Ionicons name="add" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/* Footer Actions */}
        <View style={[styles.footer, { backgroundColor: theme.card, borderTopColor: theme.divider }]}>
          {!taskToEdit && (
            <Button
              title="Save & Add Another"
              onPress={() => handleSave(true)}
              variant="outline"
              size="md"
              style={{ flex: 1 }}
            />
          )}
          <Button
            title={taskToEdit ? 'Update Task' : 'Save Task'}
            onPress={() => handleSave(false)}
            variant="primary"
            size="md"
            style={{ flex: 1 }}
            icon="checkmark-outline"
          />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
  },
  headerBtn: {
    padding: SPACING.xs,
  },
  headerTitle: {
    fontSize: 17,
    ...FONTS.bold,
  },
  scrollContent: {
    padding: SPACING.base,
    gap: SPACING.md,
    paddingBottom: 40,
  },
  cardSection: {
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    padding: SPACING.md,
  },
  titleInput: {
    fontSize: 18,
    ...FONTS.bold,
    marginBottom: SPACING.xs,
  },
  descInput: {
    fontSize: 14,
    ...FONTS.regular,
    minHeight: 50,
    textAlignVertical: 'top',
  },
  sectionLabel: {
    fontSize: 12,
    ...FONTS.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: SPACING.sm,
  },
  priorityRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  priorityOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    gap: 6,
  },
  priorityText: {
    fontSize: 13,
  },
  categoryScroll: {
    gap: SPACING.xs + 2,
  },
  categoryChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: RADIUS.full,
    borderWidth: 1,
  },
  categoryText: {
    fontSize: 12,
  },
  dateShortcuts: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  shortcutBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  shortcutText: {
    fontSize: 12,
    ...FONTS.medium,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  timeInput: {
    flex: 1,
    height: 38,
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.md,
    fontSize: 13,
  },
  optionsRow: {
    gap: 4,
  },
  halfOption: {
    gap: 4,
  },
  subLabel: {
    fontSize: 11,
    ...FONTS.medium,
    marginBottom: 4,
  },
  miniPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    marginRight: 6,
  },
  miniPillText: {
    fontSize: 11,
    ...FONTS.medium,
  },
  repeatChips: {
    flexDirection: 'row',
  },
  subtaskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  subtaskItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    gap: 8,
  },
  subtaskTitle: {
    flex: 1,
    fontSize: 13,
    ...FONTS.medium,
  },
  removeSubtaskBtn: {
    padding: 2,
  },
  addSubtaskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: SPACING.xs,
  },
  addSubtaskInput: {
    flex: 1,
    height: 38,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    fontSize: 13,
  },
  addSubtaskBtn: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.md,
    borderTopWidth: 1,
  },
});
