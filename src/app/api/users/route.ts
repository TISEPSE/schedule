import { NextResponse } from 'next/server';
export const dynamic = "force-dynamic";


import { ServerDatabaseService } from '@/lib/database/server';



// GET /api/users
export async function GET() {
  try {
    const users = await ServerDatabaseService.getAllUsers();
    
    return NextResponse.json({
      success: true,
      users
    });
    
  } catch (error) {
    console.error('Erreur GET users:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Erreur serveur'
    }, { status: 500 });
  }
}
