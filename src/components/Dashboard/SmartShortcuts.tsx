'use client';

import { Calendar, Clock, Target, Plus, BookOpen, TrendingUp, Users, CheckSquare, Zap, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { UserRole } from '@/types';
import { LucideIcon } from 'lucide-react';

interface SmartShortcutsProps {
  userRole: UserRole;
}

interface SmartShortcut {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  color: string;
  priority: number;
  timeContext?: 'morning' | 'afternoon' | 'evening' | 'weekend';
  roleSpecific?: boolean;
}

export default function SmartShortcuts({ userRole }: SmartShortcutsProps) {
  const currentHour = new Date().getHours();
  const isWeekend = [0, 6].includes(new Date().getDay());
  
  const getTimeContext = () => {
    if (isWeekend) return 'weekend';
    if (currentHour < 12) return 'morning';
    if (currentHour < 18) return 'afternoon';
    return 'evening';
  };

  const timeContext = getTimeContext();

  // Define all possible shortcuts
  const allShortcuts: Record<UserRole, SmartShortcut[]> = {
    student: [
      {
        id: 'today-schedule',
        title: 'Mon planning aujourd\'hui',
        description: 'Voir mes cours du jour',
        icon: Calendar,
        href: '/planning?view=today',
        color: 'bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200',
        priority: 10,
        timeContext: 'morning',
      },
      {
        id: 'urgent-assignments',
        title: 'Devoirs urgents',
        description: 'À rendre cette semaine',
        icon: Clock,
        href: '/devoirs?filter=urgent',
        color: 'bg-red-50 hover:bg-red-100 text-red-700 border-red-200',
        priority: 9,
      },
      {
        id: 'new-assignment',
        title: 'Nouveau devoir',
        description: 'Ajouter une tâche rapidement',
        icon: Plus,
        href: '/devoirs?new=true',
        color: 'bg-green-50 hover:bg-green-100 text-green-700 border-green-200',
        priority: 8,
      },
      {
        id: 'next-class',
        title: 'Prochain cours',
        description: 'Voir les détails',
        icon: BookOpen,
        href: '/planning?view=next',
        color: 'bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200',
        priority: 7,
        timeContext: 'morning',
      },
      {
        id: 'week-overview',
        title: 'Vue hebdomadaire',
        description: 'Planning de la semaine',
        icon: Calendar,
        href: '/planning?view=week',
        color: 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200',
        priority: 6,
        timeContext: 'weekend',
      },
    ],
    personal: [
      {
        id: 'today-tasks',
        title: 'Tâches d\'aujourd\'hui',
        description: 'Focus sur l\'essentiel',
        icon: CheckSquare,
        href: '/devoirs?filter=today',
        color: 'bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200',
        priority: 10,
        timeContext: 'morning',
      },
      {
        id: 'new-note',
        title: 'Nouvelle note',
        description: 'Créer une note markdown',
        icon: BookOpen,
        href: '/notes',
        color: 'bg-green-50 hover:bg-green-100 text-green-700 border-green-200',
        priority: 9,
        timeContext: 'morning',
      },
      {
        id: 'quick-task',
        title: 'Tâche rapide',
        description: 'Créer en 30 secondes',
        icon: Zap,
        href: '/devoirs?template=quick',
        color: 'bg-yellow-50 hover:bg-yellow-100 text-yellow-700 border-yellow-200',
        priority: 8,
      },
      {
        id: 'goals-review',
        title: 'Revoir mes projets',
        description: 'Progression du mois',
        icon: Target,
        href: '/projects?view=progress',
        color: 'bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200',
        priority: 7,
        timeContext: 'weekend',
      },
      {
        id: 'weekly-planning',
        title: 'Planifier la semaine',
        description: 'Organiser les priorités',
        icon: Calendar,
        href: '/calendar?view=week-planning',
        color: 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200',
        priority: 6,
        timeContext: 'weekend',
      },
      {
        id: 'project-check',
        title: 'État des projets',
        description: 'Vue d\'ensemble',
        icon: TrendingUp,
        href: '/projects?view=overview',
        color: 'bg-orange-50 hover:bg-orange-100 text-orange-700 border-orange-200',
        priority: 5,
        timeContext: 'evening',
      },
    ],
    admin: [
      {
        id: 'user-activity',
        title: 'Activité utilisateurs',
        description: 'Vue temps réel',
        icon: Users,
        href: '/admin/users?view=activity',
        color: 'bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200',
        priority: 10,
        timeContext: 'morning',
      },
      {
        id: 'system-status',
        title: 'État du système',
        description: 'Monitoring et alertes',
        icon: TrendingUp,
        href: '/admin/system',
        color: 'bg-green-50 hover:bg-green-100 text-green-700 border-green-200',
        priority: 9,
      },
      {
        id: 'pending-approvals',
        title: 'Approbations en attente',
        description: 'Comptes et demandes',
        icon: Clock,
        href: '/admin/approvals',
        color: 'bg-orange-50 hover:bg-orange-100 text-orange-700 border-orange-200',
        priority: 8,
      },
      {
        id: 'weekly-report',
        title: 'Rapport hebdomadaire',
        description: 'Statistiques et insights',
        icon: BookOpen,
        href: '/admin/reports?period=week',
        color: 'bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200',
        priority: 7,
        timeContext: 'weekend',
      },
    ],
  };

  // Filter and sort shortcuts based on time context and priority
  const getContextualShortcuts = () => {
    const userShortcuts = allShortcuts[userRole] || [];
    
    return userShortcuts
      .filter(shortcut => !shortcut.timeContext || shortcut.timeContext === timeContext)
      .sort((a, b) => b.priority - a.priority)
      .slice(0, 4); // Show top 4 contextual shortcuts
  };

  const contextualShortcuts = getContextualShortcuts();

  const getGreeting = () => {
    if (timeContext === 'morning') return `Bonjour ! Commencez votre journée efficacement.`;
    if (timeContext === 'afternoon') return `Bon après-midi ! Restez productif.`;
    if (timeContext === 'evening') return `Bonsoir ! Finissez en beauté.`;
    return `Bon week-end ! Planifiez votre semaine.`;
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-2">
          <Zap className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Raccourcis intelligents</h3>
        </div>
        <p className="text-sm text-gray-600">{getGreeting()}</p>
      </div>

      <div className="space-y-3">
        {contextualShortcuts.map((shortcut) => {
          const Icon = shortcut.icon;
          return (
            <Link
              key={shortcut.id}
              href={shortcut.href}
              className={`${shortcut.color} p-4 rounded-lg transition-all duration-200 group block border hover:shadow-sm`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1">
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{shortcut.title}</p>
                    <p className="text-xs opacity-75 truncate">{shortcut.description}</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity ml-2 flex-shrink-0" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick access hint */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-500 flex items-center space-x-1">
          <span>💡</span>
          <span>Astuce: Appuyez sur <kbd className="px-1 py-0.5 text-xs bg-gray-100 rounded">?</kbd> pour voir tous les raccourcis clavier</span>
        </p>
      </div>
    </div>
  );
}