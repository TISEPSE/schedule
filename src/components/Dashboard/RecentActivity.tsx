import { Clock, UserPlus, Calendar, BookOpen } from 'lucide-react';
import { UserRole } from '@/types';

interface RecentActivityProps {
  userRole: UserRole;
}

const adminActivities = [
  {
    icon: UserPlus,
    title: 'Nouvel utilisateur',
    description: 'Marie Dubois s\'est inscrite',
    time: 'Il y a 2h',
    color: 'text-blue-600',
  },
  {
    icon: Calendar,
    title: 'Planning modifié',
    description: 'Thomas a mis à jour son emploi du temps',
    time: 'Il y a 4h',
    color: 'text-green-600',
  },
];

const studentActivities = [
  {
    icon: Calendar,
    title: 'Planning mis à jour',
    description: 'Cours de Maths ajouté pour demain',
    time: 'Il y a 30min',
    color: 'text-blue-600',
  },
  {
    icon: BookOpen,
    title: 'Tâche terminée',
    description: 'Révisions Français marquées comme complètes',
    time: 'Il y a 1h',
    color: 'text-green-600',
  },
  {
    icon: Calendar,
    title: 'Rappel créé',
    description: 'Projet de groupe - échéance vendredi',
    time: 'Hier',
    color: 'text-purple-600',
  },
  {
    icon: BookOpen,
    title: 'Objectif atteint',
    description: '32h de travail cette semaine ✨',
    time: 'Il y a 2 jours',
    color: 'text-orange-600',
  },
];

export default function RecentActivity({ userRole }: RecentActivityProps) {
  const activities = userRole === 'admin' ? adminActivities : studentActivities;

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Activité récente</h3>
        <Clock className="h-5 w-5 text-gray-400" />
      </div>
      
      <div className="space-y-4">
        {activities.map((activity, index) => {
          const Icon = activity.icon;
          return (
            <div key={index} className="flex items-start space-x-3">
              <div className={`p-2 rounded-lg bg-gray-50 ${activity.color}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {activity.title}
                </p>
                <p className="text-sm text-gray-600 truncate">
                  {activity.description}
                </p>
                <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-100">
        <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
          Voir toute l'activité →
        </button>
      </div>
    </div>
  );
}