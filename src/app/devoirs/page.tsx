'use client';

import { useAuth } from '@/context/AuthContext';
import { redirect } from 'next/navigation';
import MainLayout from '@/components/Layout/MainLayout';
import { useState, useEffect } from 'react';
import { useApiData } from '@/hooks/useApiData';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Target,
  CheckCircle,
  TrendingUp,
  AlertCircle,
  Calendar,
  Filter,
  SortAsc
} from 'lucide-react';
import { getSubjectColors } from '@/lib/colors';
import CreateAssignmentModal from '@/components/Devoirs/CreateAssignmentModal';

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

export default function DevoirsPage() {
  const { user, logout } = useAuth();
  
  // Adapter les labels selon le type d'utilisateur
  const pageTitle = user?.role === 'personal' ? 'Mes Tâches' : 'Mes Devoirs';
  const pageDescription = user?.role === 'personal' 
    ? 'Organisez et suivez vos tâches personnelles et projets'
    : 'Organisez vos devoirs et suivez votre progression';
  const createButtonText = user?.role === 'personal' ? 'Nouvelle tâche' : 'Nouveau devoir';

  // Connexion avec projets retirée pour simplifier
  
  const { assignments, updateAssignment, createAssignment } = useApiData(user?.id || '');
  
  // États locaux
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [localAssignments, setLocalAssignments] = useState<Assignment[]>([]);
  const [pendingUpdates, setPendingUpdates] = useState<Map<string, Assignment>>(new Map());
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed' | 'overdue'>('all');
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'subject'>('dueDate');
  
  // Synchroniser l'état local avec les assignments du serveur et les jalons
  useEffect(() => {
    const updatedAssignments = assignments.map(serverAssignment => {
      const pendingUpdate = pendingUpdates.get(serverAssignment.id);
      if (pendingUpdate) {
        return pendingUpdate;
      }
      return serverAssignment;
    });
    
    setLocalAssignments(updatedAssignments);
  }, [assignments, pendingUpdates]);

  // Synchronisation différée des mises à jour
  useEffect(() => {
    if (pendingUpdates.size > 0) {
      const timer = setTimeout(async () => {
        const updatesToSync = new Map(pendingUpdates);
        setPendingUpdates(new Map());
        
        try {
          await Promise.all(
            Array.from(updatesToSync.values()).map(assignment => 
              updateAssignment(assignment).catch(err => 
                console.error('Erreur sync:', assignment.id, err)
              )
            )
          );
        } catch (error) {
          console.error('Erreur lors de la synchronisation:', error);
          setPendingUpdates(prev => new Map([...prev, ...updatesToSync]));
        }
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [pendingUpdates, updateAssignment]);

  if (!user) {
    redirect('/');
  }

  if (user.role === 'admin') {
    return (
      <MainLayout user={user} onLogout={logout}>
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">{pageTitle}</h1>
            <div className="bg-gray-50 rounded-xl p-8 text-center">
              <p className="text-gray-600">
                Gérez les devoirs de tous les étudiants et créez de nouvelles tâches.
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Fonctionnalités prévues : attribution de devoirs, suivi des rendus, évaluations...
              </p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Filtrer et trier les assignments
  const filteredAssignments = localAssignments
    .filter(assignment => {
      switch (filterStatus) {
        case 'pending':
          return !assignment.completed && getDaysRemaining(assignment.dueDate) >= 0;
        case 'completed':
          return assignment.completed;
        case 'overdue':
          return !assignment.completed && getDaysRemaining(assignment.dueDate) < 0;
        default:
          return true;
      }
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'dueDate':
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'subject':
          return a.subject.localeCompare(b.subject);
        default:
          return 0;
      }
    });

  // Fonction pour créer un devoir
  const handleCreateAssignment = async (formData: {
    title: string;
    description: string;
    subject: string;
    dueDate: Date;
    priority: 'low' | 'medium' | 'high';
  }) => {
    await createAssignment({
      title: formData.title,
      description: formData.description,
      subject: formData.subject,
      dueDate: formData.dueDate,
      priority: formData.priority,
      completed: false
    });
  };

  const handleEditAssignment = (assignment: Assignment) => {
    console.log('Édition du devoir:', assignment.id);
  };

  const handleDeleteAssignment = async (assignmentId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce devoir ?')) {
      console.log('Suppression du devoir:', assignmentId);
    }
  };

  const toggleCompletion = (assignmentId: string) => {
    const assignment = localAssignments.find(a => a.id === assignmentId);
    if (!assignment) return;

    const updatedAssignment: Assignment = {
      ...assignment,
      completed: !assignment.completed
    };

    setLocalAssignments(prev => 
      prev.map(a => a.id === assignmentId ? updatedAssignment : a)
    );

    setPendingUpdates(prev => {
      const newMap = new Map(prev);
      newMap.set(assignmentId, updatedAssignment);
      return newMap;
    });
  };

  const formatDueDate = (dueDate: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (dueDate.toDateString() === today.toDateString()) {
      return "Aujourd'hui";
    } else if (dueDate.toDateString() === tomorrow.toDateString()) {
      return 'Demain';
    } else {
      const daysDiff = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      if (daysDiff > 0 && daysDiff <= 7) {
        return `Dans ${daysDiff} jours`;
      } else if (daysDiff < 0) {
        return `En retard de ${Math.abs(daysDiff)} jours`;
      } else {
        return dueDate.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' });
      }
    }
  };

  const getDaysRemaining = (dueDate: Date) => {
    const today = new Date();
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

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

  return (
    <MainLayout user={user} onLogout={logout}>
      <div className="space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{pageTitle}</h1>
              <p className="text-gray-600">{pageDescription}</p>
            </div>
            <button 
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>{createButtonText}</span>
            </button>
          </div>

          {/* Statistics Cards - Simplified and consistent */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{localAssignments.length}</p>
                  <p className="text-sm text-gray-600 mt-1">Total des tâches</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Target className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {localAssignments.filter(a => a.completed).length}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Terminées</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {localAssignments.filter(a => !a.completed && getDaysRemaining(a.dueDate) >= 0).length}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">En cours</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {localAssignments.filter(a => !a.completed && getDaysRemaining(a.dueDate) < 0).length}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">En retard</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Filter and Sort Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as 'all' | 'pending' | 'completed' | 'overdue')}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="all">Toutes les tâches</option>
                <option value="pending">En cours</option>
                <option value="completed">Terminées</option>
                <option value="overdue">En retard</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <SortAsc className="h-4 w-4 text-gray-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'dueDate' | 'priority' | 'subject')}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="dueDate">Trier par échéance</option>
                <option value="priority">Trier par priorité</option>
                <option value="subject">Trier par matière</option>
              </select>
            </div>
          </div>


          {/* Tasks Grid - Clean and consistent design */}
          <div className={`${filteredAssignments.length === 0 ? 'text-center py-12' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'}`}>
            {filteredAssignments.length === 0 ? (
              <div>
                <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-600 text-lg">Aucune tâche trouvée</p>
                <p className="text-gray-500 text-sm mt-1">Essayez de modifier vos filtres ou créez une nouvelle tâche</p>
              </div>
            ) : (
              filteredAssignments.map((assignment) => {
                const daysRemaining = getDaysRemaining(assignment.dueDate);
                const isOverdue = daysRemaining < 0;
                const subjectColors = getSubjectColors(assignment.subject);
                // Remove unused variable
                
                return (
                  <div 
                    key={assignment.id} 
                    className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-200 group ${
                      assignment.completed 
                        ? 'border-l-4 border-l-green-500' 
                        : isOverdue 
                          ? 'border-l-4 border-l-red-500'
                          : 'border-l-4 border-l-blue-500'
                    }`}
                  >
                    {/* Header with checkbox and title */}
                    <div className="flex items-start gap-4 mb-4">
                      <button
                        onClick={() => toggleCompletion(assignment.id)}
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
                        <span className={`${isOverdue ? 'text-red-600' : 'text-gray-600'}`}>
                          {formatDueDate(assignment.dueDate)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(assignment)}
                        <span className={`text-xs font-medium ${
                          assignment.completed ? 'text-green-600' :
                          isOverdue ? 'text-red-600' : 'text-blue-600'
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
                            isOverdue ? 'bg-red-500' : 'bg-blue-500'
                          }`}
                          style={{ width: assignment.completed ? '100%' : '0%' }}
                        />
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100">
                      <button
                        onClick={() => handleEditAssignment(assignment)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteAssignment(assignment.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
        
        <CreateAssignmentModal 
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateAssignment}
        />
      </div>
    </MainLayout>
  );
}