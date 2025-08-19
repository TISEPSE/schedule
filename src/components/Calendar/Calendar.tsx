'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';

interface CalendarEvent {
  id: string;
  title: string;
  time: string;
  type: 'course' | 'study' | 'exam' | 'personal';
  color: string;
}

const mockEvents: Record<string, CalendarEvent[]> = {
  '2024-01-15': [
    { id: '1', title: 'Mathématiques', time: '08:00', type: 'course', color: 'bg-blue-500' },
    { id: '2', title: 'Révisions Français', time: '14:00', type: 'study', color: 'bg-green-500' },
  ],
  '2024-01-16': [
    { id: '3', title: 'Contrôle Physique', time: '10:00', type: 'exam', color: 'bg-red-500' },
  ],
  '2024-01-18': [
    { id: '4', title: 'Projet groupe', time: '16:00', type: 'personal', color: 'bg-purple-500' },
  ],
};

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

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
    return mockEvents[formatDate(date)] || [];
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
                    : isCurrentMonth 
                      ? 'hover:bg-gray-50' 
                      : 'bg-gray-50 hover:bg-gray-100'
                } ${
                  isSelected 
                    ? isCurrentMonth 
                      ? 'bg-blue-500 border-blue-600 ring-2 ring-blue-300 shadow-lg' 
                      : 'bg-blue-400 border-blue-500 ring-2 ring-blue-200 shadow-md' 
                    : ''
                } ${
                  isToday 
                    ? 'bg-blue-100 border-blue-200' 
                    : ''
                }`}
              >
                <div className={`text-base font-bold ${
                  isSelected
                    ? 'text-white'
                    : isToday 
                      ? 'text-blue-700' 
                      : isCurrentMonth 
                        ? 'text-gray-900' 
                        : 'text-gray-500'
                }`}>
                  {day.getDate()}
                </div>
                
                {/* Indicateurs d'événements */}
                {hasEvents && isCurrentMonth && (
                  <div className="absolute bottom-1 left-1 right-1">
                    <div className="flex space-x-1">
                      {getEventsForDate(day).slice(0, 3).map(event => (
                        <div
                          key={event.id}
                          className={`h-1 flex-1 rounded-full ${event.color}`}
                        ></div>
                      ))}
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
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-4 px-6 rounded-2xl transition-colors flex items-center justify-center space-x-2 shadow-sm">
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
                <div key={event.id} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                  <div className={`w-3 h-3 rounded-full ${event.color}`}></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{event.title}</p>
                    <p className="text-xs text-gray-500">{event.time}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center py-8">
              {selectedDate ? 'Aucun événement ce jour' : 'Cliquez sur une date pour voir les événements'}
            </p>
          )}
        </div>

        {/* Légende */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-base font-semibold text-gray-900 mb-3">Types d&apos;événements</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-sm text-gray-700">Cours</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-sm text-gray-700">Révisions</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-sm text-gray-700">Examens</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-purple-500"></div>
              <span className="text-sm text-gray-700">Personnel</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}