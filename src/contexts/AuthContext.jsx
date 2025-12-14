import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/auth/authServive.js';

// Create the Auth Context
const AuthContext = createContext(undefined);

// Custom hook to use the Auth Context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Auth Provider Component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for authenticated user on mount
  useEffect(() => {
    async function loadUser() {
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Error loading user:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  // Login function
  const login = async (email, password) => {
    const result = await authService.login(email, password);
    const currentUser = await authService.getCurrentUser();
    setUser(currentUser);
    return result;
  };

  // Logout function
  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  // Register function
  const register = async (email, password, firstName, lastName) => {
    const result = await authService.register(
      email,
      password,
      firstName,
      lastName
    );
    const currentUser = await authService.getCurrentUser();
    setUser(currentUser);
    return result;
  };

  // Refresh user data
  const refreshUser = async () => {
    const currentUser = await authService.getCurrentUser();
    setUser(currentUser);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    register,
    refreshUser,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
