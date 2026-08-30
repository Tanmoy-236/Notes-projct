import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TouchableWithoutFeedback } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Note } from '../../types';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';
import { SPACING, RADIUS, FONTS, SHADOWS } from '../../constants/theme';
import { formatDate } from '../../utils/dateUtils';

interface NoteCardProps {
  note: Note;
  onPress: () => void;
  onEdit?: () => void;
  isGridView?: boolean;
  onAiSummarize?: () => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({
  note,
  onPress,
  onEdit,
  isGridView = false,
  onAiSummarize,
}) => {
  const { theme, togglePinNote, toggleFavoriteNote, deleteNote, addNote } = useApp();
  const [showMenu, setShowMenu] = useState(false);

  const cleanPreview = note.content
    ? note.content
        .replace(/[#*`_~\[\]\(\)>-]/g, '')
        .replace(/\n+/g, ' ')
        .trim()
    : 'No content';

  const handleDuplicate = () => {
    setShowMenu(false);
    addNote({
      title: `${note.title} (Copy)`,
      content: note.content,
      category: note.category,
      tags: [...note.tags],
      pinned: false,
      favorite: false,
      summary: note.summary,
    });
  };

  const handleDelete = () => {
    setShowMenu(false);
    deleteNote(note.id);
  };

  return (
    <>
      <TouchableOpacity
        style={[
          styles.card,
          isGridView ? styles.gridCard : styles.listCard,
          {
            backgroundColor: theme.card,
            borderColor: note.pinned ? theme.primary : theme.cardBorder,
            borderWidth: note.pinned ? 1.5 : 1,
          },
          SHADOWS.soft,
        ]}
        onPress={onPress}
        activeOpacity={0.82}
      >
        {/* Top meta row */}
        <View style={styles.topRow}>
          <Badge label={note.category} category={note.category} size="sm" />
          <View style={styles.iconsRow}>
            {note.pinned && (
              <Ionicons name="pin" size={13} color={theme.primary} style={styles.pinIcon} />
            )}
            <TouchableOpacity
              onPress={() => toggleFavoriteNote(note.id)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons
                name={note.favorite ? 'heart' : 'heart-outline'}
                size={16}
                color={note.favorite ? '#EF4444' : theme.textTertiary}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setShowMenu(true)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              style={styles.moreBtn}
            >
              <Ionicons name="ellipsis-vertical" size={14} color={theme.textTertiary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Title */}
        <Text style={[styles.title, { color: theme.text }]} numberOfLines={isGridView ? 2 : 1}>
          {note.title || 'Untitled Note'}
        </Text>

        {/* Content Preview */}
        <Text
          style={[styles.preview, { color: theme.textSecondary }]}
          numberOfLines={isGridView ? 4 : 2}
        >
          {cleanPreview}
        </Text>

        {/* AI Summary badge if available */}
        {note.summary && !isGridView && (
          <View style={[styles.summaryBadge, { backgroundColor: theme.primarySoft }]}>
            <Ionicons name="sparkles" size={11} color={theme.primary} />
            <Text style={[styles.summaryText, { color: theme.primary }]} numberOfLines={1}>
              {note.summary}
            </Text>
          </View>
        )}

        {/* Bottom tags & date row */}
        <View style={styles.bottomRow}>
          <Text style={[styles.dateText, { color: theme.textTertiary }]}>
            {formatDate(note.updatedAt || note.createdAt)}
          </Text>

          {note.tags && note.tags.length > 0 && (
            <View style={styles.tagWrap}>
              {note.tags.slice(0, isGridView ? 1 : 2).map((t) => (
                <Text key={t} style={[styles.tagPill, { color: theme.textSecondary, backgroundColor: theme.cardAlt }]}>
                  #{t}
                </Text>
              ))}
            </View>
          )}
        </View>
      </TouchableOpacity>

      {/* 3-dots Context Modal */}
      <Modal visible={showMenu} transparent animationType="fade" onRequestClose={() => setShowMenu(false)}>
        <TouchableWithoutFeedback onPress={() => setShowMenu(false)}>
          <View style={[styles.menuOverlay, { backgroundColor: theme.modalOverlay }]}>
            <TouchableWithoutFeedback>
              <View style={[styles.menuPopup, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
                <Text style={[styles.menuTitle, { color: theme.text }]} numberOfLines={1}>
                  {note.title}
                </Text>

                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    togglePinNote(note.id);
                    setShowMenu(false);
                  }}
                >
                  <Ionicons name={note.pinned ? 'pin-outline' : 'pin'} size={18} color={theme.text} />
                  <Text style={[styles.menuItemText, { color: theme.text }]}>
                    {note.pinned ? 'Unpin from Top' : 'Pin to Top'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    toggleFavoriteNote(note.id);
                    setShowMenu(false);
                  }}
                >
                  <Ionicons name={note.favorite ? 'heart-dislike-outline' : 'heart-outline'} size={18} color={theme.text} />
                  <Text style={[styles.menuItemText, { color: theme.text }]}>
                    {note.favorite ? 'Remove Favorite' : 'Mark Favorite'}
                  </Text>
                </TouchableOpacity>

                {onAiSummarize && (
                  <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => {
                      setShowMenu(false);
                      onAiSummarize();
                    }}
                  >
                    <Ionicons name="sparkles-outline" size={18} color={theme.primary} />
                    <Text style={[styles.menuItemText, { color: theme.primary }]}>AI Summarize Note</Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity style={styles.menuItem} onPress={handleDuplicate}>
                  <Ionicons name="copy-outline" size={18} color={theme.text} />
                  <Text style={[styles.menuItemText, { color: theme.text }]}>Duplicate Note</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem} onPress={handleDelete}>
                  <Ionicons name="trash-outline" size={18} color={theme.error} />
                  <Text style={[styles.menuItemText, { color: theme.error }]}>Delete Note</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginVertical: 5,
  },
  listCard: {
    width: '100%',
  },
  gridCard: {
    flex: 1,
    minHeight: 160,
    marginHorizontal: 4,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  iconsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pinIcon: {
    marginRight: 2,
  },
  moreBtn: {
    padding: 2,
  },
  title: {
    fontSize: 15,
    ...FONTS.bold,
    lineHeight: 20,
    marginBottom: 4,
  },
  preview: {
    fontSize: 12,
    ...FONTS.regular,
    lineHeight: 17,
    marginBottom: SPACING.xs,
  },
  summaryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.xs,
    marginBottom: SPACING.xs,
  },
  summaryText: {
    fontSize: 11,
    ...FONTS.medium,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  dateText: {
    fontSize: 11,
    ...FONTS.medium,
  },
  tagWrap: {
    flexDirection: 'row',
    gap: 4,
  },
  tagPill: {
    fontSize: 10,
    ...FONTS.medium,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.xs,
  },
  menuOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  menuPopup: {
    width: '100%',
    maxWidth: 320,
    borderRadius: RADIUS.xl,
    padding: SPACING.base,
    borderWidth: 1,
    ...SHADOWS.modal,
  },
  menuTitle: {
    fontSize: 15,
    ...FONTS.bold,
    marginBottom: SPACING.md,
    paddingBottom: SPACING.xs,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F030',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: SPACING.md,
  },
  menuItemText: {
    fontSize: 14,
    ...FONTS.medium,
  },
});
