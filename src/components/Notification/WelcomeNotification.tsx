'use client';

import { useState, useEffect } from 'react';
import { X, CheckCircle } from 'lucide-react';

interface WelcomeNotificationProps {
  userName: string;
  userRole: 'admin' | 'student' | 'personal';
  show: boolean;
  onHide: () => void;
  startTime: number | null;
}

export default function WelcomeNotification({ userRole, show, onHide, startTime }: WelcomeNotificationProps) {
  // Calculer le temps écoulé pour synchroniser la barre de progression
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    if (!startTime) return;

    const updateElapsed = () => {
      const elapsed = Date.now() - startTime;
      setElapsedTime(elapsed);
    };

    // Mettre à jour immédiatement
    updateElapsed();

    // Puis mettre à jour toutes les 50ms pour une animation fluide
    const interval = setInterval(updateElapsed, 50);

    return () => clearInterval(interval);
  }, [startTime]);

  if (!show) return null;

  // Calculer le pourcentage pour la barre de progression (4000ms = 100%)
  const progressPercentage = Math.min((elapsedTime / 4000) * 100, 100);

  const message = userRole === 'admin' 
    ? `Bienvenue dans l'administration !` 
    : userRole === 'personal'
    ? `Bienvenue dans votre espace personnel !`
    : `Bienvenue dans votre espace étudiant !`;

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 max-w-sm">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <CheckCircle className="h-6 w-6 text-green-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900">
              Connexion réussie
            </p>
            <p className="text-sm text-gray-600 mt-1">
              {message}
            </p>
          </div>
          <button
            onClick={onHide}
            className="flex-shrink-0 ml-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        
        {/* Barre de progression */}
        <div className="mt-3 w-full bg-gray-200 rounded-full h-1">
          <div 
            className="bg-green-500 h-1 rounded-full transition-all duration-75 ease-linear"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}