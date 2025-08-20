import { NextRequest, NextResponse } from 'next/server';
import { ServerDatabaseService } from '@/lib/database/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json({
        success: false,
        error: 'Email et mot de passe requis'
      }, { status: 400 });
    }

    // Chercher l'utilisateur dans la base de données
    const foundUser = await ServerDatabaseService.getUserByEmail(email);
    
    if (!foundUser) {
      return NextResponse.json({
        success: false,
        error: 'Email ou mot de passe incorrect'
      }, { status: 401 });
    }

    // Validation simple des mots de passe (à remplacer par bcrypt en production)
    const validPasswords: Record<string, string> = {
      'test@example.com': 'test123',
      'admin@example.com': 'admin123',
      'etudiant@example.com': 'etudiant123',
    };

    if (validPasswords[email] !== password) {
      return NextResponse.json({
        success: false,
        error: 'Email ou mot de passe incorrect'
      }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      user: foundUser
    });
    
  } catch (error) {
    console.error('Erreur login:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Erreur serveur'
    }, { status: 500 });
  }
}