import React, { useEffect, useRef } from 'react';
import { View, Text, Image, Animated, Easing, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';

const { width } = Dimensions.get('window');

export default function SplashView() {
  const busX = useRef(new Animated.Value(-60)).current;
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fade, { toValue: 1, duration: 600, useNativeDriver: true }).start();
    Animated.loop(
      Animated.timing(busX, {
        toValue: width + 60,
        duration: 2400,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  return (
    <View style={s.wrap}>
      <Animated.View style={[s.center, { opacity: fade }]}>
        <Image source={require('../../assets/icon.png')} style={s.logo} />
        <Text style={s.title}>LankaBus Compass</Text>
        <View style={s.plate}>
          <Text style={s.plateText}>OFFLINE BUS GUIDE</Text>
        </View>
        <Text style={s.tag}>All 25 districts, no internet needed</Text>
      </Animated.View>

      <View style={s.road}>
        <View style={s.dashes}>
          {Array.from({ length: 12 }).map((_, i) => (
            <View key={i} style={s.dash} />
          ))}
        </View>
        <Animated.View style={[s.bus, { transform: [{ translateX: busX }] }]}>
          <Ionicons name="bus" size={44} color={colors.plate} />
        </Animated.View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.ink },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  logo: { width: 120, height: 120, borderRadius: 28, borderWidth: 3, borderColor: colors.plate },
  title: { color: '#fff', fontSize: 30, fontWeight: '900', marginTop: 22, letterSpacing: 0.5 },
  plate: {
    marginTop: 12,
    backgroundColor: colors.plate,
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 6,
    paddingHorizontal: 14,
    paddingVertical: 4,
  },
  plateText: { color: colors.ink, fontWeight: '900', fontSize: 13, letterSpacing: 1.5 },
  tag: { color: '#B8C7D6', fontSize: 14, marginTop: 14 },
  road: {
    height: 110,
    backgroundColor: '#0A1828',
    borderTopWidth: 3,
    borderTopColor: colors.plate,
    justifyContent: 'center',
  },
  dashes: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 28 },
  dash: { width: 22, height: 4, borderRadius: 2, backgroundColor: '#3A5573' },
  bus: { position: 'absolute', top: 10, left: 0 },
});