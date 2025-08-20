import { NextResponse } from 'next/server';
import { ServerDatabaseService } from '@/lib/database/server';

export async function POST() {
  try {
    console.log('🎯 Configuration des données de test...');
    
    // Nettoyer toutes les données existantes
    await ServerDatabaseService.clearAllData();
    
    // Créer un seul utilisateur de test
    const testUsers = [
      {
        email: 'test@app.com',
        firstName: 'Utilisateur',
        lastName: 'Test',
        role: 'student' as const
      }
    ];
    
    const createdUsers = [];
    
    for (const userData of testUsers) {
      const user = await ServerDatabaseService.createUser(userData);
      createdUsers.push(user);
      console.log(`👤 Utilisateur créé: ${user.email}`);
    }
    
    // Créer quelques événements de test pour le premier utilisateur (seulement en semaine)
    const testUser = createdUsers[0];
    const today = new Date();
    
    // Fonction pour obtenir le prochain jour de semaine
    const getNextWeekday = (date: Date, daysToAdd: number) => {
      const newDate = new Date(date);
      newDate.setDate(date.getDate() + daysToAdd);
      
      // Si c'est le week-end, décaler au lundi
      if (newDate.getDay() === 0) { // Dimanche
        newDate.setDate(newDate.getDate() + 1);
      } else if (newDate.getDay() === 6) { // Samedi
        newDate.setDate(newDate.getDate() + 2);
      }
      
      return newDate;
    };
    
    const day1 = getNextWeekday(today, 0); // Aujourd'hui si jour de semaine
    const day2 = getNextWeekday(today, 1); // Demain si jour de semaine
    const day3 = getNextWeekday(today, 2); // Après-demain si jour de semaine
    
    const sampleEvents = [
      {
        userId: testUser.id,
        title: 'Mathématiques',
        description: 'Algèbre linéaire - Chapitre 3',
        type: 'course' as const,
        startTime: new Date(day1.getFullYear(), day1.getMonth(), day1.getDate(), 9, 0),
        endTime: new Date(day1.getFullYear(), day1.getMonth(), day1.getDate(), 10, 30),
        location: 'Salle A101'
      },
      {
        userId: testUser.id,
        title: 'Physique-Chimie',
        description: 'Travaux pratiques optique',
        type: 'practical' as const,
        startTime: new Date(day2.getFullYear(), day2.getMonth(), day2.getDate(), 14, 0),
        endTime: new Date(day2.getFullYear(), day2.getMonth(), day2.getDate(), 16, 0),
        location: 'Labo B205'
      },
      {
        userId: testUser.id,
        title: 'Contrôle Histoire',
        description: 'Évaluation - Seconde Guerre mondiale',
        type: 'exam' as const,
        startTime: new Date(day3.getFullYear(), day3.getMonth(), day3.getDate(), 10, 0),
        endTime: new Date(day3.getFullYear(), day3.getMonth(), day3.getDate(), 12, 0),
        location: 'Amphi C'
      }
    ];
    
    const createdEvents = [];
    for (const eventData of sampleEvents) {
      const event = await ServerDatabaseService.createEvent(eventData);
      createdEvents.push(event);
      console.log(`📅 Événement créé: ${event.title}`);
    }
    
    // Créer quelques devoirs de test (seulement pour des jours de semaine)
    const assignmentDay1 = getNextWeekday(today, 5); // Dans 5 jours (semaine)
    const assignmentDay2 = getNextWeekday(today, 3); // Dans 3 jours (semaine)
    
    const sampleAssignments = [
      {
        userId: testUser.id,
        title: 'Rapport de laboratoire',
        description: 'Analyse des résultats de l\'expérience de physique',
        subject: 'Physique',
        type: 'report' as const,
        dueDate: assignmentDay1,
        priority: 'high' as const
      },
      {
        userId: testUser.id,
        title: 'Exercices de mathématiques',
        description: 'Chapitre 3 - Exercices 1 à 15',
        subject: 'Mathématiques',
        type: 'homework' as const,
        dueDate: assignmentDay2,
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
          email: 'test@app.com',
          password: 'test123 ou vide',
          role: 'student',
          description: 'Utilisateur de test avec données d\'exemple'
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