import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useApp } from '../context/AppContext';
import { SPACING, RADIUS, FONTS, SHADOWS } from '../constants/theme';
import { ChatBubble } from '../components/ai/ChatBubble';
import { SuggestedPromptChips } from '../components/ai/SuggestedPromptChips';

export const AIAssistantScreen: React.FC<{ onNavigateToTasks?: () => void }> = ({ onNavigateToTasks }) => {
  const { theme, chatMessages, sendChatMessage, clearChat, isAiLoading, tasks, notes } = useApp();
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    // Auto-scroll to bottom on new message
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 150);
  }, [chatMessages, isAiLoading]);

  const handleSend = async (textToSend?: string) => {
    const message = (textToSend || inputText).trim();
    if (!message || isAiLoading) return;

    setInputText('');
    await sendChatMessage(message);
  };

  const handleVoiceSimulate = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      setInputText('Plan my schedule for this afternoon and tell me my top 2 priorities.');
    }, 1400);
  };

  const handleAttachContext = () => {
    Alert.alert(
      'Attach Context to AI',
      `LifeFlow AI is already connected to your workspace:\n• ${tasks.filter((t) => !t.completed).length} Pending Tasks\n• ${notes.length} Notes in Vault\n\nAI automatically factors in your current tasks and notes when answering!`,
      [{ text: 'Got it' }]
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <View style={[styles.header, { backgroundColor: theme.background, borderBottomColor: theme.divider }]}>
          <View style={styles.headerLeft}>
            <View style={[styles.aiIconBadge, { backgroundColor: theme.primarySoft }]}>
              <Ionicons name="sparkles" size={18} color={theme.primary} />
            </View>
            <View>
              <Text style={[styles.headerTitle, { color: theme.text }]}>LifeFlow AI</Text>
              <View style={styles.statusRow}>
                <View style={[styles.onlineDot, { backgroundColor: theme.success }]} />
                <Text style={[styles.statusText, { color: theme.textSecondary }]}>
                  AI Assistant • Online & Ready
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.clearBtn, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
            onPress={clearChat}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="refresh-outline" size={18} color={theme.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Chat Message Stream */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.chatScroll}
          contentContainerStyle={styles.chatContent}
          showsVerticalScrollIndicator={false}
        >
          {chatMessages.map((msg) => (
            <ChatBubble key={msg.id} message={msg} />
          ))}

          {/* AI Thinking Animation */}
          {isAiLoading && (
            <View style={[styles.thinkingBubble, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
              <ActivityIndicator size="small" color={theme.primary} />
              <Text style={[styles.thinkingText, { color: theme.textSecondary }]}>
                LifeFlow AI is generating insights...
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Suggested Prompts Carousel */}
        <SuggestedPromptChips onSelectPrompt={(p) => handleSend(p)} />

        {/* Bottom Chat Input Bar */}
        <View style={[styles.inputBar, { backgroundColor: theme.card, borderTopColor: theme.divider }]}>
          <TouchableOpacity
            style={[styles.attachBtn, { backgroundColor: theme.cardAlt }]}
            onPress={handleAttachContext}
          >
            <Ionicons name="attach-outline" size={20} color={theme.textSecondary} />
          </TouchableOpacity>

          <TextInput
            style={[styles.input, { color: theme.text, backgroundColor: theme.cardAlt }]}
            placeholder={isRecording ? 'Listening...' : 'Ask AI to plan, summarize, or add tasks...'}
            placeholderTextColor={theme.textTertiary}
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={() => handleSend()}
            returnKeyType="send"
            multiline
          />

          <TouchableOpacity
            style={[
              styles.voiceBtn,
              {
                backgroundColor: isRecording ? theme.errorSoft : theme.cardAlt,
              },
            ]}
            onPress={handleVoiceSimulate}
          >
            <Ionicons
              name={isRecording ? 'radio-button-on' : 'mic-outline'}
              size={19}
              color={isRecording ? theme.error : theme.primary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.sendBtn,
              {
                backgroundColor: inputText.trim() ? theme.primary : theme.cardAlt,
              },
            ]}
            onPress={() => handleSend()}
            disabled={!inputText.trim() || isAiLoading}
          >
            <Ionicons
              name="arrow-up"
              size={18}
              color={inputText.trim() ? '#FFFFFF' : theme.textTertiary}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.base,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  aiIconBadge: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    ...FONTS.bold,
    letterSpacing: -0.3,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 1,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 11,
    ...FONTS.medium,
  },
  clearBtn: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatScroll: {
    flex: 1,
  },
  chatContent: {
    paddingVertical: SPACING.md,
    gap: SPACING.xs,
  },
  thinkingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.lg,
    alignSelf: 'flex-start',
    marginLeft: SPACING.base,
    marginVertical: 4,
    borderWidth: 1,
  },
  thinkingText: {
    fontSize: 12,
    ...FONTS.medium,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.sm,
    borderTopWidth: 1,
    gap: SPACING.xs + 2,
  },
  attachBtn: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    minHeight: 38,
    maxHeight: 100,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: 8,
    fontSize: 14,
  },
  voiceBtn: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtn: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
