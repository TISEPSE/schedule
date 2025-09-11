'use client';

import { LocalStorage, User, Assignment, Event, SyncLog } from '@/lib/database/local';
import { v4 as uuidv4 } from 'uuid';

export interface SyncStatus {
  isOnline: boolean;
  lastSync: Date | null;
  pendingChanges: number;
  syncing: boolean;
  error?: string;
}

export class SyncService {
  private static syncStatus: SyncStatus = {
    isOnline: false,
    lastSync: null,
    pendingChanges: 0,
    syncing: false
  };

  private static listeners: Array<(status: SyncStatus) => void> = [];

  // Subscribe to sync status changes
  static subscribe(listener: (status: SyncStatus) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private static notifyListeners(): void {
    this.listeners.forEach(listener => listener({ ...this.syncStatus }));
  }

  // Check online status
  static async checkOnlineStatus(): Promise<boolean> {
    try {
      if (typeof window === 'undefined') return false;
      
      // Quick network check
      if (!navigator.onLine) return false;
      
      // Try to reach Neon (only on server-side or through API route)
      const response = await fetch('/api/health', { 
        method: 'GET',
        headers: { 'Cache-Control': 'no-cache' }
      });
      
      const isOnline = response.ok;
      this.syncStatus.isOnline = isOnline;
      this.notifyListeners();
      return isOnline;
    } catch {
      this.syncStatus.isOnline = false;
      this.notifyListeners();
      return false;
    }
  }

  // Get current sync status
  static getSyncStatus(): SyncStatus {
    return { ...this.syncStatus };
  }

  // Initialize sync service
  static async initialize(): Promise<void> {
    if (typeof window === 'undefined') return;

    // Check initial online status
    await this.checkOnlineStatus();
    
    // Update pending changes count
    await this.updatePendingChangesCount();

    // Listen for online/offline events
    window.addEventListener('online', () => {
      this.syncStatus.isOnline = true;
      this.notifyListeners();
      this.syncToCloud(); // Auto-sync when coming online
    });

    window.addEventListener('offline', () => {
      this.syncStatus.isOnline = false;
      this.notifyListeners();
    });

    // Periodic sync check (every 5 minutes)
    setInterval(() => {
      if (this.syncStatus.isOnline && !this.syncStatus.syncing) {
        this.syncToCloud();
      }
    }, 5 * 60 * 1000);
  }

  private static async updatePendingChangesCount(): Promise<void> {
    try {
      const pendingSyncs = await LocalStorage.getPendingSyncs();
      this.syncStatus.pendingChanges = pendingSyncs.length;
      this.notifyListeners();
    } catch (error) {
      console.error('Error updating pending changes count:', error);
    }
  }

  // Manual sync trigger
  static async syncToCloud(): Promise<boolean> {
    if (this.syncStatus.syncing) return false;
    if (!this.syncStatus.isOnline) return false;

    this.syncStatus.syncing = true;
    this.syncStatus.error = undefined;
    this.notifyListeners();

    try {
      const pendingSyncs = await LocalStorage.getPendingSyncs();
      
      for (const syncLog of pendingSyncs) {
        try {
          await this.processSyncLog(syncLog);
          if (syncLog.id) {
            await LocalStorage.markSynced(syncLog.id);
          }
        } catch (error) {
          console.error(`Error syncing ${syncLog.tableName}:${syncLog.recordId}`, error);
          // Continue with other syncs even if one fails
        }
      }

      // Pull latest changes from cloud
      await this.pullFromCloud();

      this.syncStatus.lastSync = new Date();
      await this.updatePendingChangesCount();
      
      return true;
    } catch (error) {
      console.error('Sync error:', error);
      this.syncStatus.error = error instanceof Error ? error.message : 'Unknown sync error';
      return false;
    } finally {
      this.syncStatus.syncing = false;
      this.notifyListeners();
    }
  }

  private static async processSyncLog(syncLog: SyncLog): Promise<void> {
    const data = syncLog.data ? JSON.parse(syncLog.data) : null;

    switch (syncLog.tableName) {
      case 'users':
        if (syncLog.action === 'update' && data) {
          await this.syncUser(data);
        }
        break;
      
      case 'assignments':
        if (syncLog.action === 'delete') {
          await this.deleteAssignmentFromCloud(syncLog.recordId);
        } else if (data) {
          await this.syncAssignment(data);
        }
        break;
      
      case 'events':
        if (syncLog.action === 'delete') {
          await this.deleteEventFromCloud(syncLog.recordId);
        } else if (data) {
          await this.syncEvent(data);
        }
        break;
    }
  }

  private static async syncUser(user: User): Promise<void> {
    const response = await fetch('/api/sync/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    });
    
    if (!response.ok) {
      throw new Error(`Failed to sync user: ${response.statusText}`);
    }
  }

  private static async syncAssignment(assignment: Assignment): Promise<void> {
    const response = await fetch('/api/sync/assignments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(assignment)
    });
    
    if (!response.ok) {
      throw new Error(`Failed to sync assignment: ${response.statusText}`);
    }
  }

  private static async deleteAssignmentFromCloud(id: string): Promise<void> {
    const response = await fetch(`/api/sync/assignments/${id}`, {
      method: 'DELETE'
    });
    
    if (!response.ok && response.status !== 404) {
      throw new Error(`Failed to delete assignment: ${response.statusText}`);
    }
  }

  private static async syncEvent(event: Event): Promise<void> {
    const response = await fetch('/api/sync/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event)
    });
    
    if (!response.ok) {
      throw new Error(`Failed to sync event: ${response.statusText}`);
    }
  }

  private static async deleteEventFromCloud(id: string): Promise<void> {
    const response = await fetch(`/api/sync/events/${id}`, {
      method: 'DELETE'
    });
    
    if (!response.ok && response.status !== 404) {
      throw new Error(`Failed to delete event: ${response.statusText}`);
    }
  }

  // Pull latest changes from cloud
  private static async pullFromCloud(): Promise<void> {
    // This would be implemented to pull changes from cloud
    // For now, we'll focus on push-based sync to minimize costs
    console.log('Pull from cloud - not implemented yet (cost optimization)');
  }

  // Utility methods for components
  static async createAssignment(userId: string, assignmentData: Partial<Assignment>): Promise<Assignment> {
    const assignment: Assignment = {
      id: uuidv4(),
      userId,
      title: assignmentData.title || '',
      description: assignmentData.description || '',
      subject: assignmentData.subject || '',
      type: assignmentData.type || 'homework',
      dueDate: assignmentData.dueDate || new Date(),
      completed: assignmentData.completed || false,
      priority: assignmentData.priority || 'medium',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await LocalStorage.saveAssignment(assignment);
    await this.updatePendingChangesCount();
    
    // Try to sync immediately if online
    if (this.syncStatus.isOnline) {
      setTimeout(() => this.syncToCloud(), 100);
    }

    return assignment;
  }

  static async updateAssignment(assignment: Assignment): Promise<void> {
    await LocalStorage.saveAssignment(assignment);
    await this.updatePendingChangesCount();
    
    // Try to sync immediately if online
    if (this.syncStatus.isOnline) {
      setTimeout(() => this.syncToCloud(), 100);
    }
  }

  static async deleteAssignment(id: string): Promise<void> {
    await LocalStorage.deleteAssignment(id);
    await this.updatePendingChangesCount();
    
    // Try to sync immediately if online
    if (this.syncStatus.isOnline) {
      setTimeout(() => this.syncToCloud(), 100);
    }
  }

  static async createEvent(userId: string, eventData: Partial<Event>): Promise<Event> {
    const event: Event = {
      id: uuidv4(),
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
    await this.updatePendingChangesCount();
    
    // Try to sync immediately if online
    if (this.syncStatus.isOnline) {
      setTimeout(() => this.syncToCloud(), 100);
    }

    return event;
  }

  static async updateEvent(event: Event): Promise<void> {
    await LocalStorage.saveEvent(event);
    await this.updatePendingChangesCount();
    
    // Try to sync immediately if online
    if (this.syncStatus.isOnline) {
      setTimeout(() => this.syncToCloud(), 100);
    }
  }

  static async deleteEvent(id: string): Promise<void> {
    await LocalStorage.deleteEvent(id);
    await this.updatePendingChangesCount();
    
    // Try to sync immediately if online
    if (this.syncStatus.isOnline) {
      setTimeout(() => this.syncToCloud(), 100);
    }
  }
}