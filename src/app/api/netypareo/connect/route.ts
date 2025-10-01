import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Nom d\'utilisateur et mot de passe requis' },
        { status: 400 }
      );
    }

    // Simulation de connexion à Nétyparéo
    // Dans un vrai environnement, ceci ferait une connexion réelle à l'API Nétyparéo
    console.log('Tentative de connexion Nétyparéo pour:', username);

    // Pour l'instant, retournons des données simulées
    const simulatedEvents = [
      {
        title: 'Cours de Mathématiques',
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // +2h
        location: 'Salle 101',
        description: 'Cours de mathématiques importé depuis Nétyparéo'
      },
      {
        title: 'Cours de Français',
        startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // +1 jour
        endTime: new Date(Date.now() + 24 * 60 * 60 * 1000 + 90 * 60 * 1000).toISOString(), // +1 jour +1.5h
        location: 'Salle 203',
        description: 'Cours de français importé depuis Nétyparéo'
      }
    ];

    return NextResponse.json({
      success: true,
      events: simulatedEvents
    });

  } catch (error) {
    console.error('Erreur connexion Nétyparéo:', error);
    return NextResponse.json(
      {
        error: 'Erreur lors de la connexion à Nétyparéo',
        success: false
      },
      { status: 500 }
    );
  }
}