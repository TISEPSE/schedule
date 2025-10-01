import { Plus, Calendar, Users, Settings, Target, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { UserRole } from '@/types';

interface QuickActionsProps {
  userRole: UserRole;
}

const adminActions = [
  {
    title: 'Gestion utilisateurs',
    description: 'Modérer les comptes',
    icon: Users,
    href: '/classes',
    color: 'bg-blue-50 hover:bg-blue-100 text-blue-700',
  },
  {
    title: 'Configuration',
    description: 'Paramètres système',
    icon: Settings,
    href: '/settings',
    color: 'bg-purple-50 hover:bg-purple-100 text-purple-700',
  },
];

const studentActions = [
  {
    title: 'Planifier un événement',
    description: 'Ajouter à mon emploi du temps',
    icon: Plus,
    href: '/calendar',
    color: 'bg-blue-50 hover:bg-blue-100 text-blue-700',
  },
  {
    title: 'Mes devoirs',
    description: 'Voir mes tâches à faire',
    icon: Calendar,
    href: '/devoirs',
    color: 'bg-green-50 hover:bg-green-100 text-green-700',
  },
  {
    title: 'Ma classe',
    description: 'Voir ma classe et mes camarades',
    icon: Users,
    href: '/classes',
    color: 'bg-purple-50 hover:bg-purple-100 text-purple-700',
  },
  {
    title: 'Mon profil',
    description: 'Modifier mes informations',
    icon: Settings,
    href: '/profile',
    color: 'bg-orange-50 hover:bg-orange-100 text-orange-700',
  },
];

const personalActions = [
  {
    title: 'Nouvelle tâche',
    description: 'Ajouter une tâche à faire',
    icon: Plus,
    href: '/devoirs',
    color: 'bg-blue-50 hover:bg-blue-100 text-blue-700',
  },
  {
    title: 'Nouvelle note',
    description: 'Créer une note markdown',
    icon: BookOpen,
    href: '/notes',
    color: 'bg-green-50 hover:bg-green-100 text-green-700',
  },
  {
    title: 'Projets',
    description: 'Suivre mes projets',
    icon: Target,
    href: '/projects',
    color: 'bg-purple-50 hover:bg-purple-100 text-purple-700',
  },
];

export default function QuickActions({ userRole }: QuickActionsProps) {
  const actions = userRole === 'admin' ? adminActions : 
                  userRole === 'personal' ? personalActions : 
                  studentActions;

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 h-fit">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Actions rapides</h3>
      <div className="space-y-4">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Link
              key={`action-${index}`}
              href={action.href}
              className={`${action.color} p-4 rounded-lg transition-colors group block`}
            >
              <div className="flex items-center space-x-3">
                <Icon className="h-5 w-5 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-base font-medium truncate">{action.title}</p>
                  <p className="text-sm opacity-75 truncate">{action.description}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}