import React from 'react';
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, typeColors } from '../theme';

export function RoutePlate({ number, size = 'md' }) {
  const big = size === 'lg';
  return (
    <View style={[s.plate, big && s.plateLg]}>
      <Text style={[s.plateText, big && s.plateTextLg]} numberOfLines={1}>
        {number}
      </Text>
    </View>
  );
}

export function SearchBar({ value, onChangeText, placeholder, onDark }) {
  return (
    <View style={[s.search, onDark && s.searchOnDark]}>
      <Ionicons name="search" size={18} color={colors.muted} />
      <TextInput
        style={s.searchInput}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.faint}
        autoCorrect={false}
        autoCapitalize="none"
        returnKeyType="search"
      />
      {value.length > 0 && (
        <Pressable onPress={() => onChangeText('')} hitSlop={10}>
          <Ionicons name="close-circle" size={18} color={colors.faint} />
        </Pressable>
      )}
    </View>
  );
}

export function FilterChips({ options, value, onChange }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={s.chipRow}
      keyboardShouldPersistTaps="handled"
    >
      {options.map((opt) => {
        const active = opt === value;
        return (
          <Pressable
            key={opt}
            onPress={() => onChange(opt)}
            style={[s.chip, active && s.chipActive]}
          >
            <Text style={[s.chipText, active && s.chipTextActive]}>{opt}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

export function Pill({ text, color }) {
  const c = color || typeColors[text] || colors.muted;
  return (
    <View style={[s.pill, { borderColor: c }]}>
      <Text style={[s.pillText, { color: c }]}>{text}</Text>
    </View>
  );
}

export function EmptyState({ icon = 'bus-outline', title, body }) {
  return (
    <View style={s.empty}>
      <Ionicons name={icon} size={44} color={colors.faint} />
      <Text style={s.emptyTitle}>{title}</Text>
      {body ? <Text style={s.emptyBody}>{body}</Text> : null}
    </View>
  );
}

export function SectionTitle({ children, action, onAction }) {
  return (
    <View style={s.sectionRow}>
      <Text style={s.sectionTitle}>{children}</Text>
      {action ? (
        <Pressable onPress={onAction} hitSlop={10}>
          <Text style={s.sectionAction}>{action}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export function HeartButton({ active, onPress, light }) {
  return (
    <Pressable onPress={onPress} hitSlop={12} style={s.heart}>
      <Ionicons
        name={active ? 'heart' : 'heart-outline'}
        size={24}
        color={active ? colors.maroon : light ? '#fff' : colors.muted}
      />
    </Pressable>
  );
}

const s = StyleSheet.create({
  plate: {
    minWidth: 54,
    paddingHorizontal: 8,
    paddingVertical: 5,
    backgroundColor: colors.plate,
    borderWidth: 2,
    borderColor: colors.ink,
    borderRadius: 6,
    alignItems: 'center',
  },
  plateLg: { minWidth: 76, paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 },
  plateText: { color: colors.ink, fontWeight: '900', fontSize: 16, letterSpacing: 0.5 },
  plateTextLg: { fontSize: 28 },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: 12,
    height: 46,
  },
  searchOnDark: { borderColor: 'transparent' },
  searchInput: { flex: 1, fontSize: 16, color: colors.text, paddingVertical: 0 },
  chipRow: { paddingHorizontal: 16, paddingVertical: 8, gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
  },
  chipActive: { backgroundColor: colors.ink, borderColor: colors.ink },
  chipText: { color: colors.text, fontSize: 14, fontWeight: '600' },
  chipTextActive: { color: '#fff' },
  pill: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2 },
  pillText: { fontSize: 12, fontWeight: '700' },
  empty: { alignItems: 'center', padding: 32, gap: 8 },
  emptyTitle: { fontSize: 17, fontWeight: '700', color: colors.text, textAlign: 'center' },
  emptyBody: { fontSize: 14, color: colors.muted, textAlign: 'center', lineHeight: 20 },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    paddingHorizontal: 16,
    marginTop: 20,
    marginBottom: 8,
  },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: colors.text },
  sectionAction: { fontSize: 14, fontWeight: '600', color: colors.maroon },
  heart: { padding: 4 },
});
