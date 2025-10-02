import { Bell, AlertCircle, Calendar, BookOpen, CheckCircle2, Info, Clock } from 'lucide-react';
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
    const adminNews = [
      {
        icon: Bell,
        title: 'Information importante',
        description: 'Nouvelle procédure de connexion mise en place',
        time: 'Il y a 2h',
        color: 'text-blue-600',
        priority: 'high' as const,
      },
      {
        icon: Info,
        title: 'Maintenance programmée',
        description: 'Interruption de service prévue dimanche 15h-17h',
        time: 'Il y a 4h',
        color: 'text-orange-600',
        priority: 'medium' as const,
      },
    ];

    const studentNews = [
      {
        icon: AlertCircle,
        title: 'Rappel important',
        description: 'Date limite d\'inscription aux examens : 15 mars',
        time: 'Il y a 30min',
        color: 'text-red-600',
        priority: 'high' as const,
      },
      {
        icon: Bell,
        title: 'Nouvelle communication',
        description: 'Planning des vacances de Pâques disponible',
        time: 'Il y a 2h',
        color: 'text-blue-600',
        priority: 'medium' as const,
      },
      {
        icon: Info,
        title: 'Information générale',
        description: 'Nouvelle bibliothèque numérique accessible',
        time: 'Il y a 5h',
        color: 'text-green-600',
        priority: 'low' as const,
      },
      {
        icon: Calendar,
        title: 'Événement à venir',
        description: 'Journée portes ouvertes le 20 mars',
        time: 'Hier',
        color: 'text-purple-600',
        priority: 'medium' as const,
      },
      {
        icon: Bell,
        title: 'Mise à jour système',
        description: 'Nouvelle version de l\'application disponible',
        time: 'Il y a 1j',
        color: 'text-blue-600',
        priority: 'medium' as const,
      },
      {
        icon: Info,
        title: 'Rappel santé',
        description: 'Campagne de vaccination dans l\'établissement',
        time: 'Il y a 2j',
        color: 'text-orange-600',
        priority: 'medium' as const,
      },
      {
        icon: Calendar,
        title: 'Concours national',
        description: 'Inscriptions ouvertes pour le concours de mathématiques',
        time: 'Il y a 3j',
        color: 'text-purple-600',
        priority: 'low' as const,
      },
      {
        icon: AlertCircle,
        title: 'Travaux en cours',
        description: 'Rénovation de la cafétéria du 25 au 30 mars',
        time: 'Il y a 4j',
        color: 'text-orange-600',
        priority: 'medium' as const,
      },
    ];

    const activities = userRole === 'admin' ? adminNews : studentNews;
    const title = 'Actualités';

    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <Bell className="h-4 w-4 text-gray-400" />
        </div>
        
        <div className="max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <div className="space-y-3 pr-2">
            {activities.map((activity, index) => (
              <div key={`activity-${activity.title}-${activity.time || index}`} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
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
        </div>
        
        <div className="mt-4 pt-3 border-t border-gray-100">
          <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">
            Voir toutes les actualités →
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
      priority?: 'high' | 'medium' | 'low';
    }> = [];
    
    // Devoirs récemment ajoutés ou complétés
    assignments
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
      .slice(0, 6)
      .forEach(assignment => {
        if (assignment.completed) {
          activities.push({
            icon: CheckCircle2,
            title: 'Devoir terminé',
            description: `"${assignment.title}" marqué comme complété`,
            time: formatTimeAgo(assignment.updatedAt),
            color: 'text-green-600',
            priority: 'low' as const,
          });
        } else {
          activities.push({
            icon: BookOpen,
            title: 'Nouveau devoir',
            description: `"${assignment.title}" ajouté en ${assignment.subject}`,
            time: formatTimeAgo(assignment.createdAt),
            color: 'text-blue-600',
            priority: 'medium' as const,
          });
        }
      });
    
    // Événements récemment ajoutés
    events
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
      .slice(0, 6)
      .forEach(event => {
        activities.push({
          icon: Calendar,
          title: 'Événement planifié',
          description: `"${event.title}" ajouté au planning`,
          time: formatTimeAgo(event.createdAt),
          color: 'text-purple-600',
          priority: 'medium' as const,
        });
      });
    
    // Ajouter des actualités simulées supplémentaires pour avoir plus de contenu
    const simulatedNews = [
      {
        icon: Bell,
        title: 'Communication importante',
        description: 'Nouvelle procédure d\'accès à la bibliothèque',
        time: 'Il y a 6h',
        color: 'text-blue-600',
        priority: 'medium' as const,
      },
      {
        icon: Info,
        title: 'Mise à jour des règles',
        description: 'Nouveau règlement intérieur disponible',
        time: 'Il y a 12h',
        color: 'text-green-600',
        priority: 'low' as const,
      },
      {
        icon: AlertCircle,
        title: 'Rappel urgent',
        description: 'Derniers jours pour les inscriptions pédagogiques',
        time: 'Il y a 1j',
        color: 'text-red-600',
        priority: 'high' as const,
      },
      {
        icon: Calendar,
        title: 'Événement spécial',
        description: 'Conférence sur l\'intelligence artificielle mardi',
        time: 'Il y a 2j',
        color: 'text-purple-600',
        priority: 'medium' as const,
      },
      {
        icon: Bell,
        title: 'Services étudiants',
        description: 'Permanences d\'aide aux révisions ouvertes',
        time: 'Il y a 3j',
        color: 'text-blue-600',
        priority: 'low' as const,
      },
      {
        icon: Info,
        title: 'Ressources pédagogiques',
        description: 'Nouveau portail documentaire mis en ligne',
        time: 'Il y a 4j',
        color: 'text-green-600',
        priority: 'medium' as const,
      },
    ];
    
    // Combiner avec les actualités simulées
    activities.push(...simulatedNews);
    
    // Trier par date de mise à jour et limiter à 15 items
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
      .slice(0, 15);
  };
  
  const recentActivities = generateRecentActivities();
  const title = 'Actualités';

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Bell className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        <div className="flex items-center space-x-2">
          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">École</span>
        </div>
      </div>
      
      <div className="max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        <div className="space-y-3 pr-2">
          {recentActivities.length > 0 ? (
            recentActivities.map((activity, index) => (
              <div key={`recent-${activity.title}-${activity.time || index}`} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="p-1.5 rounded-full bg-gray-100">
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
                Aucune actualité
              </p>
              <p className="text-gray-400 text-xs mt-1">
                Les actualités de l&apos;école apparaîtront ici
              </p>
            </div>
          )}
        </div>
      </div>
      
      {recentActivities.length > 0 && (
        <div className="mt-4 pt-3 border-t border-gray-100">
          <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">
            Voir toutes les actualités →
          </button>
        </div>
      )}
    </div>
  );
}