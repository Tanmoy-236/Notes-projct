import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, SafeAreaView, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import Ionicons from '@expo/vector-icons/Ionicons';
import { AppProvider, useApp } from './src/context/AppContext';
import { HomeScreen } from './src/screens/HomeScreen';
import { TasksScreen } from './src/screens/TasksScreen';
import { NotesScreen } from './src/screens/NotesScreen';
import { AIAssistantScreen } from './src/screens/AIAssistantScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { AIDailyPlannerScreen } from './src/screens/AIDailyPlannerScreen';
import { CalendarScreen } from './src/screens/CalendarScreen';
import { UniversalSearchScreen } from './src/screens/UniversalSearchScreen';
import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { SPACING, RADIUS, FONTS, SHADOWS } from './src/constants/theme';

type MainTab = 'home' | 'tasks' | 'notes' | 'ai' | 'profile';
type OverlayScreen = 'planner' | 'calendar' | 'search' | null;

const AppContent: React.FC = () => {
  const { theme, isDarkMode, userProfile, tasks, notes } = useApp();

  const [activeTab, setActiveTab] = useState<MainTab>('home');
  const [activeOverlay, setActiveOverlay] = useState<OverlayScreen>(null);
  const [showOnboardingOverride, setShowOnboardingOverride] = useState(false);

  // Show onboarding if not onboarded or if user explicitly requested a replay
  const shouldShowOnboarding = !userProfile.hasOnboarded || showOnboardingOverride;

  if (shouldShowOnboarding) {
    return (
      <OnboardingScreen
        onFinish={() => {
          setShowOnboardingOverride(false);
          setActiveTab('home');
        }}
      />
    );
  }

  // Pending tasks count
  const pendingTasksCount = tasks.filter((t) => !t.completed).length;

  // Render current tab screen or overlay
  const renderCurrentView = () => {
    // Overlays take precedence
    if (activeOverlay === 'planner') {
      return (
        <View style={styles.overlayContainer}>
          <View style={[styles.overlayHeader, { backgroundColor: theme.background }]}>
            <TouchableOpacity
              onPress={() => setActiveOverlay(null)}
              style={[styles.backBtn, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
            >
              <Ionicons name="chevron-back" size={22} color={theme.text} />
            </TouchableOpacity>
          </View>
          <AIDailyPlannerScreen />
        </View>
      );
    }

    if (activeOverlay === 'calendar') {
      return (
        <View style={styles.overlayContainer}>
          <View style={[styles.overlayHeader, { backgroundColor: theme.background }]}>
            <TouchableOpacity
              onPress={() => setActiveOverlay(null)}
              style={[styles.backBtn, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
            >
              <Ionicons name="chevron-back" size={22} color={theme.text} />
            </TouchableOpacity>
          </View>
          <CalendarScreen />
        </View>
      );
    }

    if (activeOverlay === 'search') {
      return <UniversalSearchScreen onBack={() => setActiveOverlay(null)} />;
    }

    // Tabs
    switch (activeTab) {
      case 'home':
        return (
          <HomeScreen
            onNavigateToTasks={() => setActiveTab('tasks')}
            onNavigateToNotes={() => setActiveTab('notes')}
            onNavigateToAI={() => setActiveTab('ai')}
            onNavigateToPlanner={() => setActiveOverlay('planner')}
            onNavigateToCalendar={() => setActiveOverlay('calendar')}
            onNavigateToSearch={() => setActiveOverlay('search')}
            onNavigateToProfile={() => setActiveTab('profile')}
          />
        );
      case 'tasks':
        return <TasksScreen />;
      case 'notes':
        return <NotesScreen onOpenSearch={() => setActiveOverlay('search')} />;
      case 'ai':
        return <AIAssistantScreen onNavigateToTasks={() => setActiveTab('tasks')} />;
      case 'profile':
        return (
          <ProfileScreen
            onReplayOnboarding={() => setShowOnboardingOverride(true)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />

      {/* Main View Area */}
      <View style={styles.mainView}>{renderCurrentView()}</View>

      {/* Custom Bottom Navigation Bar (hidden during full screen overlays) */}
      {!activeOverlay && (
        <View
          style={[
            styles.tabBar,
            {
              backgroundColor: theme.card,
              borderTopColor: theme.cardBorder,
            },
            SHADOWS.card,
          ]}
        >
          {/* Home Tab */}
          <TouchableOpacity
            style={styles.tabButton}
            onPress={() => setActiveTab('home')}
            activeOpacity={0.7}
          >
            <View style={[styles.iconWrap, activeTab === 'home' && { backgroundColor: theme.primarySoft }]}>
              <Ionicons
                name={activeTab === 'home' ? 'home' : 'home-outline'}
                size={22}
                color={activeTab === 'home' ? theme.primary : theme.textTertiary}
              />
            </View>
            <Text
              style={[
                styles.tabText,
                {
                  color: activeTab === 'home' ? theme.primary : theme.textTertiary,
                  fontWeight: activeTab === 'home' ? '700' : '500',
                },
              ]}
            >
              Home
            </Text>
          </TouchableOpacity>

          {/* Tasks Tab */}
          <TouchableOpacity
            style={styles.tabButton}
            onPress={() => setActiveTab('tasks')}
            activeOpacity={0.7}
          >
            <View style={[styles.iconWrap, activeTab === 'tasks' && { backgroundColor: theme.primarySoft }]}>
              <Ionicons
                name={activeTab === 'tasks' ? 'checkbox' : 'checkbox-outline'}
                size={22}
                color={activeTab === 'tasks' ? theme.primary : theme.textTertiary}
              />
              {pendingTasksCount > 0 && (
                <View style={[styles.tabBadge, { backgroundColor: theme.primary }]}>
                  <Text style={styles.tabBadgeText}>
                    {pendingTasksCount > 9 ? '9+' : pendingTasksCount}
                  </Text>
                </View>
              )}
            </View>
            <Text
              style={[
                styles.tabText,
                {
                  color: activeTab === 'tasks' ? theme.primary : theme.textTertiary,
                  fontWeight: activeTab === 'tasks' ? '700' : '500',
                },
              ]}
            >
              Tasks
            </Text>
          </TouchableOpacity>

          {/* Notes Tab */}
          <TouchableOpacity
            style={styles.tabButton}
            onPress={() => setActiveTab('notes')}
            activeOpacity={0.7}
          >
            <View style={[styles.iconWrap, activeTab === 'notes' && { backgroundColor: theme.primarySoft }]}>
              <Ionicons
                name={activeTab === 'notes' ? 'document-text' : 'document-text-outline'}
                size={22}
                color={activeTab === 'notes' ? theme.primary : theme.textTertiary}
              />
            </View>
            <Text
              style={[
                styles.tabText,
                {
                  color: activeTab === 'notes' ? theme.primary : theme.textTertiary,
                  fontWeight: activeTab === 'notes' ? '700' : '500',
                },
              ]}
            >
              Notes
            </Text>
          </TouchableOpacity>

          {/* AI Assistant Tab */}
          <TouchableOpacity
            style={styles.tabButton}
            onPress={() => setActiveTab('ai')}
            activeOpacity={0.7}
          >
            <View style={[styles.iconWrap, activeTab === 'ai' && { backgroundColor: theme.primarySoft }]}>
              <Ionicons
                name={activeTab === 'ai' ? 'sparkles' : 'sparkles-outline'}
                size={22}
                color={activeTab === 'ai' ? theme.primary : theme.textTertiary}
              />
            </View>
            <Text
              style={[
                styles.tabText,
                {
                  color: activeTab === 'ai' ? theme.primary : theme.textTertiary,
                  fontWeight: activeTab === 'ai' ? '700' : '500',
                },
              ]}
            >
              AI
            </Text>
          </TouchableOpacity>

          {/* Profile Tab */}
          <TouchableOpacity
            style={styles.tabButton}
            onPress={() => setActiveTab('profile')}
            activeOpacity={0.7}
          >
            <View style={[styles.iconWrap, activeTab === 'profile' && { backgroundColor: theme.primarySoft }]}>
              <Ionicons
                name={activeTab === 'profile' ? 'person' : 'person-outline'}
                size={22}
                color={activeTab === 'profile' ? theme.primary : theme.textTertiary}
              />
            </View>
            <Text
              style={[
                styles.tabText,
                {
                  color: activeTab === 'profile' ? theme.primary : theme.textTertiary,
                  fontWeight: activeTab === 'profile' ? '700' : '500',
                },
              ]}
            >
              Profile
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default function App() {
  const [fontsLoaded] = useFonts({
    ...Ionicons.font,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  mainView: {
    flex: 1,
  },
  overlayContainer: {
    flex: 1,
  },
  overlayHeader: {
    paddingHorizontal: SPACING.base,
    paddingTop: SPACING.xs,
    paddingBottom: SPACING.xs,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: Platform.OS === 'ios' ? 78 : 64,
    paddingBottom: Platform.OS === 'ios' ? 18 : 6,
    paddingTop: 6,
    borderTopWidth: 1,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrap: {
    width: 40,
    height: 28,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  tabBadge: {
    position: 'absolute',
    top: -2,
    right: 2,
    minWidth: 14,
    height: 14,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  tabBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
  },
  tabText: {
    fontSize: 11,
    marginTop: 2,
  },
});
