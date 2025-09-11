'use client';

import { useAuth } from '@/context/AuthContext';
import { redirect } from 'next/navigation';
import MainLayout from '@/components/Layout/MainLayout';

export default function ProfilePage() {
  const { user, logout } = useAuth();

  if (!user) {
    redirect('/');
  }

  return (
    <MainLayout user={user} onLogout={logout}>
      <div className="space-y-6">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Mon profil</h1>
              <p className="text-gray-600">Gérez vos informations personnelles et préférences</p>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <p className="text-sm text-gray-500 mt-2">
              Fonctionnalités prévues : informations personnelles, photo, préférences, etc.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}