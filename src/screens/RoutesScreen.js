import React, { useMemo, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { SearchBar, FilterChips, EmptyState } from '../components/ui';
import RouteCard from '../components/RouteCard';
import { routes, routeTypes, provinces, stopsById } from '../data';
import { matchRoute } from '../utils/search';
import { useApp } from '../context/AppContext';
import { colors } from '../theme';

const FARES = {
  'Any fare': () => true,
  'Under Rs 200': (f) => f < 200,
  'Rs 200 to 500': (f) => f >= 200 && f <= 500,
  'Over Rs 500': (f) => f > 500,
};

export default function RoutesScreen({ navigation }) {
  const { addRecent } = useApp();
  const [query, setQuery] = useState('');
  const [type, setType] = useState('All types');
  const [province, setProvince] = useState('All provinces');
  const [fare, setFare] = useState('Any fare');

  const data = useMemo(
    () =>
      routes.filter(
        (r) =>
          matchRoute(r, query) &&
          (type === 'All types' || r.type === type) &&
          FARES[fare](r.fare) &&
          (province === 'All provinces' || r.stops.some((id) => stopsById[id].province === province))
      ),
    [query, type, province, fare]
  );

  return (
    <View style={s.screen}>
      <View style={s.filters}>
        <View style={{ paddingHorizontal: 16, paddingTop: 12 }}>
          <SearchBar value={query} onChangeText={setQuery} placeholder="Route number, town or stop" />
        </View>
        <FilterChips options={['All types', ...routeTypes]} value={type} onChange={setType} />
        <FilterChips options={Object.keys(FARES)} value={fare} onChange={setFare} />
        <FilterChips options={['All provinces', ...provinces]} value={province} onChange={setProvince} />
        <Text style={s.count}>
          {data.length} {data.length === 1 ? 'route' : 'routes'} found
        </Text>
      </View>
      <FlatList
        data={data}
        keyExtractor={(r) => r.id}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingTop: 4, paddingBottom: 24 }}
        renderItem={({ item }) => (
          <RouteCard
            route={item}
            onPress={() => {
              addRecent('route', item.id);
              navigation.navigate('RouteDetails', { routeId: item.id });
            }}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            title="No routes match these filters"
            body="Clear the search box or choose All types, Any fare or All provinces."
          />
        }
      />
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  filters: { backgroundColor: colors.bg, borderBottomWidth: 1, borderBottomColor: colors.line },
  count: { paddingHorizontal: 16, paddingBottom: 8, color: colors.muted, fontSize: 13, fontWeight: '600' },
});
