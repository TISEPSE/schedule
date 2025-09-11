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
  AlertCircle
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
  
  const { assignments, updateAssignment, createAssignment } = useApiData(user?.id || '');
  
  // États locaux
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [localAssignments, setLocalAssignments] = useState<Assignment[]>([]);
  const [pendingUpdates, setPendingUpdates] = useState<Map<string, Assignment>>(new Map());
  
  // Synchroniser l'état local avec les assignments du serveur
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

  // Afficher toutes les assignments locales
  const filteredAssignments = localAssignments;

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
      return 'Juste tâche';
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

          {/* Statistiques avec design unique */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white border-2 border-blue-200 rounded-2xl p-6 relative overflow-hidden hover:border-blue-300 transition-all duration-200">
              <div className="absolute top-0 right-0 w-16 h-16 bg-blue-100 rounded-bl-full opacity-50"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Target className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="text-right">
                    <p className="text-4xl font-black text-gray-900">{filteredAssignments.length}</p>
                  </div>
                </div>
                <div className="border-t border-gray-100 pt-3">
                  <span className="text-sm font-bold text-gray-800 uppercase tracking-wide">Total</span>
                  <p className="text-xs text-gray-500 mt-1">Toutes les tâches</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white border-2 border-green-200 rounded-2xl p-6 relative overflow-hidden hover:border-green-300 transition-all duration-200">
              <div className="absolute top-0 right-0 w-16 h-16 bg-green-100 rounded-bl-full opacity-50"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="text-right">
                    <p className="text-4xl font-black text-gray-900">
                      {filteredAssignments.filter(a => a.completed).length}
                    </p>
                  </div>
                </div>
                <div className="border-t border-gray-100 pt-3">
                  <span className="text-sm font-bold text-gray-800 uppercase tracking-wide">Terminées</span>
                  <p className="text-xs text-gray-500 mt-1">Objectifs atteints</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white border-2 border-orange-200 rounded-2xl p-6 relative overflow-hidden hover:border-orange-300 transition-all duration-200">
              <div className="absolute top-0 right-0 w-16 h-16 bg-orange-100 rounded-bl-full opacity-50"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-orange-600" />
                  </div>
                  <div className="text-right">
                    <p className="text-4xl font-black text-gray-900">
                      {filteredAssignments.filter(a => !a.completed && getDaysRemaining(a.dueDate) >= 0).length}
                    </p>
                  </div>
                </div>
                <div className="border-t border-gray-100 pt-3">
                  <span className="text-sm font-bold text-gray-800 uppercase tracking-wide">En cours</span>
                  <p className="text-xs text-gray-500 mt-1">À compléter</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white border-2 border-red-200 rounded-2xl p-6 relative overflow-hidden hover:border-red-300 transition-all duration-200">
              <div className="absolute top-0 right-0 w-16 h-16 bg-red-100 rounded-bl-full opacity-50"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertCircle className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="text-right">
                    <p className="text-4xl font-black text-gray-900">
                      {filteredAssignments.filter(a => !a.completed && getDaysRemaining(a.dueDate) < 0).length}
                    </p>
                  </div>
                </div>
                <div className="border-t border-gray-100 pt-3">
                  <span className="text-sm font-bold text-gray-800 uppercase tracking-wide">En retard</span>
                  <p className="text-xs text-gray-500 mt-1">Nécessitent attention</p>
                </div>
              </div>
            </div>
          </div>


          {/* Liste des tâches modernisée */}
          <div className="space-y-6">
            {filteredAssignments.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">Aucune tâche pour le moment</p>
              </div>
            ) : (
              filteredAssignments.map((assignment) => {
                const daysRemaining = getDaysRemaining(assignment.dueDate);
                const isOverdue = daysRemaining < 0;
                const subjectColors = getSubjectColors(assignment.subject);
                
                return (
                  <div 
                    key={assignment.id} 
                    className={`group relative bg-white rounded-3xl shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-2 transform ${
                      assignment.completed 
                        ? 'border-l-4 border-green-400 bg-green-50/20' 
                        : isOverdue 
                          ? 'border-l-4 border-red-400 bg-red-50/20'
                          : 'border-l-4 border-blue-400 hover:border-blue-500'
                    }`}
                    style={{
                      boxShadow: assignment.completed 
                        ? '0 8px 25px rgba(34, 197, 94, 0.15), 0 0 0 1px rgba(34, 197, 94, 0.05)' 
                        : isOverdue 
                          ? '0 8px 25px rgba(239, 68, 68, 0.15), 0 0 0 1px rgba(239, 68, 68, 0.05)'
                          : '0 8px 25px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.02)'
                    }}
                  >
                    {/* Indicateur de priorité sous forme de coin */}
                    <div className={`absolute top-0 right-0 w-0 h-0 border-l-[20px] border-b-[20px] ${
                      assignment.priority === 'high' ? 'border-l-red-500 border-b-transparent' :
                      assignment.priority === 'medium' ? 'border-l-orange-500 border-b-transparent' : 
                      'border-l-green-500 border-b-transparent'
                    } rounded-tr-3xl`}></div>
                    
                    <div className="p-6 pl-8">
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex-1">
                          <div className="mb-4">
                            <div className="flex items-center space-x-4 mb-3">
                              <button
                                onClick={() => toggleCompletion(assignment.id)}
                                className="group/checkbox flex-shrink-0 transition-all duration-300 hover:scale-110"
                              >
                                {assignment.completed ? (
                                  <div className="relative h-8 w-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white group-hover/checkbox:shadow-xl transition-all duration-300">
                                    <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                  </div>
                                ) : (
                                  <div className="h-8 w-8 border-3 border-gray-300 rounded-full hover:border-blue-500 transition-all duration-300 group-hover/checkbox:bg-blue-50 group-hover/checkbox:border-blue-400"></div>
                                )}
                              </button>
                              <div className="flex-1">
                                <h3 className={`text-xl font-bold transition-all duration-200 ${
                                  assignment.completed 
                                    ? 'text-green-700 line-through' 
                                    : 'text-gray-900 group-hover:text-blue-900'
                                }`}>
                                  {assignment.title}
                                </h3>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-3 mb-4 ml-11">
                              <span className={`px-3 py-1.5 rounded-xl text-sm font-semibold ${subjectColors.backgroundLight} ${subjectColors.text} border border-current/20`}>
                                {assignment.subject}
                              </span>
                              <span className={`px-3 py-1.5 rounded-xl text-sm font-semibold border ${
                                assignment.priority === 'high' ? 'bg-red-50 text-red-700 border-red-200' :
                                assignment.priority === 'medium' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                                'bg-green-50 text-green-700 border-green-200'
                              }`}>
                                Priorité {assignment.priority === 'high' ? 'haute' : assignment.priority === 'medium' ? 'moyenne' : 'basse'}
                              </span>
                            </div>
                          </div>
                          
                          <div className="ml-11">
                            <p className={`text-gray-600 mb-4 leading-relaxed ${
                              assignment.completed ? 'text-gray-500' : ''
                            }`}>
                              {assignment.description}
                            </p>
                            
                            {/* Barre de progression avec design unique */}
                            <div className="mb-4">
                              <div className="flex justify-between items-center mb-3">
                                <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Progression</span>
                                <span className={`text-sm font-black px-3 py-1 rounded-full border-2 ${
                                  assignment.completed ? 'bg-green-100 text-green-800 border-green-200' : 
                                  'bg-gray-100 text-gray-800 border-gray-200'
                                }`}>
                                  {assignment.completed ? 100 : 0}%
                                </span>
                              </div>
                              <div className="relative w-full bg-gray-100 rounded-full h-4 overflow-hidden border border-gray-200">
                                <div 
                                  className={`h-4 rounded-full transition-all duration-700 ease-out relative ${
                                    assignment.completed ? 'bg-green-500' : 
                                    isOverdue ? 'bg-red-500' : 'bg-blue-500'
                                  }`}
                                  style={{ width: `${assignment.completed ? 100 : 0}%` }}
                                >
                                  {assignment.completed && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20 rounded-full"></div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right ml-6 flex flex-col items-end">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className={`p-2 rounded-xl ${
                              assignment.completed ? 'bg-green-100' :
                              isOverdue ? 'bg-red-100' : 'bg-blue-100'
                            }`}>
                              {getStatusIcon(assignment)}
                            </div>
                          </div>
                          <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
                            assignment.completed ? 'bg-green-100 text-green-800' :
                            isOverdue ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {getStatusLabel(assignment)}
                          </span>
                          <div className={`text-sm font-medium mt-2 ${
                            isOverdue ? 'text-red-600' : 'text-gray-600'
                          }`}>
                            {formatDueDate(assignment.dueDate)}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            {assignment.dueDate.toLocaleDateString('fr-FR')}
                          </div>
                        </div>
                      </div>

                      {/* Actions avec design distinctif */}
                      <div className="flex justify-end space-x-3 pt-6 mt-6 border-t border-gray-100/50">
                        <button
                          onClick={() => handleEditAssignment(assignment)}
                          className="flex items-center space-x-2 px-5 py-3 text-sm font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-2xl transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 border border-blue-200 hover:border-blue-300"
                        >
                          <Edit className="h-4 w-4" />
                          <span>Modifier</span>
                        </button>
                        <button
                          onClick={() => handleDeleteAssignment(assignment.id)}
                          className="flex items-center space-x-2 px-5 py-3 text-sm font-bold text-red-700 bg-red-50 hover:bg-red-100 rounded-2xl transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 border border-red-200 hover:border-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span>Supprimer</span>
                        </button>
                      </div>
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