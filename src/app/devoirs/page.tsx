'use client';

import { useAuth } from '@/context/AuthContext';
import { redirect } from 'next/navigation';
import MainLayout from '@/components/Layout/MainLayout';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useApiData } from '@/hooks/useApiData';
import { 
  Plus, 
  Target,
  CheckCircle,
  TrendingUp,
  AlertCircle,
  Filter,
  SortAsc
} from 'lucide-react';
import { getDaysRemaining } from '@/lib/dateUtils';
import CreateAssignmentModal from '@/components/Devoirs/CreateAssignmentModal';
import AssignmentCard from '@/components/Assignments/AssignmentCard';

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

  // Filtrer et trier les assignments avec useMemo pour optimiser les performances
  const filteredAssignments = useMemo(() => {
    return localAssignments
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
  }, [localAssignments, filterStatus, sortBy]);

  // Fonctions optimisées avec useCallback
  const handleCreateAssignment = useCallback(async (formData: {
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
  }, [createAssignment]);

  const handleEditAssignment = useCallback((assignment: Assignment) => {
    console.log('Édition du devoir:', assignment.id);
    // TODO: Implémenter l'édition
  }, []);

  const handleDeleteAssignment = useCallback(async (assignmentId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce devoir ?')) {
      console.log('Suppression du devoir:', assignmentId);
      // TODO: Implémenter la suppression
    }
  }, []);

  const toggleCompletion = useCallback((assignmentId: string) => {
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
  }, [localAssignments]);

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
              filteredAssignments.map((assignment) => (
                <AssignmentCard
                  key={assignment.id}
                  assignment={assignment}
                  onToggleCompletion={toggleCompletion}
                  onEdit={handleEditAssignment}
                  onDelete={handleDeleteAssignment}
                />
              ))
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