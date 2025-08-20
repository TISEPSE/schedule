import { NextResponse } from 'next/server';
import { ServerDatabaseService, initializeDatabase } from '@/lib/database/server';

export async function POST() {
  try {
    console.log('🚀 Initialisation de la base de données...');
    
    // Initialiser la base de données
    await initializeDatabase();
    
    // Vérifier qu'un utilisateur test existe
    const users = await ServerDatabaseService.getAllUsers();
    
    if (users.length === 0) {
      // Créer un utilisateur test
      const testUser = await ServerDatabaseService.createUser({
        email: 'test@app.com',
        firstName: 'Utilisateur',
        lastName: 'Test',
        role: 'student'
      });
      
      console.log('👤 Utilisateur test créé:', testUser);
      
      return NextResponse.json({
        success: true,
        message: 'Base de données initialisée avec succès',
        testUser: {
          id: testUser.id,
          email: testUser.email,
          password: 'test123'
        }
      });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Base de données initialisée avec succès',
      existingUsers: users.length
    });
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    console.log('🗑️ Suppression de toutes les données...');
    
    await ServerDatabaseService.clearAllData();
    
    // Recréer un utilisateur test
    const testUser = await ServerDatabaseService.createUser({
      email: 'test@app.com',
      firstName: 'Utilisateur',
      lastName: 'Test',
      role: 'student'
    });
    
    return NextResponse.json({
      success: true,
      message: 'Toutes les données supprimées et utilisateur test recréé',
      testUser: {
        id: testUser.id,
        email: testUser.email,
        password: 'test123'
      }
    });
    
  } catch (error) {
    console.error('❌ Erreur lors de la suppression:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 });
  }
}