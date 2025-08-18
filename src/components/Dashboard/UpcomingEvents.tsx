import { Calendar, Clock, MapPin } from 'lucide-react';
import { UserRole } from '@/types';

interface UpcomingEventsProps {
  userRole: UserRole;
}

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
];

const studentEvents = [
  {
    title: 'Cours de Maths',
    time: '14:00',
    location: 'Bibliothèque',
    date: 'Aujourd\'hui',
    color: 'border-l-blue-500',
  },
  {
    title: 'Séance révisions',
    time: '10:00',
    location: 'Chez moi',
    date: 'Demain',
    color: 'border-l-green-500',
  },
  {
    title: 'Groupe d\'étude',
    time: '15:00',
    location: 'Campus',
    date: 'Mercredi',
    color: 'border-l-purple-500',
  },
];

export default function UpcomingEvents({ userRole }: UpcomingEventsProps) {
  const events = userRole === 'admin' ? adminEvents : studentEvents;

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Prochains événements</h3>
        <Calendar className="h-5 w-5 text-gray-400" />
      </div>
      
      <div className="space-y-3">
        {events.map((event, index) => (
          <div key={index} className={`border-l-4 ${event.color} pl-4 py-2`}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-900">{event.title}</h4>
                <div className="flex items-center space-x-4 mt-1">
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="h-3 w-3 mr-1" />
                    {event.time}
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <MapPin className="h-3 w-3 mr-1" />
                    {event.location}
                  </div>
                </div>
              </div>
              <span className="text-xs text-gray-400">{event.date}</span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-100">
        <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
          Voir tout l'agenda →
        </button>
      </div>
    </div>
  );
}