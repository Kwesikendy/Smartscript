import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Keep loading state
  const navigate = useNavigate();

  // Helper to persist token and keep axios in sync via interceptors
  const persistToken = (t) => { // Persist token helper
    setToken(t);
    if (t) localStorage.setItem('token', t);
    else localStorage.removeItem('token');
    // Also set axios default header immediately to avoid any race with interceptors
    try {
      if (t) {
        api.defaults.headers.common['Authorization'] = `Bearer ${t}`;
      } else {
        delete api.defaults.headers.common['Authorization'];
      }
    } catch (e) {
      // noop
    }
  };

  // Fetch current user's profile from /auth/me
  const fetchMe = async () => { // Fetch current user profile
    try {
      // Explicitly include Authorization header to avoid timing issues
      const currentToken = localStorage.getItem('token');
      const res = await api.get('/auth/me', {
        headers: currentToken ? { Authorization: `Bearer ${currentToken}` } : undefined,
      });
      const payload = res.data && res.data.success ? res.data.data : res.data;
      setUser(payload || null);
    } catch (err) {
      // If unauthorized, clear tokens and user
      if (err.response && err.response.status === 401) {
        persistToken(null);
        localStorage.removeItem('refreshToken');
        setUser(null);
        // don't navigate automatically on mount
      } else {
        console.error('Failed to fetch user profile', err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // On mount, if token exists, fetch profile
    if (token) {
      fetchMe();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const tokenData = res.data.data; // Backend returns: { success: true, data: { token: "...", refresh_token: "..." } }
    persistToken(tokenData.token);

    // Store refresh token if provided
    if (tokenData.refresh_token) {
      localStorage.setItem('refreshToken', tokenData.refresh_token);
    }

    // Fetch and set user, then navigate
    await fetchMe();
    navigate('/dashboard');
  };

  const logout = () => {
    persistToken(null);
    setUser(null);
    localStorage.removeItem('refreshToken');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ token, user, setUser, login, logout, isAuthenticated: !!token, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
