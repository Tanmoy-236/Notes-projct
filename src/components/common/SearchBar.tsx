import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useApp } from '../../context/AppContext';
import { SPACING, RADIUS, FONTS } from '../../constants/theme';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onFilterPress?: () => void;
  showFilter?: boolean;
  onVoicePress?: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Search notes, tasks, ideas...',
  onFilterPress,
  showFilter = false,
  onVoicePress,
}) => {
  const { theme } = useApp();

  return (
    <View style={[styles.container, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder }]}>
      <Ionicons name="search-outline" size={19} color={theme.textSecondary} style={styles.searchIcon} />
      <TextInput
        accessibilityLabel="Search"
        accessibilityHint="Enter text to search"
        style={[styles.input, { color: theme.text }]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.textTertiary}
        returnKeyType="search"
        autoCapitalize="none"
        autoCorrect={false}
        clearButtonMode="never"
      />
      {value.length > 0 && (
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Clear search"
          onPress={() => onChangeText('')}
          style={styles.actionBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="close-circle" size={18} color={theme.textSecondary} />
        </TouchableOpacity>
      )}
      {onVoicePress && (
        <TouchableOpacity accessibilityRole="button" accessibilityLabel="Search by voice" onPress={onVoicePress} style={styles.actionBtn} hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}>
          <Ionicons name="mic-outline" size={18} color={theme.primary} />
        </TouchableOpacity>
      )}
      {showFilter && onFilterPress && (
        <TouchableOpacity accessibilityRole="button" accessibilityLabel="Filter search results" onPress={onFilterPress} style={[styles.actionBtn, styles.filterBtn, { backgroundColor: theme.cardAlt }]}>
          <Ionicons name="options-outline" size={16} color={theme.text} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 46,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    paddingHorizontal: SPACING.md,
    marginVertical: SPACING.xs,
  },
  searchIcon: {
    marginRight: SPACING.sm,
  },
  input: {
    flex: 1,
    fontSize: 14,
    ...FONTS.regular,
    paddingVertical: SPACING.xs,
    minHeight: 44,
  },
  actionBtn: {
    minWidth: 32,
    minHeight: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 2,
  },
  filterBtn: {
    borderRadius: RADIUS.xs,
    paddingHorizontal: 6,
  },
});
