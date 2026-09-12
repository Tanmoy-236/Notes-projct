import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
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
const TABS: TaskTab[] = ['today', 'upcoming', 'completed', 'all'];
const PRIORITIES: Array<Priority | 'all'> = ['all', 'high', 'medium', 'low'];

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
  const todayTasks = tasks.filter((task) => task.dueDate === todayStr);
  const todayCompleted = todayTasks.filter((task) => task.completed).length;

  const filteredTasks = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const priorityOrder: Record<Priority, number> = { high: 3, medium: 2, low: 1 };

    return tasks
      .filter((task) => {
        if (activeTab === 'today' && task.dueDate !== todayStr) return false;
        if (activeTab === 'upcoming' && (task.dueDate <= todayStr || task.completed)) return false;
        if (activeTab === 'completed' && !task.completed) return false;
        if (query && !task.title.toLowerCase().includes(query) && !task.description?.toLowerCase().includes(query)) return false;
        if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false;
        if (categoryFilter !== 'all' && task.category !== categoryFilter) return false;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'priority') return priorityOrder[b.priority] - priorityOrder[a.priority];
        if (sortBy === 'alphabetical') return a.title.localeCompare(b.title);
        return (a.dueTime || '').localeCompare(b.dueTime || '');
      });
  }, [tasks, activeTab, searchQuery, priorityFilter, categoryFilter, sortBy, todayStr]);

  const openEditor = (task: Task | null = null) => {
    setSelectedTask(task);
    setEditorModalVisible(true);
  };

  const tabCount = (tab: TaskTab) => {
    if (tab === 'today') return todayTasks.length;
    if (tab === 'upcoming') return tasks.filter((task) => task.dueDate > todayStr && !task.completed).length;
    if (tab === 'completed') return tasks.filter((task) => task.completed).length;
    return tasks.length;
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}> 
      <View style={styles.header}>
        <View style={styles.headerTitleGroup}>
          <Text style={[styles.headerTitle, { color: theme.text }]}>My Tasks</Text>
          <Text style={[styles.headerSub, { color: theme.textSecondary }]}>
            {tasks.filter((task) => !task.completed).length} pending · {tasks.filter((task) => task.completed).length} completed
          </Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel={showFilters ? 'Hide task filters' : 'Show task filters'}
            accessibilityState={{ expanded: showFilters }}
            style={[styles.iconButton, { backgroundColor: showFilters ? theme.primarySoft : theme.card, borderColor: showFilters ? theme.primary : theme.cardBorder }]}
            onPress={() => setShowFilters((visible) => !visible)}
          >
            <Ionicons name="options-outline" size={18} color={showFilters ? theme.primary : theme.text} />
          </TouchableOpacity>
          <TouchableOpacity accessibilityRole="button" accessibilityLabel="Add new task" style={[styles.iconButton, { backgroundColor: theme.primary }]} onPress={() => openEditor()}>
            <Ionicons name="add" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {activeTab === 'today' && <TaskProgressRing completedCount={todayCompleted} totalCount={todayTasks.length} subtitle="Today's Progress" />}
        <SearchBar value={searchQuery} onChangeText={setSearchQuery} placeholder="Search tasks..." />

        <View style={[styles.tabBar, { backgroundColor: theme.cardAlt }]} accessibilityRole="tablist">
          {TABS.map((tab) => {
            const selected = activeTab === tab;
            return (
              <TouchableOpacity
                key={tab}
                accessibilityRole="tab"
                accessibilityLabel={`${tab} tasks`}
                accessibilityState={{ selected }}
                style={[styles.tabItem, selected && [styles.tabItemActive, { backgroundColor: theme.card, borderColor: theme.cardBorder }]]}
                onPress={() => setActiveTab(tab)}
              >
                <Text style={[styles.tabLabel, { color: selected ? theme.primary : theme.textSecondary }, selected && styles.selectedText]}>{tab[0].toUpperCase() + tab.slice(1)}</Text>
                <Text style={[styles.tabCount, { color: selected ? theme.primary : theme.textTertiary }]}>{tabCount(tab)}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {showFilters && (
          <View style={[styles.filterPanel, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
            <Text style={[styles.filterLabel, { color: theme.textSecondary }]}>Priority</Text>
            <View style={styles.chipRow}>
              {PRIORITIES.map((priority) => {
                const selected = priorityFilter === priority;
                return <TouchableOpacity key={priority} accessibilityRole="button" accessibilityState={{ selected }} accessibilityLabel={`Priority ${priority}`} style={[styles.chip, { backgroundColor: selected ? theme.primary : theme.cardAlt, borderColor: selected ? theme.primary : theme.cardBorder }]} onPress={() => setPriorityFilter(priority)}><Text style={[styles.chipText, { color: selected ? '#FFFFFF' : theme.text }]}>{priority.toUpperCase()}</Text></TouchableOpacity>;
              })}
            </View>
            <Text style={[styles.filterLabel, { color: theme.textSecondary }]}>Sort by</Text>
            <View style={styles.chipRow}>
              {([{ label: 'Due Time', value: 'time' }, { label: 'Priority', value: 'priority' }, { label: 'Alphabetical', value: 'alphabetical' }] as const).map((option) => {
                const selected = sortBy === option.value;
                return <TouchableOpacity key={option.value} accessibilityRole="button" accessibilityState={{ selected }} style={[styles.chip, { backgroundColor: selected ? theme.primarySoft : theme.cardAlt, borderColor: selected ? theme.primary : theme.cardBorder }]} onPress={() => setSortBy(option.value)}><Text style={[styles.chipText, { color: selected ? theme.primary : theme.text }]}>{option.label}</Text></TouchableOpacity>;
              })}
            </View>
          </View>
        )}

        <View style={styles.tasksList}>
          {filteredTasks.length === 0 ? (
            <EmptyState
              icon="checkbox-outline"
              title={activeTab === 'completed' ? 'No completed tasks yet' : 'No tasks found'}
              description={searchQuery ? `No task matches "${searchQuery}".` : activeTab === 'completed' ? 'Complete tasks to build your productivity streak!' : 'All caught up! Add a task when you are ready.'}
              actionTitle="Add New Task"
              onAction={() => openEditor()}
            />
          ) : filteredTasks.map((task) => <TaskCard key={task.id} task={task} onPress={() => openEditor(task)} onEdit={() => openEditor(task)} />)}
        </View>
      </ScrollView>

      <TaskEditorModal visible={editorModalVisible} onClose={() => { setEditorModalVisible(false); setSelectedTask(null); }} taskToEdit={selectedTask} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.base, paddingTop: SPACING.sm, paddingBottom: SPACING.sm },
  headerTitleGroup: { flex: 1, minWidth: 0 },
  headerTitle: { fontSize: 24, ...FONTS.bold, letterSpacing: -0.4 },
  headerSub: { fontSize: 12, ...FONTS.medium, marginTop: 2 },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginLeft: SPACING.sm },
  iconButton: { width: 40, height: 40, minWidth: 40, borderRadius: RADIUS.md, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  scrollContent: { paddingHorizontal: SPACING.base, paddingBottom: 100, gap: SPACING.md },
  tabBar: { flexDirection: 'row', borderRadius: RADIUS.md, padding: 3 },
  tabItem: { flex: 1, minHeight: 40, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, paddingHorizontal: 4, borderRadius: RADIUS.sm, borderWidth: 1, borderColor: 'transparent' },
  tabItemActive: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 2, elevation: 2 },
  tabLabel: { fontSize: 13, ...FONTS.medium },
  selectedText: { ...FONTS.bold },
  tabCount: { fontSize: 11, ...FONTS.bold },
  filterPanel: { borderRadius: RADIUS.lg, borderWidth: 1, padding: SPACING.md, gap: SPACING.sm },
  filterLabel: { fontSize: 11, ...FONTS.bold, textTransform: 'uppercase', letterSpacing: 0.4 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  chip: { minHeight: 36, paddingHorizontal: SPACING.md, borderRadius: RADIUS.sm, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  chipText: { fontSize: 11, ...FONTS.semibold },
  tasksList: { gap: SPACING.sm },
});
