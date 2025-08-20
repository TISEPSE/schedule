'use client';

import { useState, useEffect, useCallback } from 'react';

// Types locaux pour éviter les imports de modules serveur
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'student' | 'admin';
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Event {
  id: string;
  userId: string;
  title: string;
  description: string;
  type: 'course' | 'practical' | 'exam' | 'project' | 'sport' | 'study';
  startTime: Date;
  endTime: Date;
  location?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Assignment {
  id: string;
  userId: string;
  title: string;
  description: string;
  subject: string;
  type: 'homework' | 'report' | 'essay' | 'study' | 'presentation' | 'research' | 'reading';
  dueDate: Date;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  updatedAt: Date;
}

interface DataHookReturn {
  // Data
  assignments: Assignment[];
  events: Event[];
  
  // Loading states
  loading: boolean;
  syncing: boolean;
  
  // Status
  isOnline: boolean;
  lastSync: Date | null;
  error: string | null;
  
  // Actions
  createAssignment: (assignmentData: Partial<Assignment>) => Promise<void>;
  updateAssignment: (assignment: Assignment) => Promise<void>;
  deleteAssignment: (id: string) => Promise<void>;
  
  createEvent: (eventData: Partial<Event>) => Promise<void>;
  updateEvent: (event: Event) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  
  syncNow: () => Promise<void>;
  refreshData: () => Promise<void>;
}

export function useApiData(userId: string): DataHookReturn {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Charger les données depuis les API
  const loadData = useCallback(async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const [eventsResponse, assignmentsResponse] = await Promise.all([
        fetch(`/api/events?userId=${userId}`),
        fetch(`/api/assignments?userId=${userId}`)
      ]);

      const eventsData = await eventsResponse.json();
      const assignmentsData = await assignmentsResponse.json();

      if (eventsData.success) {
        // Convertir les dates string en objets Date
        const processedEvents = eventsData.events.map((event: any) => ({
          ...event,
          startTime: new Date(event.startTime),
          endTime: new Date(event.endTime),
          createdAt: new Date(event.createdAt),
          updatedAt: new Date(event.updatedAt),
        }));
        setEvents(processedEvents);
      }

      if (assignmentsData.success) {
        // Convertir les dates string en objets Date
        const processedAssignments = assignmentsData.assignments.map((assignment: any) => ({
          ...assignment,
          dueDate: new Date(assignment.dueDate),
          createdAt: new Date(assignment.createdAt),
          updatedAt: new Date(assignment.updatedAt),
        }));
        setAssignments(processedAssignments);
      }

      setIsOnline(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des données');
      setIsOnline(false);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Mock sync function
  const syncWithCloud = useCallback(async () => {
    if (syncing) return;
    
    try {
      setSyncing(true);
      setError(null);
      
      // Simuler une synchronisation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setLastSync(new Date());
      setIsOnline(true);
      
      console.log('✅ Synchronisation simulée réussie');
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de synchronisation');
      setIsOnline(false);
    } finally {
      setSyncing(false);
    }
  }, [syncing]);

  // Actions pour les devoirs
  const createAssignment = useCallback(async (assignmentData: Partial<Assignment>) => {
    if (!userId) return;
    
    try {
      const response = await fetch('/api/assignments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...assignmentData,
          userId,
          dueDate: assignmentData.dueDate?.toISOString(),
        }),
      });

      const data = await response.json();

      if (data.success) {
        const processedAssignment = {
          ...data.assignment,
          dueDate: new Date(data.assignment.dueDate),
          createdAt: new Date(data.assignment.createdAt),
          updatedAt: new Date(data.assignment.updatedAt),
        };
        setAssignments(prev => [...prev, processedAssignment]);
        console.log('📝 Nouveau devoir créé:', processedAssignment.title);
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur création devoir');
    }
  }, [userId]);

  const updateAssignment = useCallback(async (assignment: Assignment) => {
    try {
      const response = await fetch(`/api/assignments/${assignment.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...assignment,
          dueDate: assignment.dueDate.toISOString(),
        }),
      });

      const data = await response.json();

      if (data.success) {
        const processedAssignment = {
          ...data.assignment,
          dueDate: new Date(data.assignment.dueDate),
          createdAt: new Date(data.assignment.createdAt),
          updatedAt: new Date(data.assignment.updatedAt),
        };
        setAssignments(prev => 
          prev.map(a => a.id === assignment.id ? processedAssignment : a)
        );
        console.log('✏️ Devoir mis à jour:', assignment.title);
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur mise à jour devoir');
    }
  }, []);

  const deleteAssignment = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/assignments/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setAssignments(prev => prev.filter(a => a.id !== id));
        console.log('🗑️ Devoir supprimé');
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur suppression devoir');
    }
  }, []);

  // Actions pour les événements
  const createEvent = useCallback(async (eventData: Partial<Event>) => {
    if (!userId) return;
    
    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...eventData,
          userId,
          startTime: eventData.startTime?.toISOString(),
          endTime: eventData.endTime?.toISOString(),
        }),
      });

      const data = await response.json();

      if (data.success) {
        const processedEvent = {
          ...data.event,
          startTime: new Date(data.event.startTime),
          endTime: new Date(data.event.endTime),
          createdAt: new Date(data.event.createdAt),
          updatedAt: new Date(data.event.updatedAt),
        };
        setEvents(prev => [...prev, processedEvent]);
        console.log('📅 Nouvel événement créé:', processedEvent.title);
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur création événement');
    }
  }, [userId]);

  const updateEvent = useCallback(async (event: Event) => {
    try {
      const response = await fetch(`/api/events/${event.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...event,
          startTime: event.startTime.toISOString(),
          endTime: event.endTime.toISOString(),
        }),
      });

      const data = await response.json();

      if (data.success) {
        const processedEvent = {
          ...data.event,
          startTime: new Date(data.event.startTime),
          endTime: new Date(data.event.endTime),
          createdAt: new Date(data.event.createdAt),
          updatedAt: new Date(data.event.updatedAt),
        };
        setEvents(prev => 
          prev.map(e => e.id === event.id ? processedEvent : e)
        );
        console.log('📝 Événement mis à jour:', event.title);
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur mise à jour événement');
    }
  }, []);

  const deleteEvent = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/events/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setEvents(prev => prev.filter(e => e.id !== id));
        console.log('🗑️ Événement supprimé');
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur suppression événement');
    }
  }, []);

  // Rafraîchir les données
  const refreshData = useCallback(async () => {
    await loadData();
  }, [loadData]);

  // Initialisation - une seule fois au montage
  useEffect(() => {
    loadData();
  }, [loadData]);
  
  // Sync séparé - seulement si online
  useEffect(() => {
    if (isOnline && !syncing) {
      const syncTimer = setTimeout(() => {
        syncWithCloud();
      }, 5000);
      
      return () => clearTimeout(syncTimer);
    }
  }, [isOnline, syncing, syncWithCloud]);

  return {
    // Data
    assignments,
    events,
    
    // Loading states
    loading,
    syncing,
    
    // Status
    isOnline,
    lastSync,
    error,
    
    // Actions
    createAssignment,
    updateAssignment,
    deleteAssignment,
    
    createEvent,
    updateEvent,
    deleteEvent,
    
    syncNow: syncWithCloud,
    refreshData
  };
}