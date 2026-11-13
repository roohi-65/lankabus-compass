import React, { useMemo, useState } from 'react';
import { View, Text, SectionList, StyleSheet } from 'react-native';
import { SearchBar, FilterChips, EmptyState } from '../components/ui';
import StopRow from '../components/StopRow';
import { stops, provinces } from '../data';
import { matchStop } from '../utils/search';
import { useApp } from '../context/AppContext';
import { colors } from '../theme';

export default function StopsScreen({ navigation }) {
  const { addRecent } = useApp();
  const [query, setQuery] = useState('');
  const [province, setProvince] = useState('All provinces');

  const { sections, total } = useMemo(() => {
    const filtered = stops.filter(
      (st) => matchStop(st, query) && (province === 'All provinces' || st.province === province)
    );
    const byDistrict = {};
    filtered.forEach((st) => (byDistrict[st.district] = [...(byDistrict[st.district] || []), st]));
    const secs = Object.keys(byDistrict)
      .sort()
      .map((d) => ({ title: d, data: byDistrict[d].sort((a, b) => a.name.localeCompare(b.name)) }));
    return { sections: secs, total: filtered.length };
  }, [query, province]);

  return (
    <View style={s.screen}>
      <View style={s.filters}>
        <View style={{ paddingHorizontal: 16, paddingTop: 12 }}>
          <SearchBar value={query} onChangeText={setQuery} placeholder="Search stops or districts" />
        </View>
        <FilterChips options={['All provinces', ...provinces]} value={province} onChange={setProvince} />
        <Text style={s.count}>
          {total} {total === 1 ? 'stop' : 'stops'} in {sections.length} {sections.length === 1 ? 'district' : 'districts'}
        </Text>
      </View>
      <SectionList
        sections={sections}
        keyExtractor={(st) => st.id}
        keyboardShouldPersistTaps="handled"
        stickySectionHeadersEnabled
        contentContainerStyle={{ paddingBottom: 24 }}
        renderSectionHeader={({ section }) => (
          <View style={s.header}>
            <Text style={s.headerText}>{section.title}</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <StopRow
            stop={item}
            onPress={() => {
              addRecent('stop', item.id);
              navigation.navigate('StopDetails', { stopId: item.id });
            }}
          />
        )}
        ListEmptyComponent={<EmptyState icon="location-outline" title="No stops found" body="Try a different spelling or choose All provinces." />}
      />
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  filters: { borderBottomWidth: 1, borderBottomColor: colors.line },
  count: { paddingHorizontal: 16, paddingBottom: 8, color: colors.muted, fontSize: 13, fontWeight: '600' },
  header: { backgroundColor: colors.ink, paddingHorizontal: 16, paddingVertical: 6 },
  headerText: { color: '#fff', fontWeight: '800', fontSize: 14 },
});
