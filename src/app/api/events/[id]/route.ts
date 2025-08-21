import { NextRequest, NextResponse } from 'next/server';
import { ServerDatabaseService } from '@/lib/database/server';

// PUT /api/events/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const eventData = await request.json();
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'ID requis'
      }, { status: 400 });
    }

    const updatedEvent = await ServerDatabaseService.updateEvent(id, {
      title: eventData.title,
      description: eventData.description,
      type: eventData.type,
      startTime: eventData.startTime ? new Date(eventData.startTime) : undefined,
      endTime: eventData.endTime ? new Date(eventData.endTime) : undefined,
      location: eventData.location,
    });
    
    return NextResponse.json({
      success: true,
      event: updatedEvent
    });
    
  } catch (error) {
    console.error('Erreur PUT events:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Erreur serveur'
    }, { status: 500 });
  }
}

// DELETE /api/events/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'ID requis'
      }, { status: 400 });
    }

    const success = await ServerDatabaseService.deleteEvent(id);
    
    return NextResponse.json({
      success,
      message: success ? 'Événement supprimé' : 'Échec suppression'
    });
    
  } catch (error) {
    console.error('Erreur DELETE events:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Erreur serveur'
    }, { status: 500 });
  }
}