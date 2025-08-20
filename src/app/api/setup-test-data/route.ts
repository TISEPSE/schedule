import { NextResponse } from 'next/server';
import { ServerDatabaseService } from '@/lib/database/server';

export async function POST() {
  try {
    console.log('🎯 Configuration des données de test...');
    
    // Nettoyer toutes les données existantes
    await ServerDatabaseService.clearAllData();
    
    // Créer des utilisateurs de test
    const testUsers = [
      {
        email: 'test@example.com',
        firstName: 'Utilisateur',
        lastName: 'Test',
        role: 'student' as const
      },
      {
        email: 'admin@example.com', 
        firstName: 'Admin',
        lastName: 'Système',
        role: 'admin' as const
      },
      {
        email: 'etudiant@example.com',
        firstName: 'Marie',
        lastName: 'Dupont',
        role: 'student' as const
      }
    ];
    
    const createdUsers = [];
    
    for (const userData of testUsers) {
      const user = await ServerDatabaseService.createUser(userData);
      createdUsers.push(user);
      console.log(`👤 Utilisateur créé: ${user.email}`);
    }
    
    // Créer quelques événements de test pour le premier utilisateur
    const testUser = createdUsers[0];
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    const sampleEvents = [
      {
        userId: testUser.id,
        title: 'Cours de Mathématiques',
        description: 'Algèbre linéaire - Chapitre 3',
        type: 'course' as const,
        startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 0),
        endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 30),
        location: 'Salle A101'
      },
      {
        userId: testUser.id,
        title: 'Réunion de Projet',
        description: 'Point sur l\'avancement du projet final',
        type: 'project' as const,
        startTime: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 14, 0),
        endTime: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 15, 30),
        location: 'Salle B205'
      },
      {
        userId: testUser.id,
        title: 'Examen de Physique',
        description: 'Examen final - Mécanique quantique',
        type: 'exam' as const,
        startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3, 10, 0),
        endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3, 12, 0),
        location: 'Amphi C'
      }
    ];
    
    const createdEvents = [];
    for (const eventData of sampleEvents) {
      const event = await ServerDatabaseService.createEvent(eventData);
      createdEvents.push(event);
      console.log(`📅 Événement créé: ${event.title}`);
    }
    
    // Créer quelques devoirs de test
    const sampleAssignments = [
      {
        userId: testUser.id,
        title: 'Rapport de laboratoire',
        description: 'Analyse des résultats de l\'expérience de physique',
        subject: 'Physique',
        type: 'report' as const,
        dueDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7),
        priority: 'high' as const
      },
      {
        userId: testUser.id,
        title: 'Exercices de mathématiques',
        description: 'Chapitre 3 - Exercices 1 à 15',
        subject: 'Mathématiques',
        type: 'homework' as const,
        dueDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3),
        priority: 'medium' as const
      }
    ];
    
    const createdAssignments = [];
    for (const assignmentData of sampleAssignments) {
      const assignment = await ServerDatabaseService.createAssignment(assignmentData);
      createdAssignments.push(assignment);
      console.log(`📝 Devoir créé: ${assignment.title}`);
    }
    
    return NextResponse.json({
      success: true,
      message: 'Données de test créées avec succès',
      testCredentials: [
        {
          email: 'test@example.com',
          password: 'test123',
          role: 'student',
          description: 'Utilisateur principal de test avec données d\'exemple'
        },
        {
          email: 'admin@example.com',
          password: 'admin123',
          role: 'admin',
          description: 'Administrateur système'
        },
        {
          email: 'etudiant@example.com',
          password: 'etudiant123',
          role: 'student',
          description: 'Étudiant sans données'
        }
      ],
      created: {
        users: createdUsers.length,
        events: createdEvents.length,
        assignments: createdAssignments.length
      }
    });
    
  } catch (error) {
    console.error('❌ Erreur lors de la création des données de test:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 });
  }
}