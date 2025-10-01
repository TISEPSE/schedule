import { Calendar, Clock, MapPin } from 'lucide-react';
import { UserRole } from '@/types';
import { Event } from '@/lib/database/local';
import { getEventColors } from '@/lib/colors';

interface UpcomingEventsProps {
  userRole: UserRole;
  events?: Event[];
}

export default function UpcomingEvents({ userRole, events }: UpcomingEventsProps) {
  // Si aucun events fourni, utiliser les données statiques (utilisateurs normaux)
  if (!events) {
    const adminEvents = [
      {
        title: 'Maintenance serveur',
        time: '14:00',
        location: 'À distance',
        date: 'Aujourd\'hui',
        color: 'border-l-blue-500',
      },
      {
        title: 'Réunion équipe',
        time: '16:30',
        location: 'Visio',
        date: 'Demain',
        color: 'border-l-green-500',
      },
      {
        title: 'Formation sécurité',
        time: '10:00',
        location: 'Salle de conf',
        date: 'Vendredi',
        color: 'border-l-orange-500',
      },
    ];

    const studentEvents = [
      {
        title: 'Mathématiques',
        time: '08:00',
        location: 'Salle A12',
        date: 'Demain',
        color: getEventColors('course').borderLight,
        type: 'course'
      },
      {
        title: 'Informatique',
        time: '14:00',
        location: 'Lab B3',
        date: 'Mercredi',
        color: getEventColors('practical').borderLight,
        type: 'practical'
      },
      {
        title: 'Contrôle Français',
        time: '10:00',
        location: 'Amphi C',
        date: 'Vendredi',
        color: getEventColors('exam').borderLight,
        type: 'exam'
      },
    ];

    const items = userRole === 'admin' ? adminEvents : studentEvents;
    const title = userRole === 'admin' ? 'Prochains événements' : 'Mes cours';

    return (
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
          <Calendar className="h-4 w-4 text-gray-400" />
        </div>
        
        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={`event-${index}`} className={`border-l-4 ${item.color} pl-3 py-2.5`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="text-base font-medium text-gray-900">{item.title}</h4>
                  <div className="flex items-center mt-1">
                    <MapPin className="h-3 w-3 text-gray-400 mr-1" />
                    <span className="text-sm text-gray-500">{item.location}</span>
                  </div>
                </div>
                <div className="text-right ml-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-3 w-3 mr-1" />
                    {item.time}
                  </div>
                  <span className="text-xs text-gray-400">{item.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-3 border-t border-gray-100">
          <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">
            Voir tout →
          </button>
        </div>
      </div>
    );
  }

  // Pour l'utilisateur test : utiliser les vraies données avec les couleurs cohérentes
  const getTypeColor = (type: string) => {
    return getEventColors(type).borderLight;
  };
  
  const formatDateTime = (date: Date) => {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    
    let dateStr;
    if (days === 0) dateStr = 'Aujourd\'hui';
    else if (days === 1) dateStr = 'Demain';
    else if (days < 7) dateStr = `Dans ${days} jours`;
    else dateStr = date.toLocaleDateString();
    
    const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return { date: dateStr, time: timeStr };
  };
  
  // Filtrer les événements futurs et les trier par date
  const upcomingEvents = events
    .filter(event => event.startTime > new Date())
    .sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
    .slice(0, 3);
    
  const title = userRole === 'admin' ? 'Prochains événements' : 'Mes cours';

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        <Calendar className="h-4 w-4 text-gray-400" />
      </div>
      
      <div className="space-y-3">
        {upcomingEvents.length > 0 ? (
          upcomingEvents.map((event) => {
            const { date, time } = formatDateTime(event.startTime);
            return (
              <div key={event.id} className={`border-l-4 ${getTypeColor(event.type)} pl-3 py-2.5`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-base font-medium text-gray-900">{event.title}</h4>
                    {event.location && (
                      <div className="flex items-center mt-1">
                        <MapPin className="h-3 w-3 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-500">{event.location}</span>
                      </div>
                    )}
                  </div>
                  <div className="text-right ml-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-3 w-3 mr-1" />
                      {time}
                    </div>
                    <span className="text-xs text-gray-400">{date}</span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-sm">
              {userRole === 'admin' ? 'Aucun événement prévu' : 'Aucun cours à venir'}
            </p>
            <p className="text-gray-400 text-xs mt-1">
              Utilisez le panel de test pour ajouter des données
            </p>
          </div>
        )}
      </div>
      
      {upcomingEvents.length > 0 && (
        <div className="mt-4 pt-3 border-t border-gray-100">
          <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">
            Voir tout ({events.filter(e => e.startTime > new Date()).length}) →
          </button>
        </div>
      )}
    </div>
  );
}