'use client';

import { useAuth } from '@/context/AuthContext';
import { redirect } from 'next/navigation';
import MainLayout from '@/components/Layout/MainLayout';

export default function ClassesPage() {
  const { user, logout } = useAuth();

  if (!user) {
    redirect('/');
  }

  return (
    <MainLayout user={user} onLogout={logout}>
      <div className="space-y-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {user.role === 'admin' ? 'Gestion des utilisateurs' : 'Ma classe'}
          </h1>
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <p className="text-gray-600">
              {user.role === 'admin' 
                ? 'Modérez les comptes utilisateurs et gérez les accès.'
                : 'Découvrez votre classe, vos camarades et vos enseignants.'
              }
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {user.role === 'admin' 
                ? 'Fonctionnalités prévues : liste des utilisateurs, modération, permissions...'
                : 'Fonctionnalités prévues : liste des élèves, informations des enseignants, groupes de travail...'
              }
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}