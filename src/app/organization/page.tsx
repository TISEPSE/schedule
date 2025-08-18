'use client';

import { useAuth } from '@/context/AuthContext';
import { redirect } from 'next/navigation';
import MainLayout from '@/components/Layout/MainLayout';

export default function OrganizationPage() {
  const { user, logout } = useAuth();

  if (!user) {
    redirect('/');
  }

  return (
    <MainLayout user={user} onLogout={logout}>
      <div className="space-y-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {user.role === 'admin' ? 'Structure de l\'application' : 'Mon environnement d\'étude'}
          </h1>
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <p className="text-gray-600">
              {user.role === 'admin' 
                ? 'Gérez la structure et l\'organisation de l\'application.'
                : 'Visualisez votre environnement d\'étude : école, groupes, matières...'
              }
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {user.role === 'admin' 
                ? 'Fonctionnalités prévues : gestion des établissements, modération, statistiques...'
                : 'Fonctionnalités prévues : votre école, vos groupes d\'étude, vos matières principales...'
              }
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}