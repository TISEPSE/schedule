import { FileText, AlertTriangle } from 'lucide-react';
import { UserRole } from '@/types';
import { Assignment } from '@/lib/database/local';

interface AssignmentsProps {
  userRole: UserRole;
  assignments?: Assignment[];
}

export default function Assignments({ userRole, assignments }: AssignmentsProps) {
  // Si aucune assignments fournie, utiliser les données statiques (utilisateurs normaux)
  if (!assignments) {
    const studentAssignments = [
      {
        title: 'Révisions Français',
        subject: 'Personnel',
        dueDate: 'Demain',
        priority: 'high',
        color: 'border-l-red-500',
      },
      {
        title: 'Projet de groupe',
        subject: 'Collaboration', 
        dueDate: 'Vendredi',
        priority: 'medium',
        color: 'border-l-orange-500',
      },
      {
        title: 'Lecture chapitre 5',
        subject: 'Personnel',
        dueDate: 'Lundi prochain',
        priority: 'low',
        color: 'border-l-green-500',
      },
    ];

    const adminTasks = [
      {
        title: 'Modération utilisateurs',
        subject: 'Administration',
        dueDate: 'Aujourd\'hui',
        priority: 'high',
        color: 'border-l-red-500',
      },
      {
        title: 'Mise à jour système',
        subject: 'Technique',
        dueDate: 'Cette semaine',
        priority: 'medium',
        color: 'border-l-orange-500',
      },
      {
        title: 'Rapport d\'activité',
        subject: 'Administratif',
        dueDate: 'Fin du mois',
        priority: 'low',
        color: 'border-l-green-500',
      },
    ];

    const items = userRole === 'admin' ? adminTasks : studentAssignments;
    const title = userRole === 'admin' ? 'Tâches admin' : 'À faire';

    return (
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
          <FileText className="h-4 w-4 text-gray-400" />
        </div>
        
        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={index} className={`border-l-4 ${item.color} pl-3 py-2.5`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="text-base font-medium text-gray-900">{item.title}</h4>
                  <p className="text-sm text-gray-500 mt-0.5">{item.subject}</p>
                </div>
                <div className="flex items-center space-x-1">
                  {item.priority === 'high' && (
                    <AlertTriangle className="h-3 w-3 text-red-500" />
                  )}
                  <span className="text-sm text-gray-400">{item.dueDate}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-3 border-t border-gray-100">
          <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">
            Voir tout →
          </button>
        </div>
      </div>
    );
  }

  // Pour l'utilisateur test : utiliser les vraies données
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-orange-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-500';
    }
  };
  
  const formatDueDate = (dueDate: Date) => {
    const now = new Date();
    const diff = dueDate.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Aujourd\'hui';
    if (days === 1) return 'Demain';
    if (days < 7) return `Dans ${days} jours`;
    return dueDate.toLocaleDateString();
  };
  
  // Limiter aux 3 premiers devoirs non terminés
  const visibleAssignments = assignments.filter(a => !a.completed).slice(0, 3);
  const title = userRole === 'admin' ? 'Tâches admin' : 'À faire';

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        <FileText className="h-4 w-4 text-gray-400" />
      </div>
      
      <div className="space-y-3">
        {visibleAssignments.length > 0 ? (
          visibleAssignments.map((assignment) => (
            <div key={assignment.id} className={`border-l-4 ${getPriorityColor(assignment.priority)} pl-3 py-2.5`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="text-base font-medium text-gray-900">{assignment.title}</h4>
                  <p className="text-sm text-gray-500 mt-0.5">{assignment.subject}</p>
                </div>
                <div className="flex items-center space-x-1">
                  {assignment.priority === 'high' && (
                    <AlertTriangle className="h-3 w-3 text-red-500" />
                  )}
                  <span className="text-sm text-gray-400">{formatDueDate(assignment.dueDate)}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-sm">
              {userRole === 'admin' ? 'Aucune tâche urgente' : 'Aucun devoir en cours'}
            </p>
            <p className="text-gray-400 text-xs mt-1">
              Utilisez le panel de test pour ajouter des données
            </p>
          </div>
        )}
      </div>
      
      {visibleAssignments.length > 0 && (
        <div className="mt-4 pt-3 border-t border-gray-100">
          <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">
            Voir tout ({assignments.filter(a => !a.completed).length}) →
          </button>
        </div>
      )}
    </div>
  );
}