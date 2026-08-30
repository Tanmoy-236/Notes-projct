import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Switch,
  Alert,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useApp } from '../context/AppContext';
import { SPACING, RADIUS, FONTS, SHADOWS } from '../constants/theme';
import { Button } from '../components/common/Button';

export const ProfileScreen: React.FC<{ onReplayOnboarding: () => void }> = ({ onReplayOnboarding }) => {
  const {
    theme,
    isDarkMode,
    toggleTheme,
    userProfile,
    updateUserProfile,
    tasks,
    notes,
    resetToSampleData,
  } = useApp();

  const [notificationsOn, setNotificationsOn] = useState(userProfile.notificationsEnabled);
  const [soundOn, setSoundOn] = useState(userProfile.reminderSound);

  const completedTasksCount = tasks.filter((t) => t.completed).length;

  const handleToggleNotifications = (val: boolean) => {
    setNotificationsOn(val);
    updateUserProfile({ notificationsEnabled: val });
  };

  const handleToggleSound = (val: boolean) => {
    setSoundOn(val);
    updateUserProfile({ reminderSound: val });
  };

  const handleResetData = () => {
    Alert.alert(
      'Reset Sample Data',
      'This will reset your tasks, notes, and AI history to default sample data. Proceed?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            await resetToSampleData();
            Alert.alert('Reset Complete', 'Sample workspace has been reloaded.');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      {/* Top Header */}
      <View style={[styles.header, { backgroundColor: theme.background }]}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Profile & Settings</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* User Profile Card */}
        <View
          style={[
            styles.profileCard,
            { backgroundColor: theme.card, borderColor: theme.cardBorder },
            SHADOWS.card,
          ]}
        >
          <View style={styles.profileTop}>
            <View style={[styles.avatarWrap, { borderColor: theme.primary }]}>
              <Image source={{ uri: userProfile.avatarUrl }} style={styles.avatar} />
              <View style={[styles.proBadge, { backgroundColor: theme.primary }]}>
                <Ionicons name="sparkles" size={10} color="#FFFFFF" />
              </View>
            </View>

            <View style={styles.profileInfo}>
              <View style={styles.nameRow}>
                <Text style={[styles.userName, { color: theme.text }]}>{userProfile.name}</Text>
                <View style={[styles.planPill, { backgroundColor: theme.primarySoft }]}>
                  <Text style={[styles.planPillText, { color: theme.primary }]}>PRO</Text>
                </View>
              </View>
              <Text style={[styles.userEmail, { color: theme.textSecondary }]}>
                {userProfile.email}
              </Text>
            </View>
          </View>

          {/* Productivity Stats Grid */}
          <View style={[styles.statsGrid, { backgroundColor: theme.cardAlt }]}>
            <View style={styles.statCol}>
              <Text style={[styles.statNum, { color: theme.primary }]}>{notes.length}</Text>
              <Text style={[styles.statLbl, { color: theme.textSecondary }]}>Notes</Text>
            </View>

            <View style={[styles.statSep, { backgroundColor: theme.divider }]} />

            <View style={styles.statCol}>
              <Text style={[styles.statNum, { color: theme.success }]}>{completedTasksCount}</Text>
              <Text style={[styles.statLbl, { color: theme.textSecondary }]}>Completed</Text>
            </View>

            <View style={[styles.statSep, { backgroundColor: theme.divider }]} />

            <View style={styles.statCol}>
              <Text style={[styles.statNum, { color: '#EF4444' }]}>🔥 {userProfile.streakDays}</Text>
              <Text style={[styles.statLbl, { color: theme.textSecondary }]}>Day Streak</Text>
            </View>

            <View style={[styles.statSep, { backgroundColor: theme.divider }]} />

            <View style={styles.statCol}>
              <Text style={[styles.statNum, { color: theme.secondary }]}>
                {userProfile.aiRequestsUsed}
              </Text>
              <Text style={[styles.statLbl, { color: theme.textSecondary }]}>AI Queries</Text>
            </View>
          </View>
        </View>

        {/* Preferences Section */}
        <View style={styles.sectionBlock}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>APPEARANCE & PREFERENCES</Text>
          <View style={[styles.menuGroup, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
            {/* Dark Mode Toggle */}
            <View style={styles.menuRow}>
              <View style={styles.menuLeft}>
                <View style={[styles.iconBox, { backgroundColor: isDarkMode ? '#312E81' : '#EEF2FF' }]}>
                  <Ionicons
                    name={isDarkMode ? 'moon' : 'sunny'}
                    size={18}
                    color={isDarkMode ? '#A78BFA' : '#4F46E5'}
                  />
                </View>
                <View>
                  <Text style={[styles.menuLabel, { color: theme.text }]}>Dark Mode</Text>
                  <Text style={[styles.menuSub, { color: theme.textSecondary }]}>
                    {isDarkMode ? 'Dark theme active' : 'Light theme active'}
                  </Text>
                </View>
              </View>
              <Switch
                value={isDarkMode}
                onValueChange={toggleTheme}
                trackColor={{ false: '#CBD5E1', true: theme.primary }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={[styles.rowDivider, { backgroundColor: theme.divider }]} />

            {/* Notifications Toggle */}
            <View style={styles.menuRow}>
              <View style={styles.menuLeft}>
                <View style={[styles.iconBox, { backgroundColor: '#ECFDF5' }]}>
                  <Ionicons name="notifications-outline" size={18} color="#10B981" />
                </View>
                <View>
                  <Text style={[styles.menuLabel, { color: theme.text }]}>Task Reminders</Text>
                  <Text style={[styles.menuSub, { color: theme.textSecondary }]}>
                    Push notifications before due times
                  </Text>
                </View>
              </View>
              <Switch
                value={notificationsOn}
                onValueChange={handleToggleNotifications}
                trackColor={{ false: '#CBD5E1', true: '#10B981' }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={[styles.rowDivider, { backgroundColor: theme.divider }]} />

            {/* Sound Toggle */}
            <View style={styles.menuRow}>
              <View style={styles.menuLeft}>
                <View style={[styles.iconBox, { backgroundColor: '#FFFBEB' }]}>
                  <Ionicons name="volume-medium-outline" size={18} color="#F59E0B" />
                </View>
                <View>
                  <Text style={[styles.menuLabel, { color: theme.text }]}>Sound & Haptics</Text>
                  <Text style={[styles.menuSub, { color: theme.textSecondary }]}>
                    Tactile check-off feedback
                  </Text>
                </View>
              </View>
              <Switch
                value={soundOn}
                onValueChange={handleToggleSound}
                trackColor={{ false: '#CBD5E1', true: '#F59E0B' }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>
        </View>

        {/* AI & Product Features */}
        <View style={styles.sectionBlock}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>APPLICATION & WORKSPACE</Text>
          <View style={[styles.menuGroup, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
            <TouchableOpacity style={styles.menuRow} onPress={onReplayOnboarding}>
              <View style={styles.menuLeft}>
                <View style={[styles.iconBox, { backgroundColor: '#F5F3FF' }]}>
                  <Ionicons name="compass-outline" size={18} color="#8B5CF6" />
                </View>
                <View>
                  <Text style={[styles.menuLabel, { color: theme.text }]}>Replay Onboarding Tour</Text>
                  <Text style={[styles.menuSub, { color: theme.textSecondary }]}>
                    Review product guide & features
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color={theme.textTertiary} />
            </TouchableOpacity>

            <View style={[styles.rowDivider, { backgroundColor: theme.divider }]} />

            <TouchableOpacity
              style={styles.menuRow}
              onPress={() =>
                Alert.alert(
                  'AI Model Status',
                  'LifeFlow Ambient Neural Engine v2.4 is active with low-latency local summarization and task extraction pipelines.'
                )
              }
            >
              <View style={styles.menuLeft}>
                <View style={[styles.iconBox, { backgroundColor: theme.primarySoft }]}>
                  <Ionicons name="hardware-chip-outline" size={18} color={theme.primary} />
                </View>
                <View>
                  <Text style={[styles.menuLabel, { color: theme.text }]}>AI Engine Diagnostics</Text>
                  <Text style={[styles.menuSub, { color: theme.textSecondary }]}>
                    Model v2.4 • 99.8% precision
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color={theme.textTertiary} />
            </TouchableOpacity>

            <View style={[styles.rowDivider, { backgroundColor: theme.divider }]} />

            <TouchableOpacity style={styles.menuRow} onPress={handleResetData}>
              <View style={styles.menuLeft}>
                <View style={[styles.iconBox, { backgroundColor: theme.errorSoft }]}>
                  <Ionicons name="reload-outline" size={18} color={theme.error} />
                </View>
                <View>
                  <Text style={[styles.menuLabel, { color: theme.error }]}>Reset Sample Data</Text>
                  <Text style={[styles.menuSub, { color: theme.textSecondary }]}>
                    Restore demo notes & tasks
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color={theme.textTertiary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* App Info / Version */}
        <View style={styles.footerBlock}>
          <Text style={[styles.appName, { color: theme.text }]}>LifeFlow AI</Text>
          <Text style={[styles.versionText, { color: theme.textTertiary }]}>
            Version 2.4.0 • Built for Peak Productivity
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: SPACING.base,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.xs,
  },
  headerTitle: {
    fontSize: 24,
    ...FONTS.bold,
    letterSpacing: -0.4,
  },
  scrollContent: {
    paddingHorizontal: SPACING.base,
    paddingBottom: 90,
    gap: SPACING.lg,
  },
  profileCard: {
    borderRadius: RADIUS.xl,
    padding: SPACING.base,
    borderWidth: 1,
    gap: SPACING.md,
  },
  profileTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  avatarWrap: {
    position: 'relative',
    borderWidth: 2,
    borderRadius: 30,
    padding: 2,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
  },
  proBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  userName: {
    fontSize: 18,
    ...FONTS.bold,
  },
  planPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.xs,
  },
  planPillText: {
    fontSize: 10,
    ...FONTS.bold,
  },
  userEmail: {
    fontSize: 13,
    ...FONTS.regular,
    marginTop: 2,
  },
  statsGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.lg,
  },
  statCol: {
    alignItems: 'center',
  },
  statNum: {
    fontSize: 16,
    ...FONTS.bold,
  },
  statLbl: {
    fontSize: 10,
    ...FONTS.medium,
    marginTop: 2,
  },
  statSep: {
    width: 1,
    height: 24,
  },
  sectionBlock: {
    gap: SPACING.xs + 2,
  },
  sectionTitle: {
    fontSize: 11,
    ...FONTS.bold,
    letterSpacing: 0.5,
  },
  menuGroup: {
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    overflow: 'hidden',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.base,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    flex: 1,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: {
    fontSize: 14,
    ...FONTS.semibold,
  },
  menuSub: {
    fontSize: 11,
    ...FONTS.regular,
    marginTop: 1,
  },
  rowDivider: {
    height: 1,
    marginLeft: 62,
  },
  footerBlock: {
    alignItems: 'center',
    paddingVertical: SPACING.md,
    gap: 4,
  },
  appName: {
    fontSize: 14,
    ...FONTS.bold,
  },
  versionText: {
    fontSize: 11,
    ...FONTS.regular,
  },
});
