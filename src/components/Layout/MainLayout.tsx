'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';
import Header from './Header';
import NotificationContainer from './NotificationContainer';
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
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Layout */}
      <div className="hidden md:flex">
        {/* Sidebar fixe pour desktop */}
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
          {/* Header intégré */}
          <Header user={user} onLogout={onLogout} />
          
          {/* Main content */}
          <main className="flex-1 p-6 overflow-y-auto page-animate">
            {children}
          </main>
          
          {/* Notifications globales */}
          <NotificationContainer />
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden flex flex-col min-h-screen">
        {/* Header mobile compact */}
        <Header user={user} onLogout={onLogout} isMobile={true} />
        
        {/* Main content avec padding bottom pour la nav */}
        <main className="flex-1 p-4 pb-20 overflow-y-auto page-animate">
          {children}
        </main>
        
        {/* Navigation mobile en bas */}
        <MobileNav userRole={user.role} />
        
        {/* Notifications globales */}
        <NotificationContainer />
      </div>
    </div>
  );
}