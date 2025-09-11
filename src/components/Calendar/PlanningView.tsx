'use client';

import { useState, useEffect } from 'react';
import { 
  Clock,
  MapPin,
  Calendar
} from 'lucide-react';
import { UserRole } from '@/types';
import { Event } from '@/lib/database/local';
import { getItemColors } from '@/lib/colors';

interface PlanningViewProps {
  userRole: UserRole;
  events: Event[];
  initialDate?: Date;
}

// Types pour les filtres
type FilterType = 'all' | 'courses' | 'assignments' | 'exams' | 'tasks' | 'events';

interface WeeklyItem {
  id: string;
  title: string;
  type: 'course' | 'practical' | 'exam' | 'project' | 'sport' | 'study' | 'assignment';
  day: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  subject?: string;
  description: string;
  color: string;
  borderColor: string;
  bgColor: string;
}

const getDayName = (date: Date) => {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  return days[date.getDay()];
};

export default function PlanningView({ userRole, events, initialDate }: PlanningViewProps) {
  const [currentWeek, setCurrentWeek] = useState(initialDate || new Date());
  const [activeFilter] = useState<FilterType>(userRole === 'personal' ? 'tasks' : 'all');

  // Synchroniser avec la date du parent
  useEffect(() => {
    if (initialDate) {
      setCurrentWeek(initialDate);
    }
  }, [initialDate]);

  // Calculer les dates de la semaine (lundi à dimanche)
  const getWeekDates = (date: Date) => {
    const week = [];
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Lundi = 1
    startOfWeek.setDate(diff);

    for (let i = 0; i < 7; i++) {
      const weekDay = new Date(startOfWeek);
      weekDay.setDate(startOfWeek.getDate() + i);
      week.push(weekDay);
    }
    return week;
  };

  const weekDates = getWeekDates(currentWeek);
  const weekStart = weekDates[0];
  const weekEnd = weekDates[6];

  // Convertir events en format unifié
  const weeklyItems: WeeklyItem[] = events
    .filter(event => {
      const eventDate = new Date(event.startTime);
      return eventDate >= weekStart && eventDate <= weekEnd;
    })
    .map(event => {
      const colors = getItemColors(event.type, undefined, event.title);
      return {
        id: event.id,
        title: event.title,
        type: event.type,
        day: getDayName(new Date(event.startTime)),
        startTime: new Date(event.startTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        endTime: new Date(event.endTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        location: event.location,
        description: event.description,
        color: colors.background,
        borderColor: colors.border,
        bgColor: colors.backgroundLight
      };
    });

  // Filtrer selon le type d'utilisateur
  const filteredItems = weeklyItems.filter(item => {
    if (userRole === 'personal') {
      if (activeFilter === 'tasks') return item.type === 'assignment';
      if (activeFilter === 'events') return ['course', 'practical', 'exam', 'project', 'sport', 'study'].includes(item.type);
      return true;
    } else {
      const courseTypes = ['course', 'practical', 'exam'];
      if (activeFilter === 'all') return courseTypes.includes(item.type);
      if (activeFilter === 'courses') return ['course', 'practical'].includes(item.type);
      if (activeFilter === 'exams') return item.type === 'exam';
      return courseTypes.includes(item.type);
    }
  });

  // Grouper par jour
  const itemsByDay = filteredItems.reduce((acc, item) => {
    if (!acc[item.day]) acc[item.day] = [];
    acc[item.day].push(item);
    return acc;
  }, {} as Record<string, WeeklyItem[]>);

  // Trier les éléments de chaque jour par heure
  Object.keys(itemsByDay).forEach(day => {
    itemsByDay[day].sort((a, b) => {
      const timeA = a.startTime || '00:00';
      const timeB = b.startTime || '00:00';
      return timeA.localeCompare(timeB);
    });
  });


  const dayNames = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
  const dayKeys = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];


  return (
    <div className="space-y-6">
      {/* Vue hebdomadaire */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="grid grid-cols-7 gap-4">
          {dayKeys.map((dayKey, index) => {
            const dayItems = itemsByDay[dayKey] || [];
            const dayDate = weekDates[index];
            const isToday = dayDate.toDateString() === new Date().toDateString();
            const isWeekend = dayKey === 'saturday' || dayKey === 'sunday';

            return (
              <div 
                key={dayKey} 
                className={`${isWeekend ? 'opacity-60' : ''} rounded-xl`}
              >
                {/* Header du jour */}
                <div className="text-center mb-4 pb-3 border-b border-gray-200">
                  <div className="font-semibold text-gray-900 mb-2">{dayNames[index]}</div>
                  <div className={`text-2xl font-bold w-10 h-10 mx-auto rounded-full flex items-center justify-center transition-colors ${
                    isToday 
                      ? 'bg-blue-500 text-white shadow-md' 
                      : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
                  }`}>
                    {dayDate.getDate()}
                  </div>
                </div>

                {/* Éléments du jour */}
                <div className="space-y-3 min-h-[200px]">
                  {dayItems.length === 0 ? (
                    <div className="p-4 text-center text-gray-500 bg-gray-50 rounded-xl">
                      <Calendar className="h-6 w-6 mx-auto mb-2 text-gray-400" />
                      <p className="text-xs">Libre</p>
                    </div>
                  ) : (
                    dayItems.map(item => (
                      <div
                        key={item.id}
                        className={`p-3 rounded-lg ${item.bgColor} border border-gray-200 hover:shadow-md transition-shadow`}
                      >
                        <div className="mb-2">
                          <h4 className="font-medium text-xs text-gray-900 leading-tight">
                            {item.title}
                          </h4>
                        </div>
                        
                        <div className="space-y-1 text-xs text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{item.startTime} - {item.endTime}</span>
                          </div>
                          
                          {item.location && (
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-3 w-3" />
                              <span className="truncate">{item.location}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}