import { NextRequest, NextResponse } from 'next/server';
export const dynamic = "force-dynamic";

import { ServerDatabaseService } from '@/lib/database/server';



// GET /api/assignments?userId=xxx
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'userId requis'
      }, { status: 400 });
    }

    const assignments = await ServerDatabaseService.getAssignmentsByUserId(userId);
    
    return NextResponse.json({
      success: true,
      assignments
    });
    
  } catch (error) {
    console.error('Erreur GET assignments:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Erreur serveur'
    }, { status: 500 });
  }
}

// POST /api/assignments
export async function POST(request: NextRequest) {
  try {
    const assignmentData = await request.json();
    
    if (!assignmentData.userId || !assignmentData.title || !assignmentData.subject) {
      return NextResponse.json({
        success: false,
        error: 'userId, title et subject requis'
      }, { status: 400 });
    }

    const newAssignment = await ServerDatabaseService.createAssignment({
      userId: assignmentData.userId,
      title: assignmentData.title,
      description: assignmentData.description || '',
      subject: assignmentData.subject,
      type: assignmentData.type || 'homework',
      dueDate: new Date(assignmentData.dueDate),
      priority: assignmentData.priority || 'medium',
    });
    
    return NextResponse.json({
      success: true,
      assignment: newAssignment
    });
    
  } catch (error) {
    console.error('Erreur POST assignments:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Erreur serveur'
    }, { status: 500 });
  }
}
