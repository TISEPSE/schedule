'use client';

import { useAuth } from '@/context/AuthContext';
import { redirect } from 'next/navigation';
import MainLayout from '@/components/Layout/MainLayout';
import Calendar from '@/components/Calendar/Calendar';

/**
 * Calendar Page - Monthly calendar view for managing events and schedules
 *
 * This page provides a comprehensive calendar interface with:
 * - Monthly grid view with event visualization
 * - Interactive date selection
 * - Event creation and viewing
 * - Responsive design for mobile and desktop
 * - Optimized performance with memoization and caching
 *
 * The calendar uses the OptimizedCalendar component which implements:
 * - Efficient event filtering and grouping
 * - Smart date calculations with caching
 * - Minimal re-renders through React.memo
 * - Accessibility features (ARIA labels, keyboard navigation)
 */
export default function CalendarPage() {
  const { user, logout } = useAuth();

  // Redirect to login if not authenticated
  if (!user) {
    redirect('/');
    return null;
  }

  return (
    <MainLayout user={user} onLogout={logout}>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 page-animate">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Calendrier</h1>
              <p className="text-gray-600">
                Vue mensuelle de vos événements et cours
              </p>
            </div>

            {/* Quick stats */}
            <div className="mt-4 sm:mt-0 flex items-center space-x-4">
              <div className="bg-blue-50 px-4 py-2 rounded-xl">
                <div className="text-xs text-blue-600 font-medium">Aujourd&apos;hui</div>
                <div className="text-lg font-bold text-blue-700">
                  {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Calendar Component */}
        <div className="page-animate-delay-1">
          <Calendar />
        </div>

        {/* Tips section with integrated legend */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100 page-animate-delay-2">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Astuces d&apos;utilisation</h3>

              {/* Usage tips */}
              <ul className="text-sm text-gray-600 space-y-1.5 mb-4">
                <li key="tip-click-date" className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-blue-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Cliquez sur une date pour voir les événements du jour</span>
                </li>
                <li key="tip-add-button" className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-blue-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Utilisez le bouton &quot;Ajouter&quot; pour créer un nouvel événement</span>
                </li>
                <li key="tip-planning-view" className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-blue-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Passez en vue &quot;Planning&quot; pour une visualisation hebdomadaire</span>
                </li>
              </ul>

              {/* Legend section */}
              <div className="pt-3 border-t border-blue-200">
                <h4 className="text-xs font-semibold text-gray-700 mb-2.5 uppercase tracking-wide">Code couleur des événements</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2">
                  <div key="legend-cours" className="flex items-center space-x-2">
                    <div className="w-4 h-4 rounded-full bg-blue-700 shadow-sm flex-shrink-0"></div>
                    <span className="text-xs font-medium text-gray-700">Cours</span>
                  </div>
                  <div key="legend-tp" className="flex items-center space-x-2">
                    <div className="w-4 h-4 rounded-full bg-emerald-700 shadow-sm flex-shrink-0"></div>
                    <span className="text-xs font-medium text-gray-700">TP</span>
                  </div>
                  <div key="legend-examen" className="flex items-center space-x-2">
                    <div className="w-4 h-4 rounded-full bg-rose-600 shadow-sm flex-shrink-0"></div>
                    <span className="text-xs font-medium text-gray-700">Examen</span>
                  </div>
                  <div key="legend-projet" className="flex items-center space-x-2">
                    <div className="w-4 h-4 rounded-full bg-teal-700 shadow-sm flex-shrink-0"></div>
                    <span className="text-xs font-medium text-gray-700">Projet</span>
                  </div>
                  <div key="legend-sport" className="flex items-center space-x-2">
                    <div className="w-4 h-4 rounded-full bg-indigo-700 shadow-sm flex-shrink-0"></div>
                    <span className="text-xs font-medium text-gray-700">Sport</span>
                  </div>
                  <div key="legend-etude" className="flex items-center space-x-2">
                    <div className="w-4 h-4 rounded-full bg-purple-700 shadow-sm flex-shrink-0"></div>
                    <span className="text-xs font-medium text-gray-700">Étude</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
