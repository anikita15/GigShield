import React, { useState, useEffect, createContext, useContext } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('gigshield_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      const storedUser = localStorage.getItem('gigshield_user');
      if (storedUser) setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, [token]);

  const login = (userData, userToken) => {
    localStorage.setItem('gigshield_token', userToken);
    localStorage.setItem('gigshield_user', JSON.stringify(userData));
    setToken(userToken);
    setUser(userData);
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Proceed with local logout even if server call fails
    }
    localStorage.removeItem('gigshield_token');
    localStorage.removeItem('gigshield_user');
    setToken(null);
    setUser(null);
  };

  const updateUserInfo = (updates) => {
    const newUser = { ...user, ...updates };
    localStorage.setItem('gigshield_user', JSON.stringify(newUser));
    setUser(newUser);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, updateUserInfo }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
