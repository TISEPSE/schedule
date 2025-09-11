import { NextResponse } from 'next/server';
export const dynamic = "force-static";


import { ServerDatabaseService } from '@/lib/database/server';



export async function GET() {
  try {
    console.log('🔍 Diagnostic de la base de données...');
    
    // 1. Vérifier les utilisateurs
    const users = await ServerDatabaseService.getAllUsers();
    console.log(`👤 Utilisateurs trouvés: ${users.length}`);
    users.forEach(user => {
      console.log(`  - ${user.email} (ID: ${user.id})`);
    });
    
    // 2. Vérifier les événements
    if (users.length > 0) {
      const testUserId = users[0].id;
      const events = await ServerDatabaseService.getEventsByUserId(testUserId);
      console.log(`📅 Événements pour ${users[0].email}: ${events.length}`);
      
      const assignments = await ServerDatabaseService.getAssignmentsByUserId(testUserId);
      console.log(`📝 Devoirs pour ${users[0].email}: ${assignments.length}`);
    }
    
    return NextResponse.json({
      success: true,
      diagnostic: {
        users: users.map(u => ({ id: u.id, email: u.email, role: u.role })),
        totalEvents: users.length > 0 ? (await ServerDatabaseService.getEventsByUserId(users[0].id)).length : 0,
        totalAssignments: users.length > 0 ? (await ServerDatabaseService.getAssignmentsByUserId(users[0].id)).length : 0
      }
    });
    
  } catch (error) {
    console.error('❌ Erreur diagnostic:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}
