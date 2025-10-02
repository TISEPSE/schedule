import { NextRequest, NextResponse } from 'next/server';
export const dynamic = "force-dynamic";

import { TempDataService } from '@/lib/tempDatabase';



export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json({
        success: false,
        error: 'Email et mot de passe requis'
      }, { status: 400 });
    }

    // Utiliser le service temporaire pour l'authentification
    try {
      const foundUser = await TempDataService.login(email, password);
      
      return NextResponse.json({
        success: true,
        user: foundUser
      });
    } catch (loginError) {
      return NextResponse.json({
        success: false,
        error: loginError instanceof Error ? loginError.message : 'Email ou mot de passe incorrect'
      }, { status: 401 });
    }
    
  } catch (error) {
    console.error('Erreur login:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Erreur serveur'
    }, { status: 500 });
  }
}
