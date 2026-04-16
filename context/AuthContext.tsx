import * as React from 'react';
import { createContext, useContext, useState, useEffect } from 'react';

import { UserProfile } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  login: (email: string, name?: string, uid?: string) => void;
  updateUser: (profile: Partial<UserProfile>) => void;
  logout: () => void;
  isAuthReady: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('n8n_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsAuthReady(true);
  }, []);

  const login = (email: string, name: string = 'n8n Expert', uid: string = 'user1') => {
    const newUser: UserProfile = { 
      email, 
      displayName: name, 
      uid, 
      createdAt: Date.now() 
    };
    setUser(newUser);
    localStorage.setItem('n8n_user', JSON.stringify(newUser));
  };

  const updateUser = (profile: Partial<UserProfile>) => {
    if (!user) return;
    const updatedUser = { ...user, ...profile };
    setUser(updatedUser);
    localStorage.setItem('n8n_user', JSON.stringify(updatedUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('n8n_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, updateUser, logout, isAuthReady }}>
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
