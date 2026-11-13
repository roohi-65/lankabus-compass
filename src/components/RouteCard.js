import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RoutePlate, Pill } from './ui';
import { colors, radius } from '../theme';
import { fmtDuration } from '../utils/time';
import { useApp } from '../context/AppContext';

export default function RouteCard({ route, onPress, footer }) {
  const { isFavorite } = useApp();
  return (
    <Pressable onPress={onPress} style={s.card}>
      <View style={s.top}>
        <RoutePlate number={route.number} />
        <View style={s.main}>
          <Text style={s.name} numberOfLines={2}>
            {route.name}
          </Text>
          <View style={s.meta}>
            <Pill text={route.type} />
            <Text style={s.metaText}>Rs {route.fare}</Text>
            <Text style={s.metaText}>{fmtDuration(route.durationMin)}</Text>
          </View>
        </View>
        {isFavorite('route', route.id) && <Ionicons name="heart" size={18} color={colors.maroon} />}
        <Ionicons name="chevron-forward" size={18} color={colors.faint} />
      </View>
      {footer ? <View style={s.footer}>{footer}</View> : null}
    </Pressable>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 10,
  },
  top: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  main: { flex: 1, gap: 6 },
  name: { fontSize: 16, fontWeight: '700', color: colors.text },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 10, flexWrap: 'wrap' },
  metaText: { fontSize: 13, color: colors.muted, fontWeight: '600' },
  footer: { marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: colors.line },
});
