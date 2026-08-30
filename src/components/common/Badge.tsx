import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Priority, TaskCategory, NoteCategory } from '../../types';
import { CATEGORY_COLORS, RADIUS, FONTS, SPACING } from '../../constants/theme';
import { useApp } from '../../context/AppContext';

interface BadgeProps {
  label: string;
  type?: 'priority' | 'category' | 'status' | 'custom';
  priority?: Priority;
  category?: TaskCategory | NoteCategory | string;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  type = 'custom',
  priority,
  category,
  size = 'md',
}) => {
  const { theme } = useApp();

  let bg = theme.primarySoft;
  let text = theme.primary;
  let dotColor = theme.primary;

  if (type === 'priority' || priority) {
    const p = priority || (label.toLowerCase() as Priority);
    if (p === 'high') {
      bg = theme.errorSoft;
      text = theme.error;
      dotColor = theme.error;
    } else if (p === 'medium') {
      bg = theme.warningSoft;
      text = theme.warning;
      dotColor = theme.warning;
    } else {
      bg = theme.successSoft;
      text = theme.success;
      dotColor = theme.success;
    }
  } else if (category && CATEGORY_COLORS[category]) {
    const c = CATEGORY_COLORS[category];
    bg = c.bg;
    text = c.text;
    dotColor = c.dot;
  }

  const isSmall = size === 'sm';

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: bg,
          paddingVertical: isSmall ? 2 : 4,
          paddingHorizontal: isSmall ? 6 : 8,
        },
      ]}
    >
      <View style={[styles.dot, { backgroundColor: dotColor, width: isSmall ? 5 : 6, height: isSmall ? 5 : 6 }]} />
      <Text
        style={[
          styles.text,
          {
            color: text,
            fontSize: isSmall ? 11 : 12,
          },
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: RADIUS.full,
    alignSelf: 'flex-start',
  },
  dot: {
    borderRadius: 99,
    marginRight: SPACING.xs,
  },
  text: {
    ...FONTS.medium,
  },
});
