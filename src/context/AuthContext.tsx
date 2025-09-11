'use client';

import { createContext, useContext, useState, useEffect } from 'react';

// Types locaux pour éviter les imports de modules serveur
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'student' | 'admin' | 'personal';
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
  showWelcome: boolean;
  hideWelcome: () => void;
  welcomeStartTime: number | null;
  initializeDatabase: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
      // Simuler un délai d'API
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Appel API pour l'authentification
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Erreur de connexion');
      }

      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
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

  const initializeDatabase = async () => {
    try {
      // L'initialisation se fait maintenant côté serveur via les API
      console.log('Initialisation déplacée côté serveur');
    } catch (error) {
      console.error('Erreur d\'initialisation de la DB:', error);
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
      initializeDatabase,
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