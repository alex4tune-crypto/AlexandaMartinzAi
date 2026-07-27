import React, { createContext, useContext, useState, useEffect } from 'react';
import { RoleType } from '../types';

interface User {
  id: string;
  email: string;
  name: string;
  role: RoleType;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (email: string, password: string, name: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for persisted user
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Mock login - replace with actual Firebase auth
      const mockUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        name: email.split('@')[0],
        role: 'Client / User',
        avatar: `https://ui-avatars.com/api/?name=${email}&background=0D8ABC&color=fff`
      };
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const signup = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      const mockUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        name,
        role: 'Client / User',
        avatar: `https://ui-avatars.com/api/?name=${name}&background=0D8ABC&color=fff`
      };
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
