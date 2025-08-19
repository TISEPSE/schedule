import { NextRequest, NextResponse } from 'next/server';
import { NeonStorage } from '@/lib/database/neon';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    await NeonStorage.deleteAssignment(id);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting assignment:', error);
    return NextResponse.json(
      { error: 'Failed to delete assignment' },
      { status: 500 }
    );
  }
}