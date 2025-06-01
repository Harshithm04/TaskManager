import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';

// Keys for localStorage
const ACCESS_TOKEN_KEY = 'tm_access';
const REFRESH_TOKEN_KEY = 'tm_refresh';
const USER_KEY = 'tm_user'; // we’ll store { username, user_id }

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [accessToken, _setAccessToken] = useState(localStorage.getItem(ACCESS_TOKEN_KEY));
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem(REFRESH_TOKEN_KEY));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem(USER_KEY)) || null);

  // Set access token both in state and localStorage
  const setAccessToken = (token) => {
    _setAccessToken(token);
    if (token) localStorage.setItem(ACCESS_TOKEN_KEY, token);
    else localStorage.removeItem(ACCESS_TOKEN_KEY);
  };

  // Login: save tokens and fetch user info if needed
  const login = ({ access, refresh, userData }) => {
    setAccessToken(access);
    setRefreshToken(refresh);
    localStorage.setItem(REFRESH_TOKEN_KEY, refresh);

    if (userData) {
      setUser(userData);
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
    }
    navigate('/dashboard');
  };

  // Logout: clear everything and redirect to login
  const logout = () => {
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    navigate('/login');
  };

  // Helper to register user context functions to be used outside hooks
  useEffect(() => {
    // Expose helpers for axios interceptors
    window.tmAuth = {
      getAccessToken: () => accessToken,
      getRefreshToken: () => refreshToken,
      setAccessToken,
      logout,
    };
  }, [accessToken, refreshToken]);

  return (
    <AuthContext.Provider value={{ accessToken, refreshToken, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to consume AuthContext
export function useAuth() {
  return useContext(AuthContext);
}

// These are for axiosConfig.js to import:
export function getAccessToken() {
  return window.tmAuth?.getAccessToken();
}

export function getRefreshToken() {
  return window.tmAuth?.getRefreshToken();
}

export function setAccessToken(token) {
  window.tmAuth?.setAccessToken(token);
}

export function logout() {
  window.tmAuth?.logout();
}
