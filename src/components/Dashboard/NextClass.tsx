import { Clock, MapPin, User, BookOpen } from 'lucide-react';

export default function NextClass() {
  // Mock next class data
  const nextClass = {
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
          {nextClass.timeUntil}
        </div>
      </div>
      
      <div className={`${nextClass.color} rounded-lg p-3 text-white mb-3`}>
        <div className="flex items-center mb-2">
          <BookOpen className="h-4 w-4 mr-2" />
          <span className="font-medium text-base">{nextClass.subject}</span>
        </div>
        <div className="text-base opacity-90">{nextClass.time}</div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center text-base text-gray-600">
          <User className="h-3 w-3 mr-2" />
          {nextClass.teacher}
        </div>
        <div className="flex items-center text-base text-gray-600">
          <MapPin className="h-3 w-3 mr-2" />
          {nextClass.room}
        </div>
      </div>
    </div>
  );
}