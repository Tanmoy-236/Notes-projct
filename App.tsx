import React, { useState } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import Ionicons from '@expo/vector-icons/Ionicons';
import { AppProvider, useApp } from './src/context/AppContext';
import { AIAssistantScreen } from './src/screens/AIAssistantScreen';
import { AIDailyPlannerScreen } from './src/screens/AIDailyPlannerScreen';
import { CalendarScreen } from './src/screens/CalendarScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { NotesScreen } from './src/screens/NotesScreen';
import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { TasksScreen } from './src/screens/TasksScreen';
import { UniversalSearchScreen } from './src/screens/UniversalSearchScreen';
import { RADIUS, SHADOWS, SPACING } from './src/constants/theme';

type MainTab = 'home' | 'tasks' | 'notes' | 'ai' | 'profile';
type OverlayScreen = 'planner' | 'calendar' | 'search' | null;

const AppContent: React.FC = () => {
  const { theme, isDarkMode, userProfile, tasks } = useApp();
  const [activeTab, setActiveTab] = useState<MainTab>('home');
  const [activeOverlay, setActiveOverlay] = useState<OverlayScreen>(null);
  const [showOnboardingOverride, setShowOnboardingOverride] = useState(false);

  if (!userProfile.hasOnboarded || showOnboardingOverride) {
    return (
      <OnboardingScreen
        onFinish={() => {
          setShowOnboardingOverride(false);
          setActiveTab('home');
        }}
      />
    );
  }

  const pendingTasksCount = tasks.filter((task) => !task.completed).length;

  const renderOverlay = () => {
    if (activeOverlay === 'search') {
      return <UniversalSearchScreen onBack={() => setActiveOverlay(null)} />;
    }

    if (activeOverlay === 'planner' || activeOverlay === 'calendar') {
      const Screen = activeOverlay === 'planner' ? AIDailyPlannerScreen : CalendarScreen;

      return (
        <View style={styles.overlayContainer}>
          <View style={[styles.overlayHeader, { backgroundColor: theme.background }]}>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Go back"
              onPress={() => setActiveOverlay(null)}
              style={[styles.backButton, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
            >
              <Ionicons name="chevron-back" size={22} color={theme.text} />
            </TouchableOpacity>
          </View>
          <Screen />
        </View>
      );
    }

    return null;
  };

  const renderCurrentView = () => {
    const overlay = renderOverlay();
    if (overlay) return overlay;

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
        return <ProfileScreen onReplayOnboarding={() => setShowOnboardingOverride(true)} />;
      default:
        return null;
    }
  };

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      <View style={styles.mainView}>{renderCurrentView()}</View>

      {!activeOverlay && (
        <View
          style={[
            styles.tabBar,
            { backgroundColor: theme.card, borderTopColor: theme.cardBorder },
            SHADOWS.card,
          ]}
        >
          <TabButton
            label="Home"
            icon="home"
            active={activeTab === 'home'}
            theme={theme}
            onPress={() => setActiveTab('home')}
          />
          <TabButton
            label="Tasks"
            icon="checkbox"
            active={activeTab === 'tasks'}
            badge={pendingTasksCount}
            theme={theme}
            onPress={() => setActiveTab('tasks')}
          />
          <TabButton
            label="Notes"
            icon="document-text"
            active={activeTab === 'notes'}
            theme={theme}
            onPress={() => setActiveTab('notes')}
          />
          <TabButton
            label="AI"
            icon="sparkles"
            active={activeTab === 'ai'}
            theme={theme}
            onPress={() => setActiveTab('ai')}
          />
          <TabButton
            label="Profile"
            icon="person"
            active={activeTab === 'profile'}
            theme={theme}
            onPress={() => setActiveTab('profile')}
          />
        </View>
      )}
    </View>
  );
};

type TabButtonProps = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  active: boolean;
  badge?: number;
  theme: ReturnType<typeof useApp>['theme'];
  onPress: () => void;
};

const TabButton = ({ label, icon, active, badge, theme, onPress }: TabButtonProps) => (
  <TouchableOpacity
    accessibilityRole="button"
    accessibilityLabel={`${label} tab`}
    accessibilityState={{ selected: active }}
    style={styles.tabButton}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View style={[styles.iconWrap, active && { backgroundColor: theme.primarySoft }]}>
      <Ionicons
        name={active ? icon : (`${icon}-outline` as keyof typeof Ionicons.glyphMap)}
        size={22}
        color={active ? theme.primary : theme.textTertiary}
      />
      {badge !== undefined && badge > 0 && (
        <View style={[styles.tabBadge, { backgroundColor: theme.primary }]}>
          <Text style={styles.tabBadgeText}>{badge > 9 ? '9+' : badge}</Text>
        </View>
      )}
    </View>
    <Text
      style={[
        styles.tabText,
        { color: active ? theme.primary : theme.textTertiary },
        active && styles.activeTabText,
      ]}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

export default function App() {
  const [fontsLoaded] = useFonts({ ...Ionicons.font });

  if (!fontsLoaded) return null;

  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  mainView: { flex: 1 },
  overlayContainer: { flex: 1 },
  overlayHeader: {
    paddingHorizontal: SPACING.base,
    paddingTop: SPACING.xs,
    paddingBottom: SPACING.xs,
  },
  backButton: {
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
    fontWeight: '500',
  },
  activeTabText: { fontWeight: '700' },
});
