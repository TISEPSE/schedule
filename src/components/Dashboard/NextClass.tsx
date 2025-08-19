import { Clock, MapPin, User, BookOpen, Calendar } from 'lucide-react';
import { Event } from '@/lib/database/local';

interface NextClassProps {
  events?: Event[];
}

export default function NextClass({ events }: NextClassProps) {
  // Si aucun events fourni, utiliser les données statiques (utilisateurs normaux)
  if (!events) {
    const mockNextClass = {
      subject: 'Mathématiques',
      teacher: 'Mme Dubois',
      room: 'Salle 105',
      time: '14:00 - 15:00',
      timeUntil: 'Dans 2h',
      color: 'bg-blue-500',
    };

    return (
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold text-gray-900">Prochain cours</h3>
          <div className="flex items-center text-sm text-green-600 bg-green-50 px-2 py-1 rounded">
            <Clock className="h-3 w-3 mr-1" />
            {mockNextClass.timeUntil}
          </div>
        </div>
        
        <div className={`${mockNextClass.color} rounded-lg p-3 text-white mb-3`}>
          <div className="flex items-center mb-2">
            <BookOpen className="h-4 w-4 mr-2" />
            <span className="font-medium text-base">{mockNextClass.subject}</span>
          </div>
          <div className="text-base opacity-90">{mockNextClass.time}</div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-3 w-3 mr-2" />
            {mockNextClass.room}
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <User className="h-3 w-3 mr-2" />
            {mockNextClass.teacher}
          </div>
        </div>
      </div>
    );
  }

  // Pour l'utilisateur test : utiliser les vraies données
  const now = new Date();
  const upcomingEvents = events
    .filter(event => event.startTime > now)
    .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
  
  const nextClass = upcomingEvents[0];
  
  const formatTimeUntil = (date: Date) => {
    const diff = date.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) return `Dans ${hours}h${minutes > 0 ? ` ${minutes}min` : ''}`;
    if (minutes > 0) return `Dans ${minutes}min`;
    return 'Bientôt';
  };
  
  const formatTime = (start: Date, end: Date) => {
    const startTime = start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const endTime = end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return `${startTime} - ${endTime}`;
  };
  
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'course': return 'bg-blue-500';
      case 'exam': return 'bg-red-500';
      case 'practical': return 'bg-green-500';
      case 'project': return 'bg-purple-500';
      case 'sport': return 'bg-orange-500';
      case 'study': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  if (!nextClass) {
    return (
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold text-gray-900">Prochain cours</h3>
        </div>
        
        <div className="text-center py-8">
          <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-sm mb-2">Aucun cours prévu</p>
          <p className="text-gray-400 text-xs">
            Utilisez le panel de test pour ajouter des événements
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-semibold text-gray-900">Prochain cours</h3>
        <div className="flex items-center text-sm text-green-600 bg-green-50 px-2 py-1 rounded">
          <Clock className="h-3 w-3 mr-1" />
          {formatTimeUntil(nextClass.startTime)}
        </div>
      </div>
      
      <div className={`${getTypeColor(nextClass.type)} rounded-lg p-3 text-white mb-3`}>
        <div className="flex items-center mb-2">
          <BookOpen className="h-4 w-4 mr-2" />
          <span className="font-medium text-base">{nextClass.title}</span>
        </div>
        <div className="text-base opacity-90">
          {formatTime(nextClass.startTime, nextClass.endTime)}
        </div>
      </div>
      
      <div className="space-y-2">
        {nextClass.location && (
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-3 w-3 mr-2" />
            {nextClass.location}
          </div>
        )}
        
        {nextClass.description && (
          <div className="flex items-start text-sm text-gray-600">
            <BookOpen className="h-3 w-3 mr-2 mt-0.5" />
            <span>{nextClass.description}</span>
          </div>
        )}
      </div>
    </div>
  );
}