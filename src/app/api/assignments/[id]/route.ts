import { NextRequest, NextResponse } from 'next/server';
import { ServerDatabaseService } from '@/lib/database/server';

// PUT /api/assignments/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const assignmentData = await request.json();
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'ID requis'
      }, { status: 400 });
    }

    const updatedAssignment = await ServerDatabaseService.updateAssignment(id, {
      title: assignmentData.title,
      description: assignmentData.description,
      subject: assignmentData.subject,
      type: assignmentData.type,
      dueDate: assignmentData.dueDate ? new Date(assignmentData.dueDate) : undefined,
      completed: assignmentData.completed,
      priority: assignmentData.priority,
    });
    
    return NextResponse.json({
      success: true,
      assignment: updatedAssignment
    });
    
  } catch (error) {
    console.error('Erreur PUT assignments:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Erreur serveur'
    }, { status: 500 });
  }
}

// DELETE /api/assignments/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'ID requis'
      }, { status: 400 });
    }

    const success = await ServerDatabaseService.deleteAssignment(id);
    
    return NextResponse.json({
      success,
      message: success ? 'Devoir supprimé' : 'Échec suppression'
    });
    
  } catch (error) {
    console.error('Erreur DELETE assignments:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Erreur serveur'
    }, { status: 500 });
  }
}