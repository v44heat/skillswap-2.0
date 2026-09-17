import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import * as SecureStore from 'expo-secure-store';
import { authService } from '../services/api';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]     = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = useCallback(async () => {
    try {
      const res = await authService.me();
      setUser(res.data);
    } catch {
      await SecureStore.deleteItemAsync('ss_token');
      setUser(null);
    }
  }, []);

  useEffect(() => {
    SecureStore.getItemAsync('ss_token').then((token) => {
      if (token) fetchMe().finally(() => setLoading(false));
      else setLoading(false);
    });
  }, [fetchMe]);

  const login = async (identifier, password) => {
    const res = await authService.login({ identifier, password });
    await SecureStore.setItemAsync('ss_token', res.data.token);
    setUser(res.data.user);
    return res.data.user;
  };

  const register = async (data) => {
    const res = await authService.register(data);
    await SecureStore.setItemAsync('ss_token', res.data.token);
    setUser(res.data.user);
    return res.data.user;
  };

  const logout = async () => {
    try { await authService.logout(); } catch { /* ignore */ }
    await SecureStore.deleteItemAsync('ss_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};
