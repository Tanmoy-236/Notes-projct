import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useApp } from '../context/AppContext';
import { SPACING, RADIUS, FONTS, SHADOWS } from '../constants/theme';
import { TimeBlockCard } from '../components/planner/TimeBlockCard';
import { TaskEditorModal } from '../components/tasks/TaskEditorModal';
import { Task } from '../types';
import { getTodayFormattedLong } from '../utils/dateUtils';

export const AIDailyPlannerScreen: React.FC = () => {
  const { theme, tasks, optimizeDailySchedule, isAiLoading } = useApp();

  const [editorModalVisible, setEditorModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [targetBlock, setTargetBlock] = useState<'morning' | 'afternoon' | 'evening'>('morning');
  const [aiInsightMessage, setAiInsightMessage] = useState<string | null>(null);

  const todayStr = new Date().toISOString().split('T')[0];
  const todayTasks = tasks.filter((t) => t.dueDate === todayStr);

  const morningTasks = todayTasks.filter(
    (t) => t.scheduledTimeBlock === 'morning' || (!t.scheduledTimeBlock && t.priority === 'high')
  );
  const afternoonTasks = todayTasks.filter(
    (t) => t.scheduledTimeBlock === 'afternoon' || (!t.scheduledTimeBlock && t.priority === 'medium')
  );
  const eveningTasks = todayTasks.filter(
    (t) => t.scheduledTimeBlock === 'evening' || (!t.scheduledTimeBlock && t.priority === 'low')
  );

  const handleOptimize = async () => {
    const res = await optimizeDailySchedule();
    setAiInsightMessage(res.aiInsight);
  };

  const handleAddTaskToBlock = (block: 'morning' | 'afternoon' | 'evening') => {
    setTargetBlock(block);
    setSelectedTask(null);
    setEditorModalVisible(true);
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setEditorModalVisible(true);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      {/* Top Header */}
      <View style={[styles.header, { backgroundColor: theme.background }]}>
        <View>
          <Text style={[styles.headerDate, { color: theme.textSecondary }]}>
            {getTodayFormattedLong()}
          </Text>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Your AI Plan</Text>
        </View>

        <TouchableOpacity
          style={[styles.optimizeBtn, { backgroundColor: theme.primary }, SHADOWS.card]}
          onPress={handleOptimize}
          disabled={isAiLoading}
          activeOpacity={0.8}
        >
          {isAiLoading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Ionicons name="sparkles" size={16} color="#FFFFFF" />
              <Text style={styles.optimizeBtnText}>Optimize Schedule</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Productivity Score & Overview Summary */}
        <View
          style={[
            styles.summaryCard,
            { backgroundColor: theme.card, borderColor: theme.cardBorder },
            SHADOWS.soft,
          ]}
        >
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: theme.primary }]}>
              {todayTasks.filter((t) => t.completed).length}/{todayTasks.length}
            </Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Completed</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: theme.divider }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: '#F59E0B' }]}>3.5 hrs</Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Deep Focus</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: theme.divider }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: '#10B981' }]}>92%</Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Efficiency Score</Text>
          </View>
        </View>

        {/* AI Insight banner if optimized */}
        {aiInsightMessage && (
          <View style={[styles.insightCard, { backgroundColor: theme.primarySoft, borderColor: theme.primary }]}>
            <View style={styles.insightHeader}>
              <Ionicons name="sparkles" size={16} color={theme.primary} />
              <Text style={[styles.insightTitle, { color: theme.primary }]}>AI Schedule Reasoning</Text>
            </View>
            <Text style={[styles.insightBody, { color: theme.text }]}>{aiInsightMessage}</Text>
          </View>
        )}

        {/* Morning Block */}
        <TimeBlockCard
          period="morning"
          title="Morning Focus"
          timeRange="08:00 AM - 12:00 PM"
          energyLevel="Peak Energy Focus (Deep Work)"
          aiTip="✨ Highest cognitive bandwidth: Tackle strategy, writing, and analytical problem-solving."
          tasks={morningTasks}
          onAddTask={() => handleAddTaskToBlock('morning')}
          onEditTask={handleEditTask}
        />

        {/* Afternoon Block */}
        <TimeBlockCard
          period="afternoon"
          title="Afternoon Sync"
          timeRange="12:00 PM - 05:00 PM"
          energyLevel="Execution & Collaboration"
          aiTip="⚡ Mid-day energy: Ideal for cross-team communication, code reviews, and tactical tasks."
          tasks={afternoonTasks}
          onAddTask={() => handleAddTaskToBlock('afternoon')}
          onEditTask={handleEditTask}
        />

        {/* Evening Block */}
        <TimeBlockCard
          period="evening"
          title="Evening Wind Down"
          timeRange="05:00 PM - 09:00 PM"
          energyLevel="Wellness & Review"
          aiTip="🌙 Rest & Reflect: Wrap up loose ends, log top wins, and recharge for tomorrow."
          tasks={eveningTasks}
          onAddTask={() => handleAddTaskToBlock('evening')}
          onEditTask={handleEditTask}
        />
      </ScrollView>

      {/* Task Modal */}
      <TaskEditorModal
        visible={editorModalVisible}
        onClose={() => {
          setEditorModalVisible(false);
          setSelectedTask(null);
        }}
        taskToEdit={selectedTask}
        initialDate={todayStr}
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
    paddingBottom: SPACING.sm,
  },
  headerDate: {
    fontSize: 11,
    ...FONTS.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  headerTitle: {
    fontSize: 22,
    ...FONTS.bold,
    letterSpacing: -0.3,
  },
  optimizeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: RADIUS.md,
  },
  optimizeBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    ...FONTS.bold,
  },
  scrollContent: {
    paddingHorizontal: SPACING.base,
    paddingBottom: 90,
    gap: SPACING.md,
  },
  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    ...FONTS.bold,
  },
  statLabel: {
    fontSize: 11,
    ...FONTS.medium,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
  },
  insightCard: {
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    gap: 4,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  insightTitle: {
    fontSize: 13,
    ...FONTS.bold,
  },
  insightBody: {
    fontSize: 12,
    ...FONTS.regular,
    lineHeight: 18,
  },
});
