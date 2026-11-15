import React, { createContext, useContext, useEffect, useState } from 'react';
import { loadJSON, saveJSON } from '../utils/storage';

const USER_KEY = 'lbc:user';
const SESSION_KEY = 'lbc:session';

export const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

// Sri Lankan mobile/landline: 0771234567, +94771234567 or 771234567
export const isPhone = (v) => /^(?:\+94|0)?\d{9}$/.test(v.replace(/[\s-]/g, ''));

// One canonical form so "0771234567" and "+94 77 123 4567" count as the same login.
export const normalizeId = (v) => {
  const t = v.trim();
  if (isEmail(t)) return t.toLowerCase();
  let d = t.replace(/\D/g, '');
  if (d.startsWith('94') && d.length === 11) d = d.slice(2);
  else if (d.startsWith('0') && d.length === 10) d = d.slice(1);
  return d;
};

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

// Local-only account stored on the device (no server, works offline).
export function AuthProvider({ children }) {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState(null); // { name, contact, id, password }
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    (async () => {
      let saved = await loadJSON(USER_KEY, null);
      // ignore an old PIN-style account from an earlier version
      if (saved && !saved.id) saved = null;
      const session = await loadJSON(SESSION_KEY, false);
      setUser(saved);
      setLoggedIn(!!saved && session === true);
      setReady(true);
    })();
  }, []);

  const register = async (name, contact, password) => {
    const account = { name: name.trim(), contact: contact.trim(), id: normalizeId(contact), password };
    await saveJSON(USER_KEY, account);
    await saveJSON(SESSION_KEY, true);
    setUser(account);
    setLoggedIn(true);
  };

  // returns an error message, or null when the login succeeds
  const login = async (contact, password) => {
    if (!user) return 'No account found. Please create one.';
    if (user.id !== normalizeId(contact) || user.password !== password) {
      return 'Wrong email/phone or password.';
    }
    await saveJSON(SESSION_KEY, true);
    setLoggedIn(true);
    return null;
  };

  const logout = async () => {
    await saveJSON(SESSION_KEY, false);
    setLoggedIn(false);
  };

  const resetAccount = async () => {
    await saveJSON(USER_KEY, null);
    await saveJSON(SESSION_KEY, false);
    setUser(null);
    setLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ ready, user, loggedIn, register, login, logout, resetAccount }}>
      {children}
    </AuthContext.Provider>
  );
}