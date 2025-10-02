import { NextRequest, NextResponse } from 'next/server';
export const dynamic = "force-dynamic";



interface NetypareoEvent {
  title: string;
  startTime: string;
  endTime: string;
  location?: string;
  description?: string;
}

async function connectAndScrapeNetypareo(username: string, password: string) {
  try {
    // Utiliser la route de connexion Nétyparéo existante
    const connectResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/netypareo/connect`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    if (!connectResponse.ok) {
      throw new Error('Échec de la connexion à Nétyparéo');
    }

    const connectData = await connectResponse.json();
    
    if (!connectData.success) {
      throw new Error(connectData.error || 'Erreur de connexion à Nétyparéo');
    }

    return connectData.events || [];
  } catch (error) {
    console.error('Erreur scraping Nétyparéo:', error);
    throw error;
  }
}

function convertNetypareoToEvents(netypareoData: NetypareoEvent[], userId: string) {
  return netypareoData.map((item: NetypareoEvent, index: number) => ({
    id: `netypareo-${Date.now()}-${index}`,
    title: item.title || 'Cours',
    type: 'course',
    startTime: item.startTime,
    endTime: item.endTime,
    location: item.location || '',
    description: `Cours importé depuis Nétyparéo - ${item.description || item.title}`,
    userId: userId
  }));
}

export async function POST(request: NextRequest) {
  try {
    const { username, password, userId } = await request.json();

    if (!username || !password || !userId) {
      return NextResponse.json(
        { error: 'Paramètres manquants (nom d\'utilisateur, mot de passe et userId requis)' },
        { status: 400 }
      );
    }

    // Connexion et récupération des données Nétyparéo
    const netypareoData = await connectAndScrapeNetypareo(username, password);

    // Conversion en format d'événements
    const events = convertNetypareoToEvents(netypareoData, userId);

    // Sauvegarde des événements
    const savedEvents = [];
    for (const event of events) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/events`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(event)
        });
        
        if (response.ok) {
          const savedEvent = await response.json();
          savedEvents.push(savedEvent);
        }
      } catch (error) {
        console.error('Erreur sauvegarde événement:', error);
      }
    }

    return NextResponse.json({
      success: true,
      message: `${savedEvents.length} événements importés depuis Nétyparéo`,
      events: savedEvents
    });

  } catch (error) {
    console.error('Erreur import Nétyparéo:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Erreur lors de l\'import depuis Nétyparéo'
      },
      { status: 500 }
    );
  }
}
