'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { useApiData } from '@/hooks/useApiData';
import { useAuth } from '@/context/AuthContext';
import EventModal, { EventFormData } from './EventModal';
import EventDetailsModal from './EventDetailsModal';

import { getLegacyEventColor } from '@/lib/colors';

const getEventColor = (type: string) => {
  return getLegacyEventColor(type);
};

export default function Calendar() {
  const { user } = useAuth();
  const { events, createEvent } = useApiData(user?.id || '');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<{id: string; title: string; type: string; startTime: Date; endTime: Date; subject?: string; location?: string; description?: string} | null>(null);

  // Générer les jours du mois avec grille fixe de 42 cases (6 semaines)
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    // Ajuster pour que lundi = 0 (au lieu de dimanche = 0)
    const startingDayOfWeek = (firstDay.getDay() + 6) % 7;

    const days = [];
    
    // Jours du mois précédent
    const prevMonth = new Date(year, month - 1, 0);
    const daysInPrevMonth = prevMonth.getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
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
    
    // Jours du mois suivant pour compléter 42 cases
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

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const getEventsForDate = (date: Date) => {
    const dateStr = formatDate(date);
    return events.filter(event => {
      const eventDate = new Date(event.startTime);
      return formatDate(eventDate) === dateStr;
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

  const handleEventClick = (event: {id: string; title?: string; type?: string; time?: string; color?: string; location?: string}) => {
    // Trouver l'événement complet dans la liste
    const fullEvent = events.find(e => e.id === event.id);
    if (fullEvent) {
      setSelectedEvent(fullEvent);
      setIsDetailsModalOpen(true);
    }
  };

  const handleAddEventClick = () => {
    if (selectedDate) {
      setIsModalOpen(true);
    } else {
      // Sélectionner la date d'aujourd'hui par défaut
      setSelectedDate(new Date());
      setIsModalOpen(true);
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
      return newDate;
    });
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
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Calendrier principal */}
      <div className="lg:col-span-3 bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
        {/* Header du calendrier */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-3 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-4 py-2 text-sm bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors"
            >
              Aujourd&apos;hui
            </button>
            <button
              onClick={() => navigateMonth('next')}
              className="p-3 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <ChevronRight className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Grille du calendrier */}
        <div className="grid grid-cols-7 gap-2">
          {/* Headers des jours */}
          {dayNames.map(day => (
            <div key={day} className="p-4 text-center text-base font-medium text-gray-500">
              {day}
            </div>
          ))}

          {/* Jours du calendrier */}
          {days.map((dayObj, index) => {
            const day = dayObj.date;
            const isCurrentMonth = dayObj.isCurrentMonth;
            const isToday = day.toDateString() === today.toDateString();
            const isSelected = selectedDate && day.toDateString() === selectedDate.toDateString();
            const hasEvents = getEventsForDate(day).length > 0;

            return (
              <button
                key={`${day.getFullYear()}-${day.getMonth()}-${day.getDate()}-${index}`}
                onClick={() => {
                  if (!isCurrentMonth) {
                    // Si c'est un jour d'un autre mois, naviguer vers ce mois
                    setCurrentDate(new Date(day.getFullYear(), day.getMonth(), 1));
                  }
                  setSelectedDate(day);
                }}
                className={`p-4 h-28 border border-gray-200 transition-colors relative rounded-xl ${
                  isSelected 
                    ? 'hover:bg-blue-400 hover:shadow-xl hover:ring-4 hover:ring-blue-150' 
                    : isToday
                      ? '' // Pas d'effet hover pour la date du jour
                      : isCurrentMonth 
                        ? 'hover:bg-gray-50' 
                        : 'bg-gray-50 hover:bg-gray-100'
                } ${
                  isSelected 
                    ? isCurrentMonth 
                      ? 'bg-blue-100 border-blue-200 ring-2 ring-blue-300 shadow-lg' 
                      : 'bg-blue-100 border-blue-200 ring-2 ring-blue-200 shadow-md' 
                    : ''
                } ${
                  isToday 
                    ? 'bg-blue-500 border-blue-600' 
                    : ''
                }`}
              >
                <div className={`text-base font-bold ${
                  isSelected
                    ? 'text-blue-700'
                    : isToday 
                      ? 'text-white' 
                      : isCurrentMonth 
                        ? 'text-gray-900' 
                        : 'text-gray-500'
                }`}>
                  {day.getDate()}
                </div>
                
                {/* Indicateurs d'événements */}
                {hasEvents && isCurrentMonth && (
                  <div className="absolute bottom-2 left-2 right-2">
                    <div className="flex justify-center space-x-1">
                      {getEventsForDate(day).slice(0, 3).map(event => (
                        <div
                          key={event.id}
                          className={`w-2 h-2 rounded-full ${event.color} shadow-sm`}
                        ></div>
                      ))}
                      {getEventsForDate(day).length > 3 && (
                        <div className="w-2 h-2 rounded-full bg-gray-400 shadow-sm"></div>
                      )}
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Panel des événements */}
      <div className="space-y-6">
        {/* Bouton ajouter événement */}
        <button 
          onClick={handleAddEventClick}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-4 px-6 rounded-2xl transition-colors flex items-center justify-center space-x-2 shadow-sm"
        >
          <Plus className="h-4 w-4" />
          <span>Ajouter un événement</span>
        </button>

        {/* Événements du jour sélectionné */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-base font-semibold text-gray-900 mb-4">
            {selectedDate 
              ? `Événements du ${selectedDate.getDate()} ${monthNames[selectedDate.getMonth()]}`
              : 'Sélectionnez une date'
            }
          </h3>

          {selectedEvents.length > 0 ? (
            <div className="space-y-3">
              {selectedEvents.map(event => (
                <button 
                  key={event.id} 
                  onClick={() => handleEventClick(event)}
                  className="w-full flex items-center space-x-3 p-4 bg-gray-50 hover:bg-blue-50 rounded-xl transition-colors text-left"
                >
                  <div className={`w-3 h-3 rounded-full ${event.color}`}></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{event.title}</p>
                    <p className="text-xs text-gray-500">
                      {event.time}
                      {event.location && ` • ${event.location}`}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center py-8">
              {selectedDate ? 'Aucun événement ce jour' : 'Cliquez sur une date pour voir les événements'}
            </p>
          )}
        </div>

      </div>

      {/* Modal de création d'événement */}
      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateEvent}
        selectedDate={selectedDate || undefined}
      />

      {/* Modal de détails d'événement */}
      <EventDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        event={selectedEvent}
      />
    </div>
  );
}