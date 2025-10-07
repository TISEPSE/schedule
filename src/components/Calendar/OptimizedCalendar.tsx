'use client';

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Grid, Trash2, X } from 'lucide-react';
import { useApiData } from '@/hooks/useApiData';
import { useAuth } from '@/context/AuthContext';
import EventModal, { EventFormData } from './EventModal';
import EventDetailsModal from './EventDetailsModal';
import PlanningView from './PlanningView';
import { Event } from '@/types';

// Import optimized utilities
import {
  generateCalendarGrid,
  navigateMonth as navigateMonthUtil,
  navigateWeek as navigateWeekUtil,
  createDateKey,
  CalendarDay,
  CalendarGrid
} from '@/lib/dateUtils';

import {
  getEventsForDate,
  getEventsForMonth,
  ProcessedEvent,
  preloadEvents
} from '@/lib/eventUtils';

interface OptimizedCalendarProps {
  className?: string;
}

export default function OptimizedCalendar({ className = '' }: OptimizedCalendarProps) {
  const { user } = useAuth();
  const { events, createEvent, deleteEvent, loading, error } = useApiData(user?.id || '');

  // Core calendar state
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  // View state
  const [viewMode, setViewMode] = useState<'calendar' | 'planning'>('calendar');

  // Delete confirmation state for inline delete
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isInlineDeleting, setIsInlineDeleting] = useState(false);

  // Preload events for performance when date changes
  useEffect(() => {
    if (events.length > 0) {
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      preloadEvents(events, startOfMonth, endOfMonth);
    }
  }, [events, currentDate]);

  // Memoized calendar grid generation - only recalculates when month changes
  const calendarGrid: CalendarGrid = useMemo(() => {
    return generateCalendarGrid(currentDate);
  }, [currentDate]);

  // Memoized events for current month - only recalculates when events or month changes
  const monthEvents = useMemo(() => {
    return getEventsForMonth(events, currentDate);
  }, [events, currentDate]);

  // Memoized events for selected date - only recalculates when selection or events change
  const selectedEvents = useMemo(() => {
    return selectedDate ? getEventsForDate(events, selectedDate) : [];
  }, [events, selectedDate]);

  // Optimized navigation functions with useCallback
  const navigateMonth = useCallback((direction: 'prev' | 'next') => {
    setCurrentDate(prevDate => navigateMonthUtil(prevDate, direction));
  }, []);

  const navigateWeek = useCallback((direction: 'prev' | 'next') => {
    setCurrentDate(prevDate => navigateWeekUtil(prevDate, direction));
  }, []);

  const navigate = useCallback((direction: 'prev' | 'next') => {
    if (viewMode === 'calendar') {
      navigateMonth(direction);
    } else {
      navigateWeek(direction);
    }
  }, [viewMode, navigateMonth, navigateWeek]);

  // Optimized event creation handler
  const handleCreateEvent = useCallback(async (formData: EventFormData) => {
    if (!selectedDate || !user) return;

    try {
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

      setIsModalOpen(false);
    } catch (err) {
      console.error('Error creating event:', err);
    }
  }, [selectedDate, user, createEvent]);

  // Optimized event click handler
  const handleEventClick = useCallback((event: ProcessedEvent) => {
    const fullEvent = events.find(e => e.id === event.id);
    if (fullEvent) {
      setSelectedEvent(fullEvent);
      setIsDetailsModalOpen(true);
    }
  }, [events]);

  // Optimized day click handler
  const handleDayClick = useCallback((day: CalendarDay) => {
    if (!day.isCurrentMonth) {
      setCurrentDate(new Date(day.date.getFullYear(), day.date.getMonth(), 1));
    }
    setSelectedDate(day.date);
  }, []);

  // Optimized add event handler
  const handleAddEventClick = useCallback(() => {
    if (!selectedDate) {
      setSelectedDate(new Date());
    }
    setIsModalOpen(true);
  }, [selectedDate]);

  // Go to today handler
  const goToToday = useCallback(() => {
    setCurrentDate(new Date());
  }, []);

  // Inline delete handlers
  const handleInlineDeleteClick = useCallback((eventId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteConfirmId(eventId);
  }, []);

  const handleConfirmInlineDelete = useCallback(async (eventId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setIsInlineDeleting(true);
      await deleteEvent(eventId);
      setDeleteConfirmId(null);
    } catch (error) {
      console.error('Error deleting event:', error);
    } finally {
      setIsInlineDeleting(false);
    }
  }, [deleteEvent]);

  const handleCancelInlineDelete = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteConfirmId(null);
  }, []);

  // Memoized constants
  const monthNames = useMemo(() => [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ], []);

  const dayNames = useMemo(() => [
    'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'
  ], []);


  // Memoized render functions for better performance
  const CalendarDay = React.memo(({ day }: { day: CalendarDay }) => {
    const isSelected = selectedDate && createDateKey(day.date) === createDateKey(selectedDate);
    const eventsForDay = monthEvents[day.dateKey] || [];
    const hasEvents = eventsForDay.length > 0;

    return (
      <button
        onClick={() => handleDayClick(day)}
        className={`group p-3 h-28 border transition-all duration-200 ease-out relative rounded-xl transform hover:scale-[1.02] active:scale-[0.98] ${
          isSelected
            ? 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-300 ring-2 ring-blue-400/50 shadow-lg shadow-blue-200/30'
            : day.isToday
              ? 'bg-gradient-to-br from-blue-600 to-blue-700 border-blue-700 shadow-lg shadow-blue-500/30'
              : day.isCurrentMonth
                ? 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300 hover:shadow-md'
                : 'bg-gray-50/50 border-gray-200/50 hover:bg-gray-100/70'
        }`}
      >
        <div className={`text-base font-bold transition-colors duration-200 ${
          isSelected
            ? 'text-blue-800'
            : day.isToday
              ? 'text-white'
              : day.isCurrentMonth
                ? 'text-gray-900 group-hover:text-gray-700'
                : 'text-gray-500'
        }`}>
          {day.dayNumber}
        </div>

        {/* Event count badge */}
        {hasEvents && day.isCurrentMonth && eventsForDay.length > 0 && (
          <div className="absolute top-2 right-2">
            <div className={`w-5 h-5 rounded-full text-xs font-semibold flex items-center justify-center transition-all duration-200 ${
              isSelected
                ? 'bg-blue-600 text-white'
                : day.isToday
                  ? 'bg-white text-blue-600'
                  : 'bg-blue-100 text-blue-600 group-hover:bg-blue-200'
            }`}>
              {eventsForDay.length}
            </div>
          </div>
        )}

        {/* Event indicators */}
        {hasEvents && day.isCurrentMonth && (
          <div className="absolute bottom-2 left-2 right-2">
            <div className="flex justify-center space-x-1">
              {eventsForDay.slice(0, 3).map((event) => (
                <div
                  key={`event-indicator-${event.id}`}
                  className={`w-3 h-3 rounded-full ${event.color} shadow-sm border-2 border-white transition-transform duration-200 group-hover:scale-110`}
                  title={event.title}
                />
              ))}
              {eventsForDay.length > 3 && (
                <div
                  key={`more-${day.dateKey}`}
                  className="w-3 h-3 rounded-full bg-gray-400 shadow-sm border-2 border-white transition-transform duration-200 group-hover:scale-110"
                  title={`+${eventsForDay.length - 3} autres événements`}
                />
              )}
            </div>
          </div>
        )}

        {/* Selection indicator */}
        {isSelected && (
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-400/20 to-blue-600/20 pointer-events-none">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-400/50 to-blue-600/50 rounded-xl blur-sm" />
          </div>
        )}
      </button>
    );
  });

  CalendarDay.displayName = 'CalendarDay';

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-6" />
            <div className="grid grid-cols-7 gap-4">
              {Array.from({ length: 42 }).map((_, i) => (
                <div key={i} className="h-28 bg-gray-100 rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <div className="text-center">
            <p className="text-red-600 font-medium">Erreur lors du chargement du calendrier</p>
            <p className="text-gray-500 text-sm mt-2">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Main calendar container */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {viewMode === 'calendar'
              ? `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`
              : 'Planning Hebdomadaire'
            }
          </h2>

          <div className="flex items-center space-x-4">
            {/* Add button */}
            <button
              onClick={handleAddEventClick}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-xl transition-colors flex items-center space-x-2 shadow-sm"
            >
              <Plus className="h-4 w-4" />
              <span>Ajouter</span>
            </button>

            {/* View selector */}
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

            {/* Navigation */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => navigate('prev')}
                className="p-3 rounded-xl transition-colors hover:bg-gray-100 text-gray-600"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={goToToday}
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

        {/* Main content */}
        <div className="transition-all duration-300">
          {viewMode === 'calendar' ? (
            /* Calendar view */
            <div className="grid grid-cols-7 gap-4 max-w-5xl mx-auto">
              {/* Day headers */}
              {dayNames.map(day => (
                <div key={day} className="p-4 text-center text-base font-medium text-gray-500">
                  {day}
                </div>
              ))}

              {/* Calendar grid */}
              {calendarGrid.days.map((day) => (
                <CalendarDay key={day.dateKey} day={day} />
              ))}
            </div>
          ) : (
            /* Planning view */
            <div>
              <PlanningView
                userRole={user?.role || 'student'}
                events={events}
                initialDate={currentDate}
                onDeleteEvent={deleteEvent}
              />
            </div>
          )}
        </div>
      </div>

      {/* Selected day events */}
      {viewMode === 'calendar' && selectedDate && selectedEvents.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <h3 className="text-lg font-semibold text-gray-900">
              Événements du {selectedDate.getDate()} {monthNames[selectedDate.getMonth()]}
            </h3>
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
              {selectedEvents.length}
            </span>
          </div>
          <div className="space-y-3">
            {selectedEvents.map((event, index) => {
              const isConfirmingDelete = deleteConfirmId === event.id;

              return (
                <div
                  key={event.id}
                  className="relative"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Main event button */}
                  <button
                    onClick={() => !isConfirmingDelete && handleEventClick(event)}
                    disabled={isConfirmingDelete}
                    className={`group w-full flex items-center space-x-4 p-4 rounded-xl transition-all duration-200 text-left transform border ${
                      isConfirmingDelete
                        ? 'bg-red-50 border-red-300 cursor-default'
                        : 'bg-gradient-to-r from-gray-50 to-gray-50/50 hover:from-blue-50 hover:to-blue-100/30 hover:scale-[1.01] hover:shadow-md border-transparent hover:border-blue-200'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full ${event.color} shadow-sm group-hover:scale-110 transition-transform duration-200 flex-shrink-0`} />
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold transition-colors duration-200 truncate ${
                        isConfirmingDelete ? 'text-red-900' : 'text-gray-900 group-hover:text-blue-900'
                      }`}>
                        {event.title}
                      </p>
                      <p className={`text-xs transition-colors duration-200 ${
                        isConfirmingDelete ? 'text-red-700' : 'text-gray-500 group-hover:text-blue-600'
                      }`}>
                        <span className="font-medium">{event.time}</span>
                        {event.location && (
                          <>
                            <span className="mx-1">•</span>
                            <span className="truncate">{event.location}</span>
                          </>
                        )}
                      </p>
                    </div>

                    {/* Delete button - shown on hover */}
                    {!isConfirmingDelete && (
                      <button
                        onClick={(e) => handleInlineDeleteClick(event.id, e)}
                        className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-50 rounded-lg transition-all duration-200 flex-shrink-0"
                        title="Supprimer"
                      >
                        <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-500 transition-colors" />
                      </button>
                    )}

                    {/* View details arrow */}
                    {!isConfirmingDelete && (
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    )}
                  </button>

                  {/* Confirmation overlay */}
                  {isConfirmingDelete && (
                    <div className="absolute inset-0 flex items-center justify-end px-4 space-x-2">
                      <span className="text-sm font-medium text-red-800 mr-2">Supprimer ?</span>
                      <button
                        onClick={(e) => handleConfirmInlineDelete(event.id, e)}
                        disabled={isInlineDeleting}
                        className="px-3 py-1.5 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white text-sm font-medium rounded-lg transition-colors flex items-center space-x-1"
                      >
                        {isInlineDeleting ? (
                          <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <Trash2 className="h-3 w-3" />
                            <span>Oui</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={handleCancelInlineDelete}
                        disabled={isInlineDeleting}
                        className="px-3 py-1.5 bg-white hover:bg-gray-100 disabled:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors border border-gray-300"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modals */}
      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateEvent}
        selectedDate={selectedDate || undefined}
      />

      <EventDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        onDelete={deleteEvent}
        event={selectedEvent}
      />
    </div>
  );
}