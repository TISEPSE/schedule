import { Clock, Calendar, BookOpen, CheckCircle2 } from 'lucide-react';
import { UserRole } from '@/types';
import { Assignment, Event } from '@/lib/database/local';

interface RecentActivityProps {
  userRole: UserRole;
  assignments?: Assignment[];
  events?: Event[];
}

export default function RecentActivity({ userRole, assignments, events }: RecentActivityProps) {
  // Si aucune données fournie, utiliser les données statiques (utilisateurs normaux)
  if (!assignments || !events) {
    const adminActivities = [
      {
        icon: Calendar,
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
        title: 'Devoir complété',
        description: 'Exercices de Français terminés',
        time: 'Il y a 2h',
        color: 'text-green-600',
      },
      {
        icon: Calendar,
        title: 'Rappel événement',
        description: 'TP Informatique dans 1h',
        time: 'Il y a 5min',
        color: 'text-orange-600',
      },
    ];

    const activities = userRole === 'admin' ? adminActivities : studentActivities;
    const title = userRole === 'admin' ? 'Activité récente' : 'Mes actions récentes';

    return (
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
          <Clock className="h-4 w-4 text-gray-400" />
        </div>
        
        <div className="space-y-3">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className={`p-1.5 rounded-full bg-gray-100`}>
                <activity.icon className={`h-3 w-3 ${activity.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                <p className="text-sm text-gray-600 truncate">{activity.description}</p>
                <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-3 border-t border-gray-100">
          <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">
            Voir toute l&apos;activité →
          </button>
        </div>
      </div>
    );
  }

  // Pour l'utilisateur test : utiliser les vraies données
  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (minutes < 60) return `Il y a ${minutes}min`;
    if (hours < 24) return `Il y a ${hours}h`;
    return `Il y a ${days}j`;
  };
  
  // Générer les activités récentes à partir des données réelles
  const generateRecentActivities = () => {
    const activities: Array<{
      icon: React.ComponentType<{className?: string}>;
      title: string;
      description: string;
      time: string;
      color: string;
    }> = [];
    
    // Devoirs récemment ajoutés ou complétés
    assignments
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
      .slice(0, 2)
      .forEach(assignment => {
        if (assignment.completed) {
          activities.push({
            icon: CheckCircle2,
            title: 'Devoir terminé',
            description: `"${assignment.title}" marqué comme complété`,
            time: formatTimeAgo(assignment.updatedAt),
            color: 'text-green-600',
          });
        } else {
          activities.push({
            icon: BookOpen,
            title: 'Nouveau devoir',
            description: `"${assignment.title}" ajouté en ${assignment.subject}`,
            time: formatTimeAgo(assignment.createdAt),
            color: 'text-blue-600',
          });
        }
      });
    
    // Événements récemment ajoutés
    events
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
      .slice(0, 2)
      .forEach(event => {
        activities.push({
          icon: Calendar,
          title: 'Événement planifié',
          description: `"${event.title}" ajouté au planning`,
          time: formatTimeAgo(event.createdAt),
          color: 'text-purple-600',
        });
      });
    
    // Trier par date de mise à jour et limiter à 3 items
    return activities
      .sort((a, b) => {
        // Retrouver la date depuis le texte "Il y a Xmin/h/j"
        const getMinutes = (timeStr: string) => {
          const match = timeStr.match(/(\d+)(min|h|j)/);
          if (!match) return 0;
          const value = parseInt(match[1]);
          const unit = match[2];
          if (unit === 'min') return value;
          if (unit === 'h') return value * 60;
          if (unit === 'j') return value * 60 * 24;
          return 0;
        };
        return getMinutes(a.time) - getMinutes(b.time);
      })
      .slice(0, 3);
  };
  
  const recentActivities = generateRecentActivities();
  const title = userRole === 'admin' ? 'Activité récente' : 'Mes actions récentes';

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        <Clock className="h-4 w-4 text-gray-400" />
      </div>
      
      <div className="space-y-3">
        {recentActivities.length > 0 ? (
          recentActivities.map((activity, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className={`p-1.5 rounded-full bg-gray-100`}>
                <activity.icon className={`h-3 w-3 ${activity.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                <p className="text-sm text-gray-600 truncate">{activity.description}</p>
                <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-sm">
              Aucune activité récente
            </p>
            <p className="text-gray-400 text-xs mt-1">
              Les actions sur vos données apparaîtront ici
            </p>
          </div>
        )}
      </div>
      
      {recentActivities.length > 0 && (
        <div className="mt-4 pt-3 border-t border-gray-100">
          <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">
            Voir toute l&apos;activité →
          </button>
        </div>
      )}
    </div>
  );
}