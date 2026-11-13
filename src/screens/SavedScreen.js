import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { EmptyState } from '../components/ui';
import RouteCard from '../components/RouteCard';
import StopRow from '../components/StopRow';
import { routesById, stopsById } from '../data';
import { useApp } from '../context/AppContext';
import { colors, radius } from '../theme';

export default function SavedScreen({ navigation }) {
  const { favorites, getNote } = useApp();
  const [tab, setTab] = useState('routes');
  const savedRoutes = favorites.routes.map((id) => routesById[id]).filter(Boolean);
  const savedStops = favorites.stops.map((id) => stopsById[id]).filter(Boolean);

  const Note = ({ type, id }) => {
    const n = getNote(type, id);
    return n ? <Text style={s.note}>Note: {n}</Text> : null;
  };

  return (
    <View style={s.screen}>
      <View style={s.segment}>
        {[
          ['routes', `Routes (${savedRoutes.length})`],
          ['stops', `Stops (${savedStops.length})`],
        ].map(([key, label]) => (
          <Pressable key={key} style={[s.seg, tab === key && s.segActive]} onPress={() => setTab(key)}>
            <Text style={[s.segText, tab === key && s.segTextActive]}>{label}</Text>
          </Pressable>
        ))}
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        {tab === 'routes' ? (
          savedRoutes.length === 0 ? (
            <EmptyState icon="heart-outline" title="No saved routes yet" body="Open a route and tap the heart to keep it here." />
          ) : (
            savedRoutes.map((r) => (
              <RouteCard
                key={r.id}
                route={r}
                onPress={() => navigation.navigate('RouteDetails', { routeId: r.id })}
                footer={getNote('route', r.id) ? <Note type="route" id={r.id} /> : null}
              />
            ))
          )
        ) : savedStops.length === 0 ? (
          <EmptyState icon="heart-outline" title="No saved stops yet" body="Open a stop and tap the heart to keep it here." />
        ) : (
          <View style={s.box}>
            {savedStops.map((st) => (
              <View key={st.id}>
                <StopRow stop={st} showProvince onPress={() => navigation.navigate('StopDetails', { stopId: st.id })} />
                {getNote('stop', st.id) ? (
                  <View style={s.stopNote}>
                    <Note type="stop" id={st.id} />
                  </View>
                ) : null}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  segment: {
    flexDirection: 'row',
    margin: 16,
    backgroundColor: colors.line,
    borderRadius: radius.md,
    padding: 3,
  },
  seg: { flex: 1, paddingVertical: 9, borderRadius: radius.sm, alignItems: 'center' },
  segActive: { backgroundColor: colors.ink },
  segText: { fontWeight: '700', color: colors.muted },
  segTextActive: { color: '#fff' },
  note: { fontSize: 13, color: colors.text, fontStyle: 'italic' },
  box: { marginHorizontal: 16, borderRadius: radius.md, overflow: 'hidden', borderWidth: 1, borderColor: colors.line },
  stopNote: { backgroundColor: colors.card, paddingHorizontal: 48, paddingBottom: 10, marginTop: -4 },
});
