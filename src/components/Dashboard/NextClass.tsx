import { Clock, MapPin, User, BookOpen } from 'lucide-react';
import { Event } from '@/lib/database/local';

interface NextClassProps {
  events?: Event[];
}

export default function NextClass({ events }: NextClassProps) {
  const now = new Date();
  
  // Utiliser les vraies données si disponibles, sinon données statiques
  let nextClass = null;
  
  if (events && events.length > 0) {
    const upcomingEvents = events
      .filter(event => event.startTime > now)
      .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
    nextClass = upcomingEvents[0];
  }
  
  // Si pas de vraies données, utiliser les données statiques
  if (!nextClass) {
    const mockData = {
      title: 'Mathématiques',
      location: 'Salle 105',
      description: 'Mme Dubois',
      startTime: new Date(now.getTime() + 2 * 60 * 60 * 1000), // Dans 2h
      endTime: new Date(now.getTime() + 3 * 60 * 60 * 1000), // Dans 3h
      type: 'course'
    };
    nextClass = mockData;
  }
  
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

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Prochain cours</h3>
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
            <User className="h-3 w-3 mr-2 mt-0.5" />
            <span>{nextClass.description}</span>
          </div>
        )}
      </div>
    </div>
  );
}