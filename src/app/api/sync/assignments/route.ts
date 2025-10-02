import { NextRequest, NextResponse } from 'next/server';
export const dynamic = "force-dynamic";


import { NeonStorage } from '@/lib/database/neon';



export async function POST(request: NextRequest) {
  try {
    const assignmentData = await request.json();
    
    const result = await NeonStorage.upsertAssignment(assignmentData);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error syncing assignment:', error);
    return NextResponse.json(
      { error: 'Failed to sync assignment' },
      { status: 500 }
    );
  }
}
