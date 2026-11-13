import AsyncStorage from '@react-native-async-storage/async-storage';

export const KEYS = {
  favorites: 'lbc:favorites',
  recents: 'lbc:recents',
  notes: 'lbc:notes',
  trip: 'lbc:trip',
};

export async function loadJSON(key, fallback) {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}

export async function saveJSON(key, value) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    // storage failure should never crash the app
  }
}
