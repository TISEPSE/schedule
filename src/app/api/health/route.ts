import { NextResponse } from 'next/server';
export const dynamic = "force-dynamic";


import { NeonStorage } from '@/lib/database/neon';



export async function GET() {
  try {
    const isHealthy = await NeonStorage.healthCheck();
    
    if (isHealthy) {
      return NextResponse.json({ status: 'healthy' });
    } else {
      return NextResponse.json({ status: 'unhealthy' }, { status: 503 });
    }
  } catch {
    return NextResponse.json(
      { status: 'error', message: 'Database connection failed' },
      { status: 503 }
    );
  }
}
