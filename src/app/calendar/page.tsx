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

  return (
    <MainLayout user={user} onLogout={logout}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            {user.role === 'admin' ? 'Supervision des plannings' : 'Mon calendrier'}
          </h1>
        </div>

        {/* Calendrier pour les étudiants, vue admin pour les admins */}
        {user.role === 'student' ? (
          <Calendar />
        ) : (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
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