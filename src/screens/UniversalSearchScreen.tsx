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
import { SPACING, RADIUS, FONTS, SHADOWS } from '../constants/theme';
import { SearchBar } from '../components/common/SearchBar';
import { TaskCard } from '../components/tasks/TaskCard';
import { NoteCard } from '../components/notes/NoteCard';
import { TaskEditorModal } from '../components/tasks/TaskEditorModal';
import { NoteEditorModal } from '../components/notes/NoteEditorModal';
import { Task, Note } from '../types';

type SearchFilter = 'all' | 'notes' | 'tasks' | 'high_priority' | 'pinned';

const RECENT_SEARCHES = ['Roadmap', 'Presentation', 'Brainstorm', 'Budget', 'Design System'];

export const UniversalSearchScreen: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const { theme, tasks, notes } = useApp();

  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<SearchFilter>('all');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [taskModalVisible, setTaskModalVisible] = useState(false);
  const [noteModalVisible, setNoteModalVisible] = useState(false);

  // Search logic
  const results = useMemo(() => {
    const q = query.toLowerCase().trim();

    const matchingNotes = notes.filter((n) => {
      if (filter === 'tasks' || filter === 'high_priority') return false;
      if (filter === 'pinned' && !n.pinned) return false;
      if (!q) return filter !== 'all';
      return (
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q) ||
        n.tags?.some((t) => t.toLowerCase().includes(q)) ||
        n.category.toLowerCase().includes(q)
      );
    });

    const matchingTasks = tasks.filter((t) => {
      if (filter === 'notes' || filter === 'pinned') return false;
      if (filter === 'high_priority' && t.priority !== 'high') return false;
      if (!q) return filter !== 'all';
      return (
        t.title.toLowerCase().includes(q) ||
        t.description?.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.subtasks.some((st) => st.title.toLowerCase().includes(q))
      );
    });

    return {
      notes: matchingNotes,
      tasks: matchingTasks,
      totalCount: matchingNotes.length + matchingTasks.length,
    };
  }, [query, filter, notes, tasks]);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.background }]}>
        {onBack && (
          <TouchableOpacity onPress={onBack} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color={theme.text} />
          </TouchableOpacity>
        )}
        <View style={{ flex: 1 }}>
          <SearchBar
            value={query}
            onChangeText={setQuery}
            placeholder="Search notes, tasks, checklists, tags..."
          />
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {[
            { label: 'All Results', value: 'all' as SearchFilter },
            { label: 'Notes Only', value: 'notes' as SearchFilter },
            { label: 'Tasks Only', value: 'tasks' as SearchFilter },
            { label: 'High Priority', value: 'high_priority' as SearchFilter },
            { label: 'Pinned Notes', value: 'pinned' as SearchFilter },
          ].map((item) => {
            const isSelected = filter === item.value;
            return (
              <TouchableOpacity
                key={item.value}
                style={[
                  styles.filterPill,
                  {
                    backgroundColor: isSelected ? theme.primary : theme.card,
                    borderColor: isSelected ? theme.primary : theme.cardBorder,
                  },
                ]}
                onPress={() => setFilter(item.value)}
              >
                <Text
                  style={[
                    styles.filterPillText,
                    {
                      color: isSelected ? '#FFFFFF' : theme.text,
                      fontWeight: isSelected ? '700' : '500',
                    },
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Recent Search Suggestions if empty query */}
        {!query.trim() && (
          <View style={styles.recentBlock}>
            <Text style={[styles.recentTitle, { color: theme.textSecondary }]}>POPULAR SEARCHES</Text>
            <View style={styles.recentTags}>
              {RECENT_SEARCHES.map((tag) => (
                <TouchableOpacity
                  key={tag}
                  style={[styles.recentChip, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
                  onPress={() => setQuery(tag)}
                >
                  <Ionicons name="search-outline" size={13} color={theme.primary} />
                  <Text style={[styles.recentChipText, { color: theme.text }]}>{tag}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Results Info */}
        {query.trim() && (
          <Text style={[styles.resultCount, { color: theme.textSecondary }]}>
            Found {results.totalCount} result{results.totalCount === 1 ? '' : 's'} for "{query}"
          </Text>
        )}

        {/* Notes Results */}
        {results.notes.length > 0 && (
          <View style={styles.sectionBlock}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="document-text" size={16} color={theme.secondary} />
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                Notes ({results.notes.length})
              </Text>
            </View>
            {results.notes.map((note) => (
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

        {/* Tasks Results */}
        {results.tasks.length > 0 && (
          <View style={styles.sectionBlock}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="checkbox" size={16} color={theme.primary} />
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                Tasks ({results.tasks.length})
              </Text>
            </View>
            {results.tasks.map((task) => (
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
            ))}
          </View>
        )}

        {/* No results */}
        {query.trim() && results.totalCount === 0 && (
          <View style={styles.noResultsBox}>
            <Ionicons name="search-outline" size={44} color={theme.textTertiary} />
            <Text style={[styles.noResultsTitle, { color: theme.text }]}>No matching results</Text>
            <Text style={[styles.noResultsDesc, { color: theme.textSecondary }]}>
              Try searching with a different term or keyword.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Modals */}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.base,
    paddingTop: SPACING.xs,
    gap: SPACING.xs,
  },
  backBtn: {
    padding: SPACING.xs,
  },
  filterRow: {
    paddingVertical: SPACING.xs + 2,
  },
  filterScroll: {
    paddingHorizontal: SPACING.base,
    gap: 8,
  },
  filterPill: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: RADIUS.full,
    borderWidth: 1,
  },
  filterPillText: {
    fontSize: 12,
  },
  scrollContent: {
    paddingHorizontal: SPACING.base,
    paddingBottom: 90,
    gap: SPACING.md,
  },
  recentBlock: {
    marginVertical: SPACING.sm,
    gap: SPACING.xs + 2,
  },
  recentTitle: {
    fontSize: 11,
    ...FONTS.bold,
    letterSpacing: 0.5,
  },
  recentTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  recentChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: RADIUS.md,
    borderWidth: 1,
  },
  recentChipText: {
    fontSize: 13,
    ...FONTS.medium,
  },
  resultCount: {
    fontSize: 12,
    ...FONTS.medium,
  },
  sectionBlock: {
    gap: 6,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 14,
    ...FONTS.bold,
  },
  noResultsBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: SPACING.xs,
  },
  noResultsTitle: {
    fontSize: 16,
    ...FONTS.bold,
    marginTop: SPACING.xs,
  },
  noResultsDesc: {
    fontSize: 13,
    ...FONTS.regular,
  },
});
