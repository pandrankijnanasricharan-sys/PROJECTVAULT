import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../api.js';
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); const [loading, setLoading] = useState(true);
  useEffect(() => { if (localStorage.getItem('pv_token')) api('/auth/me').then(d => setUser(d.user)).catch(() => localStorage.removeItem('pv_token')).finally(() => setLoading(false)); else setLoading(false); }, []);
  const signIn = data => { localStorage.setItem('pv_token', data.token); setUser(data.user); };
  const signOut = () => { localStorage.removeItem('pv_token'); setUser(null); };
  const refreshUser = async () => { const d = await api('/auth/me'); setUser(d.user); };
  return <AuthContext.Provider value={{ user, loading, signIn, signOut, refreshUser }}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
