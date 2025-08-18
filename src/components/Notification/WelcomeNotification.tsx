'use client';

import { useState, useEffect } from 'react';
import { X, CheckCircle } from 'lucide-react';

interface WelcomeNotificationProps {
  userName: string;
  userRole: 'admin' | 'student';
  show: boolean;
}

export default function WelcomeNotification({ userName, userRole, show }: WelcomeNotificationProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 4000); // Disparaît après 4 secondes

      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [show]);

  if (!isVisible) return null;

  const message = userRole === 'admin' 
    ? `Bonjour ${userName}, bienvenue dans l'administration !` 
    : `Salut ${userName} ! Prêt pour une nouvelle journée ?`;

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
            onClick={() => setIsVisible(false)}
            className="flex-shrink-0 ml-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        
        {/* Barre de progression */}
        <div className="mt-3 w-full bg-gray-200 rounded-full h-1">
          <div className="bg-green-500 h-1 rounded-full animate-progress-bar"></div>
        </div>
      </div>
    </div>
  );
}