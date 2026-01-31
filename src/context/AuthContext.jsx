import { createContext, useState, useEffect } from 'react';
import { getToken, removeToken, setToken } from '../utils/token.util';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setTokenState] = useState(getToken());
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user');
      if (!stored) return null;
      return JSON.parse(stored);
    } catch (err) {
      console.warn('Invalid user data in localStorage, clearing it');
      localStorage.removeItem('user');
      return null;
    }
  });

  const login = (newToken, userData) => {
    setToken(newToken);
    setTokenState(newToken);
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    removeToken();
    localStorage.removeItem('user');
    setTokenState(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};