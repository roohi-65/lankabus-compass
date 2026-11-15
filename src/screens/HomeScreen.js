import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, Pressable, Image, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { SearchBar, SectionTitle } from '../components/ui';
import RouteCard from '../components/RouteCard';
import StopRow from '../components/StopRow';
import { routes, stops, routesById, stopsById, districtCount } from '../data';
import { searchAll } from '../utils/search';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
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
  const { user, logout } = useAuth();
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
        <View style={s.userRow}>
          <Text style={s.hello}>Hello, {user ? user.name : ''}</Text>
          <Pressable onPress={logout} hitSlop={10} style={s.logout}>
            <Ionicons name="log-out-outline" size={18} color="#fff" />
            <Text style={s.logoutText}>Log out</Text>
          </Pressable>
        </View>

        <View style={s.brand}>
          <Image source={require('../../assets/icon.png')} style={s.logo} />
          <View style={{ flex: 1 }}>
            <Text style={s.title}>LankaBus Compass</Text>
            <Text style={s.tagline}>Bus routes across all {districtCount} districts. Works offline.</Text>
          </View>
        </View>

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
  userRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  hello: { color: colors.plate, fontWeight: '800', fontSize: 15 },
  logout: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  logoutText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  logo: { width: 64, height: 64, borderRadius: 16, borderWidth: 2, borderColor: colors.plate },
  title: { color: '#fff', fontSize: 26, fontWeight: '900' },
  tagline: { color: '#B8C7D6', fontSize: 14, marginTop: 2 },
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