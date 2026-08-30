import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useApp } from '../context/AppContext';
import { SPACING, RADIUS, FONTS, SHADOWS } from '../constants/theme';
import { getGreeting, getTodayFormattedLong } from '../utils/dateUtils';
import { TaskCard } from '../components/tasks/TaskCard';
import { NoteCard } from '../components/notes/NoteCard';
import { TaskProgressRing } from '../components/tasks/TaskProgressRing';
import { NotificationModal } from '../components/common/NotificationModal';
import { TaskEditorModal } from '../components/tasks/TaskEditorModal';
import { NoteEditorModal } from '../components/notes/NoteEditorModal';
import { QuickActionFAB } from '../components/common/QuickActionFAB';
import { Task, Note } from '../types';

interface HomeScreenProps {
  onNavigateToTasks: () => void;
  onNavigateToNotes: () => void;
  onNavigateToAI: () => void;
  onNavigateToPlanner: () => void;
  onNavigateToCalendar: () => void;
  onNavigateToSearch: () => void;
  onNavigateToProfile: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigateToTasks,
  onNavigateToNotes,
  onNavigateToAI,
  onNavigateToPlanner,
  onNavigateToCalendar,
  onNavigateToSearch,
  onNavigateToProfile,
}) => {
  const { theme, tasks, notes, userProfile, notifications } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [taskModalVisible, setTaskModalVisible] = useState(false);
  const [noteModalVisible, setNoteModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  const { greeting } = getGreeting(userProfile.name);
  const todayStr = new Date().toISOString().split('T')[0];
  const todayTasks = tasks.filter((t) => t.dueDate === todayStr);
  const completedToday = todayTasks.filter((t) => t.completed).length;
  const unreadNotifs = notifications.filter((n) => !n.read).length;

  // Priority tasks: High priority or pending today
  const priorityTasks = tasks
    .filter((t) => !t.completed && (t.priority === 'high' || t.dueDate === todayStr))
    .slice(0, 3);

  // Recent notes (top 3)
  const recentNotes = [...notes]
    .sort((a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime())
    .slice(0, 3);

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setTaskModalVisible(true);
  };

  const handleEditNote = (note: Note) => {
    setSelectedNote(note);
    setNoteModalVisible(true);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      {/* Top Header Bar */}
      <View style={[styles.headerBar, { backgroundColor: theme.background }]}>
        <TouchableOpacity style={styles.userInfo} onPress={onNavigateToProfile} activeOpacity={0.8}>
          <View style={[styles.avatarWrapper, { borderColor: theme.primary }]}>
            <Image source={{ uri: userProfile.avatarUrl }} style={styles.avatar} />
            <View style={[styles.onlineDot, { backgroundColor: theme.success }]} />
          </View>
          <View>
            <Text style={[styles.greetingText, { color: theme.text }]}>{greeting}</Text>
            <Text style={[styles.mottoText, { color: theme.textSecondary }]}>
              Small steps lead to big wins ✨
            </Text>
          </View>
        </TouchableOpacity>

        <View style={styles.headerIcons}>
          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
            onPress={onNavigateToSearch}
          >
            <Ionicons name="search-outline" size={19} color={theme.text} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
            onPress={() => setShowNotifications(true)}
          >
            <Ionicons name="notifications-outline" size={19} color={theme.text} />
            {unreadNotifs > 0 && (
              <View style={[styles.badgePill, { backgroundColor: theme.error }]}>
                <Text style={styles.badgePillText}>{unreadNotifs}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Today Section & Progress Bar */}
        <View style={styles.section}>
          <View style={styles.todayHeader}>
            <View>
              <Text style={[styles.todayDate, { color: theme.textSecondary }]}>
                {getTodayFormattedLong()}
              </Text>
              <Text style={[styles.todayHeading, { color: theme.text }]}>Today's Overview</Text>
            </View>

            <TouchableOpacity style={styles.viewCalendarBtn} onPress={onNavigateToCalendar}>
              <Ionicons name="calendar-outline" size={14} color={theme.primary} />
              <Text style={[styles.viewCalendarText, { color: theme.primary }]}>Calendar</Text>
            </TouchableOpacity>
          </View>

          <TaskProgressRing
            completedCount={completedToday}
            totalCount={todayTasks.length}
            subtitle="Today's Progress"
          />
        </View>

        {/* AI Assistant Quick Banner */}
        <TouchableOpacity
          style={[styles.aiCard, { backgroundColor: theme.primary, ...SHADOWS.card }]}
          onPress={onNavigateToAI}
          activeOpacity={0.88}
        >
          <View style={styles.aiLeft}>
            <View style={styles.aiSparkleBox}>
              <Ionicons name="sparkles" size={20} color="#FFFFFF" />
            </View>
            <View style={styles.aiTextCol}>
              <Text style={styles.aiTitle}>Need help planning your day?</Text>
              <Text style={styles.aiDesc}>
                LifeFlow AI can optimize your schedule or summarize your notes.
              </Text>
            </View>
          </View>

          <View style={styles.askAiButton}>
            <Text style={[styles.askAiText, { color: theme.primary }]}>Ask AI</Text>
            <Ionicons name="arrow-forward" size={13} color={theme.primary} />
          </View>
        </TouchableOpacity>

        {/* Quick Shortcut Pills */}
        <View style={styles.shortcutRow}>
          <TouchableOpacity
            style={[styles.shortcutItem, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
            onPress={onNavigateToPlanner}
          >
            <Ionicons name="time-outline" size={18} color="#F59E0B" />
            <Text style={[styles.shortcutLabel, { color: theme.text }]}>Daily Plan</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.shortcutItem, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
            onPress={() => {
              setSelectedNote(null);
              setNoteModalVisible(true);
            }}
          >
            <Ionicons name="document-text-outline" size={18} color="#8B5CF6" />
            <Text style={[styles.shortcutLabel, { color: theme.text }]}>Quick Note</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.shortcutItem, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
            onPress={() => {
              setSelectedTask(null);
              setTaskModalVisible(true);
            }}
          >
            <Ionicons name="checkbox-outline" size={18} color="#10B981" />
            <Text style={[styles.shortcutLabel, { color: theme.text }]}>Add Task</Text>
          </TouchableOpacity>
        </View>

        {/* Priority Tasks Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="flame" size={18} color="#EF4444" />
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Priority Tasks</Text>
            </View>
            <TouchableOpacity onPress={onNavigateToTasks}>
              <Text style={[styles.seeAllText, { color: theme.primary }]}>See all ({tasks.length})</Text>
            </TouchableOpacity>
          </View>

          {priorityTasks.length === 0 ? (
            <View style={[styles.emptyCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
              <Ionicons name="checkmark-circle-outline" size={28} color={theme.success} />
              <Text style={[styles.emptyCardTitle, { color: theme.text }]}>No high-priority tasks pending!</Text>
              <Text style={[styles.emptyCardSub, { color: theme.textSecondary }]}>
                Enjoy your focused day or add a new goal.
              </Text>
            </View>
          ) : (
            priorityTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onPress={() => handleEditTask(task)}
                onEdit={() => handleEditTask(task)}
              />
            ))
          )}
        </View>

        {/* Recent Notes Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="document-text" size={18} color="#8B5CF6" />
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Recent Notes</Text>
            </View>
            <TouchableOpacity onPress={onNavigateToNotes}>
              <Text style={[styles.seeAllText, { color: theme.primary }]}>See all ({notes.length})</Text>
            </TouchableOpacity>
          </View>

          {recentNotes.length === 0 ? (
            <View style={[styles.emptyCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
              <Ionicons name="create-outline" size={28} color={theme.textTertiary} />
              <Text style={[styles.emptyCardTitle, { color: theme.text }]}>No notes created yet</Text>
            </View>
          ) : (
            recentNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onPress={() => handleEditNote(note)}
                onEdit={() => handleEditNote(note)}
              />
            ))
          )}
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <QuickActionFAB
        onNewTask={() => {
          setSelectedTask(null);
          setTaskModalVisible(true);
        }}
        onNewNote={() => {
          setSelectedNote(null);
          setNoteModalVisible(true);
        }}
        onNewChecklist={() => {
          setSelectedTask(null);
          setTaskModalVisible(true);
        }}
        onPlanDay={onNavigateToPlanner}
      />

      {/* Modals */}
      <NotificationModal
        visible={showNotifications}
        onClose={() => setShowNotifications(false)}
      />

      <TaskEditorModal
        visible={taskModalVisible}
        onClose={() => {
          setTaskModalVisible(false);
          setSelectedTask(null);
        }}
        taskToEdit={selectedTask}
      />

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
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.base,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.md,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  avatarWrapper: {
    position: 'relative',
    borderWidth: 2,
    borderRadius: 22,
    padding: 1,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  greetingText: {
    fontSize: 17,
    ...FONTS.bold,
    letterSpacing: -0.3,
  },
  mottoText: {
    fontSize: 12,
    ...FONTS.regular,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  badgePill: {
    position: 'absolute',
    top: 5,
    right: 5,
    minWidth: 14,
    height: 14,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  badgePillText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
  },
  scrollContainer: {
    paddingHorizontal: SPACING.base,
    paddingBottom: 90,
    gap: SPACING.lg,
  },
  section: {
    gap: SPACING.xs,
  },
  todayHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  todayDate: {
    fontSize: 12,
    ...FONTS.medium,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  todayHeading: {
    fontSize: 20,
    ...FONTS.bold,
    letterSpacing: -0.3,
  },
  viewCalendarBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingBottom: 2,
  },
  viewCalendarText: {
    fontSize: 12,
    ...FONTS.bold,
  },
  aiCard: {
    borderRadius: RADIUS.xl,
    padding: SPACING.base,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  aiLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: SPACING.sm,
    marginRight: SPACING.sm,
  },
  aiSparkleBox: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.md,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiTextCol: {
    flex: 1,
  },
  aiTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    ...FONTS.bold,
  },
  aiDesc: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 11,
    ...FONTS.regular,
    marginTop: 2,
  },
  askAiButton: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: RADIUS.md,
  },
  askAiText: {
    fontSize: 12,
    ...FONTS.bold,
  },
  shortcutRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  shortcutItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: RADIUS.md,
    borderWidth: 1,
  },
  shortcutLabel: {
    fontSize: 12,
    ...FONTS.semibold,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionTitle: {
    fontSize: 17,
    ...FONTS.bold,
    letterSpacing: -0.3,
  },
  seeAllText: {
    fontSize: 13,
    ...FONTS.bold,
  },
  emptyCard: {
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    alignItems: 'center',
    gap: 4,
  },
  emptyCardTitle: {
    fontSize: 14,
    ...FONTS.bold,
    marginTop: 4,
  },
  emptyCardSub: {
    fontSize: 12,
    ...FONTS.regular,
  },
});
