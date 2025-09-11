'use client';

import { useAuth } from '@/context/AuthContext';
import { redirect } from 'next/navigation';
import MainLayout from '@/components/Layout/MainLayout';
import Calendar from '@/components/Calendar/Calendar';
export default function CalendarPage() {
  const { user, logout } = useAuth();

  if (!user) {
    redirect('/');
  }

  // Utilisateur test : interface normale mais données vides (sera géré par le composant Calendar)

  return (
    <MainLayout user={user} onLogout={logout}>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {user.role === 'admin' ? 'Supervision des plannings' : 
                 user.role === 'personal' ? 'Mon calendrier personnel' : 'Mon calendrier'}
              </h1>
              <p className="text-gray-600">
                {user.role === 'admin' 
                  ? 'Gérez et supervisez les plannings' 
                  : user.role === 'personal'
                  ? 'Organisez vos événements et activités personnelles'
                  : 'Visualisez vos événements et rendez-vous'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Calendrier pour les étudiants et personnels, vue admin pour les admins */}
        {user.role === 'student' || user.role === 'personal' ? (
          <Calendar />
        ) : (
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <p className="text-gray-600">
                Supervisez l&apos;activité des plannings utilisateurs.
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Fonctionnalités prévues : statistiques d&apos;usage, modération des contenus...
              </p>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}