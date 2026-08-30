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
    <View style={[styles.container, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
      <Ionicons name="search-outline" size={19} color={theme.textTertiary} style={styles.searchIcon} />
      <TextInput
        style={[styles.input, { color: theme.text }]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.textTertiary}
        returnKeyType="search"
        autoCapitalize="none"
        autoCorrect={false}
      />
      {value.length > 0 && (
        <TouchableOpacity
          onPress={() => onChangeText('')}
          style={styles.actionBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="close-circle" size={18} color={theme.textTertiary} />
        </TouchableOpacity>
      )}
      {onVoicePress && (
        <TouchableOpacity onPress={onVoicePress} style={styles.actionBtn}>
          <Ionicons name="mic-outline" size={18} color={theme.primary} />
        </TouchableOpacity>
      )}
      {showFilter && onFilterPress && (
        <TouchableOpacity
          onPress={onFilterPress}
          style={[styles.actionBtn, styles.filterBtn, { backgroundColor: theme.cardAlt }]}
        >
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
    height: 44,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    paddingHorizontal: SPACING.md,
    marginVertical: SPACING.xs,
  },
  searchIcon: {
    marginRight: SPACING.xs + 2,
  },
  input: {
    flex: 1,
    fontSize: 14,
    ...FONTS.regular,
    paddingVertical: 0,
  },
  actionBtn: {
    padding: SPACING.xs,
    marginLeft: 4,
  },
  filterBtn: {
    borderRadius: RADIUS.xs,
    padding: 6,
  },
});
