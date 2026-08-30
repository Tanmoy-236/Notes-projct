import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ChatMessage } from '../../types';
import { useApp } from '../../context/AppContext';
import { SPACING, RADIUS, FONTS, SHADOWS } from '../../constants/theme';

interface ChatBubbleProps {
  message: ChatMessage;
  onActionPress?: (actionType: string, payload: any) => void;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message, onActionPress }) => {
  const { theme } = useApp();
  const isUser = message.sender === 'user';

  // Render text with basic markdown bold parsing
  const renderFormattedText = (rawText: string) => {
    return rawText.split('\n').map((line, lineIdx) => {
      return (
        <Text
          key={lineIdx}
          style={[
            styles.textLine,
            {
              color: isUser ? '#FFFFFF' : theme.text,
              marginBottom: line.trim() === '' ? 6 : 2,
            },
          ]}
        >
          {line}
        </Text>
      );
    });
  };

  return (
    <View style={[styles.container, isUser ? styles.userContainer : styles.aiContainer]}>
      {!isUser && (
        <View style={[styles.avatarBox, { backgroundColor: theme.primarySoft }]}>
          <Ionicons name="sparkles" size={16} color={theme.primary} />
        </View>
      )}

      <View
        style={[
          styles.bubble,
          isUser
            ? [styles.userBubble, { backgroundColor: theme.primary }]
            : [styles.aiBubble, { backgroundColor: theme.card, borderColor: theme.cardBorder }, SHADOWS.soft],
        ]}
      >
        <View style={styles.textContainer}>{renderFormattedText(message.text)}</View>

        {/* Action button if AI performed an action */}
        {message.actionType && (
          <View style={[styles.actionCard, { backgroundColor: theme.cardAlt, borderColor: theme.cardBorder }]}>
            <View style={styles.actionHeader}>
              <Ionicons
                name={message.actionType === 'task_created' ? 'checkmark-circle' : 'sparkles'}
                size={16}
                color={theme.success}
              />
              <Text style={[styles.actionCardTitle, { color: theme.text }]}>
                {message.actionType === 'task_created' ? 'Task Added to Your List' : 'AI Action Completed'}
              </Text>
            </View>
          </View>
        )}

        <View style={styles.footerRow}>
          <Text style={[styles.timeText, { color: isUser ? 'rgba(255,255,255,0.7)' : theme.textTertiary }]}>
            {message.timestamp}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: 6,
    paddingHorizontal: SPACING.base,
  },
  userContainer: {
    justifyContent: 'flex-end',
  },
  aiContainer: {
    justifyContent: 'flex-start',
    gap: SPACING.xs + 2,
  },
  avatarBox: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  bubble: {
    maxWidth: '82%',
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
  },
  userBubble: {
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    borderTopLeftRadius: 4,
    borderWidth: 1,
  },
  textContainer: {
    gap: 2,
  },
  textLine: {
    fontSize: 14,
    ...FONTS.regular,
    lineHeight: 20,
  },
  actionCard: {
    marginTop: SPACING.sm,
    padding: SPACING.sm,
    borderRadius: RADIUS.md,
    borderWidth: 1,
  },
  actionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionCardTitle: {
    fontSize: 12,
    ...FONTS.bold,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  timeText: {
    fontSize: 10,
    ...FONTS.regular,
  },
});
