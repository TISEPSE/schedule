import { NextRequest, NextResponse } from 'next/server';
export const dynamic = "force-dynamic";


import { ServerDatabaseService } from '@/lib/database/server';



// GET /api/events?userId=xxx
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'userId requis'
      }, { status: 400 });
    }

    const events = await ServerDatabaseService.getEventsByUserId(userId);
    
    return NextResponse.json({
      success: true,
      events
    });
    
  } catch (error) {
    console.error('Erreur GET events:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Erreur serveur'
    }, { status: 500 });
  }
}

// POST /api/events
export async function POST(request: NextRequest) {
  try {
    const eventData = await request.json();
    
    if (!eventData.userId || !eventData.title) {
      return NextResponse.json({
        success: false,
        error: 'userId et title requis'
      }, { status: 400 });
    }

    const newEvent = await ServerDatabaseService.createEvent({
      userId: eventData.userId,
      title: eventData.title,
      description: eventData.description || '',
      type: eventData.type || 'course',
      startTime: new Date(eventData.startTime),
      endTime: new Date(eventData.endTime),
      location: eventData.location,
    });
    
    return NextResponse.json({
      success: true,
      event: newEvent
    });
    
  } catch (error) {
    console.error('Erreur POST events:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Erreur serveur'
    }, { status: 500 });
  }
}
