import { NextResponse } from 'next/server';
import { MockDataService } from '@/lib/services/mockDataService';

export const dynamic = "force-static";

// API Route mockée qui simule la connexion à Neon
export async function GET() {
  try {
    const isHealthy = await MockDataService.healthCheck();
    
    if (isHealthy) {
      return NextResponse.json({ 
        status: 'healthy',
        message: 'Mock Neon connection successful',
        timestamp: new Date().toISOString()
      });
    } else {
      return NextResponse.json({ status: 'unhealthy' }, { status: 503 });
    }
  } catch {
    return NextResponse.json(
      { status: 'error', message: 'Mock database connection failed' },
      { status: 503 }
    );
  }
}
