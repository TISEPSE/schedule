import Dexie, { Table } from 'dexie';

// Types de données
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'student' | 'admin' | 'personal';
  avatar?: string;
  createdAt?: Date;
  updatedAt?: Date;
  syncedAt?: Date;
}

export interface Assignment {
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
  syncedAt?: Date;
}

export interface Event {
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
  syncedAt?: Date;
}

export interface SyncLog {
  id?: number;
  tableName: string;
  recordId: string;
  action: 'create' | 'update' | 'delete';
  timestamp: Date;
  synced: boolean;
  data?: string; // JSON stringified data
}

// Base de données locale
class ScheduleDatabase extends Dexie {
  users!: Table<User>;
  assignments!: Table<Assignment>;
  events!: Table<Event>;
  syncLogs!: Table<SyncLog>;

  constructor() {
    super('ScheduleDB');
    
    this.version(1).stores({
      users: 'id, email, role, syncedAt',
      assignments: 'id, userId, dueDate, completed, type, priority, syncedAt',
      events: 'id, userId, startTime, endTime, type, syncedAt',
      syncLogs: '++id, tableName, recordId, timestamp, synced'
    });
  }
}

export const db = new ScheduleDatabase();

// Utilitaires pour la base locale
export class LocalStorage {
  // Users
  static async getUser(id: string): Promise<User | undefined> {
    return await db.users.get(id);
  }

  static async getUserByEmail(email: string): Promise<User | undefined> {
    return await db.users.where('email').equals(email).first();
  }

  static async saveUser(user: User): Promise<void> {
    user.updatedAt = new Date();
    await db.users.put(user);
    await this.logSync('users', user.id, 'update', user);
  }

  // Assignments
  static async getAssignments(userId: string): Promise<Assignment[]> {
    return await db.assignments.where('userId').equals(userId).toArray();
  }

  static async saveAssignment(assignment: Assignment): Promise<void> {
    assignment.updatedAt = new Date();
    const exists = await db.assignments.get(assignment.id);
    await db.assignments.put(assignment);
    await this.logSync('assignments', assignment.id, exists ? 'update' : 'create', assignment);
  }

  static async deleteAssignment(id: string): Promise<void> {
    const assignment = await db.assignments.get(id);
    if (assignment) {
      await db.assignments.delete(id);
      await this.logSync('assignments', id, 'delete', assignment);
    }
  }

  // Events
  static async getEvents(userId: string): Promise<Event[]> {
    return await db.events.where('userId').equals(userId).toArray();
  }

  static async saveEvent(event: Event): Promise<void> {
    event.updatedAt = new Date();
    const exists = await db.events.get(event.id);
    await db.events.put(event);
    await this.logSync('events', event.id, exists ? 'update' : 'create', event);
  }

  static async deleteEvent(id: string): Promise<void> {
    const event = await db.events.get(id);
    if (event) {
      await db.events.delete(id);
      await this.logSync('events', id, 'delete', event);
    }
  }

  // Sync logging
  static async logSync(tableName: string, recordId: string, action: 'create' | 'update' | 'delete', data?: object): Promise<void> {
    await db.syncLogs.add({
      tableName,
      recordId,
      action,
      timestamp: new Date(),
      synced: false,
      data: data ? JSON.stringify(data) : undefined
    });
  }

  // Get pending syncs
  static async getPendingSyncs(): Promise<SyncLog[]> {
    return await db.syncLogs.filter(log => !log.synced).toArray();
  }

  static async markSynced(syncLogId: number): Promise<void> {
    await db.syncLogs.update(syncLogId, { synced: true });
  }

  // Clear all data (for testing)
  static async clearAll(): Promise<void> {
    await db.users.clear();
    await db.assignments.clear();
    await db.events.clear();
    await db.syncLogs.clear();
  }
}