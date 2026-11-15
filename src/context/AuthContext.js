import React, { createContext, useContext, useEffect, useState } from 'react';
import { loadJSON, saveJSON } from '../utils/storage';

const USER_KEY = 'lbc:user';
const SESSION_KEY = 'lbc:session';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

// Local-only account stored on the device (no server, works offline).
export function AuthProvider({ children }) {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState(null); // saved account { name, pin }
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    (async () => {
      const saved = await loadJSON(USER_KEY, null);
      const session = await loadJSON(SESSION_KEY, false);
      setUser(saved);
      setLoggedIn(!!saved && session === true);
      setReady(true);
    })();
  }, []);

  const register = async (name, pin) => {
    const account = { name: name.trim(), pin };
    await saveJSON(USER_KEY, account);
    await saveJSON(SESSION_KEY, true);
    setUser(account);
    setLoggedIn(true);
  };

  // returns an error message, or null when the login succeeds
  const login = async (name, pin) => {
    if (!user) return 'No account found. Please create one.';
    if (user.name.toLowerCase() !== name.trim().toLowerCase() || user.pin !== pin) {
      return 'Wrong name or PIN.';
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