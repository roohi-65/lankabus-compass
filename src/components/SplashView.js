import React from 'react';
import { View, Text, Image, ActivityIndicator, StyleSheet } from 'react-native';
import { colors } from '../theme';

export default function SplashView() {
  return (
    <View style={s.wrap}>
      <Image source={require('../../assets/icon.png')} style={s.logo} />
      <Text style={s.title}>LankaBus Compass</Text>
      <Text style={s.tag}>Sri Lanka bus routes, offline</Text>
      <ActivityIndicator color={colors.plate} style={{ marginTop: 28 }} />
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.ink, alignItems: 'center', justifyContent: 'center' },
  logo: { width: 120, height: 120, borderRadius: 28, borderWidth: 3, borderColor: colors.plate },
  title: { color: '#fff', fontSize: 28, fontWeight: '900', marginTop: 20 },
  tag: { color: '#B8C7D6', fontSize: 15, marginTop: 6 },
});