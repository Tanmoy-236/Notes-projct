export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
  huge: 48,
} as const;

export const RADIUS = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  full: 9999,
} as const;

export const FONTS = {
  regular: { fontWeight: '400' as const },
  medium: { fontWeight: '500' as const },
  semibold: { fontWeight: '600' as const },
  bold: { fontWeight: '700' as const },
  heavy: { fontWeight: '800' as const },
} as const;

export const COLORS = {
  light: {
    primary: '#4338CA', primaryDark: '#3730A3', primaryLight: '#4F46E5', primarySoft: '#EEF2FF',
    secondary: '#8B5CF6', secondarySoft: '#F5F3FF', secondaryBorder: '#DDD6FE',
    accent: '#6366F1', accentGradient: ['#4F46E5', '#7C3AED'],
    background: '#F8FAFC', backgroundElevated: '#FFFFFF', card: '#FFFFFF', cardAlt: '#F1F5F9',
    cardBorder: '#E2E8F0', cardHover: '#F8FAFC', text: '#0F172A', textMuted: '#334155',
    textSecondary: '#475569', textTertiary: '#64748B', textInverse: '#FFFFFF',
    success: '#047857', successSoft: '#ECFDF5', successBorder: '#A7F3D0',
    warning: '#B45309', warningSoft: '#FFFBEB', warningBorder: '#FDE68A',
    error: '#B91C1C', errorSoft: '#FEF2F2', errorBorder: '#FECACA',
    divider: '#E2E8F0', inputBg: '#FFFFFF', inputBorder: '#CBD5E1',
    modalOverlay: 'rgba(15, 23, 42, 0.45)', shadowColor: '#0F172A',
  },
  dark: {
    primary: '#818CF8', primaryDark: '#6366F1', primaryLight: '#A5B4FC', primarySoft: '#1E1B4B',
    secondary: '#A78BFA', secondarySoft: '#2E1065', secondaryBorder: '#4C1D95',
    accent: '#8B5CF6', accentGradient: ['#6366F1', '#A855F7'],
    background: '#0B0F19', backgroundElevated: '#131B2E', card: '#161F33', cardAlt: '#1E293B',
    cardBorder: '#334155', cardHover: '#1E293B', text: '#F8FAFC', textMuted: '#E2E8F0',
    textSecondary: '#CBD5E1', textTertiary: '#94A3B8', textInverse: '#0F172A',
    success: '#34D399', successSoft: '#064E3B', successBorder: '#047857',
    warning: '#FBBF24', warningSoft: '#451A03', warningBorder: '#B45309',
    error: '#F87171', errorSoft: '#450A0A', errorBorder: '#B91C1C',
    divider: '#293548', inputBg: '#131B2E', inputBorder: '#475569',
    modalOverlay: 'rgba(0, 0, 0, 0.7)', shadowColor: '#000000',
  },
} as const;

export const CATEGORY_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  Work: { bg: '#EEF2FF', text: '#3730A3', dot: '#4F46E5' },
  Personal: { bg: '#F5F3FF', text: '#6D28D9', dot: '#8B5CF6' },
  Study: { bg: '#ECFDF5', text: '#047857', dot: '#10B981' },
  Ideas: { bg: '#FFFBEB', text: '#92400E', dot: '#F59E0B' },
  Important: { bg: '#FEF2F2', text: '#991B1B', dot: '#EF4444' },
  Health: { bg: '#FDF2F8', text: '#9D174D', dot: '#EC4899' },
  Finance: { bg: '#ECFEFF', text: '#155E75', dot: '#06B6D4' },
};

export const SHADOWS = {
  soft: { shadowColor: '#0F172A', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 2 },
  card: { shadowColor: '#0F172A', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.07, shadowRadius: 10, elevation: 3 },
  float: { shadowColor: '#4338CA', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.22, shadowRadius: 16, elevation: 8 },
  modal: { shadowColor: '#0F172A', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.18, shadowRadius: 24, elevation: 12 },
} as const;
