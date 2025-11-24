import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);

  // Charger le profil au démarrage
  useEffect(() => {
    if (token) {
      fetchUser();
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const response = await axios.get('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération du profil:', error);
      logout();
    }
  };

  const signup = async (firstName, lastName, email, password, churchWebsite) => {
    setLoading(true);
    try {
      const response = await axios.post('/api/auth/signup', {
        firstName,
        lastName,
        email,
        password,
        churchWebsite,
      });
      const { token: newToken, user: newUser } = response.data;
      setToken(newToken);
      setUser(newUser);
      localStorage.setItem('token', newToken);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const { token: newToken, user: newUser } = response.data;
      setToken(newToken);
      setUser(newUser);
      localStorage.setItem('token', newToken);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  const updateProfile = async (firstName, lastName, churchWebsite) => {
    setLoading(true);
    try {
      const response = await axios.put(
        '/api/auth/profile',
        { firstName, lastName, churchWebsite },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(response.data.user);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        signup,
        login,
        logout,
        updateProfile,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
