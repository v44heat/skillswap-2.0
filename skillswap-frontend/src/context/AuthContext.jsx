import React, { createContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = useCallback(async () => {
    try {
      const res = await authService.me();
      setUser(res.data);
    } catch {
      localStorage.removeItem('ss_token');
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('ss_token');
    if (token) {
      fetchCurrentUser().finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [fetchCurrentUser]);

  const login = async (credentials) => {
    const res = await authService.login(credentials);
    localStorage.setItem('ss_token', res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  const logout = async () => {
    try { await authService.logout(); } catch { /* ignore */ }
    localStorage.removeItem('ss_token');
    setUser(null);
  };

  const register = async (data) => {
    const res = await authService.register(data);
    localStorage.setItem('ss_token', res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, logout, register, fetchCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
}
