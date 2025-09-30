'use client';

import { useAuth } from '@/context/AuthContext';
import { redirect } from 'next/navigation';
import MainLayout from '@/components/Layout/MainLayout';
import { Target, Plus, TrendingUp, CheckCircle, AlertCircle, Clock, Play, Trello, X, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  recalculateMultipleProjects
} from '@/utils/progressCalculator';
import useProjectProgress from '@/hooks/useProjectProgress';

interface Project {
  id: string;
  title: string;
  description: string;
  category: 'career' | 'learning' | 'health' | 'personal' | 'financial';
  priority: 'low' | 'medium' | 'high';
  targetDate: Date;
  status: 'not-started' | 'in-progress' | 'completed' | 'overdue';
  progress: number; // 0-100
  steps: Step[];
  createdAt: Date;
}

interface Step {
  id: string;
  projectId: string;
  projectTitle: string;
  title: string;
  description?: string;
  completed: boolean;
  completedAt?: Date;
  dueDate?: Date;
  priority: 'low' | 'medium' | 'high';
  tasks: Task[];
  progress: number; // 0-100 based on completed tasks
}

interface Task {
  id: string;
  stepId: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  completedAt?: Date;
}

export default function ProjectsPage() {
  const { user, logout } = useAuth();
  const {
    toggleStep: optimizedToggleStep,
    toggleTask: optimizedToggleTask,
    addTask: optimizedAddTask,
    addStep: optimizedAddStep,
    createProject: optimizedCreateProject,
    getProjectStats
  } = useProjectProgress();

  if (!user || user.role !== 'personal') {
    redirect('/');
  }

  // Initialize projects with calculated progress
  const initialProjects = useMemo(() => {
    const rawProjects: Project[] = [
    {
      id: '1',
      title: 'Maîtriser Next.js 15',
      description: 'Devenir expert en développement avec Next.js 15 et ses nouvelles fonctionnalités',
      category: 'learning',
      priority: 'high',
      targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      status: 'in-progress',
      progress: 65,
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      steps: [
        { 
          id: '1', 
          projectId: '1',
          projectTitle: 'Maîtriser Next.js 15',
          title: 'Configuration de base', 
          description: 'Installer et configurer Next.js 15 avec TypeScript',
          completed: true, 
          priority: 'high',
          progress: 100,
          tasks: [
            { id: 't1', stepId: '1', title: 'Installer Next.js 15', completed: true, priority: 'high' },
            { id: 't2', stepId: '1', title: 'Configurer TypeScript', completed: true, priority: 'medium' },
          ]
        },
        { 
          id: '2', 
          projectId: '1',
          projectTitle: 'Maîtriser Next.js 15',
          title: 'App Router avancé', 
          description: 'Maîtriser le nouveau système de routing',
          completed: false, 
          priority: 'medium',
          progress: 50,
          tasks: [
            { id: 't3', stepId: '2', title: 'Étudier la documentation', completed: true, priority: 'high' },
            { id: 't4', stepId: '2', title: 'Créer des routes dynamiques', completed: false, priority: 'medium' },
          ]
        },
      ],
    },
    {
      id: '2',
      title: 'Développer mon réseau professionnel',
      description: 'Participer à des événements et créer des connexions dans le domaine du développement',
      category: 'career',
      priority: 'medium',
      targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      status: 'in-progress',
      progress: 30,
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      steps: [
        { 
          id: '3', 
          projectId: '2',
          projectTitle: 'Développer mon réseau professionnel',
          title: 'Inscription à 3 meetups', 
          completed: true, 
          priority: 'high',
          progress: 100,
          tasks: [
            { id: 't5', stepId: '3', title: 'Rechercher des événements locaux', completed: true, priority: 'high' },
          ]
        },
      ],
    },
  ];

    // Calculate initial progress for all projects
    return recalculateMultipleProjects(rawProjects);
  }, []);

  // États pour la gestion des données
  const [projects, setProjects] = useState<Project[]>(initialProjects);

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Effet pour empêcher le scroll du fond quand le modal est ouvert
  useEffect(() => {
    if (selectedProject) {
      // Empêcher le scroll du body
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = '15px'; // Compenser la scrollbar
    } else {
      // Restaurer le scroll du body
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0px';
    }

    // Cleanup - restaurer le scroll lors du démontage du composant
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0px';
    };
  }, [selectedProject]);
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set());
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set());
  
  // États pour la gestion des modals
  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] = useState(false);
  const [isAddStepModalOpen, setIsAddStepModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  // États pour les tâches
  const [addingTaskToStep, setAddingTaskToStep] = useState<string | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  
  // États pour les formulaires
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    category: 'personal' as Project['category'],
    priority: 'medium' as Project['priority'],
    targetDate: ''
  });

  const [newStep, setNewStep] = useState({
    projectId: '',
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    dueDate: ''
  });

  // Utility functions

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'career': return 'bg-blue-100 text-blue-800';
      case 'learning': return 'bg-purple-100 text-purple-800';
      case 'health': return 'bg-green-100 text-green-800';
      case 'personal': return 'bg-orange-100 text-orange-800';
      case 'financial': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryLabel = (category: Project['category']) => {
    switch (category) {
      case 'career': return 'Carrière';
      case 'learning': return 'Apprentissage';
      case 'health': return 'Santé';
      case 'personal': return 'Personnel';
      case 'financial': return 'Financier';
      default: return 'Autre';
    }
  };

  const getStatusIcon = (status: Project['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-5 w-5 text-green-700" />;
      case 'in-progress': return <Play className="h-5 w-5 text-blue-700" />;
      case 'overdue': return <AlertCircle className="h-5 w-5 text-red-600" />;
      case 'not-started': return <Clock className="h-5 w-5 text-gray-500" />;
      default: return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusLabel = (status: Project['status']) => {
    switch (status) {
      case 'completed': return 'Terminé';
      case 'in-progress': return 'En cours';
      case 'overdue': return 'En retard';
      case 'not-started': return 'Pas commencé';
      default: return 'Inconnu';
    }
  };

  // Fonctions CRUD pour les projets
  const createProject = useCallback(() => {
    if (!newProject.title.trim()) return;

    const projectData = {
      title: newProject.title.trim(),
      description: newProject.description.trim(),
      category: newProject.category,
      priority: newProject.priority,
      targetDate: newProject.targetDate ? new Date(newProject.targetDate) : new Date(),
      steps: [],
      createdAt: new Date()
    };

    const updatedProjects = optimizedCreateProject(projectData, projects);
    setProjects(updatedProjects);

    setNewProject({
      title: '',
      description: '',
      category: 'personal',
      priority: 'medium',
      targetDate: ''
    });
    setIsCreateProjectModalOpen(false);
  }, [newProject, projects, optimizedCreateProject]);

  const deleteProject = (projectId: string) => {
    setProjects(projects.filter(p => p.id !== projectId));
    if (selectedProject?.id === projectId) {
      setSelectedProject(null);
    }
    setProjectToDelete(null);
    setIsDeleteConfirmOpen(false);
  };

  // Fonctions pour les étapes
  const addStep = useCallback(() => {
    if (!newStep.title.trim() || !newStep.projectId) return;

    const stepData = {
      projectId: newStep.projectId,
      projectTitle: projects.find(p => p.id === newStep.projectId)?.title || '',
      title: newStep.title.trim(),
      description: newStep.description.trim(),
      completed: false,
      priority: newStep.priority,
      dueDate: newStep.dueDate ? new Date(newStep.dueDate) : undefined,
      tasks: []
    };

    const updatedProjects = optimizedAddStep(newStep.projectId, stepData, projects);
    setProjects(updatedProjects);

    // Mise à jour du projet sélectionné si nécessaire
    if (selectedProject?.id === newStep.projectId) {
      setSelectedProject(updatedProjects.find(p => p.id === newStep.projectId) || null);
    }

    setNewStep({
      projectId: '',
      title: '',
      description: '',
      priority: 'medium',
      dueDate: ''
    });
    setIsAddStepModalOpen(false);
  }, [newStep, projects, selectedProject, optimizedAddStep]);

  const toggleStep = useCallback((stepId: string) => {
    const updatedProjects = optimizedToggleStep(stepId, projects);
    setProjects(updatedProjects);

    if (selectedProject) {
      setSelectedProject(updatedProjects.find(p => p.id === selectedProject.id) || null);
    }
  }, [projects, selectedProject, optimizedToggleStep]);

  // Fonctions pour les tâches
  const addTask = useCallback((projectId: string, stepId: string, title: string) => {
    const updatedProjects = optimizedAddTask(projectId, stepId, title, projects);
    setProjects(updatedProjects);

    if (selectedProject?.id === projectId) {
      setSelectedProject(updatedProjects.find(p => p.id === projectId) || null);
    }
  }, [projects, selectedProject, optimizedAddTask]);

  const toggleTask = useCallback((taskId: string) => {
    const updatedProjects = optimizedToggleTask(taskId, projects);
    setProjects(updatedProjects);

    if (selectedProject) {
      setSelectedProject(updatedProjects.find(p => p.id === selectedProject.id) || null);
    }
  }, [projects, selectedProject, optimizedToggleTask]);

  const toggleExpanded = (projectId: string) => {
    const newExpanded = new Set(expandedProjects);
    if (newExpanded.has(projectId)) {
      newExpanded.delete(projectId);
    } else {
      newExpanded.add(projectId);
    }
    setExpandedProjects(newExpanded);
  };

  return (
    <MainLayout user={user} onLogout={logout}>
      <div className="space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Mes Projets</h1>
              <p className="text-gray-600">Gérez et suivez vos projets personnels</p>
            </div>
            <button 
              onClick={() => setIsCreateProjectModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
            >
              <Plus className="h-4 w-4" />
              <span>Nouveau projet</span>
            </button>
          </div>

          {/* Statistics Cards - Optimized with memoized stats */}
          <ProjectStats projects={projects} getProjectStats={getProjectStats} />

          {/* Projects Grid - Style moderne comme les tuiles de tâches */}
          <div className={`${projects.length === 0 ? 'text-center py-12' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'}`}>
            {projects.length === 0 ? (
              <div>
                <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-600 text-lg">Aucun projet trouvé</p>
                <p className="text-gray-500 text-sm mt-1">Créez votre premier projet pour commencer</p>
                <button 
                  onClick={() => setIsCreateProjectModalOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors mt-4"
                >
                  Créer un projet
                </button>
              </div>
            ) : (
              projects.map((project) => {
                const isExpanded = expandedProjects.has(project.id);
                const completedSteps = project.steps.filter(s => s.completed).length;
                const totalSteps = project.steps.length;
                
                return (
                  <div 
                    key={project.id}
                    className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-200 group ${
                      project.status === 'completed' 
                        ? 'border-l-4 border-l-green-500' 
                        : project.status === 'overdue' 
                          ? 'border-l-4 border-l-red-500'
                          : 'border-l-4 border-l-blue-500'
                    }`}
                  >
                    {/* Header with title and category */}
                    <div className="flex items-start gap-4 mb-6">
                      <div className="flex-1 min-w-0">
                        <h3 className={`text-xl font-bold text-gray-900 mb-3 line-clamp-2 ${
                          project.status === 'completed' ? 'line-through text-gray-500' : ''
                        }`}>
                          {project.title}
                        </h3>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ' + getCategoryColor(project.category)}>
                            {getCategoryLabel(project.category)}
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            project.priority === 'high' ? 'bg-red-100 text-red-800' :
                            project.priority === 'medium' ? 'bg-orange-100 text-orange-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {project.priority === 'high' ? 'Urgent' : 
                             project.priority === 'medium' ? 'Normal' : 'Faible'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    {project.description && (
                      <p className={`text-base text-gray-600 mb-6 line-clamp-3 ${
                        project.status === 'completed' ? 'text-gray-500' : ''
                      }`}>
                        {project.description}
                      </p>
                    )}

                    {/* Status and steps count */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2 text-sm">
                        <Trello className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">
                          {completedSteps}/{totalSteps} étapes
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(project.status)}
                        <span className={`text-xs font-medium ${
                          project.status === 'completed' ? 'text-green-600' :
                          project.status === 'overdue' ? 'text-red-600' : 'text-blue-600'
                        }`}>
                          {getStatusLabel(project.status)}
                        </span>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                        <span>Progression</span>
                        <span className="font-medium">{project.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            project.status === 'completed' ? 'bg-green-500' : 
                            project.status === 'overdue' ? 'bg-red-500' : 'bg-blue-500'
                          }`}
                          style={{ width: project.progress + '%' }}
                        />
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100">
                      <button
                        onClick={() => setSelectedProject(project)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Afficher les étapes"
                      >
                        <Play className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleExpanded(project.id);
                        }}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title={isExpanded ? 'Réduire' : 'Développer'}
                      >
                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={() => {
                          setProjectToDelete(project);
                          setIsDeleteConfirmOpen(true);
                        }}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Supprimer le projet"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Expanded content with steps */}
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                          <Trello className="h-4 w-4" />
                          Étapes ({completedSteps}/{totalSteps})
                        </h4>
                        <div className="space-y-2">
                          {project.steps.map((step) => (
                            <div key={step.id} className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-all duration-200 group">
                              <div className="flex items-center gap-3">
                                <button
                                  onClick={() => toggleStep(step.id)}
                                  className="flex-shrink-0 transition-all duration-200 hover:scale-105 cursor-pointer"
                                  title={step.completed ? "Marquer comme non terminé" : "Marquer comme terminé"}
                                >
                                  {step.completed ? (
                                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                      <CheckCircle className="h-3 w-3 text-white" />
                                    </div>
                                  ) : (
                                    <div className="w-5 h-5 border border-gray-300 rounded-full hover:border-blue-500 hover:bg-blue-50 transition-colors" />
                                  )}
                                </button>
                                <div className="flex-1 min-w-0">
                                  <h5 className={`text-sm font-medium ${
                                    step.completed ? 'text-gray-500 line-through' : 'text-gray-800'
                                  }`}>
                                    {step.title}
                                  </h5>
                                  {step.description && (
                                    <p className="text-xs text-gray-500 mt-0.5">{step.description}</p>
                                  )}
                                </div>
                                <span className="text-xs text-gray-400">
                                  {step.tasks.filter(t => t.completed).length}/{step.tasks.length} tâches
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Modal des détails du projet avec design moderne amélioré */}
        {selectedProject && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
            <div
              className="bg-white rounded-2xl max-w-5xl w-full max-h-[95vh] overflow-hidden shadow-2xl border border-gray-100 animate-in slide-in-from-bottom-4 duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header amélioré avec gradient */}
              <div className="sticky top-0 bg-gradient-to-r from-white via-gray-50 to-white border-b border-gray-200 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Target className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h2 className="text-2xl font-bold text-gray-900 truncate">{selectedProject.title}</h2>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ' + getCategoryColor(selectedProject.category)}>
                            {getCategoryLabel(selectedProject.category)}
                          </span>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            selectedProject.priority === 'high' ? 'bg-red-100 text-red-800' :
                            selectedProject.priority === 'medium' ? 'bg-orange-100 text-orange-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {selectedProject.priority === 'high' ? 'Priorité élevée' :
                             selectedProject.priority === 'medium' ? 'Priorité normale' : 'Priorité faible'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Progress bar dans le header */}
                    <div className="bg-gray-100 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          selectedProject.status === 'completed' ? 'bg-green-500' :
                          selectedProject.status === 'overdue' ? 'bg-red-500' : 'bg-blue-500'
                        }`}
                        style={{ width: selectedProject.progress + '%' }}
                      />
                    </div>
                    <div className="flex items-center justify-between mt-2 text-sm">
                      <span className="text-gray-600">Progression générale</span>
                      <span className="font-semibold text-gray-900">{selectedProject.progress}%</span>
                    </div>

                    {selectedProject.description && (
                      <p className="text-gray-600 mt-3 text-sm leading-relaxed">{selectedProject.description}</p>
                    )}
                  </div>

                  <button
                    onClick={() => setSelectedProject(null)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:scale-105 ml-4 flex-shrink-0"
                    title="Fermer"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>

              {/* Corps du modal avec scroll amélioré */}
              <div className="overflow-y-auto max-h-[calc(95vh-200px)] custom-scrollbar">
                <div className="p-6">
                  {/* Section des étapes avec design amélioré */}
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Trello className="h-4 w-4 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Étapes du projet
                        </h3>
                        <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                          {selectedProject.steps.filter(s => s.completed).length}/{selectedProject.steps.length}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          setNewStep({ ...newStep, projectId: selectedProject.id });
                          setIsAddStepModalOpen(true);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm flex items-center gap-2 transition-all duration-200 hover:scale-105 shadow-sm hover:shadow-md"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Nouvelle étape</span>
                      </button>
                    </div>

                    {selectedProject.steps.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <Trello className="h-8 w-8 text-gray-400" />
                        </div>
                        <h4 className="text-lg font-medium text-gray-900 mb-2">Aucune étape définie</h4>
                        <p className="text-gray-500 mb-4">Commencez par créer la première étape de votre projet</p>
                        <button
                          onClick={() => {
                            setNewStep({ ...newStep, projectId: selectedProject.id });
                            setIsAddStepModalOpen(true);
                          }}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition-all duration-200 hover:scale-105"
                        >
                          Créer une étape
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {selectedProject.steps.map((step) => {
                          const isStepModalExpanded = expandedSteps.has(`modal-${step.id}`);
                          const completedTasks = step.tasks.filter(t => t.completed).length;

                          return (
                            <div
                              key={step.id}
                              className={`bg-white rounded-xl border shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden ${
                                step.priority === 'high' ? 'border-l-4 border-l-red-400' :
                                step.priority === 'medium' ? 'border-l-4 border-l-orange-400' :
                                'border-l-4 border-l-green-400'
                              }`}
                            >
                              {/* Step Header - Accordion Toggle */}
                              <div
                                onClick={() => {
                                  const newExpandedSteps = new Set(expandedSteps);
                                  if (newExpandedSteps.has(`modal-${step.id}`)) {
                                    newExpandedSteps.delete(`modal-${step.id}`);
                                  } else {
                                    newExpandedSteps.add(`modal-${step.id}`);
                                  }
                                  setExpandedSteps(newExpandedSteps);
                                }}
                                className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                              >
                                <div className="flex items-center gap-4">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleStep(step.id);
                                    }}
                                    className="w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex-shrink-0 cursor-pointer"
                                    style={{
                                      backgroundColor: step.completed ? '#10b981' : '#f3f4f6',
                                      border: step.completed ? 'none' : '1px solid #d1d5db'
                                    }}
                                  >
                                    {step.completed && <CheckCircle className="h-4 w-4 text-white" />}
                                  </button>

                                  <div className="flex-1 min-w-0">
                                    <h4 className={`text-lg font-semibold mb-1 ${
                                      step.completed ? 'text-gray-500 line-through' : 'text-gray-900'
                                    }`}>
                                      {step.title}
                                    </h4>
                                    {step.description && (
                                      <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
                                    )}
                                  </div>

                                  <div className="flex items-center gap-3">
                                    <div className="text-right">
                                      <div className="text-sm font-medium text-gray-900">
                                        {completedTasks}/{step.tasks.length}
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        {step.tasks.length > 0 ? 'tâches' : 'tâche'}
                                      </div>
                                    </div>
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-transform duration-200 ${
                                      isStepModalExpanded ? 'rotate-180' : ''
                                    }`}>
                                      <ChevronDown className="h-5 w-5 text-gray-400" />
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Tasks List - Accordion Content */}
                              {isStepModalExpanded && (
                                <div className="border-t border-gray-100 bg-gray-50 p-4">
                                  <div className="space-y-3">
                                    {step.tasks.map((task) => (
                                      <div key={task.id} className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 hover:bg-gray-50 group">
                                        <button
                                          onClick={() => toggleTask(task.id)}
                                          className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-all duration-200 hover:scale-110 cursor-pointer ${
                                            task.completed
                                              ? 'bg-green-500'
                                              : 'bg-gray-100 border border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                                          }`}
                                        >
                                          {task.completed && <CheckCircle className="h-3 w-3 text-white" />}
                                        </button>
                                        <p
                                          className={`text-sm font-medium flex-1 cursor-pointer ${
                                            task.completed ? 'text-gray-500 line-through' : 'text-gray-800'
                                          }`}
                                          onClick={() => toggleTask(task.id)}
                                        >
                                          {task.title}
                                        </p>
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                                          task.priority === 'high' ? 'bg-red-100 text-red-700' :
                                          task.priority === 'medium' ? 'bg-orange-100 text-orange-700' :
                                          'bg-green-100 text-green-700'
                                        }`}>
                                          {task.priority === 'high' ? 'Urgent' :
                                           task.priority === 'medium' ? 'Normal' : 'Faible'}
                                        </span>
                                      </div>
                                    ))}

                                    {/* Add Task Input */}
                                    {addingTaskToStep === step.id ? (
                                      <div className="p-4 bg-white rounded-lg shadow-sm border-0">
                                        <div className="flex gap-2">
                                          <input
                                            type="text"
                                            value={newTaskTitle}
                                            onChange={(e) => setNewTaskTitle(e.target.value)}
                                            placeholder="Titre de la nouvelle tâche..."
                                            className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                                            autoFocus
                                            onKeyPress={(e) => {
                                              if (e.key === 'Enter' && newTaskTitle.trim()) {
                                                addTask(selectedProject.id, step.id, newTaskTitle.trim());
                                                setNewTaskTitle('');
                                                setAddingTaskToStep(null);
                                              }
                                              if (e.key === 'Escape') {
                                                setNewTaskTitle('');
                                                setAddingTaskToStep(null);
                                              }
                                            }}
                                          />
                                          <button
                                            onClick={() => {
                                              if (newTaskTitle.trim()) {
                                                addTask(selectedProject.id, step.id, newTaskTitle.trim());
                                                setNewTaskTitle('');
                                                setAddingTaskToStep(null);
                                              }
                                            }}
                                            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                          >
                                            Ajouter
                                          </button>
                                          <button
                                            onClick={() => {
                                              setNewTaskTitle('');
                                              setAddingTaskToStep(null);
                                            }}
                                            className="px-4 py-2 text-gray-600 border border-gray-200 text-sm rounded-lg hover:bg-gray-50 transition-colors font-medium"
                                          >
                                            Annuler
                                          </button>
                                        </div>
                                      </div>
                                    ) : (
                                      <button
                                        onClick={() => setAddingTaskToStep(step.id)}
                                        className="w-full p-3 text-sm text-gray-600 border border-dashed border-gray-200 rounded-lg hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 font-medium"
                                      >
                                        <Plus className="h-4 w-4 mr-2 inline" />
                                        Ajouter une tâche
                                      </button>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal Créer un Projet */}
        {isCreateProjectModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Nouveau Projet</h3>
                <button
                  onClick={() => setIsCreateProjectModalOpen(false)}
                  className="p-1 text-gray-500 hover:bg-gray-100 rounded transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Titre du projet
                  </label>
                  <input
                    type="text"
                    value={newProject.title}
                    onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ex: Créer mon portfolio"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                    placeholder="Description du projet..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
                    <select
                      value={newProject.category}
                      onChange={(e) => setNewProject({ ...newProject, category: e.target.value as Project['category'] })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="personal">Personnel</option>
                      <option value="career">Carrière</option>
                      <option value="learning">Apprentissage</option>
                      <option value="health">Santé</option>
                      <option value="financial">Financier</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Priorité</label>
                    <select
                      value={newProject.priority}
                      onChange={(e) => setNewProject({ ...newProject, priority: e.target.value as Project['priority'] })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="low">Basse</option>
                      <option value="medium">Moyenne</option>
                      <option value="high">Haute</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date cible</label>
                  <input
                    type="date"
                    value={newProject.targetDate}
                    onChange={(e) => setNewProject({ ...newProject, targetDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setIsCreateProjectModalOpen(false)}
                  className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={createProject}
                  disabled={!newProject.title.trim()}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Créer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Ajouter une Étape */}
        {isAddStepModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Nouvelle Étape</h3>
                <button
                  onClick={() => setIsAddStepModalOpen(false)}
                  className="p-1 text-gray-500 hover:bg-gray-100 rounded transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Projet
                  </label>
                  <select
                    value={newStep.projectId}
                    onChange={(e) => setNewStep({ ...newStep, projectId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Sélectionner un projet</option>
                    {projects.map(project => (
                      <option key={project.id} value={project.id}>{project.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Titre de l&apos;étape
                  </label>
                  <input
                    type="text"
                    value={newStep.title}
                    onChange={(e) => setNewStep({ ...newStep, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ex: Terminer la configuration"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={newStep.description}
                    onChange={(e) => setNewStep({ ...newStep, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    rows={2}
                    placeholder="Description de l&apos;étape..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Priorité</label>
                    <select
                      value={newStep.priority}
                      onChange={(e) => setNewStep({ ...newStep, priority: e.target.value as 'low' | 'medium' | 'high' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="low">Basse</option>
                      <option value="medium">Moyenne</option>
                      <option value="high">Haute</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date d&apos;échéance</label>
                    <input
                      type="date"
                      value={newStep.dueDate}
                      onChange={(e) => setNewStep({ ...newStep, dueDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setIsAddStepModalOpen(false)}
                  className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={addStep}
                  disabled={!newStep.title.trim() || !newStep.projectId}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Ajouter
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de confirmation de suppression */}
        {isDeleteConfirmOpen && projectToDelete && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Supprimer le projet</h3>
                  <p className="text-sm text-gray-500">Cette action est irréversible</p>
                </div>
              </div>

              <p className="text-gray-700 mb-6">
                Êtes-vous sûr de vouloir supprimer le projet &quot;<strong>{projectToDelete.title}</strong>&quot; ? 
                Toutes les étapes et tâches associées seront également supprimées.
              </p>

              <div className="flex space-x-3">
                <button
                  onClick={() => setIsDeleteConfirmOpen(false)}
                  className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-1"
                >
                  Annuler
                </button>
                <button
                  onClick={() => deleteProject(projectToDelete.id)}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

// Optimized ProjectStats component with memoization
const ProjectStats = React.memo(({ projects, getProjectStats }: {
  projects: Project[];
  getProjectStats: (projects: Project[]) => {
    total: number;
    completed: number;
    inProgress: number;
    overdue: number;
    notStarted: number;
  };
}) => {
  const stats = getProjectStats(projects);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            <p className="text-sm text-gray-600 mt-1">Total des projets</p>
          </div>
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <Target className="h-6 w-6 text-blue-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
            <p className="text-sm text-gray-600 mt-1">Terminés</p>
          </div>
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-gray-900">{stats.inProgress}</p>
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
            <p className="text-2xl font-bold text-gray-900">{stats.overdue}</p>
            <p className="text-sm text-gray-600 mt-1">En retard</p>
          </div>
          <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
        </div>
      </div>
    </div>
  );
});

ProjectStats.displayName = 'ProjectStats';