import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useApp } from '../context/AppContext';
import { SPACING, RADIUS, FONTS, SHADOWS } from '../constants/theme';
import { MonthCalendar } from '../components/calendar/MonthCalendar';
import { CalendarStrip } from '../components/calendar/CalendarStrip';
import { TaskCard } from '../components/tasks/TaskCard';
import { NoteCard } from '../components/notes/NoteCard';
import { TaskEditorModal } from '../components/tasks/TaskEditorModal';
import { NoteEditorModal } from '../components/notes/NoteEditorModal';
import { Task, Note } from '../types';
import { formatDate } from '../utils/dateUtils';

export const CalendarScreen: React.FC = () => {
  const { theme, tasks, notes } = useApp();

  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [taskModalVisible, setTaskModalVisible] = useState(false);
  const [noteModalVisible, setNoteModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  // Dates with items
  const taskDates = Array.from(new Set(tasks.map((t) => t.dueDate)));
  const noteDates = Array.from(new Set(notes.map((n) => n.createdAt.split('T')[0])));

  // Items for selected date
  const dayTasks = tasks.filter((t) => t.dueDate === selectedDate);
  const dayNotes = notes.filter((n) => n.createdAt.startsWith(selectedDate) || n.updatedAt.startsWith(selectedDate));

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.background }]}>
        <View>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Calendar</Text>
          <Text style={[styles.headerSub, { color: theme.textSecondary }]}>
            {dayTasks.length} tasks scheduled for {formatDate(selectedDate)}
          </Text>
        </View>

        {/* View Toggle */}
        <View style={[styles.toggleWrap, { backgroundColor: theme.cardAlt }]}>
          <TouchableOpacity
            style={[
              styles.toggleBtn,
              viewMode === 'month' && [styles.toggleActive, { backgroundColor: theme.card }],
            ]}
            onPress={() => setViewMode('month')}
          >
            <Text style={[styles.toggleText, { color: viewMode === 'month' ? theme.primary : theme.textSecondary }]}>
              Month
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.toggleBtn,
              viewMode === 'week' && [styles.toggleActive, { backgroundColor: theme.card }],
            ]}
            onPress={() => setViewMode('week')}
          >
            <Text style={[styles.toggleText, { color: viewMode === 'week' ? theme.primary : theme.textSecondary }]}>
              Week
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Calendar Widget */}
        {viewMode === 'month' ? (
          <MonthCalendar
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            taskDates={taskDates}
            noteDates={noteDates}
          />
        ) : (
          <CalendarStrip
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            taskDates={taskDates}
          />
        )}

        {/* Day Schedule Header */}
        <View style={styles.dayAgendaHeader}>
          <View>
            <Text style={[styles.agendaHeading, { color: theme.text }]}>
              Schedule for {formatDate(selectedDate)}
            </Text>
            <Text style={[styles.agendaSub, { color: theme.textSecondary }]}>
              {dayTasks.length} tasks • {dayNotes.length} notes
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.addEventBtn, { backgroundColor: theme.primary }]}
            onPress={() => {
              setSelectedTask(null);
              setTaskModalVisible(true);
            }}
          >
            <Ionicons name="add" size={16} color="#FFFFFF" />
            <Text style={styles.addEventBtnText}>Add Task</Text>
          </TouchableOpacity>
        </View>

        {/* Day Tasks List */}
        <View style={styles.sectionBlock}>
          <View style={styles.blockTitleRow}>
            <Ionicons name="checkbox-outline" size={16} color={theme.primary} />
            <Text style={[styles.blockTitle, { color: theme.text }]}>TASKS</Text>
          </View>

          {dayTasks.length === 0 ? (
            <View style={[styles.emptyBox, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
              <Text style={[styles.emptyText, { color: theme.textTertiary }]}>
                No tasks scheduled for this day. Tap + to schedule.
              </Text>
            </View>
          ) : (
            dayTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onPress={() => {
                  setSelectedTask(task);
                  setTaskModalVisible(true);
                }}
                onEdit={() => {
                  setSelectedTask(task);
                  setTaskModalVisible(true);
                }}
              />
            ))
          )}
        </View>

        {/* Day Notes List */}
        {dayNotes.length > 0 && (
          <View style={styles.sectionBlock}>
            <View style={styles.blockTitleRow}>
              <Ionicons name="document-text-outline" size={16} color={theme.secondary} />
              <Text style={[styles.blockTitle, { color: theme.text }]}>NOTES ON THIS DAY</Text>
            </View>

            {dayNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onPress={() => {
                  setSelectedNote(note);
                  setNoteModalVisible(true);
                }}
                onEdit={() => {
                  setSelectedNote(note);
                  setNoteModalVisible(true);
                }}
              />
            ))}
          </View>
        )}
      </ScrollView>

      {/* Task Modal */}
      <TaskEditorModal
        visible={taskModalVisible}
        onClose={() => {
          setTaskModalVisible(false);
          setSelectedTask(null);
        }}
        taskToEdit={selectedTask}
        initialDate={selectedDate}
      />

      {/* Note Modal */}
      <NoteEditorModal
        visible={noteModalVisible}
        onClose={() => {
          setNoteModalVisible(false);
          setSelectedNote(null);
        }}
        noteToEdit={selectedNote}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.base,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.xs,
  },
  headerTitle: {
    fontSize: 24,
    ...FONTS.bold,
    letterSpacing: -0.4,
  },
  headerSub: {
    fontSize: 12,
    ...FONTS.medium,
    marginTop: 2,
  },
  toggleWrap: {
    flexDirection: 'row',
    padding: 3,
    borderRadius: RADIUS.md,
  },
  toggleBtn: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: RADIUS.sm,
  },
  toggleActive: {
    ...SHADOWS.soft,
  },
  toggleText: {
    fontSize: 12,
    ...FONTS.bold,
  },
  scrollContent: {
    paddingHorizontal: SPACING.base,
    paddingBottom: 90,
    gap: SPACING.md,
  },
  dayAgendaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: SPACING.xs,
  },
  agendaHeading: {
    fontSize: 16,
    ...FONTS.bold,
  },
  agendaSub: {
    fontSize: 11,
    ...FONTS.medium,
    marginTop: 2,
  },
  addEventBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: RADIUS.md,
  },
  addEventBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    ...FONTS.bold,
  },
  sectionBlock: {
    gap: 6,
  },
  blockTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  blockTitle: {
    fontSize: 11,
    ...FONTS.bold,
    letterSpacing: 0.5,
  },
  emptyBox: {
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 12,
    ...FONTS.regular,
    fontStyle: 'italic',
  },
});
