import React, { createContext, useContext, useEffect, useState } from 'react';
import { KEYS, loadJSON, saveJSON } from '../utils/storage';

const AppContext = createContext(null);
export const useApp = () => useContext(AppContext);

const MAX_RECENTS = 8;

export function AppProvider({ children }) {
  const [ready, setReady] = useState(false);
  const [favorites, setFavorites] = useState({ routes: [], stops: [] });
  const [recents, setRecents] = useState([]); // [{ type: 'route' | 'stop', id }]
  const [notes, setNotes] = useState({}); // { 'route:R001': 'text' }
  const [trip, setTripState] = useState({ fromId: null, toId: null });

  useEffect(() => {
    (async () => {
      const [f, r, n, t] = await Promise.all([
        loadJSON(KEYS.favorites, { routes: [], stops: [] }),
        loadJSON(KEYS.recents, []),
        loadJSON(KEYS.notes, {}),
        loadJSON(KEYS.trip, { fromId: null, toId: null }),
      ]);
      setFavorites(f);
      setRecents(r);
      setNotes(n);
      setTripState(t);
      setReady(true);
    })();
  }, []);

  const favKey = (type) => (type === 'route' ? 'routes' : 'stops');

  const isFavorite = (type, id) => favorites[favKey(type)].includes(id);

  const toggleFavorite = (type, id) => {
    const key = favKey(type);
    const has = favorites[key].includes(id);
    const next = {
      ...favorites,
      [key]: has ? favorites[key].filter((x) => x !== id) : [id, ...favorites[key]],
    };
    setFavorites(next);
    saveJSON(KEYS.favorites, next);
  };

  const addRecent = (type, id) => {
    const next = [{ type, id }, ...recents.filter((x) => !(x.type === type && x.id === id))].slice(
      0,
      MAX_RECENTS
    );
    setRecents(next);
    saveJSON(KEYS.recents, next);
  };

  const clearRecents = () => {
    setRecents([]);
    saveJSON(KEYS.recents, []);
  };

  const setNote = (type, id, text) => {
    const key = `${type}:${id}`;
    const next = { ...notes };
    if (text.trim()) next[key] = text.trim();
    else delete next[key];
    setNotes(next);
    saveJSON(KEYS.notes, next);
  };
  const getNote = (type, id) => notes[`${type}:${id}`] || '';

  const setTrip = (patch) => {
    const next = { ...trip, ...patch };
    setTripState(next);
    saveJSON(KEYS.trip, next);
  };

  const value = {
    ready,
    favorites,
    recents,
    trip,
    isFavorite,
    toggleFavorite,
    addRecent,
    clearRecents,
    getNote,
    setNote,
    setTrip,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
