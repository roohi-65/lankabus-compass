import React, { useLayoutEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SectionTitle, HeartButton, RoutePlate } from '../components/ui';
import RouteCard from '../components/RouteCard';
import { stopsById, routesByStop } from '../data';
import { useApp } from '../context/AppContext';
import { fmtClock, nextTimesAtStop, useNow, whenLabel } from '../utils/time';
import { colors, radius } from '../theme';

export default function StopDetailsScreen({ route: nav, navigation }) {
  const stop = stopsById[nav.params.stopId];
  const now = useNow();
  const { isFavorite, toggleFavorite, getNote, setNote, setTrip, addRecent } = useApp();
  const [note, setNoteText] = useState(getNote('stop', stop.id));
  const fav = isFavorite('stop', stop.id);
  const serving = routesByStop[stop.id] || [];

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Stop details',
      headerRight: () => <HeartButton light active={fav} onPress={() => toggleFavorite('stop', stop.id)} />,
    });
  }, [navigation, fav, stop.id]);

  const pickForTrip = (field) => {
    setTrip({ [field]: stop.id });
    navigation.navigate('Tabs', { screen: 'Trip' });
  };

  return (
    <ScrollView style={s.screen} keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={s.head}>
        <Ionicons name="location" size={30} color={colors.plate} />
        <Text style={s.name}>{stop.name}</Text>
        <Text style={s.sub}>
          {stop.district} District, {stop.province} Province
        </Text>
        <Text style={s.coords}>
          {stop.lat.toFixed(4)}° N, {stop.lng.toFixed(4)}° E
        </Text>
      </View>

      <View style={s.actions}>
        <Pressable style={s.action} onPress={() => pickForTrip('fromId')}>
          <Ionicons name="trending-up" size={18} color={colors.ink} />
          <Text style={s.actionText}>Travel from here</Text>
        </Pressable>
        <Pressable style={s.action} onPress={() => pickForTrip('toId')}>
          <Ionicons name="flag" size={18} color={colors.ink} />
          <Text style={s.actionText}>Travel to here</Text>
        </Pressable>
      </View>

      <SectionTitle>
        {serving.length} {serving.length === 1 ? 'route' : 'routes'} serve this stop
      </SectionTitle>
      {serving.map(({ route, index }) => {
        const last = route.stops.length - 1;
        const dirs = [];
        if (index < last) dirs.push({ to: stopsById[route.stops[last]].name, reverse: false });
        if (index > 0) dirs.push({ to: stopsById[route.stops[0]].name, reverse: true });
        return (
          <RouteCard
            key={route.id}
            route={route}
            onPress={() => {
              addRecent('route', route.id);
              navigation.navigate('RouteDetails', { routeId: route.id });
            }}
            footer={
              <View style={{ gap: 8 }}>
                {dirs.map((d) => (
                  <View key={d.to}>
                    <Text style={s.footLabel}>Towards {d.to} (estimated)</Text>
                    <View style={s.timeRow}>
                      {nextTimesAtStop(route, index, now, 3, d.reverse).map((t) => (
                        <View key={t} style={s.time}>
                          <Text style={s.timeText}>{fmtClock(t)}</Text>
                          <Text style={s.timeWhen}>{whenLabel(t, now)}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                ))}
              </View>
            }
          />
        );
      })}

      <SectionTitle>My note</SectionTitle>
      <View style={{ paddingHorizontal: 16 }}>
        <TextInput
          style={s.note}
          value={note}
          onChangeText={setNoteText}
          onEndEditing={() => setNote('stop', stop.id, note)}
          placeholder="Add a note, for example which side of the road to wait"
          placeholderTextColor={colors.faint}
          multiline
        />
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  head: { backgroundColor: colors.ink, padding: 20, paddingTop: 8, gap: 4 },
  name: { color: '#fff', fontSize: 26, fontWeight: '800', marginTop: 4 },
  sub: { color: '#B8C7D6', fontSize: 15 },
  coords: { color: colors.faint, fontSize: 13, marginTop: 2 },
  actions: { flexDirection: 'row', gap: 10, padding: 16, paddingBottom: 0 },
  action: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: radius.md,
    backgroundColor: colors.plate,
    borderWidth: 2,
    borderColor: colors.ink,
  },
  actionText: { fontWeight: '800', color: colors.ink, fontSize: 14 },
  footLabel: { fontSize: 12, color: colors.muted, fontWeight: '600' },
  timeRow: { flexDirection: 'row', gap: 8, marginTop: 6 },
  time: { backgroundColor: colors.bg, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 },
  timeText: { fontSize: 13, fontWeight: '800', color: colors.text },
  timeWhen: { fontSize: 11, color: colors.muted },
  note: {
    minHeight: 70,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 12,
    fontSize: 15,
    color: colors.text,
    textAlignVertical: 'top',
  },
});
