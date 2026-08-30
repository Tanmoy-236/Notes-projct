import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, TouchableWithoutFeedback, ScrollView } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useApp } from '../../context/AppContext';
import { SPACING, RADIUS, FONTS, SHADOWS } from '../../constants/theme';

export type AIToolAction =
  | 'summarize'
  | 'improve'
  | 'grammar'
  | 'ideas'
  | 'tasks'
  | 'explain'
  | 'continue';

interface AIToolbarProps {
  visible: boolean;
  onClose: () => void;
  onSelectAction: (action: AIToolAction) => void;
}

interface ActionOption {
  id: AIToolAction;
  title: string;
  desc: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

const AI_OPTIONS: ActionOption[] = [
  {
    id: 'summarize',
    title: 'Summarize Note',
    desc: 'Generate a structured executive bullet summary',
    icon: 'sparkles',
    color: '#8B5CF6',
  },
  {
    id: 'tasks',
    title: 'Create Tasks from Note',
    desc: 'Extract actionable items and add them to your To-Do list',
    icon: 'checkbox-outline',
    color: '#10B981',
  },
  {
    id: 'improve',
    title: 'Improve Writing',
    desc: 'Enhance vocabulary, flow, and clarity',
    icon: 'color-wand-outline',
    color: '#4F46E5',
  },
  {
    id: 'grammar',
    title: 'Fix Grammar & Spelling',
    desc: 'Clean up typos, punctuation, and wording errors',
    icon: 'checkmark-done-circle-outline',
    color: '#06B6D4',
  },
  {
    id: 'ideas',
    title: 'Generate Ideas',
    desc: 'Brainstorm creative follow-ups and extensions',
    icon: 'bulb-outline',
    color: '#F59E0B',
  },
  {
    id: 'continue',
    title: 'Continue Writing',
    desc: 'Let AI draft the next logical paragraph',
    icon: 'arrow-forward-circle-outline',
    color: '#EC4899',
  },
  {
    id: 'explain',
    title: 'Explain & Clarify',
    desc: 'Break down complex thoughts into simple takeaways',
    icon: 'help-circle-outline',
    color: '#3B82F6',
  },
];

export const AIToolbar: React.FC<AIToolbarProps> = ({ visible, onClose, onSelectAction }) => {
  const { theme } = useApp();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={[styles.overlay, { backgroundColor: theme.modalOverlay }]}>
          <TouchableWithoutFeedback>
            <View style={[styles.modalCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
              {/* Header */}
              <View style={styles.header}>
                <View style={styles.titleRow}>
                  <View style={[styles.sparkleIconBox, { backgroundColor: theme.primarySoft }]}>
                    <Ionicons name="sparkles" size={18} color={theme.primary} />
                  </View>
                  <View>
                    <Text style={[styles.title, { color: theme.text }]}>LifeFlow AI Assistant</Text>
                    <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                      Transform and supercharge this note
                    </Text>
                  </View>
                </View>
                <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                  <Ionicons name="close" size={20} color={theme.textSecondary} />
                </TouchableOpacity>
              </View>

              {/* Options List */}
              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
                {AI_OPTIONS.map((opt) => (
                  <TouchableOpacity
                    key={opt.id}
                    style={[styles.actionRow, { borderColor: theme.cardBorder, backgroundColor: theme.cardAlt }]}
                    onPress={() => {
                      onClose();
                      onSelectAction(opt.id);
                    }}
                    activeOpacity={0.75}
                  >
                    <View style={[styles.actionIconBox, { backgroundColor: `${opt.color}15` }]}>
                      <Ionicons name={opt.icon} size={20} color={opt.color} />
                    </View>
                    <View style={styles.actionInfo}>
                      <Text style={[styles.actionTitle, { color: theme.text }]}>{opt.title}</Text>
                      <Text style={[styles.actionDesc, { color: theme.textSecondary }]}>{opt.desc}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={16} color={theme.textTertiary} />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: SPACING.base,
  },
  modalCard: {
    borderRadius: RADIUS.xl,
    padding: SPACING.base,
    maxHeight: '80%',
    borderWidth: 1,
    ...SHADOWS.modal,
    marginBottom: SPACING.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F030',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  sparkleIconBox: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    ...FONTS.bold,
  },
  subtitle: {
    fontSize: 12,
    ...FONTS.regular,
  },
  closeBtn: {
    padding: SPACING.xs,
  },
  list: {
    paddingVertical: SPACING.sm,
    gap: SPACING.sm,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    gap: SPACING.md,
  },
  actionIconBox: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionInfo: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 14,
    ...FONTS.bold,
    marginBottom: 2,
  },
  actionDesc: {
    fontSize: 11,
    ...FONTS.regular,
    lineHeight: 15,
  },
});
