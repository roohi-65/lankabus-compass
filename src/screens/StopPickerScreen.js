import React, { useMemo, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { SearchBar, EmptyState } from '../components/ui';
import StopRow from '../components/StopRow';
import { stops } from '../data';
import { matchStop } from '../utils/search';
import { useApp } from '../context/AppContext';
import { colors } from '../theme';

// Modal list used by Trip Finder to choose the From or To stop.
export default function StopPickerScreen({ route, navigation }) {
  const { field } = route.params;
  const { setTrip } = useApp();
  const [query, setQuery] = useState('');
  const data = useMemo(
    () => stops.filter((s) => matchStop(s, query)).sort((a, b) => a.name.localeCompare(b.name)),
    [query]
  );

  return (
    <View style={s.screen}>
      <View style={s.search}>
        <SearchBar value={query} onChangeText={setQuery} placeholder="Search a town or stop" />
      </View>
      <FlatList
        data={data}
        keyExtractor={(st) => st.id}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => (
          <StopRow
            stop={item}
            showProvince
            onPress={() => {
              setTrip({ [field]: item.id });
              navigation.goBack();
            }}
          />
        )}
        ListEmptyComponent={<EmptyState icon="location-outline" title="No stops found" body="Try a different spelling." />}
      />
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  search: { padding: 16, borderBottomWidth: 1, borderBottomColor: colors.line },
});
