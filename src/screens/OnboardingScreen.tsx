import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useApp } from '../context/AppContext';
import { SPACING, RADIUS, FONTS, SHADOWS } from '../constants/theme';
import { Button } from '../components/common/Button';

const { width } = Dimensions.get('window');

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  badge: string;
  icon: keyof typeof Ionicons.glyphMap;
  accentColor: string;
  bgLight: string;
  previewCards: Array<{ title: string; subtitle: string; icon: string; done?: boolean }>;
}

const SLIDES: Slide[] = [
  {
    id: 1,
    badge: 'ALL-IN-ONE WORKSPACE',
    title: 'Organize Everything',
    subtitle: 'Keep your notes, tasks and ideas organized in one place.',
    icon: 'folder-open-outline',
    accentColor: '#4F46E5',
    bgLight: '#EEF2FF',
    previewCards: [
      { title: 'Product Launch Checklist', subtitle: '4 of 6 completed', icon: 'checkmark-circle', done: true },
      { title: '💡 Growth Strategy Notes', subtitle: 'Work • Pinned to top', icon: 'document-text', done: false },
      { title: 'Morning Focus Block', subtitle: '09:00 AM - 11:30 AM', icon: 'time-outline', done: true },
    ],
  },
  {
    id: 2,
    badge: 'INTELLIGENT ASSISTANCE',
    title: 'Work Smarter with AI',
    subtitle: 'Let AI summarize notes, create tasks and help plan your day.',
    icon: 'sparkles',
    accentColor: '#8B5CF6',
    bgLight: '#F5F3FF',
    previewCards: [
      { title: '✨ Executive Note Summary', subtitle: 'Generated in 0.8s', icon: 'sparkles', done: false },
      { title: '📋 Auto-Extracted 4 Tasks', subtitle: 'Added to your daily to-do', icon: 'checkbox', done: true },
      { title: '🎯 AI Schedule Optimization', subtitle: 'Peak energy slotting applied', icon: 'analytics', done: false },
    ],
  },
  {
    id: 3,
    badge: 'GOAL MASTERY',
    title: 'Stay on Track',
    subtitle: 'Manage your priorities and complete your goals with ease.',
    icon: 'trending-up',
    accentColor: '#10B981',
    bgLight: '#ECFDF5',
    previewCards: [
      { title: '🔥 7-Day Consistency Streak', subtitle: 'Top 5% of active planners', icon: 'flame', done: true },
      { title: 'Today: 5 of 7 Tasks Done', subtitle: '71% completion rate', icon: 'pie-chart', done: true },
      { title: 'Evening Brain Dump', subtitle: 'Scheduled for 8:30 PM', icon: 'moon', done: false },
    ],
  },
];

export const OnboardingScreen: React.FC<{ onFinish: () => void }> = ({ onFinish }) => {
  const { theme, completeOnboarding } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      completeOnboarding();
      onFinish();
    }
  };

  const handleSkip = () => {
    completeOnboarding();
    onFinish();
  };

  const currentSlide = SLIDES[currentIndex];
  const isLast = currentIndex === SLIDES.length - 1;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={theme.text === '#0F172A' ? 'dark-content' : 'light-content'} />

      {/* Top Header Row with Skip */}
      <View style={styles.topNav}>
        <View style={styles.brandRow}>
          <View style={[styles.brandIcon, { backgroundColor: theme.primary }]}>
            <Ionicons name="infinite" size={20} color="#FFFFFF" />
          </View>
          <Text style={[styles.brandText, { color: theme.text }]}>LifeFlow AI</Text>
        </View>

        <TouchableOpacity onPress={handleSkip} style={styles.skipBtn}>
          <Text style={[styles.skipText, { color: theme.textSecondary }]}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Slide Illustration / Mock Showcase */}
      <View style={styles.slideContent}>
        <View style={[styles.heroCard, { backgroundColor: currentSlide.bgLight }]}>
          <View style={[styles.heroIconBadge, { backgroundColor: currentSlide.accentColor }]}>
            <Ionicons name={currentSlide.icon} size={32} color="#FFFFFF" />
          </View>

          {/* Mini Interactive Preview Cards */}
          <View style={styles.cardsContainer}>
            {currentSlide.previewCards.map((card, idx) => (
              <View
                key={idx}
                style={[
                  styles.miniCard,
                  { backgroundColor: theme.card, borderColor: theme.cardBorder },
                  SHADOWS.soft,
                ]}
              >
                <View
                  style={[
                    styles.miniCardIconBox,
                    { backgroundColor: card.done ? '#ECFDF5' : theme.primarySoft },
                  ]}
                >
                  <Ionicons
                    name={card.icon as any}
                    size={16}
                    color={card.done ? '#10B981' : currentSlide.accentColor}
                  />
                </View>
                <View style={styles.miniCardContent}>
                  <Text style={[styles.miniCardTitle, { color: theme.text }]}>{card.title}</Text>
                  <Text style={[styles.miniCardSubtitle, { color: theme.textSecondary }]}>
                    {card.subtitle}
                  </Text>
                </View>
                {card.done && <Ionicons name="checkmark-circle" size={16} color="#10B981" />}
              </View>
            ))}
          </View>
        </View>

        {/* Text Info */}
        <View style={styles.infoBox}>
          <View style={[styles.badgePill, { backgroundColor: currentSlide.bgLight }]}>
            <Text style={[styles.badgeText, { color: currentSlide.accentColor }]}>
              {currentSlide.badge}
            </Text>
          </View>

          <Text style={[styles.slideTitle, { color: theme.text }]}>{currentSlide.title}</Text>
          <Text style={[styles.slideSubtitle, { color: theme.textSecondary }]}>
            {currentSlide.subtitle}
          </Text>
        </View>
      </View>

      {/* Bottom Controls */}
      <View style={styles.bottomControls}>
        {/* Progress Dots */}
        <View style={styles.dotsRow}>
          {SLIDES.map((_, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => setCurrentIndex(i)}
              style={[
                styles.dot,
                {
                  backgroundColor: i === currentIndex ? currentSlide.accentColor : theme.cardBorder,
                  width: i === currentIndex ? 24 : 8,
                },
              ]}
            />
          ))}
        </View>

        {/* Action Button */}
        <Button
          title={isLast ? 'Get Started' : 'Next'}
          onPress={handleNext}
          variant="primary"
          size="lg"
          style={{ backgroundColor: currentSlide.accentColor }}
          icon={isLast ? 'arrow-forward' : 'chevron-forward'}
          iconPosition="right"
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.base,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  brandIcon: {
    width: 34,
    height: 34,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandText: {
    fontSize: 18,
    ...FONTS.bold,
    letterSpacing: -0.3,
  },
  skipBtn: {
    padding: SPACING.xs,
  },
  skipText: {
    fontSize: 14,
    ...FONTS.semibold,
  },
  slideContent: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
  },
  heroCard: {
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    alignItems: 'center',
    marginBottom: SPACING.xl,
    position: 'relative',
  },
  heroIconBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.base,
    ...SHADOWS.float,
  },
  cardsContainer: {
    width: '100%',
    gap: SPACING.sm,
  },
  miniCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    gap: SPACING.sm,
  },
  miniCardIconBox: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniCardContent: {
    flex: 1,
  },
  miniCardTitle: {
    fontSize: 13,
    ...FONTS.bold,
  },
  miniCardSubtitle: {
    fontSize: 11,
    ...FONTS.regular,
  },
  infoBox: {
    alignItems: 'center',
  },
  badgePill: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    marginBottom: SPACING.sm,
  },
  badgeText: {
    fontSize: 11,
    ...FONTS.bold,
    letterSpacing: 0.5,
  },
  slideTitle: {
    fontSize: 26,
    ...FONTS.bold,
    textAlign: 'center',
    marginBottom: SPACING.xs,
    letterSpacing: -0.5,
  },
  slideSubtitle: {
    fontSize: 15,
    ...FONTS.regular,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 290,
  },
  bottomControls: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.xl,
    gap: SPACING.lg,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
});
