'use client';

import { useState, useRef, useEffect } from 'react';
import { Bell, Search, LogOut, X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { User } from '@/types';
import Image from 'next/image';
import Breadcrumb from './Breadcrumb';

// Mock notifications data - vide par défaut
const mockNotifications: Array<{id: string; message: string; type: string; read: boolean; title: string; time: string}> = [];

interface HeaderProps {
  user: User;
  onLogout: () => void;
  isMobile?: boolean;
}

export default function Header({ user, onLogout, isMobile = false }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const unreadCount = mockNotifications.filter(n => !n.read).length;

  // Gestion du clic en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

  // Gestion des touches clavier
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showNotifications]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertCircle className="h-4 w-4 text-orange-500" />;
      case 'info': 
      default: return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  if (isMobile) {
    return (
      <header className="bg-white border-b border-gray-200 px-4 py-3 w-full">
        <div className="flex items-center justify-between">
          {/* Logo + Title compacte sur mobile */}
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">M</span>
            </div>
            <h1 className="text-lg font-bold text-gray-900">MySchedule</h1>
          </div>
          
          {/* Actions compactes */}
          <div className="flex items-center space-x-2">
            {/* Notifications */}
            <div className="relative" ref={notificationRef}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 h-2 w-2 bg-red-500 rounded-full"></span>
                )}
              </button>

              {/* Dropdown des notifications mobile */}
              {showNotifications && (
                <div 
                  className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-gray-200 z-40 focus:outline-none"
                  tabIndex={-1}
                  autoFocus
                >
                  <div className="p-3 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-semibold text-gray-900">Notifications</h3>
                      <button 
                        onClick={() => setShowNotifications(false)}
                        className="p-1 text-gray-400 hover:text-gray-600 rounded-lg"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="max-h-64 overflow-y-auto">
                    {mockNotifications.length > 0 ? (
                      <div className="p-2 space-y-2">
                        {mockNotifications.map((notification) => (
                          <div 
                            key={notification.id} 
                            className={`p-2 rounded-lg hover:bg-gray-50 transition-colors ${
                              notification.read ? 'bg-gray-25' : 'bg-blue-25'
                            }`}
                          >
                            <div className="flex items-start space-x-2">
                              <div className="flex-shrink-0 mt-0.5">
                                {getNotificationIcon(notification.type)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className={`text-sm font-medium ${
                                  notification.read ? 'text-gray-700' : 'text-gray-900'
                                }`}>
                                  {notification.title}
                                </p>
                                <p className={`text-xs mt-0.5 ${
                                  notification.read ? 'text-gray-500' : 'text-gray-600'
                                }`}>
                                  {notification.message}
                                </p>
                                <span className="text-xs text-gray-400">{notification.time}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 text-center">
                        <Bell className="h-6 w-6 text-gray-300 mx-auto mb-2" />
                        <p className="text-gray-500 text-sm">Aucune notification</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Avatar compact */}
            {user.avatar ? (
              <Image
                src={user.avatar}
                alt={`${user.firstName} ${user.lastName}`}
                width={32}
                height={32}
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user.firstName[0]}{user.lastName[0]}
                </span>
              </div>
            )}
          </div>
        </div>
      </header>
    );
  }

  // Desktop version
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 w-full">
      <div className="flex items-center justify-between">
        {/* Breadcrumb Navigation */}
        <div className="flex-1">
          <Breadcrumb />
        </div>
        
        {/* Search Bar - moved to right */}
        <div className="max-w-sm mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400 bg-white"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-3 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Bell className="h-4.5 w-4.5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-2.5 w-2.5 bg-red-500 rounded-full"></span>
              )}
            </button>

            {/* Dropdown des notifications */}
            {showNotifications && (
              <div 
                className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-40 focus:outline-none"
                tabIndex={-1}
                autoFocus
              >
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                    <button 
                      onClick={() => setShowNotifications(false)}
                      className="p-1 text-gray-400 hover:text-gray-600 rounded-lg"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  {unreadCount > 0 && (
                    <p className="text-sm text-blue-600 mt-1">{unreadCount} nouvelle(s) notification(s)</p>
                  )}
                </div>

                <div className="max-h-96 overflow-y-auto">
                  {mockNotifications.length > 0 ? (
                    <div className="p-3 space-y-4">
                      {mockNotifications.map((notification) => (
                        <div 
                          key={notification.id} 
                          className={`p-2.5 rounded-lg hover:bg-gray-50 transition-colors border-l-4 ${
                            notification.read 
                              ? 'border-transparent bg-gray-25' 
                              : 'border-blue-400 bg-blue-25'
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 mt-0.5">
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p className={`text-sm font-medium ${
                                  notification.read ? 'text-gray-700' : 'text-gray-900'
                                }`}>
                                  {notification.title}
                                </p>
                                <span className="text-xs text-gray-500">{notification.time}</span>
                              </div>
                              <p className={`text-sm mt-1 ${
                                notification.read ? 'text-gray-500' : 'text-gray-600'
                              }`}>
                                {notification.message}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <Bell className="h-8 w-8 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">Aucune notification</p>
                    </div>
                  )}
                </div>

                {mockNotifications.length > 0 && (
                  <div className="p-3 border-t border-gray-100">
                    <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium">
                      Marquer tout comme lu
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-gray-500 capitalize">{user.role}</p>
            </div>
            
            {user.avatar ? (
              <Image
                src={user.avatar}
                alt={`${user.firstName} ${user.lastName}`}
                width={32}
                height={32}
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user.firstName[0]}{user.lastName[0]}
                </span>
              </div>
            )}

            <button
              onClick={onLogout}
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Se déconnecter"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}