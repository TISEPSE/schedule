'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Grid } from 'lucide-react';
import { useApiData } from '@/hooks/useApiData';
import { useAuth } from '@/context/AuthContext';
import EventModal, { EventFormData } from './EventModal';
import EventDetailsModal from './EventDetailsModal';
import PlanningView from './PlanningView';
import { getLegacyEventColor } from '@/lib/colors';

const getEventColor = (type: string) => {
  return getLegacyEventColor(type);
};

export default function Calendar() {
  const { user } = useAuth();
  const { events, createEvent } = useApiData(user?.id || '');
  
  // États pour la vue calendrier
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  // États pour les modales
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<{
    id: string; 
    title: string; 
    type: string; 
    startTime: Date; 
    endTime: Date; 
    subject?: string; 
    location?: string; 
    description?: string;
  } | null>(null);
  
  // État pour basculer entre les vues
  const [viewMode, setViewMode] = useState<'calendar' | 'planning'>('calendar');

  // Générer les jours du mois (grille 6x7 = 42 cases)
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();

    // Lundi = 0 (au lieu de dimanche = 0)
    const startingDayOfWeek = (firstDay.getDay() + 6) % 7;
    const days = [];

    // Jours du mois précédent
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevMonthDate = new Date(year, month - 1, 0);
      const daysInPrevMonth = prevMonthDate.getDate();
      days.push({
        date: new Date(year, month - 1, daysInPrevMonth - i),
        isCurrentMonth: false
      });
    }

    // Jours du mois actuel
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        date: new Date(year, month, day),
        isCurrentMonth: true
      });
    }

    // Jours du mois suivant (compléter jusqu'à 42)
    let nextMonthDay = 1;
    while (days.length < 42) {
      days.push({
        date: new Date(year, month + 1, nextMonthDay),
        isCurrentMonth: false
      });
      nextMonthDay++;
    }

    return days;
  };

  // Obtenir les événements pour une date donnée
  const getEventsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return events.filter(event => {
      const eventDate = new Date(event.startTime);
      return eventDate.toISOString().split('T')[0] === dateStr;
    }).map(event => ({
      id: event.id,
      title: event.title,
      time: new Date(event.startTime).toLocaleTimeString('fr-FR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      type: event.type,
      color: getEventColor(event.type),
      location: event.location
    }));
  };

  // Navigation mois
  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
      return newDate;
    });
  };

  // Navigation semaine
  const navigateWeek = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setDate(prev.getDate() + (direction === 'next' ? 7 : -7));
      return newDate;
    });
  };

  // Navigation adaptée selon la vue
  const navigate = (direction: 'prev' | 'next') => {
    if (viewMode === 'calendar') {
      navigateMonth(direction);
    } else {
      navigateWeek(direction);
    }
  };

  // Créer un nouvel événement
  const handleCreateEvent = async (formData: EventFormData) => {
    if (!selectedDate || !user) return;
    
    const startDateTime = new Date(selectedDate);
    const [startHours, startMinutes] = formData.startTime.split(':');
    startDateTime.setHours(parseInt(startHours), parseInt(startMinutes));
    
    const endDateTime = new Date(selectedDate);
    const [endHours, endMinutes] = formData.endTime.split(':');
    endDateTime.setHours(parseInt(endHours), parseInt(endMinutes));
    
    await createEvent({
      title: formData.title,
      description: formData.description,
      type: formData.type,
      startTime: startDateTime,
      endTime: endDateTime,
      location: formData.location,
    });
  };

  // Afficher les détails d'un événement
  const handleEventClick = (event: {id: string; title?: string; type?: string; time?: string; color?: string; location?: string}) => {
    const fullEvent = events.find(e => e.id === event.id);
    if (fullEvent) {
      setSelectedEvent(fullEvent);
      setIsDetailsModalOpen(true);
    }
  };

  // Ouvrir le modal de création
  const handleAddEventClick = () => {
    if (selectedDate) {
      setIsModalOpen(true);
    } else {
      setSelectedDate(new Date());
      setIsModalOpen(true);
    }
  };

  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const dayNames = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  const days = getDaysInMonth(currentDate);
  const today = new Date();
  const selectedEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  return (
    <div className="space-y-6">
      {/* Calendrier principal */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
        {/* En-tête consistent - reste toujours identique */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {viewMode === 'calendar' ? `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}` : 'Planning Hebdomadaire'}
          </h2>
          
          <div className="flex items-center space-x-4">
            {/* Bouton Ajouter - toujours identique */}
            <button 
              onClick={handleAddEventClick}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-xl transition-colors flex items-center space-x-2 shadow-sm"
            >
              <Plus className="h-4 w-4" />
              <span>Ajouter</span>
            </button>
            
            {/* Sélecteur de vue - toujours identique */}
            <div className="flex bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setViewMode('calendar')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1 ${
                  viewMode === 'calendar' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <CalendarIcon className="h-4 w-4" />
                <span>Calendrier</span>
              </button>
              <button
                onClick={() => setViewMode('planning')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1 ${
                  viewMode === 'planning' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Grid className="h-4 w-4" />
                <span>Planning</span>
              </button>
            </div>
            
            {/* Navigation adaptée - toujours active */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => navigate('prev')}
                className="p-3 rounded-xl transition-colors hover:bg-gray-100 text-gray-600"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-4 py-2 text-sm rounded-xl transition-colors bg-blue-50 text-blue-600 hover:bg-blue-100"
              >
                Aujourd&apos;hui
              </button>
              <button
                onClick={() => navigate('next')}
                className="p-3 rounded-xl transition-colors hover:bg-gray-100 text-gray-600"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Contenu principal - seule cette zone change entre les vues */}
        <div className="transition-all duration-300">
          {viewMode === 'calendar' ? (
            /* Vue Calendrier */
            <div className="grid grid-cols-7 gap-4 max-w-5xl mx-auto">
              {/* En-têtes des jours */}
              {dayNames.map(day => (
                <div key={day} className="p-4 text-center text-base font-medium text-gray-500">
                  {day}
                </div>
              ))}

              {/* Grille des jours */}
              {days.map((dayObj, index) => {
                const day = dayObj.date;
                const isCurrentMonth = dayObj.isCurrentMonth;
                const isToday = day.toDateString() === today.toDateString();
                const isSelected = selectedDate && day.toDateString() === selectedDate.toDateString();
                const hasEvents = getEventsForDate(day).length > 0;
                const eventsForDay = getEventsForDate(day);

                return (
                  <button
                    key={day.getTime()}
                    onClick={() => {
                      if (!isCurrentMonth) {
                        setCurrentDate(new Date(day.getFullYear(), day.getMonth(), 1));
                      }
                      setSelectedDate(day);
                    }}
                    className={`group p-3 h-28 border transition-all duration-200 ease-out relative rounded-xl transform hover:scale-[1.02] active:scale-[0.98] ${
                      isSelected 
                        ? 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-300 ring-2 ring-blue-400/50 shadow-lg shadow-blue-200/30' 
                        : isToday
                          ? 'bg-gradient-to-br from-blue-600 to-blue-700 border-blue-700 shadow-lg shadow-blue-500/30' 
                          : isCurrentMonth 
                            ? 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300 hover:shadow-md' 
                            : 'bg-gray-50/50 border-gray-200/50 hover:bg-gray-100/70'
                    }`}
                  >
                    <div className={`text-base font-bold transition-colors duration-200 ${
                      isSelected
                        ? 'text-blue-800'
                        : isToday 
                          ? 'text-white' 
                          : isCurrentMonth 
                            ? 'text-gray-900 group-hover:text-gray-700' 
                            : 'text-gray-500'
                    }`}>
                      {day.getDate()}
                    </div>
                    
                    {/* Badge pour nombre d'événements */}
                    {hasEvents && isCurrentMonth && eventsForDay.length > 0 && (
                      <div className="absolute top-2 right-2">
                        <div className={`w-5 h-5 rounded-full text-xs font-semibold flex items-center justify-center transition-all duration-200 ${
                          isSelected
                            ? 'bg-blue-600 text-white'
                            : isToday
                              ? 'bg-white text-blue-600'
                              : 'bg-blue-100 text-blue-600 group-hover:bg-blue-200'
                        }`}>
                          {eventsForDay.length}
                        </div>
                      </div>
                    )}
                    
                    {/* Indicateurs d'événements améliorés */}
                    {hasEvents && isCurrentMonth && (
                      <div className="absolute bottom-2 left-2 right-2">
                        <div className="flex justify-center space-x-1">
                          {eventsForDay.slice(0, 3).map((event, eventIndex) => (
                            <div
                              key={`${event.id}-${eventIndex}`}
                              className={`w-3 h-3 rounded-full ${event.color} shadow-sm border-2 border-white transition-transform duration-200 group-hover:scale-110`}
                              title={event.title}
                            ></div>
                          ))}
                          {eventsForDay.length > 3 && (
                            <div
                              key={`more-indicator-${day.getTime()}`}
                              className="w-3 h-3 rounded-full bg-gray-400 shadow-sm border-2 border-white transition-transform duration-200 group-hover:scale-110"
                              title={`+${eventsForDay.length - 3} autres événements`}
                            ></div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Indicateur de sélection amélioré */}
                    {isSelected && (
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-400/20 to-blue-600/20 pointer-events-none">
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-400/50 to-blue-600/50 rounded-xl blur-sm"></div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          ) : (
            /* Vue Planning */
            <div>
              <PlanningView 
                userRole={user?.role || 'student'} 
                events={events} 
                initialDate={currentDate}
              />
            </div>
          )}
        </div>
      </div>

      {/* Événements du jour sélectionné (seulement en mode calendrier) */}
      {viewMode === 'calendar' && selectedDate && selectedEvents.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <h3 className="text-lg font-semibold text-gray-900">
              Événements du {selectedDate.getDate()} {monthNames[selectedDate.getMonth()]}
            </h3>
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
              {selectedEvents.length}
            </span>
          </div>
          <div className="space-y-3">
            {selectedEvents.map((event, index) => (
              <button
                key={`event-${event.id}-${index}`}
                onClick={() => handleEventClick(event)}
                className="group w-full flex items-center space-x-4 p-4 bg-gradient-to-r from-gray-50 to-gray-50/50 hover:from-blue-50 hover:to-blue-100/30 rounded-xl transition-all duration-200 text-left transform hover:scale-[1.01] hover:shadow-md border border-transparent hover:border-blue-200"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className={`w-4 h-4 rounded-full ${event.color} shadow-sm group-hover:scale-110 transition-transform duration-200 flex-shrink-0`}></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-900 transition-colors duration-200 truncate">{event.title}</p>
                  <p className="text-xs text-gray-500 group-hover:text-blue-600 transition-colors duration-200">
                    <span className="font-medium">{event.time}</span>
                    {event.location && (
                      <>
                        <span className="mx-1">•</span>
                        <span className="truncate">{event.location}</span>
                      </>
                    )}
                  </p>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}


      {/* Modales */}
      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateEvent}
        selectedDate={selectedDate || undefined}
      />

      <EventDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        event={selectedEvent}
      />
    </div>
  );
}