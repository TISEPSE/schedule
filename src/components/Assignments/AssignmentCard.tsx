import React, { memo } from 'react';
import { Calendar, Edit, Trash2, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';
import { formatDueDate, getDaysRemaining, isOverdue } from '@/lib/dateUtils';
import { getSubjectColors } from '@/lib/colors';

interface Assignment {
  id: string;
  userId: string;
  title: string;
  description: string;
  subject: string;
  type: 'homework' | 'report' | 'essay' | 'study' | 'presentation' | 'research' | 'reading';
  dueDate: Date;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  updatedAt: Date;
}

interface AssignmentCardProps {
  assignment: Assignment;
  onToggleCompletion: (id: string) => void;
  onEdit: (assignment: Assignment) => void;
  onDelete: (id: string) => void;
}

const getStatusIcon = (assignment: Assignment) => {
  if (assignment.completed) {
    return <CheckCircle className="h-5 w-5 text-green-500" />;
  }
  const daysRemaining = getDaysRemaining(assignment.dueDate);
  if (daysRemaining < 0) {
    return <AlertCircle className="h-5 w-5 text-red-500" />;
  }
  if (daysRemaining <= 1) {
    return <AlertCircle className="h-5 w-5 text-orange-500" />;
  }
  return <TrendingUp className="h-5 w-5 text-blue-500" />;
};

const getStatusLabel = (assignment: Assignment) => {
  if (assignment.completed) {
    return 'Terminée';
  }
  const daysRemaining = getDaysRemaining(assignment.dueDate);
  if (daysRemaining < 0) {
    return 'En retard';
  }
  if (daysRemaining <= 1) {
    return 'Urgent';
  }
  return 'En cours';
};

const AssignmentCard = memo(({ 
  assignment, 
  onToggleCompletion, 
  onEdit, 
  onDelete 
}: AssignmentCardProps) => {
  const assignmentOverdue = isOverdue(assignment.dueDate);
  const subjectColors = getSubjectColors(assignment.subject);

  return (
    <div 
      className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-200 group ${
        assignment.completed 
          ? 'border-l-4 border-l-green-500' 
          : assignmentOverdue 
            ? 'border-l-4 border-l-red-500'
            : 'border-l-4 border-l-blue-500'
      }`}
    >
      {/* Header with checkbox and title */}
      <div className="flex items-start gap-4 mb-4">
        <button
          onClick={() => onToggleCompletion(assignment.id)}
          className="flex-shrink-0 mt-0.5 transition-all duration-200 hover:scale-105"
        >
          {assignment.completed ? (
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle className="h-4 w-4 text-white" />
            </div>
          ) : (
            <div className="w-6 h-6 border-2 border-gray-300 rounded-full hover:border-blue-500 transition-colors" />
          )}
        </button>
        <div className="flex-1 min-w-0">
          <h3 className={`font-semibold text-gray-900 mb-2 line-clamp-2 ${
            assignment.completed ? 'line-through text-gray-500' : ''
          }`}>
            {assignment.title}
          </h3>
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${subjectColors.backgroundLight} ${subjectColors.text}`}>
              {assignment.subject}
            </span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              assignment.priority === 'high' ? 'bg-red-100 text-red-800' :
              assignment.priority === 'medium' ? 'bg-orange-100 text-orange-800' :
              'bg-green-100 text-green-800'
            }`}>
              {assignment.priority === 'high' ? 'Urgent' : 
               assignment.priority === 'medium' ? 'Normal' : 'Faible'}
            </span>
          </div>
        </div>
      </div>

      {/* Description */}
      {assignment.description && (
        <p className={`text-sm text-gray-600 mb-4 line-clamp-2 ${
          assignment.completed ? 'text-gray-500' : ''
        }`}>
          {assignment.description}
        </p>
      )}

      {/* Due date and status */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span className={`${assignmentOverdue ? 'text-red-600' : 'text-gray-600'}`}>
            {formatDueDate(assignment.dueDate)}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {getStatusIcon(assignment)}
          <span className={`text-xs font-medium ${
            assignment.completed ? 'text-green-600' :
            assignmentOverdue ? 'text-red-600' : 'text-blue-600'
          }`}>
            {getStatusLabel(assignment)}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
          <span>Progression</span>
          <span className="font-medium">{assignment.completed ? '100%' : '0%'}</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              assignment.completed ? 'bg-green-500' : 
              assignmentOverdue ? 'bg-red-500' : 'bg-blue-500'
            }`}
            style={{ width: assignment.completed ? '100%' : '0%' }}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100">
        <button
          onClick={() => onEdit(assignment)}
          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        >
          <Edit className="h-4 w-4" />
        </button>
        <button
          onClick={() => onDelete(assignment.id)}
          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
});

AssignmentCard.displayName = 'AssignmentCard';

export default AssignmentCard;