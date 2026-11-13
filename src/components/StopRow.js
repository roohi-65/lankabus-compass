import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';
import { routesByStop } from '../data';
import { useApp } from '../context/AppContext';

export default function StopRow({ stop, onPress, showProvince }) {
  const { isFavorite } = useApp();
  const count = (routesByStop[stop.id] || []).length;
  return (
    <Pressable onPress={onPress} style={s.row}>
      <Ionicons name="location" size={20} color={colors.maroon} />
      <View style={s.main}>
        <Text style={s.name}>{stop.name}</Text>
        <Text style={s.sub}>
          {showProvince ? `${stop.district}, ${stop.province} Province` : `${count} ${count === 1 ? 'route' : 'routes'}`}
        </Text>
      </View>
      {isFavorite('stop', stop.id) && <Ionicons name="heart" size={16} color={colors.maroon} />}
      <Ionicons name="chevron-forward" size={18} color={colors.faint} />
    </Pressable>
  );
}

const s = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 13,
    paddingHorizontal: 16,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  main: { flex: 1 },
  name: { fontSize: 16, fontWeight: '600', color: colors.text },
  sub: { fontSize: 13, color: colors.muted, marginTop: 2 },
});
