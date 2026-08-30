import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useApp } from '../../context/AppContext';
import { SPACING, RADIUS, FONTS, SHADOWS } from '../../constants/theme';

interface QuickActionFABProps {
  onNewTask: () => void;
  onNewNote: () => void;
  onNewChecklist?: () => void;
  onPlanDay?: () => void;
}

export const QuickActionFAB: React.FC<QuickActionFABProps> = ({
  onNewTask,
  onNewNote,
  onNewChecklist,
  onPlanDay,
}) => {
  const { theme } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  const handleAction = (cb?: () => void) => {
    setIsOpen(false);
    if (cb) setTimeout(cb, 150);
  };

  return (
    <>
      <TouchableOpacity
        style={[
          styles.fab,
          {
            backgroundColor: theme.primary,
            ...SHADOWS.float,
          },
        ]}
        onPress={() => setIsOpen(true)}
        activeOpacity={0.85}
      >
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableWithoutFeedback onPress={() => setIsOpen(false)}>
          <View style={[styles.modalOverlay, { backgroundColor: theme.modalOverlay }]}>
            <TouchableWithoutFeedback>
              <View style={[styles.menuSheet, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
                <View style={styles.sheetHeader}>
                  <Text style={[styles.sheetTitle, { color: theme.text }]}>Quick Actions</Text>
                  <TouchableOpacity onPress={() => setIsOpen(false)} style={styles.closeBtn}>
                    <Ionicons name="close" size={20} color={theme.textSecondary} />
                  </TouchableOpacity>
                </View>

                <View style={styles.actionsGrid}>
                  <TouchableOpacity
                    style={[styles.actionItem, { backgroundColor: theme.primarySoft }]}
                    onPress={() => handleAction(onNewTask)}
                    activeOpacity={0.75}
                  >
                    <View style={[styles.actionIcon, { backgroundColor: theme.primary }]}>
                      <Ionicons name="checkbox-outline" size={20} color="#FFFFFF" />
                    </View>
                    <Text style={[styles.actionLabel, { color: theme.text }]}>New Task</Text>
                    <Text style={[styles.actionDesc, { color: theme.textSecondary }]}>Add to-do with due date</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.actionItem, { backgroundColor: theme.secondarySoft }]}
                    onPress={() => handleAction(onNewNote)}
                    activeOpacity={0.75}
                  >
                    <View style={[styles.actionIcon, { backgroundColor: theme.secondary }]}>
                      <Ionicons name="document-text-outline" size={20} color="#FFFFFF" />
                    </View>
                    <Text style={[styles.actionLabel, { color: theme.text }]}>New Note</Text>
                    <Text style={[styles.actionDesc, { color: theme.textSecondary }]}>Capture ideas & markdown</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.actionItem, { backgroundColor: '#ECFDF5' }]}
                    onPress={() => handleAction(onNewChecklist || onNewTask)}
                    activeOpacity={0.75}
                  >
                    <View style={[styles.actionIcon, { backgroundColor: '#10B981' }]}>
                      <Ionicons name="list-outline" size={20} color="#FFFFFF" />
                    </View>
                    <Text style={[styles.actionLabel, { color: theme.text }]}>Checklist</Text>
                    <Text style={[styles.actionDesc, { color: theme.textSecondary }]}>Quick bullet checklist</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.actionItem, { backgroundColor: '#FFFBEB' }]}
                    onPress={() => handleAction(onPlanDay)}
                    activeOpacity={0.75}
                  >
                    <View style={[styles.actionIcon, { backgroundColor: '#F59E0B' }]}>
                      <Ionicons name="sparkles" size={20} color="#FFFFFF" />
                    </View>
                    <Text style={[styles.actionLabel, { color: theme.text }]}>Plan My Day</Text>
                    <Text style={[styles.actionDesc, { color: theme.textSecondary }]}>AI Smart Schedule</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 99,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: SPACING.base,
  },
  menuSheet: {
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    ...SHADOWS.modal,
    marginBottom: SPACING.md,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  sheetTitle: {
    fontSize: 18,
    ...FONTS.bold,
  },
  closeBtn: {
    padding: 4,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
    justifyContent: 'space-between',
  },
  actionItem: {
    width: '47.5%',
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
  },
  actionIcon: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xs + 2,
  },
  actionLabel: {
    fontSize: 14,
    ...FONTS.bold,
    marginBottom: 2,
  },
  actionDesc: {
    fontSize: 11,
    ...FONTS.regular,
  },
});
