import React, { useMemo } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RoutePlate, SectionTitle, EmptyState } from '../components/ui';
import RouteCard from '../components/RouteCard';
import { stopsById } from '../data';
import { findTrips } from '../utils/search';
import { useApp } from '../context/AppContext';
import { fmtClock, fmtDuration, legDuration, legFare, nextTimesAtStop, useNow, whenLabel } from '../utils/time';
import { colors, radius } from '../theme';

function StopPickRow({ icon, label, stop, onPress }) {
  return (
    <Pressable style={s.pick} onPress={onPress}>
      <Ionicons name={icon} size={20} color={colors.maroon} />
      <View style={{ flex: 1 }}>
        <Text style={s.pickLabel}>{label}</Text>
        <Text style={[s.pickValue, !stop && { color: colors.faint }]}>{stop ? stop.name : 'Choose a stop'}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.faint} />
    </Pressable>
  );
}

function ChangeList({ title, items, openRoute }) {
  if (!items || items.length === 0) return null;
  return (
    <View>
      <SectionTitle>{title}</SectionTitle>
      {items.map((t) => (
        <View key={t.legs.map((l) => l.route.id).join('-')} style={s.transfer}>
          {t.legs.map((leg, idx) => (
            <Pressable key={leg.route.id} style={s.leg} onPress={() => openRoute(leg.route.id)}>
              <RoutePlate number={leg.route.number} />
              <View style={{ flex: 1 }}>
                <Text style={s.legTitle}>
                  {stopsById[leg.route.stops[leg.from]].name} to {stopsById[leg.route.stops[leg.to]].name}
                </Text>
                <Text style={s.legText}>
                  {fmtDuration(legDuration(leg.route, leg.from, leg.to))}, Rs {legFare(leg.route, leg.from, leg.to)}
                  {idx < t.viaIds.length ? `. Change at ${stopsById[t.viaIds[idx]].name}` : ''}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>
      ))}
    </View>
  );
}

export default function TripFinderScreen({ navigation }) {
  const { trip, setTrip, addRecent } = useApp();
  const now = useNow();
  const from = trip.fromId ? stopsById[trip.fromId] : null;
  const to = trip.toId ? stopsById[trip.toId] : null;
  const same = from && to && from.id === to.id;

  const result = useMemo(
    () => (from && to && !same ? findTrips(from.id, to.id) : null),
    [from, to, same]
  );

  const openRoute = (id) => {
    addRecent('route', id);
    navigation.navigate('RouteDetails', { routeId: id });
  };

  return (
    <ScrollView style={s.screen} keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: 32 }}>
      <View style={s.form}>
        <View style={{ flex: 1, gap: 8 }}>
          <StopPickRow icon="radio-button-on" label="From" stop={from} onPress={() => navigation.navigate('StopPicker', { field: 'fromId' })} />
          <StopPickRow icon="flag" label="To" stop={to} onPress={() => navigation.navigate('StopPicker', { field: 'toId' })} />
        </View>
        <Pressable style={s.swap} onPress={() => setTrip({ fromId: trip.toId, toId: trip.fromId })} hitSlop={8}>
          <Ionicons name="swap-vertical" size={24} color={colors.ink} />
        </Pressable>
      </View>

      {!from || !to ? (
        <EmptyState icon="compass-outline" title="Where are you going?" body="Pick a starting stop and a destination to see which buses connect them." />
      ) : same ? (
        <EmptyState icon="alert-circle-outline" title="Start and destination are the same" body="Choose a different stop for From or To." />
      ) : (
        <View>
          <SectionTitle>
            {result.direct.length} direct {result.direct.length === 1 ? 'bus' : 'buses'}
          </SectionTitle>
          {result.direct.length === 0 && (
            <Text style={s.none}>No bus runs straight from {from.name} to {to.name} in this dataset.</Text>
          )}
          {result.direct.map(({ route, from: i, to: j }) => {
            const times = nextTimesAtStop(route, i, now, 3, j < i);
            return (
              <RouteCard
                key={route.id}
                route={route}
                onPress={() => openRoute(route.id)}
                footer={
                  <View style={{ gap: 4 }}>
                    <Text style={s.legText}>
                      {Math.abs(j - i)} {Math.abs(j - i) === 1 ? 'stop' : 'stops'}, about {fmtDuration(legDuration(route, i, j))}, Rs {legFare(route, i, j)}
                    </Text>
                    <Text style={s.legText}>
                      Next from {from.name}:{' '}
                      <Text style={s.bold}>{times.length ? times.map((t) => fmtClock(t)).join(', ') : 'none'}</Text>
                      {times.length ? `  (${whenLabel(times[0], now)})` : ''}
                    </Text>
                  </View>
                }
              />
            );
          })}

          <ChangeList title="With one change" items={result.transfers} openRoute={openRoute} />
          <ChangeList title="With two changes" items={result.twoChanges} openRoute={openRoute} />

          {result.direct.length === 0 && result.transfers.length === 0 && result.twoChanges.length === 0 && (
            <EmptyState icon="close-circle-outline" title="No connection found" body="This dataset has no link between these two stops. Try a nearby larger town." />
          )}
        </View>
      )}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  form: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 16, backgroundColor: colors.ink },
  pick: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: 12,
  },
  pickLabel: { fontSize: 12, color: colors.muted, fontWeight: '600' },
  pickValue: { fontSize: 17, fontWeight: '700', color: colors.text },
  swap: { backgroundColor: colors.plate, borderRadius: 24, padding: 10, borderWidth: 2, borderColor: colors.card },
  none: { marginHorizontal: 16, color: colors.muted, fontSize: 14, marginBottom: 6 },
  legText: { fontSize: 13, color: colors.muted },
  legTitle: { fontSize: 15, fontWeight: '700', color: colors.text },
  bold: { fontWeight: '800', color: colors.text },
  transfer: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
    marginHorizontal: 16,
    marginBottom: 10,
    padding: 12,
    gap: 12,
  },
  leg: { flexDirection: 'row', alignItems: 'center', gap: 12 },
});
