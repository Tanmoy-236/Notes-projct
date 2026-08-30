import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useApp } from '../context/AppContext';
import { SPACING, RADIUS, FONTS } from '../constants/theme';
import { Note, NoteCategory } from '../types';
import { NoteCard } from '../components/notes/NoteCard';
import { NoteEditorModal } from '../components/notes/NoteEditorModal';
import { SearchBar } from '../components/common/SearchBar';
import { EmptyState } from '../components/common/EmptyState';

const CATEGORIES: NoteCategory[] = ['All', 'Personal', 'Study', 'Work', 'Ideas', 'Important'];

export const NotesScreen: React.FC<{ onOpenSearch?: () => void }> = ({ onOpenSearch }) => {
  const { theme, notes } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<NoteCategory>('All');
  const [isGridView, setIsGridView] = useState(false);
  const [editorModalVisible, setEditorModalVisible] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [filterFavoritesOnly, setFilterFavoritesOnly] = useState(false);

  // Filter notes
  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      // Category filter
      if (selectedCategory !== 'All' && note.category !== selectedCategory) {
        return false;
      }
      // Favorites filter
      if (filterFavoritesOnly && !note.favorite) {
        return false;
      }
      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const titleMatch = note.title.toLowerCase().includes(q);
        const contentMatch = note.content.toLowerCase().includes(q);
        const tagMatch = note.tags?.some((t) => t.toLowerCase().includes(q));
        if (!titleMatch && !contentMatch && !tagMatch) return false;
      }
      return true;
    });
  }, [notes, selectedCategory, filterFavoritesOnly, searchQuery]);

  const pinnedNotes = filteredNotes.filter((n) => n.pinned);
  const otherNotes = filteredNotes.filter((n) => !n.pinned);

  const handleEditNote = (note: Note) => {
    setSelectedNote(note);
    setEditorModalVisible(true);
  };

  const handleCreateNew = () => {
    setSelectedNote(null);
    setEditorModalVisible(true);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      {/* Top Header */}
      <View style={[styles.header, { backgroundColor: theme.background }]}>
        <View>
          <Text style={[styles.headerTitle, { color: theme.text }]}>My Notes</Text>
          <Text style={[styles.headerSub, { color: theme.textSecondary }]}>
            {notes.length} notes & documents
          </Text>
        </View>

        <View style={styles.headerRight}>
          {/* Favorites Filter Toggle */}
          <TouchableOpacity
            style={[
              styles.headerBtn,
              {
                backgroundColor: filterFavoritesOnly ? '#FEF2F2' : theme.card,
                borderColor: filterFavoritesOnly ? '#EF4444' : theme.cardBorder,
              },
            ]}
            onPress={() => setFilterFavoritesOnly(!filterFavoritesOnly)}
          >
            <Ionicons
              name={filterFavoritesOnly ? 'heart' : 'heart-outline'}
              size={18}
              color={filterFavoritesOnly ? '#EF4444' : theme.text}
            />
          </TouchableOpacity>

          {/* Grid / List View Toggle */}
          <TouchableOpacity
            style={[styles.headerBtn, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
            onPress={() => setIsGridView(!isGridView)}
          >
            <Ionicons
              name={isGridView ? 'list-outline' : 'grid-outline'}
              size={18}
              color={theme.text}
            />
          </TouchableOpacity>

          {/* Add Note Button */}
          <TouchableOpacity
            style={[styles.addBtn, { backgroundColor: theme.primary }]}
            onPress={handleCreateNew}
          >
            <Ionicons name="add" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchWrapper}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search note titles, content, tags..."
        />
      </View>

      {/* Categories Horizontal Carousel */}
      <View style={styles.categoryBar}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            const count =
              cat === 'All' ? notes.length : notes.filter((n) => n.category === cat).length;

            return (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.catChip,
                  {
                    backgroundColor: isSelected ? theme.primary : theme.card,
                    borderColor: isSelected ? theme.primary : theme.cardBorder,
                  },
                ]}
                onPress={() => setSelectedCategory(cat)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.catChipText,
                    {
                      color: isSelected ? '#FFFFFF' : theme.text,
                      fontWeight: isSelected ? '700' : '500',
                    },
                  ]}
                >
                  {cat}
                </Text>
                <View
                  style={[
                    styles.countPill,
                    {
                      backgroundColor: isSelected ? 'rgba(255,255,255,0.25)' : theme.cardAlt,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.countText,
                      { color: isSelected ? '#FFFFFF' : theme.textSecondary },
                    ]}
                  >
                    {count}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Main Content Area */}
      {filteredNotes.length === 0 ? (
        <EmptyState
          icon="document-text-outline"
          title="No notes found"
          description={
            searchQuery
              ? `No notes matched "${searchQuery}". Try a different keyword.`
              : 'Create your first note or use AI to draft thoughts.'
          }
          actionTitle="Create Note"
          onAction={handleCreateNew}
        />
      ) : isGridView ? (
        // Grid View
        <FlatList
          data={filteredNotes}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.gridContainer}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <NoteCard
              note={item}
              onPress={() => handleEditNote(item)}
              onEdit={() => handleEditNote(item)}
              isGridView
            />
          )}
        />
      ) : (
        // List View with Pinned vs Other sections
        <ScrollView
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        >
          {pinnedNotes.length > 0 && (
            <View style={styles.sectionBlock}>
              <View style={styles.sectionHeader}>
                <Ionicons name="pin" size={14} color={theme.primary} />
                <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>PINNED NOTES</Text>
              </View>
              {pinnedNotes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onPress={() => handleEditNote(note)}
                  onEdit={() => handleEditNote(note)}
                />
              ))}
            </View>
          )}

          {otherNotes.length > 0 && (
            <View style={styles.sectionBlock}>
              {pinnedNotes.length > 0 && (
                <View style={styles.sectionHeader}>
                  <Ionicons name="document-text-outline" size={14} color={theme.textSecondary} />
                  <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>ALL NOTES</Text>
                </View>
              )}
              {otherNotes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onPress={() => handleEditNote(note)}
                  onEdit={() => handleEditNote(note)}
                />
              ))}
            </View>
          )}
        </ScrollView>
      )}

      {/* Note Editor Modal */}
      <NoteEditorModal
        visible={editorModalVisible}
        onClose={() => {
          setEditorModalVisible(false);
          setSelectedNote(null);
        }}
        noteToEdit={selectedNote}
        initialCategory={selectedCategory === 'All' ? 'Personal' : selectedCategory}
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
  headerBtn: {
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
  searchWrapper: {
    paddingHorizontal: SPACING.base,
    paddingTop: SPACING.xs,
  },
  categoryBar: {
    paddingVertical: SPACING.xs + 2,
  },
  categoryScroll: {
    paddingHorizontal: SPACING.base,
    gap: 8,
  },
  catChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: RADIUS.full,
    borderWidth: 1,
  },
  catChipText: {
    fontSize: 13,
  },
  countPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
  },
  countText: {
    fontSize: 10,
    ...FONTS.bold,
  },
  gridContainer: {
    paddingHorizontal: SPACING.sm,
    paddingBottom: 90,
    paddingTop: SPACING.xs,
  },
  listContainer: {
    paddingHorizontal: SPACING.base,
    paddingBottom: 90,
    gap: SPACING.md,
  },
  sectionBlock: {
    gap: 6,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 11,
    ...FONTS.bold,
    letterSpacing: 0.5,
  },
});
