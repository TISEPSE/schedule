import { NextRequest, NextResponse } from 'next/server';
export const dynamic = "force-dynamic";

import { ServerDatabaseService } from '@/lib/database/server';

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

    if (success) {
      return NextResponse.json({
        success: true,
        message: 'Événement supprimé avec succès'
      });
    } else {
      return NextResponse.json({
        success: false,
        error: 'Événement non trouvé'
      }, { status: 404 });
    }

  } catch (error) {
    console.error('Erreur DELETE event:', error);

    return NextResponse.json({
      success: false,
      error: 'Erreur serveur'
    }, { status: 500 });
  }
}

// PUT /api/events/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const eventData = await request.json();

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
      startTime: new Date(eventData.startTime),
      endTime: new Date(eventData.endTime),
      location: eventData.location,
    });

    return NextResponse.json({
      success: true,
      event: updatedEvent
    });

  } catch (error) {
    console.error('Erreur PUT event:', error);

    return NextResponse.json({
      success: false,
      error: 'Erreur serveur'
    }, { status: 500 });
  }
}
