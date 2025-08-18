'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
  showWelcome: boolean;
  hideWelcome: () => void;
  welcomeStartTime: number | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@app.com',
    firstName: 'Admin',
    lastName: 'System',
    role: 'admin',
  },
  {
    id: '2',
    email: 'marie.dupont@student.com',
    firstName: 'Marie',
    lastName: 'Dupont',
    role: 'student',
  },
  {
    id: '3',
    email: 'thomas.martin@student.com',
    firstName: 'Thomas',
    lastName: 'Martin',
    role: 'student',
  },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const [welcomeTimer, setWelcomeTimer] = useState<NodeJS.Timeout | null>(null);
  const [welcomeStartTime, setWelcomeStartTime] = useState<number | null>(null);

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      // Ne pas afficher la notification de bienvenue lors du chargement de la page
      // La notification ne doit s'afficher qu'après une connexion manuelle
    }
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock authentication
      const foundUser = mockUsers.find(u => u.email === email);
      
      if (!foundUser) {
        throw new Error('Email ou mot de passe incorrect');
      }

      // In real app, you'd validate password here
      const validPasswords: Record<string, string> = {
        'admin@app.com': 'admin123',
        'marie.dupont@student.com': 'marie123',
        'thomas.martin@student.com': 'thomas123',
      };

      if (validPasswords[email] !== password) {
        throw new Error('Email ou mot de passe incorrect');
      }

      setUser(foundUser);
      localStorage.setItem('user', JSON.stringify(foundUser));
      setShowWelcome(true);
      
      // Enregistrer le moment de début
      const startTime = Date.now();
      setWelcomeStartTime(startTime);
      
      // Démarrer le timer une seule fois
      if (welcomeTimer) {
        clearTimeout(welcomeTimer);
      }
      
      const timer = setTimeout(() => {
        setShowWelcome(false);
        setWelcomeTimer(null);
        setWelcomeStartTime(null);
      }, 4000);
      
      setWelcomeTimer(timer);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  const hideWelcome = () => {
    setShowWelcome(false);
    setWelcomeStartTime(null);
    if (welcomeTimer) {
      clearTimeout(welcomeTimer);
      setWelcomeTimer(null);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    setShowWelcome(false);
    setWelcomeStartTime(null);
    if (welcomeTimer) {
      clearTimeout(welcomeTimer);
      setWelcomeTimer(null);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isLoading,
      error,
      showWelcome,
      hideWelcome,
      welcomeStartTime,
    }}>
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