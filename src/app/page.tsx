'use client';

import { useAuth } from '@/context/AuthContext';
import AuthFlow from '@/components/Auth/AuthFlow';
import MainLayout from '@/components/Layout/MainLayout';
import Dashboard from '@/components/Dashboard/Dashboard';

export default function Home() {
  const { user, login, logout, isLoading, error } = useAuth();

  if (!user) {
    return (
      <AuthFlow
        onLogin={login}
        isLoading={isLoading}
        error={error}
      />
    );
  }

  return (
    <MainLayout user={user} onLogout={logout}>
      <Dashboard user={user} />
    </MainLayout>
  );
}
