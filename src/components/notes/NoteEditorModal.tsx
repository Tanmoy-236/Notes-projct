import React, { useState, useEffect, useRef } from 'react';
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
  ActivityIndicator,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Note, NoteCategory } from '../../types';
import { useApp } from '../../context/AppContext';
import { SPACING, RADIUS, FONTS, SHADOWS } from '../../constants/theme';
import { AIToolbar, AIToolAction } from './AIToolbar';
import { AIEngine } from '../../utils/aiEngine';

interface NoteEditorModalProps {
  visible: boolean;
  onClose: () => void;
  noteToEdit?: Note | null;
  initialCategory?: NoteCategory;
}

const CATEGORIES: NoteCategory[] = ['Personal', 'Study', 'Work', 'Ideas', 'Important'];

export const NoteEditorModal: React.FC<NoteEditorModalProps> = ({
  visible,
  onClose,
  noteToEdit,
  initialCategory = 'Personal',
}) => {
  const { theme, addNote, updateNote, deleteNote, createTasksFromNoteAI } = useApp();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<NoteCategory>(initialCategory);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [pinned, setPinned] = useState(false);
  const [favorite, setFavorite] = useState(false);
  const [saveStatus, setSaveStatus] = useState('Saved just now');
  
  const [showAiSheet, setShowAiSheet] = useState(false);
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [isVoiceSimulating, setIsVoiceSimulating] = useState(false);
  const [showTagBar, setShowTagBar] = useState(false);

  const textInputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (noteToEdit) {
      setTitle(noteToEdit.title);
      setContent(noteToEdit.content);
      setCategory(noteToEdit.category === 'All' ? 'Personal' : noteToEdit.category);
      setTags(noteToEdit.tags || []);
      setPinned(noteToEdit.pinned);
      setFavorite(noteToEdit.favorite);
      setSaveStatus('Saved');
    } else {
      setTitle('');
      setContent('');
      setCategory(initialCategory === 'All' ? 'Personal' : initialCategory);
      setTags(['Notes']);
      setPinned(false);
      setFavorite(false);
      setSaveStatus('New Note');
    }
  }, [noteToEdit, visible, initialCategory]);

  const autoSaveTimerRef = useRef<any>(null);

  const handleContentChange = (newText: string) => {
    setContent(newText);
    setSaveStatus('Unsaved changes...');

    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    autoSaveTimerRef.current = setTimeout(() => {
      setSaveStatus('Saved just now');
    }, 1200);
  };

  const handleInsertFormat = (prefix: string, suffix = '') => {
    setContent((prev) => `${prev}\n${prefix}${suffix}`);
  };

  const handleVoiceInputSimulate = () => {
    setIsVoiceSimulating(true);
    setTimeout(() => {
      setContent((prev) =>
        prev
          ? `${prev}\n\n🎙️ [Voice Memo]: Review key project deliverables and sync with the product team on Monday morning.`
          : `🎙️ [Voice Memo]: Review key project deliverables and sync with the product team on Monday morning.`
      );
      setIsVoiceSimulating(false);
      setSaveStatus('Saved voice memo');
    }, 1500);
  };

  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    const cleanTag = tagInput.trim().replace(/^#/, '');
    if (!tags.includes(cleanTag)) {
      setTags((prev) => [...prev, cleanTag]);
    }
    setTagInput('');
  };

  const handleRemoveTag = (tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  };

  const handleSave = () => {
    const finalTitle = title.trim() || 'Untitled Note';
    if (noteToEdit) {
      updateNote(noteToEdit.id, {
        title: finalTitle,
        content,
        category,
        tags,
        pinned,
        favorite,
      });
    } else {
      addNote({
        title: finalTitle,
        content,
        category,
        tags,
        pinned,
        favorite,
      });
    }
    onClose();
  };

  const handleAiAction = async (action: AIToolAction) => {
    setIsAiProcessing(true);
    try {
      if (action === 'summarize') {
        const summary = await AIEngine.summarizeNote(title || 'Note', content);
        setContent((prev) => `${prev}\n\n---\n${summary}`);
      } else if (action === 'improve') {
        const improved = await AIEngine.improveWriting(content);
        setContent((prev) => `${improved}\n\n*(Original content upgraded by LifeFlow AI)*`);
      } else if (action === 'grammar') {
        const fixed = await AIEngine.fixGrammar(content);
        setContent(fixed);
      } else if (action === 'ideas') {
        const ideas = await AIEngine.generateIdeas(title || 'Productivity');
        setContent((prev) => `${prev}\n\n---\n${ideas}`);
      } else if (action === 'tasks') {
        if (noteToEdit) {
          const count = await createTasksFromNoteAI(noteToEdit.id);
          Alert.alert('✨ Tasks Extracted', `LifeFlow AI successfully added ${count} new tasks to your To-Do list!`);
        } else {
          // Save note first then extract
          const saved = addNote({
            title: title || 'Quick Note',
            content,
            category,
            tags,
            pinned,
            favorite,
          });
          const count = await createTasksFromNoteAI(saved.id);
          Alert.alert('✨ Tasks Extracted', `LifeFlow AI successfully extracted ${count} tasks to your To-Do list!`);
        }
      } else if (action === 'continue') {
        await new Promise((r) => setTimeout(r, 800));
        setContent((prev) =>
          `${prev}\n\nFurthermore, focusing on measurable incremental milestones ensures consistent momentum without cognitive overload. Next steps involve establishing clear accountability check-ins.`
        );
      } else if (action === 'explain') {
        await new Promise((r) => setTimeout(r, 750));
        setContent((prev) =>
          `${prev}\n\n💡 **Simplified Explanation**:\nThis note outlines key strategic priorities and frameworks designed to maximize execution speed while reducing friction in daily routines.`
        );
      }
      setSaveStatus('AI changes applied');
    } catch (err) {
      console.warn('AI action error', err);
    } finally {
      setIsAiProcessing(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: theme.background }]}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Top bar */}
        <View style={[styles.topBar, { backgroundColor: theme.card, borderBottomColor: theme.divider }]}>
          <TouchableOpacity onPress={onClose} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color={theme.text} />
          </TouchableOpacity>

          <View style={styles.topStatusContainer}>
            <Text style={[styles.saveStatus, { color: theme.textTertiary }]}>{saveStatus}</Text>
          </View>

          <View style={styles.topRightActions}>
            <TouchableOpacity onPress={() => setPinned(!pinned)} style={styles.iconBtn}>
              <Ionicons name={pinned ? 'pin' : 'pin-outline'} size={20} color={pinned ? theme.primary : theme.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setFavorite(!favorite)} style={styles.iconBtn}>
              <Ionicons name={favorite ? 'heart' : 'heart-outline'} size={20} color={favorite ? '#EF4444' : theme.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSave}
              style={[styles.saveBtn, { backgroundColor: theme.primary }]}
            >
              <Ionicons name="checkmark" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* AI Processing Banner */}
        {isAiProcessing && (
          <View style={[styles.aiBanner, { backgroundColor: theme.primarySoft }]}>
            <ActivityIndicator size="small" color={theme.primary} />
            <Text style={[styles.aiBannerText, { color: theme.primary }]}>
              LifeFlow AI is analyzing and processing note...
            </Text>
          </View>
        )}

        {/* Category Pill Strip */}
        <View style={[styles.categoryBar, { backgroundColor: theme.card, borderBottomColor: theme.divider }]}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
            {CATEGORIES.map((cat) => {
              const isSelected = category === cat;
              return (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.catChip,
                    {
                      backgroundColor: isSelected ? theme.primary : theme.cardAlt,
                      borderColor: isSelected ? theme.primary : theme.cardBorder,
                    },
                  ]}
                  onPress={() => setCategory(cat)}
                >
                  <Text
                    style={[
                      styles.catChipText,
                      { color: isSelected ? '#FFFFFF' : theme.textMuted, fontWeight: isSelected ? '700' : '500' },
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              );
            })}

            <TouchableOpacity
              style={[styles.catChip, { backgroundColor: theme.cardAlt }]}
              onPress={() => setShowTagBar(!showTagBar)}
            >
              <Ionicons name="pricetag-outline" size={12} color={theme.textSecondary} />
              <Text style={[styles.catChipText, { color: theme.textSecondary }]}>
                {tags.length > 0 ? `${tags.length} Tags` : '+ Tags'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Tags input strip if toggled */}
        {showTagBar && (
          <View style={[styles.tagBar, { backgroundColor: theme.cardAlt, borderBottomColor: theme.divider }]}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tagsContainer}>
              {tags.map((t) => (
                <View key={t} style={[styles.tagBadge, { backgroundColor: theme.card }]}>
                  <Text style={[styles.tagBadgeText, { color: theme.text }]}>#{t}</Text>
                  <TouchableOpacity onPress={() => handleRemoveTag(t)}>
                    <Ionicons name="close" size={12} color={theme.textTertiary} />
                  </TouchableOpacity>
                </View>
              ))}
              <View style={styles.addTagInputWrap}>
                <TextInput
                  style={[styles.addTagInput, { color: theme.text }]}
                  placeholder="Add tag..."
                  placeholderTextColor={theme.textTertiary}
                  value={tagInput}
                  onChangeText={setTagInput}
                  onSubmitEditing={handleAddTag}
                  returnKeyType="done"
                />
              </View>
            </ScrollView>
          </View>
        )}

        {/* Main Note Canvas */}
        <ScrollView style={styles.editorBody} contentContainerStyle={styles.editorScroll} showsVerticalScrollIndicator={false}>
          <TextInput
            style={[styles.noteTitleInput, { color: theme.text }]}
            placeholder="Note Title"
            placeholderTextColor={theme.textTertiary}
            value={title}
            onChangeText={setTitle}
            multiline
          />

          <TextInput
            ref={textInputRef}
            style={[styles.noteContentInput, { color: theme.text }]}
            placeholder="Type your note, markdown, thoughts, or ideas here..."
            placeholderTextColor={theme.textTertiary}
            value={content}
            onChangeText={handleContentChange}
            multiline
            textAlignVertical="top"
          />
        </ScrollView>

        {/* Rich Formatting & AI Toolbar Bottom Bar */}
        <View style={[styles.toolbarContainer, { backgroundColor: theme.card, borderTopColor: theme.divider }]}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.toolbarScroll}>
            {/* AI Assistant Button */}
            <TouchableOpacity
              style={[styles.aiBtn, { backgroundColor: theme.primarySoft, borderColor: theme.primary }]}
              onPress={() => setShowAiSheet(true)}
            >
              <Ionicons name="sparkles" size={16} color={theme.primary} />
              <Text style={[styles.aiBtnText, { color: theme.primary }]}>Ask AI</Text>
            </TouchableOpacity>

            <View style={[styles.toolbarDivider, { backgroundColor: theme.divider }]} />

            {/* Markdown Formatting Tools */}
            <TouchableOpacity style={styles.toolIconBtn} onPress={() => handleInsertFormat('**Bold text**')}>
              <Ionicons name="text" size={17} color={theme.text} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.toolIconBtn} onPress={() => handleInsertFormat('# Heading 1')}>
              <Text style={[styles.hToolText, { color: theme.text }]}>H1</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.toolIconBtn} onPress={() => handleInsertFormat('## Heading 2')}>
              <Text style={[styles.hToolText, { color: theme.text }]}>H2</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.toolIconBtn} onPress={() => handleInsertFormat('- [ ] Checklist item')}>
              <Ionicons name="checkbox-outline" size={18} color={theme.text} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.toolIconBtn} onPress={() => handleInsertFormat('• Bullet point')}>
              <Ionicons name="list" size={18} color={theme.text} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.toolIconBtn} onPress={() => handleInsertFormat('1. Numbered item')}>
              <Ionicons name="reorder-four" size={18} color={theme.text} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.toolIconBtn} onPress={() => handleInsertFormat('==Highlighted text==')}>
              <Ionicons name="brush-outline" size={17} color={theme.text} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.toolIconBtn} onPress={() => handleInsertFormat('[Link title](https://example.com)')}>
              <Ionicons name="link-outline" size={18} color={theme.text} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.toolIconBtn, isVoiceSimulating && { backgroundColor: theme.errorSoft }]}
              onPress={handleVoiceInputSimulate}
            >
              <Ionicons name="mic-outline" size={18} color={isVoiceSimulating ? theme.error : theme.primary} />
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* AI Action Sheet Modal */}
        <AIToolbar
          visible={showAiSheet}
          onClose={() => setShowAiSheet(false)}
          onSelectAction={handleAiAction}
        />
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1,
  },
  backBtn: {
    padding: SPACING.xs,
  },
  topStatusContainer: {
    alignItems: 'center',
  },
  saveStatus: {
    fontSize: 12,
    ...FONTS.medium,
  },
  topRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  iconBtn: {
    padding: SPACING.xs,
  },
  saveBtn: {
    width: 34,
    height: 34,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    gap: 8,
  },
  aiBannerText: {
    fontSize: 12,
    ...FONTS.medium,
  },
  categoryBar: {
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  categoryScroll: {
    paddingHorizontal: SPACING.base,
    gap: 8,
  },
  catChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: RADIUS.full,
    borderWidth: 1,
  },
  catChipText: {
    fontSize: 12,
  },
  tagBar: {
    paddingVertical: 6,
    paddingHorizontal: SPACING.base,
    borderBottomWidth: 1,
  },
  tagsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tagBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.xs,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  tagBadgeText: {
    fontSize: 11,
    ...FONTS.medium,
  },
  addTagInputWrap: {
    minWidth: 80,
  },
  addTagInput: {
    fontSize: 12,
    paddingVertical: 2,
    paddingHorizontal: 4,
  },
  editorBody: {
    flex: 1,
  },
  editorScroll: {
    padding: SPACING.base,
    paddingBottom: 60,
  },
  noteTitleInput: {
    fontSize: 22,
    ...FONTS.bold,
    marginBottom: SPACING.md,
    letterSpacing: -0.4,
  },
  noteContentInput: {
    fontSize: 15,
    ...FONTS.regular,
    lineHeight: 24,
    minHeight: 300,
  },
  toolbarContainer: {
    borderTopWidth: 1,
    paddingVertical: 6,
    ...SHADOWS.soft,
  },
  toolbarScroll: {
    paddingHorizontal: SPACING.base,
    alignItems: 'center',
    gap: 6,
  },
  aiBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: RADIUS.md,
    borderWidth: 1,
  },
  aiBtnText: {
    fontSize: 12,
    ...FONTS.bold,
  },
  toolbarDivider: {
    width: 1,
    height: 20,
    marginHorizontal: 4,
  },
  toolIconBtn: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hToolText: {
    fontSize: 13,
    ...FONTS.bold,
  },
});
