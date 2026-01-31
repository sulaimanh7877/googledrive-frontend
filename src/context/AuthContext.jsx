import { createContext, useState, useEffect } from 'react';
import { getToken, removeToken, setToken } from '../utils/token.util';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setTokenState] = useState(getToken());
  const [user, setUser] = useState(null);

  const login = (newToken, userData) => {
    setToken(newToken);
    setTokenState(newToken);
    setUser(userData);
  };

  const logout = () => {
    removeToken();
    setTokenState(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};