import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useApp } from '../../context/AppContext';
import { SPACING, RADIUS, FONTS } from '../../constants/theme';

interface SuggestedPromptChipsProps {
  onSelectPrompt: (prompt: string) => void;
}

const PROMPTS = [
  { text: 'Plan my day based on my priorities', icon: 'calendar-outline' as const },
  { text: 'Summarize all my recent notes', icon: 'document-text-outline' as const },
  { text: 'What are my highest priority tasks?', icon: 'flame-outline' as const },
  { text: 'Brainstorm ideas for my project', icon: 'bulb-outline' as const },
  { text: 'Add task Review Weekly Budget', icon: 'add-circle-outline' as const },
];

export const SuggestedPromptChips: React.FC<SuggestedPromptChipsProps> = ({ onSelectPrompt }) => {
  const { theme } = useApp();

  return (
    <View style={styles.container}>
      <Text style={[styles.headerLabel, { color: theme.textSecondary }]}>Suggested Prompts</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {PROMPTS.map((p, idx) => (
          <TouchableOpacity
            key={idx}
            style={[
              styles.chip,
              {
                backgroundColor: theme.card,
                borderColor: theme.cardBorder,
              },
            ]}
            onPress={() => onSelectPrompt(p.text)}
            activeOpacity={0.7}
          >
            <Ionicons name={p.icon} size={14} color={theme.primary} />
            <Text style={[styles.chipText, { color: theme.text }]}>{p.text}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: SPACING.xs,
  },
  headerLabel: {
    fontSize: 11,
    ...FONTS.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: SPACING.base,
    marginBottom: SPACING.xs,
  },
  scrollContent: {
    paddingHorizontal: SPACING.base,
    gap: SPACING.xs + 2,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: RADIUS.full,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 12,
    ...FONTS.medium,
  },
});
