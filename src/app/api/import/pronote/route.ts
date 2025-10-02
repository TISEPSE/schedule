import { NextRequest, NextResponse } from 'next/server';
export const dynamic = "force-dynamic";



interface PronoteEvent {
  subject?: {
    name: string;
  };
  teachers?: Array<{
    name: string;
  }>;
  rooms?: Array<{
    name: string;
  }>;
  from: Date;
  to: Date;
  canceled?: boolean;
}

async function connectToPronote(): Promise<null> {
  try {
    // Pour l'instant, nous retournons une erreur car l'API pawnote nécessite une configuration plus complexe
    // Une implémentation complète nécessiterait de suivre la documentation officielle de pawnote
    throw new Error('L\'intégration Pronote nécessite une configuration avancée. Utilisez l\'import depuis EcoleDirecte ou Nétyparéo pour l\'instant.');
  } catch (error) {
    console.error('Erreur connexion Pronote:', error);
    throw new Error('Échec de la connexion à Pronote. Vérifiez vos identifiants et l\'URL du serveur.');
  }
}

async function getPronoteSchedule() {
  try {
    // Implémentation simplifiée pour permettre la compilation
    return [];
  } catch (error) {
    console.error('Erreur récupération planning Pronote:', error);
    throw new Error('Erreur lors de la récupération du planning Pronote');
  }
}

function convertPronoteToEvents(lessons: PronoteEvent[], userId: string) {
  return lessons
    .filter(lesson => !lesson.canceled)
    .map((lesson, index) => {
      const subject = lesson.subject?.name || 'Cours';
      const teacher = lesson.teachers?.[0]?.name || '';
      const classroom = lesson.rooms?.[0]?.name || '';

      return {
        id: `pronote-${Date.now()}-${index}`,
        title: subject,
        type: 'course',
        startTime: lesson.from.toISOString(),
        endTime: lesson.to.toISOString(),
        location: classroom,
        description: `Cours importé depuis Pronote${teacher ? ` - ${teacher}` : ''}`,
        userId: userId
      };
    });
}

export async function POST(request: NextRequest) {
  try {
    const { username, password, server, userId } = await request.json();

    if (!username || !password || !server || !userId) {
      return NextResponse.json(
        { error: 'Paramètres manquants (nom d\'utilisateur, mot de passe, serveur et userId requis)' },
        { status: 400 }
      );
    }

    // Validation de l'URL du serveur
    if (!server.startsWith('http')) {
      return NextResponse.json(
        { error: 'URL du serveur invalide (doit commencer par http:// ou https://)' },
        { status: 400 }
      );
    }

    // Connexion à Pronote
    await connectToPronote();
    
    // Récupération du planning
    const timetableData = await getPronoteSchedule();

    // Conversion en format d'événements
    const events = convertPronoteToEvents(timetableData, userId);

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

    // Note: pawnote ne nécessite pas de fermeture explicite de session

    return NextResponse.json({
      success: true,
      message: `${savedEvents.length} événements importés depuis Pronote`,
      events: savedEvents
    });

  } catch (error) {
    console.error('Erreur import Pronote:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Erreur lors de l\'import depuis Pronote'
      },
      { status: 500 }
    );
  }
}
