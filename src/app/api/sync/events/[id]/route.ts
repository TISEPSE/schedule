import { NextRequest, NextResponse } from 'next/server';
import { NeonStorage } from '@/lib/database/neon';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    await NeonStorage.deleteEvent(id);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json(
      { error: 'Failed to delete event' },
      { status: 500 }
    );
  }
}