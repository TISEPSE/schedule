import { NextRequest, NextResponse } from 'next/server';
export const dynamic = "force-dynamic";


import { NeonStorage } from '@/lib/database/neon';



export async function POST(request: NextRequest) {
  try {
    const userData = await request.json();
    
    const result = await NeonStorage.upsertUser(userData);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error syncing user:', error);
    return NextResponse.json(
      { error: 'Failed to sync user' },
      { status: 500 }
    );
  }
}
