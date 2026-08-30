import React from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, FlatList, TouchableWithoutFeedback } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useApp } from '../../context/AppContext';
import { SPACING, RADIUS, FONTS, SHADOWS } from '../../constants/theme';
import { NotificationItem } from '../../types';

interface NotificationModalProps {
  visible: boolean;
  onClose: () => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({ visible, onClose }) => {
  const { theme, notifications, markNotificationRead, clearNotifications } = useApp();

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'streak':
        return { name: 'flame', color: '#EF4444' };
      case 'reminder':
        return { name: 'alarm-outline', color: '#F59E0B' };
      case 'ai':
        return { name: 'sparkles', color: '#8B5CF6' };
      case 'task':
      default:
        return { name: 'checkmark-circle-outline', color: '#10B981' };
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={[styles.overlay, { backgroundColor: theme.modalOverlay }]}>
          <TouchableWithoutFeedback>
            <View style={[styles.content, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
              <View style={styles.header}>
                <View style={styles.titleRow}>
                  <Ionicons name="notifications" size={20} color={theme.primary} />
                  <Text style={[styles.title, { color: theme.text }]}>Notifications</Text>
                </View>
                <View style={styles.headerActions}>
                  {notifications.length > 0 && (
                    <TouchableOpacity onPress={clearNotifications} style={styles.clearBtn}>
                      <Text style={[styles.clearText, { color: theme.textSecondary }]}>Clear all</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                    <Ionicons name="close" size={20} color={theme.text} />
                  </TouchableOpacity>
                </View>
              </View>

              {notifications.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Ionicons name="notifications-off-outline" size={40} color={theme.textTertiary} />
                  <Text style={[styles.emptyText, { color: theme.textSecondary }]}>No new notifications</Text>
                </View>
              ) : (
                <FlatList
                  data={notifications}
                  keyExtractor={(item) => item.id}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.listContent}
                  renderItem={({ item }) => {
                    const iconInfo = getIcon(item.type);
                    return (
                      <TouchableOpacity
                        style={[
                          styles.notifItem,
                          {
                            backgroundColor: item.read ? 'transparent' : theme.primarySoft,
                            borderColor: theme.cardBorder,
                          },
                        ]}
                        onPress={() => markNotificationRead(item.id)}
                        activeOpacity={0.7}
                      >
                        <View style={[styles.iconBox, { backgroundColor: `${iconInfo.color}18` }]}>
                          <Ionicons name={iconInfo.name as any} size={20} color={iconInfo.color} />
                        </View>
                        <View style={styles.notifBody}>
                          <View style={styles.notifTop}>
                            <Text style={[styles.notifTitle, { color: theme.text }]}>{item.title}</Text>
                            <Text style={[styles.notifTime, { color: theme.textTertiary }]}>{item.time}</Text>
                          </View>
                          <Text style={[styles.notifMsg, { color: theme.textSecondary }]} numberOfLines={2}>
                            {item.message}
                          </Text>
                        </View>
                        {!item.read && <View style={[styles.unreadDot, { backgroundColor: theme.primary }]} />}
                      </TouchableOpacity>
                    );
                  }}
                />
              )}
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
    justifyContent: 'flex-start',
    paddingTop: 60,
    paddingHorizontal: SPACING.base,
  },
  content: {
    maxHeight: 480,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    padding: SPACING.base,
    ...SHADOWS.modal,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F020',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs + 2,
  },
  title: {
    fontSize: 17,
    ...FONTS.bold,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  clearBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  clearText: {
    fontSize: 12,
    ...FONTS.medium,
  },
  closeBtn: {
    padding: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xxl,
    gap: SPACING.xs,
  },
  emptyText: {
    fontSize: 13,
    ...FONTS.regular,
  },
  listContent: {
    paddingVertical: SPACING.xs,
  },
  notifItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    marginVertical: 4,
    borderWidth: 1,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  notifBody: {
    flex: 1,
  },
  notifTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  notifTitle: {
    fontSize: 13,
    ...FONTS.bold,
  },
  notifTime: {
    fontSize: 11,
    ...FONTS.regular,
  },
  notifMsg: {
    fontSize: 12,
    ...FONTS.regular,
    lineHeight: 16,
  },
  unreadDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginLeft: 6,
  },
});
