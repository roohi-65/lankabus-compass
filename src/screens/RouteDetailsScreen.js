import React, { useLayoutEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RoutePlate, Pill, SectionTitle, HeartButton } from '../components/ui';
import { routesById, stopsById } from '../data';
import { useApp } from '../context/AppContext';
import { fmtClock, fmtDuration, stopOffset, toMin, useNow, whenLabel, nextTimesAtStop } from '../utils/time';
import { colors, radius } from '../theme';

export default function RouteDetailsScreen({ route: nav, navigation }) {
  const route = routesById[nav.params.routeId];
  const now = useNow();
  const { isFavorite, toggleFavorite, getNote, setNote } = useApp();
  const [showAll, setShowAll] = useState(false);
  const [note, setNoteText] = useState(getNote('route', route.id));
  const fav = isFavorite('route', route.id);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: `Route ${route.number}`,
      headerRight: () => <HeartButton light active={fav} onPress={() => toggleFavorite('route', route.id)} />,
    });
  }, [navigation, fav, route.id]);

  const origin = stopsById[route.stops[0]];
  const next = nextTimesAtStop(route, 0, now, 1)[0];
  const upcoming = route.departures.filter((d) => toMin(d) >= now);
  const timetable = showAll ? route.departures : upcoming.slice(0, 8);

  const facts = [
    { icon: 'cash-outline', label: 'Fare', value: `Rs ${route.fare}` },
    { icon: 'time-outline', label: 'Journey', value: fmtDuration(route.durationMin) },
    { icon: 'navigate-outline', label: 'Distance', value: `${route.distanceKm} km` },
  ];

  return (
    <ScrollView style={s.screen} keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={s.head}>
        <RoutePlate number={route.number} size="lg" />
        <Text style={s.name}>{route.name}</Text>
        <View style={s.headMeta}>
          <Pill text={route.type} color="#fff" />
          <Text style={s.operator}>{route.operator}</Text>
        </View>
      </View>

      <View style={s.facts}>
        {facts.map((f) => (
          <View key={f.label} style={s.fact}>
            <Ionicons name={f.icon} size={20} color={colors.maroon} />
            <Text style={s.factValue}>{f.value}</Text>
            <Text style={s.factLabel}>{f.label}</Text>
          </View>
        ))}
      </View>

      <View style={s.nextBox}>
        <Text style={s.nextLabel}>Next bus from {origin.name}</Text>
        <Text style={s.nextValue}>{next ? `${fmtClock(next)}  (${whenLabel(next, now)})` : 'No more buses'}</Text>
      </View>

      <SectionTitle>Stops in order</SectionTitle>
      <View style={s.timeline}>
        {route.stops.map((id, i) => {
          const st = stopsById[id];
          const last = i === route.stops.length - 1;
          return (
            <Pressable
              key={id}
              style={s.stopRow}
              onPress={() => navigation.navigate('StopDetails', { stopId: id })}
            >
              <View style={s.rail}>
                <View style={[s.dot, (i === 0 || last) && s.dotEnd]} />
                {!last && <View style={s.line} />}
              </View>
              <View style={s.stopText}>
                <Text style={s.stopName}>{st.name}</Text>
                <Text style={s.stopSub}>
                  {i === 0 ? 'Starts here' : `About ${fmtDuration(stopOffset(route, i))} after departure`}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.faint} />
            </Pressable>
          );
        })}
      </View>

      <SectionTitle action={showAll ? 'Show upcoming' : 'Full timetable'} onAction={() => setShowAll(!showAll)}>
        Departures from {origin.name}
      </SectionTitle>
      <View style={s.times}>
        {timetable.length === 0 ? (
          <Text style={s.hint}>No more departures today. Tap Full timetable to see all times.</Text>
        ) : (
          timetable.map((d) => (
            <View key={d} style={[s.time, toMin(d) === (upcoming[0] && toMin(upcoming[0])) && s.timeNext]}>
              <Text style={[s.timeText, toMin(d) === (upcoming[0] && toMin(upcoming[0])) && s.timeTextNext]}>
                {fmtClock(toMin(d))}
              </Text>
            </View>
          ))
        )}
      </View>

      <SectionTitle>My note</SectionTitle>
      <View style={{ paddingHorizontal: 16 }}>
        <TextInput
          style={s.note}
          value={note}
          onChangeText={setNoteText}
          onEndEditing={() => setNote('route', route.id, note)}
          placeholder="Add a note, for example where to board"
          placeholderTextColor={colors.faint}
          multiline
        />
      </View>
      <Text style={s.disclaimer}>
        Buses run both ways on the same timetable. Fares and times are approximate, built from a hand-made dataset. Check with the bus crew or SLTB/NTC before
        travelling.
      </Text>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  head: { backgroundColor: colors.ink, padding: 20, paddingTop: 8, gap: 12, alignItems: 'flex-start' },
  name: { color: '#fff', fontSize: 24, fontWeight: '800' },
  headMeta: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  operator: { color: '#B8C7D6', fontSize: 14 },
  facts: { flexDirection: 'row', backgroundColor: colors.card, borderBottomWidth: 1, borderBottomColor: colors.line },
  fact: { flex: 1, alignItems: 'center', paddingVertical: 14, gap: 2 },
  factValue: { fontSize: 17, fontWeight: '800', color: colors.text },
  factLabel: { fontSize: 12, color: colors.muted },
  nextBox: {
    margin: 16,
    marginBottom: 0,
    padding: 14,
    borderRadius: radius.md,
    backgroundColor: colors.plate,
    borderWidth: 2,
    borderColor: colors.ink,
  },
  nextLabel: { fontSize: 13, fontWeight: '700', color: colors.ink },
  nextValue: { fontSize: 20, fontWeight: '900', color: colors.ink, marginTop: 2 },
  timeline: {
    marginHorizontal: 16,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: 14,
  },
  stopRow: { flexDirection: 'row', alignItems: 'stretch', minHeight: 58 },
  rail: { width: 22, alignItems: 'center' },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.inkSoft, marginTop: 20 },
  dotEnd: { width: 14, height: 14, borderRadius: 7, backgroundColor: colors.maroon, marginTop: 18 },
  line: { flex: 1, width: 3, backgroundColor: colors.line, marginTop: 2 },
  stopText: { flex: 1, paddingVertical: 11, paddingLeft: 8, justifyContent: 'center' },
  stopName: { fontSize: 16, fontWeight: '700', color: colors.text },
  stopSub: { fontSize: 13, color: colors.muted, marginTop: 1 },
  times: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: 16 },
  time: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
  },
  timeNext: { backgroundColor: colors.ink, borderColor: colors.ink },
  timeText: { fontSize: 14, fontWeight: '700', color: colors.text },
  timeTextNext: { color: '#fff' },
  hint: { color: colors.muted, fontSize: 14 },
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
  disclaimer: { margin: 16, fontSize: 12, color: colors.muted, lineHeight: 17 },
});
