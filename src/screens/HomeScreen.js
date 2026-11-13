import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { SearchBar, SectionTitle, EmptyState } from '../components/ui';
import RouteCard from '../components/RouteCard';
import StopRow from '../components/StopRow';
import { routes, stops, routesById, stopsById, districtCount } from '../data';
import { searchAll } from '../utils/search';
import { useApp } from '../context/AppContext';
import { colors, radius } from '../theme';

const POPULAR = [
  'Colombo - Kandy',
  'Colombo - Matara (Galle Road)',
  'Colombo - Anuradhapura',
  'Colombo - Jaffna',
  'Colombo - Badulla',
]
  .map((n) => routes.find((r) => r.name === n))
  .filter(Boolean);

export default function HomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { recents, addRecent, clearRecents, favorites } = useApp();
  const [query, setQuery] = useState('');
  const results = useMemo(() => (query.trim() ? searchAll(query) : null), [query]);

  const openRoute = (id) => {
    addRecent('route', id);
    navigation.navigate('RouteDetails', { routeId: id });
  };
  const openStop = (id) => {
    addRecent('stop', id);
    navigation.navigate('StopDetails', { stopId: id });
  };

  const tiles = [
    { label: 'Routes', sub: `${routes.length} routes`, icon: 'bus', go: () => navigation.navigate('Routes') },
    { label: 'Stops', sub: `${stops.length} stops`, icon: 'location', go: () => navigation.navigate('Stops') },
    { label: 'Trip Finder', sub: 'From A to B', icon: 'swap-horizontal', go: () => navigation.navigate('Trip') },
    {
      label: 'Saved',
      sub: `${favorites.routes.length + favorites.stops.length} saved`,
      icon: 'bookmark',
      go: () => navigation.navigate('Saved'),
    },
  ];

  return (
    <ScrollView style={s.screen} keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: 32 }}>
      <View style={[s.hero, { paddingTop: insets.top + 16 }]}>
        <Ionicons name="compass" size={150} color={colors.inkSoft} style={s.heroIcon} />
        <Text style={s.title}>LankaBus Compass</Text>
        <Text style={s.tagline}>Bus routes across all {districtCount} districts. Works offline.</Text>
        <View style={{ marginTop: 18 }}>
          <SearchBar onDark value={query} onChangeText={setQuery} placeholder="Search a route number, town or stop" />
        </View>
      </View>

      {results ? (
        <View>
          <SectionTitle>Routes</SectionTitle>
          {results.routes.length === 0 ? (
            <Text style={s.none}>No routes match "{query}"</Text>
          ) : (
            results.routes.map((r) => <RouteCard key={r.id} route={r} onPress={() => openRoute(r.id)} />)
          )}
          <SectionTitle>Stops</SectionTitle>
          {results.stops.length === 0 ? (
            <Text style={s.none}>No stops match "{query}"</Text>
          ) : (
            <View style={s.listBox}>
              {results.stops.map((st) => (
                <StopRow key={st.id} stop={st} showProvince onPress={() => openStop(st.id)} />
              ))}
            </View>
          )}
        </View>
      ) : (
        <View>
          <View style={s.tiles}>
            {tiles.map((t) => (
              <Pressable key={t.label} style={s.tile} onPress={t.go}>
                <Ionicons name={t.icon} size={26} color={colors.maroon} />
                <Text style={s.tileLabel}>{t.label}</Text>
                <Text style={s.tileSub}>{t.sub}</Text>
              </Pressable>
            ))}
          </View>

          {recents.length > 0 && (
            <View>
              <SectionTitle action="Clear" onAction={clearRecents}>
                Recently viewed
              </SectionTitle>
              <View style={s.listBox}>
                {recents.slice(0, 5).map((item) =>
                  item.type === 'route' ? (
                    <Pressable key={`r${item.id}`} style={s.recent} onPress={() => openRoute(item.id)}>
                      <Ionicons name="bus-outline" size={18} color={colors.muted} />
                      <Text style={s.recentText}>
                        {routesById[item.id].number}  {routesById[item.id].name}
                      </Text>
                    </Pressable>
                  ) : (
                    <Pressable key={`s${item.id}`} style={s.recent} onPress={() => openStop(item.id)}>
                      <Ionicons name="location-outline" size={18} color={colors.muted} />
                      <Text style={s.recentText}>{stopsById[item.id].name}</Text>
                    </Pressable>
                  )
                )}
              </View>
            </View>
          )}

          <SectionTitle>Popular routes</SectionTitle>
          {POPULAR.map((r) => (
            <RouteCard key={r.id} route={r} onPress={() => openRoute(r.id)} />
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  hero: { backgroundColor: colors.ink, paddingHorizontal: 16, paddingBottom: 20, overflow: 'hidden' },
  heroIcon: { position: 'absolute', right: -30, top: 10, opacity: 0.6 },
  title: { color: '#fff', fontSize: 30, fontWeight: '900', letterSpacing: 0.3 },
  tagline: { color: '#B8C7D6', fontSize: 15, marginTop: 4, maxWidth: 260 },
  tiles: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, padding: 16, paddingBottom: 0 },
  tile: {
    width: '48%',
    flexGrow: 1,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 14,
    gap: 2,
  },
  tileLabel: { fontSize: 16, fontWeight: '800', color: colors.text, marginTop: 6 },
  tileSub: { fontSize: 13, color: colors.muted },
  listBox: {
    marginHorizontal: 16,
    borderRadius: radius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.line,
  },
  recent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 13,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  recentText: { fontSize: 15, color: colors.text, flex: 1 },
  none: { marginHorizontal: 16, color: colors.muted, fontSize: 14, marginBottom: 6 },
});
