
import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '@/lib/axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedUser = localStorage.getItem('campusbuzz_user');
      if (!storedUser) {
        setLoading(false);
        return;
      }

      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);

      try {
        // Verification/Refresh from backend
        const { data } = await api.get(`/users/${parsedUser._id}`);
        const fullUser = { ...data, token: parsedUser.token };
        setUser(fullUser);
        localStorage.setItem('campusbuzz_user', JSON.stringify(fullUser));
      } catch (error) {
        console.error("Session verification failed:", error);
        if (error.response?.status === 401) {
          logout();
        }
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = (userData, token) => {
    const fullUser = { ...userData, token };
    setUser(fullUser);
    localStorage.setItem('campusbuzz_user', JSON.stringify(fullUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('campusbuzz_user');
  };

  const updateUser = (updatedData) => {
    const fullUser = { ...user, ...updatedData };
    setUser(fullUser);
    localStorage.setItem('campusbuzz_user', JSON.stringify(fullUser));
  };

  const value = {
    user,
    login,
    logout,
    updateUser,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
