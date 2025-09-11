'use client';

import { User, Assignment, Event } from '@/lib/database/local';
import { v4 as uuidv4 } from 'uuid';

// Service de données mockées pour tester sans vraie DB
export class MockDataService {
  // Simule la base Neon avec des données en mémoire
  private static mockUsers: User[] = [
    {
      id: '1',
      email: 'marie.dupont@student.com',
      firstName: 'Marie',
      lastName: 'Dupont',
      role: 'student',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15')
    },
    {
      id: '2', 
      email: 'admin@app.com',
      firstName: 'Admin',
      lastName: 'System',
      role: 'admin',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    }
  ];

  private static mockAssignments: Assignment[] = [
    {
      id: uuidv4(),
      userId: '2', // Marie a des données (utilisateur test '4' reste vide)
      title: 'Exercices de Mathématiques',
      description: 'Chapitre 5 : Fonctions linéaires, exercices 1 à 15',
      subject: 'Mathématiques',
      type: 'homework',
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Dans 2 jours
      completed: false,
      priority: 'high',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: uuidv4(),
      userId: '2',
      title: 'Rapport de stage',
      description: 'Rédaction du rapport de stage en entreprise - 15 pages minimum',
      subject: 'Stage professionnel',
      type: 'report',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Dans 1 semaine
      completed: false,
      priority: 'medium',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: uuidv4(),
      userId: '2',
      title: 'Lecture - Le Père Goriot',
      description: 'Lire les chapitres 1 à 3 et préparer une fiche de lecture',
      subject: 'Français',
      type: 'reading',
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // Dans 5 jours
      completed: true,
      priority: 'low',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      updatedAt: new Date()
    }
  ];

  private static mockEvents: Event[] = [
    {
      id: uuidv4(),
      userId: '2',
      title: 'Cours de Mathématiques',
      description: 'Fonctions et dérivées - Salle A205',
      type: 'course',
      startTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // Demain 9h
      endTime: new Date(Date.now() + 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), // Demain 11h
      location: 'Salle A205',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: uuidv4(),
      userId: '2',
      title: 'TP Informatique',
      description: 'Travaux pratiques : Base de données SQL',
      type: 'practical',
      startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Après-demain 14h
      endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000), // Après-demain 17h
      location: 'Lab Informatique B',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: uuidv4(),
      userId: '2',
      title: 'Contrôle de Français',
      description: 'Évaluation sur Le Père Goriot',
      type: 'exam',
      startTime: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000), // Dans 6 jours 10h
      endTime: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), // Dans 6 jours 12h
      location: 'Salle C101',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  // Simule l'API Neon - Users
  static async getUser(id: string): Promise<User | null> {
    await this.simulateNetworkDelay();
    return this.mockUsers.find(u => u.id === id) || null;
  }

  static async getUserByEmail(email: string): Promise<User | null> {
    await this.simulateNetworkDelay();
    return this.mockUsers.find(u => u.email === email) || null;
  }

  // Simule l'API Neon - Assignments
  static async getAssignments(userId: string): Promise<Assignment[]> {
    await this.simulateNetworkDelay();
    return this.mockAssignments.filter(a => a.userId === userId);
  }

  static async saveAssignment(assignment: Assignment): Promise<Assignment> {
    await this.simulateNetworkDelay();
    
    const existingIndex = this.mockAssignments.findIndex(a => a.id === assignment.id);
    if (existingIndex >= 0) {
      this.mockAssignments[existingIndex] = { ...assignment, updatedAt: new Date() };
    } else {
      this.mockAssignments.push({ ...assignment, createdAt: new Date(), updatedAt: new Date() });
    }
    
    return assignment;
  }

  static async deleteAssignment(id: string): Promise<void> {
    await this.simulateNetworkDelay();
    this.mockAssignments = this.mockAssignments.filter(a => a.id !== id);
  }

  // Simule l'API Neon - Events
  static async getEvents(userId: string): Promise<Event[]> {
    await this.simulateNetworkDelay();
    return this.mockEvents.filter(e => e.userId === userId);
  }

  static async saveEvent(event: Event): Promise<Event> {
    await this.simulateNetworkDelay();
    
    const existingIndex = this.mockEvents.findIndex(e => e.id === event.id);
    if (existingIndex >= 0) {
      this.mockEvents[existingIndex] = { ...event, updatedAt: new Date() };
    } else {
      this.mockEvents.push({ ...event, createdAt: new Date(), updatedAt: new Date() });
    }
    
    return event;
  }

  static async deleteEvent(id: string): Promise<void> {
    await this.simulateNetworkDelay();
    this.mockEvents = this.mockEvents.filter(e => e.id !== id);
  }

  // Health check simulation
  static async healthCheck(): Promise<boolean> {
    await this.simulateNetworkDelay();
    return true; // Simule une connexion réussie
  }

  // Simule la latence réseau
  private static async simulateNetworkDelay(): Promise<void> {
    const delay = Math.random() * 500 + 100; // Entre 100ms et 600ms
    await new Promise(resolve => setTimeout(resolve, delay));
  }

  // Utilitaires pour les tests
  static resetData(): void {
    // Remet les données par défaut - utile pour les tests
    console.log('🔄 Données mockées réinitialisées');
  }

  static addSampleData(userId: string): void {
    // Ajoute plus de données de test pour un utilisateur
    const sampleAssignments: Assignment[] = [
      {
        id: uuidv4(),
        userId,
        title: 'Présentation Anglais',
        description: 'Exposé de 10 minutes sur un pays anglophone',
        subject: 'Anglais',
        type: 'presentation',
        dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        completed: false,
        priority: 'medium',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        userId,
        title: 'Recherches Histoire',
        description: 'Première Guerre mondiale - causes et conséquences',
        subject: 'Histoire',
        type: 'research',
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        completed: false,
        priority: 'low',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    const sampleEvents: Event[] = [
      {
        id: uuidv4(),
        userId,
        title: 'Sport - Basketball',
        description: 'Entraînement équipe basket',
        type: 'sport',
        startTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
        location: 'Gymnase',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        userId,
        title: 'Session révisions',
        description: 'Révisions en groupe pour les partiels',
        type: 'study',
        startTime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
        endTime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000),
        location: 'Bibliothèque',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    this.mockAssignments.push(...sampleAssignments);
    this.mockEvents.push(...sampleEvents);
  }

  // Stats pour le dashboard
  static async getUserStats(userId: string): Promise<{
    totalAssignments: number;
    completedAssignments: number;
    upcomingEvents: number;
    todayActivities: number;
  }> {
    await this.simulateNetworkDelay();
    
    const assignments = this.mockAssignments.filter(a => a.userId === userId);
    const events = this.mockEvents.filter(e => e.userId === userId);
    
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);
    
    return {
      totalAssignments: assignments.length,
      completedAssignments: assignments.filter(a => a.completed).length,
      upcomingEvents: events.filter(e => e.startTime > today).length,
      todayActivities: events.filter(e => 
        e.startTime >= todayStart && e.startTime < todayEnd
      ).length
    };
  }
}