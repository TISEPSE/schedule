'use client';

import { useState, useEffect, useCallback } from 'react';
import { LocalStorage, User, Assignment, Event } from '@/lib/database/local';
import { MockDataService } from '@/lib/services/mockDataService';

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
  loadSampleData: () => Promise<void>;
}

export function useData(userId: string): DataHookReturn {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Charger les données depuis IndexedDB
  const loadLocalData = useCallback(async () => {
    try {
      setLoading(true);
      const [localAssignments, localEvents] = await Promise.all([
        LocalStorage.getAssignments(userId),
        LocalStorage.getEvents(userId)
      ]);
      
      setAssignments(localAssignments);
      setEvents(localEvents);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading local data');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Simuler la synchronisation avec Neon
  const syncWithCloud = useCallback(async () => {
    if (syncing) return;
    
    try {
      setSyncing(true);
      setError(null);
      
      // Vérifier la "connexion" (mock)
      const healthResponse = await fetch('/api/mock-health');
      const healthOk = healthResponse.ok;
      setIsOnline(healthOk);
      
      if (!healthOk) {
        throw new Error('Service indisponible');
      }

      // Simuler la sync des devoirs
      const assignmentsResponse = await fetch(`/api/mock-sync/assignments?userId=${userId}`);
      if (assignmentsResponse.ok) {
        const assignmentsData = await assignmentsResponse.json();
        console.log('📚 Devoirs synchronisés:', assignmentsData.count);
      }

      // Simuler la sync des événements  
      const eventsResponse = await fetch(`/api/mock-sync/events?userId=${userId}`);
      if (eventsResponse.ok) {
        const eventsData = await eventsResponse.json();
        console.log('📅 Événements synchronisés:', eventsData.count);
      }

      setLastSync(new Date());
      console.log('✅ Synchronisation réussie avec Mock Neon');
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de synchronisation');
      setIsOnline(false);
      console.log('❌ Synchronisation échouée, mode hors-ligne activé');
    } finally {
      setSyncing(false);
    }
  }, [userId]);

  // Actions pour les devoirs
  const createAssignment = useCallback(async (assignmentData: Partial<Assignment>) => {
    try {
      const assignment: Assignment = {
        id: crypto.randomUUID(),
        userId,
        title: assignmentData.title || '',
        description: assignmentData.description || '',
        subject: assignmentData.subject || '',
        type: assignmentData.type || 'homework',
        dueDate: assignmentData.dueDate || new Date(),
        completed: false,
        priority: assignmentData.priority || 'medium',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Sauver localement
      await LocalStorage.saveAssignment(assignment);
      
      // Mettre à jour l'état
      setAssignments(prev => [...prev, assignment]);
      
      console.log('📝 Nouveau devoir créé:', assignment.title);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur création devoir');
    }
  }, [userId]);

  const updateAssignment = useCallback(async (assignment: Assignment) => {
    try {
      assignment.updatedAt = new Date();
      await LocalStorage.saveAssignment(assignment);
      
      setAssignments(prev => 
        prev.map(a => a.id === assignment.id ? assignment : a)
      );
      
      console.log('✏️ Devoir mis à jour:', assignment.title);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur mise à jour devoir');
    }
  }, []);

  const deleteAssignment = useCallback(async (id: string) => {
    try {
      await LocalStorage.deleteAssignment(id);
      
      setAssignments(prev => prev.filter(a => a.id !== id));
      
      console.log('🗑️ Devoir supprimé');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur suppression devoir');
    }
  }, []);

  // Actions pour les événements
  const createEvent = useCallback(async (eventData: Partial<Event>) => {
    try {
      const event: Event = {
        id: crypto.randomUUID(),
        userId,
        title: eventData.title || '',
        description: eventData.description || '',
        type: eventData.type || 'course',
        startTime: eventData.startTime || new Date(),
        endTime: eventData.endTime || new Date(),
        location: eventData.location,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await LocalStorage.saveEvent(event);
      setEvents(prev => [...prev, event]);
      
      console.log('📅 Nouvel événement créé:', event.title);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur création événement');
    }
  }, [userId]);

  const updateEvent = useCallback(async (event: Event) => {
    try {
      event.updatedAt = new Date();
      await LocalStorage.saveEvent(event);
      
      setEvents(prev => 
        prev.map(e => e.id === event.id ? event : e)
      );
      
      console.log('📝 Événement mis à jour:', event.title);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur mise à jour événement');
    }
  }, []);

  const deleteEvent = useCallback(async (id: string) => {
    try {
      await LocalStorage.deleteEvent(id);
      setEvents(prev => prev.filter(e => e.id !== id));
      
      console.log('🗑️ Événement supprimé');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur suppression événement');
    }
  }, []);

  // Charger des données d'exemple
  const loadSampleData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Ajouter des données de test via le service mock
      MockDataService.addSampleData(userId);
      
      // Récupérer les données et les sauver localement
      const [sampleAssignments, sampleEvents] = await Promise.all([
        MockDataService.getAssignments(userId),
        MockDataService.getEvents(userId)
      ]);
      
      // Sauver en local
      for (const assignment of sampleAssignments) {
        await LocalStorage.saveAssignment(assignment);
      }
      
      for (const event of sampleEvents) {
        await LocalStorage.saveEvent(event);
      }
      
      // Recharger les données
      await loadLocalData();
      
      console.log('🎯 Données d\'exemple chargées:', {
        devoirs: sampleAssignments.length,
        événements: sampleEvents.length
      });
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur chargement données exemple');
    } finally {
      setLoading(false);
    }
  }, [userId, loadLocalData]);

  // Initialisation - une seule fois au montage
  useEffect(() => {
    loadLocalData();
  }, [loadLocalData]);
  
  // Sync séparé - seulement si online
  useEffect(() => {
    if (isOnline && !syncing) {
      const syncTimer = setTimeout(() => {
        syncWithCloud();
      }, 1000);
      
      return () => clearTimeout(syncTimer);
    }
  }, [isOnline]);

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
    loadSampleData
  };
}