import { NextRequest, NextResponse } from 'next/server';
import { MockDataService } from '@/lib/services/mockDataService';

export const dynamic = "force-static";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const events = await MockDataService.getEvents(userId);
    
    return NextResponse.json({
      success: true,
      data: events,
      count: events.length,
      message: 'Events retrieved from mock Neon DB'
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const eventData = await request.json();
    
    const result = await MockDataService.saveEvent(eventData);
    
    return NextResponse.json({
      success: true,
      data: result,
      message: 'Event saved to mock Neon DB'
    });
  } catch (error) {
    console.error('Error saving event:', error);
    return NextResponse.json(
      { error: 'Failed to save event' },
      { status: 500 }
    );
  }
}
