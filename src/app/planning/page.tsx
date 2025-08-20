'use client';

import { useAuth } from '@/context/AuthContext';
import { redirect } from 'next/navigation';
import MainLayout from '@/components/Layout/MainLayout';
import { useState } from 'react';
import { useApiData } from '@/hooks/useApiData';
import { 
  ChevronLeft, 
  ChevronRight, 
  Clock,
  MapPin,
  BookOpen,
  AlertCircle,
  Calendar,
  Filter,
  CheckCircle,
  Circle,
  GraduationCap
} from 'lucide-react';

// Types pour les filtres
type FilterType = 'all' | 'courses' | 'assignments' | 'exams';

interface WeeklyItem {
  id: string;
  title: string;
  type: 'course' | 'practical' | 'exam' | 'assignment';
  day: string;
  startTime?: string;
  endTime?: string;
  dueTime?: string;
  location?: string;
  subject?: string;
  description: string;
  color: string;
  borderColor: string;
  bgColor: string;
  completed?: boolean;
  priority?: 'low' | 'medium' | 'high';
}

const getItemColors = (type: string, priority?: string) => {
  const colorMaps: Record<string, { color: string; borderColor: string; bgColor: string }> = {
    course: { color: 'bg-blue-600', borderColor: 'border-l-blue-600', bgColor: 'bg-blue-100' },
    practical: { color: 'bg-emerald-600', borderColor: 'border-l-emerald-600', bgColor: 'bg-emerald-100' }, 
    exam: { color: 'bg-red-600', borderColor: 'border-l-red-600', bgColor: 'bg-red-100' },
    assignment: priority === 'high' 
      ? { color: 'bg-orange-600', borderColor: 'border-l-orange-600', bgColor: 'bg-orange-100' }
      : priority === 'low' 
        ? { color: 'bg-slate-600', borderColor: 'border-l-slate-600', bgColor: 'bg-slate-100' }
        : { color: 'bg-amber-600', borderColor: 'border-l-amber-600', bgColor: 'bg-amber-100' }
  };
  return colorMaps[type] || { color: 'bg-slate-600', borderColor: 'border-l-slate-600', bgColor: 'bg-slate-100' };
};

const getDayName = (date: Date) => {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  return days[date.getDay()];
};

export default function PlanningPage() {
  const { user, logout } = useAuth();
  const { events, assignments, createEvent, createAssignment, updateAssignment } = useApiData(user?.id || '');
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  if (!user) {
    redirect('/');
    return null;
  }

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

  // Convertir events et assignments en format unifié
  const weeklyItems: WeeklyItem[] = [
    // Événements (cours, examens, etc.)
    ...events
      .filter(event => {
        const eventDate = new Date(event.startTime);
        return eventDate >= weekStart && eventDate <= weekEnd;
      })
      .map(event => {
        const colors = getItemColors(event.type);
        return {
          id: event.id,
          title: event.title,
          type: event.type,
          day: getDayName(new Date(event.startTime)),
          startTime: new Date(event.startTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
          endTime: new Date(event.endTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
          location: event.location,
          description: event.description,
          color: colors.color,
          borderColor: colors.borderColor,
          bgColor: colors.bgColor
        };
      }),
    // Devoirs
    ...assignments
      .filter(assignment => {
        const dueDate = new Date(assignment.dueDate);
        return dueDate >= weekStart && dueDate <= weekEnd;
      })
      .map(assignment => {
        const colors = getItemColors('assignment', assignment.priority);
        return {
          id: assignment.id,
          title: assignment.title,
          type: 'assignment' as const,
          day: getDayName(new Date(assignment.dueDate)),
          dueTime: new Date(assignment.dueDate).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
          subject: assignment.subject,
          description: assignment.description,
          color: colors.color,
          borderColor: colors.borderColor,
          bgColor: colors.bgColor,
          completed: assignment.completed,
          priority: assignment.priority
        };
      })
  ];

  // Filtrer les éléments selon le filtre actif
  const filteredItems = weeklyItems.filter(item => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'courses') return ['course', 'practical'].includes(item.type);
    if (activeFilter === 'assignments') return item.type === 'assignment';
    if (activeFilter === 'exams') return item.type === 'exam';
    return true;
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
      const timeA = a.startTime || a.dueTime || '00:00';
      const timeB = b.startTime || b.dueTime || '00:00';
      return timeA.localeCompare(timeB);
    });
  });

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(currentWeek.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeek(newWeek);
  };

  const handleAssignmentToggle = async (assignment: WeeklyItem) => {
    if (assignment.type === 'assignment') {
      const originalAssignment = assignments.find(a => a.id === assignment.id);
      if (originalAssignment) {
        await updateAssignment({
          ...originalAssignment,
          completed: !originalAssignment.completed
        });
      }
    }
  };

  const dayNames = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
  const dayKeys = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  const filters = [
    { key: 'all', label: 'Tous', icon: Calendar },
    { key: 'courses', label: 'Cours', icon: GraduationCap },
    { key: 'assignments', label: 'Devoirs', icon: BookOpen },
    { key: 'exams', label: 'Examens', icon: AlertCircle }
  ];

  return (
    <MainLayout user={user} onLogout={logout}>
      <div className="space-y-6">
        
        {/* Header avec navigation et filtres - Consistent avec les autres pages */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Emploi du temps</h1>
              <p className="text-gray-600">Vue hebdomadaire de vos cours et devoirs</p>
            </div>
            
            {/* Navigation semaine */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => navigateWeek('prev')}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <div className="px-4 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg font-medium">
                Semaine du {weekStart.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })} au{' '}
                {weekEnd.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
              </div>
              <button
                onClick={() => navigateWeek('next')}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Filtres - Amélioration du design */}
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-500" />
            <div className="flex space-x-2">
              {filters.map((filter) => {
                const IconComponent = filter.icon;
                return (
                  <button
                    key={filter.key}
                    onClick={() => setActiveFilter(filter.key as FilterType)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeFilter === filter.key 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <IconComponent className="h-4 w-4" />
                    <span>{filter.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Vue hebdomadaire - Design amélioré */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
            {dayKeys.map((dayKey, index) => {
              const dayItems = itemsByDay[dayKey] || [];
              const dayDate = weekDates[index];
              const isToday = dayDate.toDateString() === new Date().toDateString();
              const isWeekend = dayKey === 'saturday' || dayKey === 'sunday';

              return (
                <div 
                  key={dayKey} 
                  className={`${isWeekend ? 'opacity-60' : ''} ${isToday ? 'ring-2 ring-blue-100' : ''} rounded-xl`}
                >
                  {/* Header du jour - Style uniforme */}
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
                  <div className="space-y-4 min-h-[300px]">
                    {dayItems.length === 0 ? (
                      <div className="p-6 text-center text-gray-500 bg-gray-50 rounded-xl">
                        <Calendar className="h-8 w-8 mx-auto mb-3 text-gray-400" />
                        <p className="text-sm font-medium">Aucun élément</p>
                        <p className="text-xs text-gray-400 mt-1">Journée libre</p>
                      </div>
                    ) : (
                      dayItems.map(item => (
                        <div
                          key={item.id}
                          className={`p-4 rounded-xl ${item.bgColor} hover:shadow-md transition-all duration-200 cursor-pointer group border border-gray-200`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-2">
                                {item.type === 'assignment' && (
                                  <button
                                    onClick={() => handleAssignmentToggle(item)}
                                    className="flex-shrink-0 hover:scale-110 transition-transform"
                                  >
                                    {item.completed ? (
                                      <CheckCircle className="h-5 w-5 text-green-600" />
                                    ) : (
                                      <Circle className="h-5 w-5 text-gray-400" />
                                    )}
                                  </button>
                                )}
                                <h4 className={`font-semibold text-sm leading-tight ${
                                  item.completed ? 'line-through text-gray-500' : 'text-gray-900'
                                }`}>
                                  {item.title}
                                </h4>
                              </div>
                              
                              <div className="space-y-2 text-xs text-gray-600 mb-3">
                                <div className="flex items-center space-x-2">
                                  <Clock className="h-3 w-3 flex-shrink-0" />
                                  <span className="font-medium">
                                    {item.type === 'assignment'
                                      ? `À rendre pour ${item.dueTime}`
                                      : `${item.startTime} - ${item.endTime}`
                                    }
                                  </span>
                                </div>
                                
                                {item.location && (
                                  <div className="flex items-center space-x-2">
                                    <MapPin className="h-3 w-3 flex-shrink-0" />
                                    <span className="truncate">{item.location}</span>
                                  </div>
                                )}
                                
                                {item.subject && (
                                  <div className="flex items-center space-x-2">
                                    <BookOpen className="h-3 w-3 flex-shrink-0" />
                                    <span className="truncate font-medium">{item.subject}</span>
                                  </div>
                                )}
                              </div>
                              
                              {item.description && (
                                <p className="text-xs text-gray-500 mb-3 line-clamp-2">{item.description}</p>
                              )}
                              
                              {item.priority && item.type === 'assignment' && (
                                <span className={`inline-block px-2 py-1 text-xs rounded-full font-medium ${
                                  item.priority === 'high' ? 'bg-red-100 text-red-700' :
                                  item.priority === 'low' ? 'bg-gray-100 text-gray-700' :
                                  'bg-yellow-100 text-yellow-700'
                                }`}>
                                  {item.priority === 'high' ? 'Priorité haute' :
                                   item.priority === 'low' ? 'Priorité basse' : 'Priorité normale'}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Message vide global - Amélioration du design */}
          {filteredItems.length === 0 && (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Aucun élément cette semaine</h3>
              <p className="text-gray-600 text-lg">
                {activeFilter === 'all' 
                  ? 'Votre emploi du temps est vide pour cette semaine.'
                  : `Aucun ${filters.find(f => f.key === activeFilter)?.label.toLowerCase()} trouvé cette semaine.`
                }
              </p>
              <p className="text-gray-500 text-sm mt-2">Profitez de ce temps libre pour vous reposer ou étudier !</p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}