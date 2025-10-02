import { NextRequest, NextResponse } from 'next/server';
export const dynamic = "force-dynamic";


import { NeonStorage } from '@/lib/database/neon';



export async function POST(request: NextRequest) {
  try {
    const eventData = await request.json();
    
    const result = await NeonStorage.upsertEvent(eventData);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error syncing event:', error);
    return NextResponse.json(
      { error: 'Failed to sync event' },
      { status: 500 }
    );
  }
}
