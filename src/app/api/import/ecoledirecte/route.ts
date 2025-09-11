import { NextRequest, NextResponse } from 'next/server';
export const dynamic = "force-static";



interface EcoleDirecteEvent {
  id: number;
  text: string;
  start_date: string;
  end_date: string;
  matiere: string;
  salle?: string;
  prof?: string;
}

interface EcoleDirecteResponse {
  code: number;
  token: string;
  data: {
    accounts: Array<{
      type: string;
      id: number;
    }>;
  };
}

async function authenticateEcoleDirecte(username: string, password: string) {
  try {
    const response = await fetch('https://api.ecoledirecte.com/v3/login.awp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        identifiant: username,
        motdepasse: password,
        uuid: '',
        fa: ''
      })
    });

    const data: EcoleDirecteResponse = await response.json();
    
    if (data.code !== 200) {
      throw new Error('Identifiants incorrects');
    }

    return {
      token: data.token,
      accountId: data.data.accounts[0]?.id,
      accountType: data.data.accounts[0]?.type
    };
  } catch (error) {
    console.error('Erreur authentification EcoleDirecte:', error);
    throw error;
  }
}

async function getEcoleDirecteSchedule(token: string, accountId: number, accountType: string) {
  try {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 14); // 2 semaines

    const response = await fetch(`https://api.ecoledirecte.com/v3/${accountType}/${accountId}/emploidutemps.awp?verbe=get&v=4.7.0`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Token': token
      },
      body: new URLSearchParams({
        dateDebut: today.toISOString().split('T')[0],
        dateFin: nextWeek.toISOString().split('T')[0]
      })
    });

    const data = await response.json();
    
    if (data.code !== 200) {
      throw new Error('Erreur lors de la récupération du planning');
    }

    return data.data;
  } catch (error) {
    console.error('Erreur récupération planning EcoleDirecte:', error);
    throw error;
  }
}

function convertEcoleDirecteToEvents(scheduleData: EcoleDirecteEvent[], userId: string) {
  return scheduleData.map((item: EcoleDirecteEvent) => ({
    id: `ed-${item.id}-${Date.now()}`,
    title: item.text || item.matiere,
    type: 'course',
    startTime: item.start_date,
    endTime: item.end_date,
    location: item.salle || '',
    description: `Cours importé depuis EcoleDirecte${item.prof ? ` - ${item.prof}` : ''}`,
    userId: userId
  }));
}

export async function POST(request: NextRequest) {
  try {
    const { username, password, userId } = await request.json();

    if (!username || !password || !userId) {
      return NextResponse.json(
        { error: 'Paramètres manquants' },
        { status: 400 }
      );
    }

    // Authentification
    const auth = await authenticateEcoleDirecte(username, password);
    
    // Récupération du planning
    const scheduleData = await getEcoleDirecteSchedule(
      auth.token,
      auth.accountId,
      auth.accountType
    );

    // Conversion en format d'événements
    const events = convertEcoleDirecteToEvents(scheduleData, userId);

    // Sauvegarde des événements
    const savedEvents = [];
    for (const event of events) {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event)
      });
      
      if (response.ok) {
        const savedEvent = await response.json();
        savedEvents.push(savedEvent);
      }
    }

    return NextResponse.json({
      success: true,
      message: `${savedEvents.length} événements importés depuis EcoleDirecte`,
      events: savedEvents
    });

  } catch (error) {
    console.error('Erreur import EcoleDirecte:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Erreur lors de l\'import depuis EcoleDirecte'
      },
      { status: 500 }
    );
  }
}
