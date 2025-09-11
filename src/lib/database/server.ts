// Ce fichier ne s'exécute QUE côté serveur
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema';
import path from 'path';
import { eq } from 'drizzle-orm';
import { mkdirSync } from 'fs';

// Fonction simple pour générer des IDs
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Chemin vers la base de données SQLite
const DB_PATH = path.join(process.cwd(), 'data', 'schedule.db');

// Créer le répertoire data s'il n'existe pas
const dataDir = path.join(process.cwd(), 'data');
try {
  mkdirSync(dataDir, { recursive: true });
} catch {
  // Le répertoire existe déjà, c'est ok
}

// Créer la connexion SQLite
const sqlite = new Database(DB_PATH);

// Activer les clés étrangères
sqlite.pragma('foreign_keys = ON');

// Créer l'instance Drizzle
export const db = drizzle(sqlite, { schema });

// Fonction d'initialisation de la base
export async function initializeDatabase() {
  console.log('🔧 Initialisation de la base de données SQLite...');
  
  try {
    // Créer les tables si elles n'existent pas
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'student',
        avatar TEXT,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS events (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL DEFAULT '',
        type TEXT NOT NULL DEFAULT 'course',
        start_time INTEGER NOT NULL,
        end_time INTEGER NOT NULL,
        location TEXT,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS assignments (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL DEFAULT '',
        subject TEXT NOT NULL,
        type TEXT NOT NULL DEFAULT 'homework',
        due_date INTEGER NOT NULL,
        completed INTEGER NOT NULL DEFAULT 0,
        priority TEXT NOT NULL DEFAULT 'medium',
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    console.log('✅ Base de données SQLite initialisée avec succès');
    
    // Créer un utilisateur de test s'il n'existe pas
    await seedTestUser();
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation de la base:', error);
    throw error;
  }
}

// Fonction pour créer un utilisateur de test
async function seedTestUser() {
  try {
    // Vérifier si un utilisateur existe déjà
    const existingUser = await db.query.users.findFirst();
    
    if (!existingUser) {
      console.log('👤 Création de l\'utilisateur de test...');
      
      const testUserId = generateId();
      
      await db.insert(schema.users).values({
        id: testUserId,
        email: 'test@app.com',
        firstName: 'Utilisateur',
        lastName: 'Test',
        role: 'student',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      
      console.log('✅ Utilisateur de test créé:', {
        id: testUserId,
        email: 'test@app.com',
        password: 'test123'
      });
    } else {
      console.log('👤 Utilisateur existant trouvé:', existingUser.email);
    }
  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'utilisateur test:', error);
  }
}

// Service de base de données côté serveur uniquement
export class ServerDatabaseService {
  
  // ============ USERS ============
  
  static async getUserById(id: string) {
    try {
      const user = await db.query.users.findFirst({
        where: eq(schema.users.id, id)
      });
      return user;
    } catch (error) {
      console.error('Erreur getUserById:', error);
      return null;
    }
  }

  static async getUserByEmail(email: string) {
    try {
      const user = await db.query.users.findFirst({
        where: eq(schema.users.email, email)
      });
      return user;
    } catch (error) {
      console.error('Erreur getUserByEmail:', error);
      return null;
    }
  }

  static async createUser(userData: {
    email: string;
    firstName: string;
    lastName: string;
    role?: 'student' | 'admin';
  }) {
    try {
      const newUser = await db.insert(schema.users).values({
        id: generateId(),
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role || 'student',
        createdAt: new Date(),
        updatedAt: new Date(),
      }).returning();
      
      return newUser[0];
    } catch (error) {
      console.error('Erreur createUser:', error);
      throw error;
    }
  }

  // ============ EVENTS ============
  
  static async getEventsByUserId(userId: string) {
    try {
      const events = await db.query.events.findMany({
        where: eq(schema.events.userId, userId),
        orderBy: (events, { asc }) => [asc(events.startTime)]
      });
      return events;
    } catch (error) {
      console.error('Erreur getEventsByUserId:', error);
      return [];
    }
  }

  static async createEvent(eventData: {
    userId: string;
    title: string;
    description?: string;
    type: 'course' | 'practical' | 'exam' | 'project' | 'sport' | 'study';
    startTime: Date;
    endTime: Date;
    location?: string;
  }) {
    try {
      const newEvent = await db.insert(schema.events).values({
        id: generateId(),
        userId: eventData.userId,
        title: eventData.title,
        description: eventData.description || '',
        type: eventData.type,
        startTime: eventData.startTime,
        endTime: eventData.endTime,
        location: eventData.location,
        createdAt: new Date(),
        updatedAt: new Date(),
      }).returning();
      
      return newEvent[0];
    } catch (error) {
      console.error('Erreur createEvent:', error);
      throw error;
    }
  }

  static async updateEvent(id: string, updates: Partial<{
    title: string;
    description: string;
    type: 'course' | 'practical' | 'exam' | 'project' | 'sport' | 'study';
    startTime: Date;
    endTime: Date;
    location: string;
  }>) {
    try {
      const updatedEvent = await db.update(schema.events)
        .set({
          ...updates,
          updatedAt: new Date(),
        })
        .where(eq(schema.events.id, id))
        .returning();
      
      return updatedEvent[0];
    } catch (error) {
      console.error('Erreur updateEvent:', error);
      throw error;
    }
  }

  static async deleteEvent(id: string) {
    try {
      await db.delete(schema.events)
        .where(eq(schema.events.id, id));
      
      return true;
    } catch (error) {
      console.error('Erreur deleteEvent:', error);
      return false;
    }
  }

  // ============ ASSIGNMENTS ============
  
  static async getAssignmentsByUserId(userId: string) {
    try {
      const assignments = await db.query.assignments.findMany({
        where: eq(schema.assignments.userId, userId),
        orderBy: (assignments, { asc }) => [asc(assignments.dueDate)]
      });
      return assignments;
    } catch (error) {
      console.error('Erreur getAssignmentsByUserId:', error);
      return [];
    }
  }

  static async createAssignment(assignmentData: {
    userId: string;
    title: string;
    description?: string;
    subject: string;
    type?: 'homework' | 'report' | 'essay' | 'study' | 'presentation' | 'research' | 'reading';
    dueDate: Date;
    priority?: 'low' | 'medium' | 'high';
  }) {
    try {
      const newAssignment = await db.insert(schema.assignments).values({
        id: generateId(),
        userId: assignmentData.userId,
        title: assignmentData.title,
        description: assignmentData.description || '',
        subject: assignmentData.subject,
        type: assignmentData.type || 'homework',
        dueDate: assignmentData.dueDate,
        completed: false,
        priority: assignmentData.priority || 'medium',
        createdAt: new Date(),
        updatedAt: new Date(),
      }).returning();
      
      return newAssignment[0];
    } catch (error) {
      console.error('Erreur createAssignment:', error);
      throw error;
    }
  }

  static async updateAssignment(id: string, updates: Partial<{
    title: string;
    description: string;
    subject: string;
    type: 'homework' | 'report' | 'essay' | 'study' | 'presentation' | 'research' | 'reading';
    dueDate: Date;
    completed: boolean;
    priority: 'low' | 'medium' | 'high';
  }>) {
    try {
      const updatedAssignment = await db.update(schema.assignments)
        .set({
          ...updates,
          updatedAt: new Date(),
        })
        .where(eq(schema.assignments.id, id))
        .returning();
      
      return updatedAssignment[0];
    } catch (error) {
      console.error('Erreur updateAssignment:', error);
      throw error;
    }
  }

  static async deleteAssignment(id: string) {
    try {
      await db.delete(schema.assignments)
        .where(eq(schema.assignments.id, id));
      
      return true;
    } catch (error) {
      console.error('Erreur deleteAssignment:', error);
      return false;
    }
  }

  // ============ UTILITY ============
  
  static async clearAllData() {
    try {
      await db.delete(schema.assignments);
      await db.delete(schema.events);  
      await db.delete(schema.users);
      console.log('✅ Toutes les données supprimées');
    } catch (error) {
      console.error('❌ Erreur lors de la suppression:', error);
      throw error;
    }
  }

  static async getAllUsers() {
    try {
      const users = await db.query.users.findMany();
      return users;
    } catch (error) {
      console.error('Erreur getAllUsers:', error);
      return [];
    }
  }
}

export { schema };