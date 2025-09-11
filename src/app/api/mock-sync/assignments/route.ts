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

    const assignments = await MockDataService.getAssignments(userId);
    
    return NextResponse.json({
      success: true,
      data: assignments,
      count: assignments.length,
      message: 'Assignments retrieved from mock Neon DB'
    });
  } catch (error) {
    console.error('Error fetching assignments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch assignments' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const assignmentData = await request.json();
    
    const result = await MockDataService.saveAssignment(assignmentData);
    
    return NextResponse.json({
      success: true,
      data: result,
      message: 'Assignment saved to mock Neon DB'
    });
  } catch (error) {
    console.error('Error saving assignment:', error);
    return NextResponse.json(
      { error: 'Failed to save assignment' },
      { status: 500 }
    );
  }
}
