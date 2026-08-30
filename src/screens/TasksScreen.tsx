import React, { useState, useMemo } from 'react';
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
import { SPACING, RADIUS, FONTS } from '../constants/theme';
import { Task, Priority, TaskCategory } from '../types';
import { TaskCard } from '../components/tasks/TaskCard';
import { TaskProgressRing } from '../components/tasks/TaskProgressRing';
import { TaskEditorModal } from '../components/tasks/TaskEditorModal';
import { SearchBar } from '../components/common/SearchBar';
import { EmptyState } from '../components/common/EmptyState';

type TaskTab = 'today' | 'upcoming' | 'completed' | 'all';
type SortOption = 'time' | 'priority' | 'alphabetical';

export const TasksScreen: React.FC = () => {
  const { theme, tasks } = useApp();

  const [activeTab, setActiveTab] = useState<TaskTab>('today');
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<TaskCategory | 'all'>('all');
  const [sortBy, setSortBy] = useState<SortOption>('time');
  const [showFilters, setShowFilters] = useState(false);

  const [editorModalVisible, setEditorModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const todayStr = new Date().toISOString().split('T')[0];

  // Daily stats
  const todayTasks = tasks.filter((t) => t.dueDate === todayStr);
  const todayCompleted = todayTasks.filter((t) => t.completed).length;

  // Filter tasks based on activeTab, search, priority, category
  const filteredTasks = useMemo(() => {
    let result = tasks.filter((task) => {
      // Tab filter
      if (activeTab === 'today') {
        if (task.dueDate !== todayStr) return false;
      } else if (activeTab === 'upcoming') {
        if (task.dueDate <= todayStr || task.completed) return false;
      } else if (activeTab === 'completed') {
        if (!task.completed) return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const titleMatch = task.title.toLowerCase().includes(q);
        const descMatch = task.description?.toLowerCase().includes(q);
        if (!titleMatch && !descMatch) return false;
      }

      // Priority filter
      if (priorityFilter !== 'all' && task.priority !== priorityFilter) {
        return false;
      }

      // Category filter
      if (categoryFilter !== 'all' && task.category !== categoryFilter) {
        return false;
      }

      return true;
    });

    // Sorting
    result = [...result].sort((a, b) => {
      if (sortBy === 'priority') {
        const pOrder: Record<Priority, number> = { high: 3, medium: 2, low: 1 };
        return pOrder[b.priority] - pOrder[a.priority];
      }
      if (sortBy === 'alphabetical') {
        return a.title.localeCompare(b.title);
      }
      // default: time / date
      return (a.dueTime || '').localeCompare(b.dueTime || '');
    });

    return result;
  }, [tasks, activeTab, searchQuery, priorityFilter, categoryFilter, sortBy, todayStr]);

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setEditorModalVisible(true);
  };

  const handleCreateNew = () => {
    setSelectedTask(null);
    setEditorModalVisible(true);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      {/* Top Header */}
      <View style={[styles.header, { backgroundColor: theme.background }]}>
        <View>
          <Text style={[styles.headerTitle, { color: theme.text }]}>My Tasks</Text>
          <Text style={[styles.headerSub, { color: theme.textSecondary }]}>
            {tasks.filter((t) => !t.completed).length} pending • {tasks.filter((t) => t.completed).length} completed
          </Text>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity
            style={[
              styles.filterToggleBtn,
              {
                backgroundColor: showFilters ? theme.primarySoft : theme.card,
                borderColor: showFilters ? theme.primary : theme.cardBorder,
              },
            ]}
            onPress={() => setShowFilters(!showFilters)}
          >
            <Ionicons
              name="options-outline"
              size={18}
              color={showFilters ? theme.primary : theme.text}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.addBtn, { backgroundColor: theme.primary }]}
            onPress={handleCreateNew}
          >
            <Ionicons name="add" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Today's Progress Card (shown on Today tab) */}
        {activeTab === 'today' && (
          <TaskProgressRing
            completedCount={todayCompleted}
            totalCount={todayTasks.length}
            subtitle="Today's Progress"
          />
        )}

        {/* Search Bar */}
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search tasks..."
        />

        {/* Tab Pills */}
        <View style={[styles.tabBar, { backgroundColor: theme.cardAlt }]}>
          {(['today', 'upcoming', 'completed', 'all'] as TaskTab[]).map((tab) => {
            const isSelected = activeTab === tab;
            const getTabCount = () => {
              if (tab === 'today') return todayTasks.length;
              if (tab === 'upcoming') return tasks.filter((t) => t.dueDate > todayStr && !t.completed).length;
              if (tab === 'completed') return tasks.filter((t) => t.completed).length;
              return tasks.length;
            };

            return (
              <TouchableOpacity
                key={tab}
                style={[
                  styles.tabItem,
                  isSelected && [styles.tabItemActive, { backgroundColor: theme.card }],
                ]}
                onPress={() => setActiveTab(tab)}
              >
                <Text
                  style={[
                    styles.tabLabel,
                    {
                      color: isSelected ? theme.primary : theme.textSecondary,
                      fontWeight: isSelected ? '700' : '500',
                    },
                  ]}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </Text>
                <Text
                  style={[
                    styles.tabCount,
                    { color: isSelected ? theme.primary : theme.textTertiary },
                  ]}
                >
                  {getTabCount()}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Expandable Filter & Sorting Drawer */}
        {showFilters && (
          <View style={[styles.filterPanel, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
            <Text style={[styles.filterLabel, { color: theme.textSecondary }]}>Filter by Priority:</Text>
            <View style={styles.filterChipRow}>
              {(['all', 'high', 'medium', 'low'] as const).map((p) => (
                <TouchableOpacity
                  key={p}
                  style={[
                    styles.filterChip,
                    {
                      backgroundColor: priorityFilter === p ? theme.primary : theme.cardAlt,
                      borderColor: priorityFilter === p ? theme.primary : theme.cardBorder,
                    },
                  ]}
                  onPress={() => setPriorityFilter(p)}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      { color: priorityFilter === p ? '#FFFFFF' : theme.text },
                    ]}
                  >
                    {p.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.filterLabel, { color: theme.textSecondary, marginTop: SPACING.xs }]}>
              Sort by:
            </Text>
            <View style={styles.filterChipRow}>
              {[
                { label: 'Due Time', value: 'time' as SortOption },
                { label: 'Priority', value: 'priority' as SortOption },
                { label: 'Alphabetical', value: 'alphabetical' as SortOption },
              ].map((s) => (
                <TouchableOpacity
                  key={s.value}
                  style={[
                    styles.filterChip,
                    {
                      backgroundColor: sortBy === s.value ? theme.primarySoft : theme.cardAlt,
                      borderColor: sortBy === s.value ? theme.primary : theme.cardBorder,
                    },
                  ]}
                  onPress={() => setSortBy(s.value)}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      { color: sortBy === s.value ? theme.primary : theme.text },
                    ]}
                  >
                    {s.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Task List Items */}
        <View style={styles.tasksList}>
          {filteredTasks.length === 0 ? (
            <EmptyState
              icon="checkbox-outline"
              title={
                activeTab === 'completed'
                  ? 'No completed tasks yet'
                  : 'No tasks found'
              }
              description={
                searchQuery
                  ? `No task matches "${searchQuery}".`
                  : activeTab === 'completed'
                  ? 'Complete tasks to build your productivity streak!'
                  : 'All caught up! Tap the + button to add a task.'
              }
              actionTitle="Add New Task"
              onAction={handleCreateNew}
            />
          ) : (
            filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onPress={() => handleEditTask(task)}
                onEdit={() => handleEditTask(task)}
              />
            ))
          )}
        </View>
      </ScrollView>

      {/* Task Creation & Edit Modal */}
      <TaskEditorModal
        visible={editorModalVisible}
        onClose={() => {
          setEditorModalVisible(false);
          setSelectedTask(null);
        }}
        taskToEdit={selectedTask}
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
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs + 2,
  },
  filterToggleBtn: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtn: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: SPACING.base,
    paddingBottom: 90,
    gap: SPACING.sm,
  },
  tabBar: {
    flexDirection: 'row',
    borderRadius: RADIUS.md,
    padding: 3,
    marginVertical: SPACING.xs,
  },
  tabItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 8,
    borderRadius: RADIUS.sm,
  },
  tabItemActive: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabLabel: {
    fontSize: 13,
  },
  tabCount: {
    fontSize: 11,
    ...FONTS.bold,
  },
  filterPanel: {
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    padding: SPACING.md,
    gap: SPACING.xs,
  },
  filterLabel: {
    fontSize: 11,
    ...FONTS.bold,
    textTransform: 'uppercase',
  },
  filterChipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  filterChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
  },
  filterChipText: {
    fontSize: 11,
    ...FONTS.semibold,
  },
  tasksList: {
    gap: 4,
    marginTop: 4,
  },
});
