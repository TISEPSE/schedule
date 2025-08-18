'use client';

import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { User } from '@/types';

interface MainLayoutProps {
  user: User;
  children: React.ReactNode;
  onLogout: () => void;
}

export default function MainLayout({ user, children, onLogout }: MainLayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    // Initialiser directement avec la valeur du localStorage si disponible
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem('sidebarCollapsed');
      return savedState !== null ? JSON.parse(savedState) : false;
    }
    return false;
  });

  const handleToggle = () => {
    const newState = !isSidebarCollapsed;
    setIsSidebarCollapsed(newState);
    localStorage.setItem('sidebarCollapsed', JSON.stringify(newState));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar fixe */}
      <div className="fixed top-0 left-0 h-full z-30">
        <Sidebar
          userRole={user.role}
          isCollapsed={isSidebarCollapsed}
          onToggle={handleToggle}
        />
      </div>
      
      {/* Contenu principal avec marge pour la sidebar */}
      <div 
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isSidebarCollapsed ? 'ml-16' : 'ml-64'
        }`}
      >
        <Header user={user} onLogout={onLogout} />
        
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}