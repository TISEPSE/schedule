'use client';

import { useAuth } from '@/context/AuthContext';
import { redirect } from 'next/navigation';
import MainLayout from '@/components/Layout/MainLayout';
import { Target, Plus, Calendar, TrendingUp, CheckCircle, AlertCircle, Clock, Play, Trello, X, ChevronDown, ChevronUp, Eye, Edit2, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { getPriorityColors } from '@/lib/colors';

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
  
  const [projects] = useState<Project[]>([
    {
      id: '1',
      title: 'Maîtriser Next.js 15',
      description: 'Devenir expert en développement avec Next.js 15 et ses nouvelles fonctionnalités',
      category: 'learning',
      priority: 'high',
      targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // dans 30 jours
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
          completedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          priority: 'high',
          progress: 100,
          tasks: [
            { id: 't1', stepId: '1', title: 'Installer Next.js 15', completed: true, priority: 'high', completedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) },
            { id: 't2', stepId: '1', title: 'Configurer TypeScript', completed: true, priority: 'medium', completedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000) },
          ]
        },
        { 
          id: '2', 
          projectId: '1',
          projectTitle: 'Maîtriser Next.js 15',
          title: 'App Router avancé', 
          description: 'Maîtriser le nouveau système de routing',
          completed: true, 
          completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          priority: 'high',
          progress: 100,
          tasks: [
            { id: 't3', stepId: '2', title: 'Étudier la documentation App Router', completed: true, priority: 'high', completedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000) },
            { id: 't4', stepId: '2', title: 'Créer des routes dynamiques', completed: true, priority: 'medium', completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
          ]
        },
        { 
          id: '3', 
          projectId: '1',
          projectTitle: 'Maîtriser Next.js 15',
          title: 'Server Components', 
          description: 'Comprendre et utiliser les Server Components',
          completed: false,
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          priority: 'medium',
          progress: 50,
          tasks: [
            { id: 't5', stepId: '3', title: 'Créer des Server Components', completed: true, priority: 'high', completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
            { id: 't6', stepId: '3', title: 'Implémenter le streaming', completed: false, priority: 'medium', dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) },
          ]
        },
        { 
          id: '4', 
          projectId: '1',
          projectTitle: 'Maîtriser Next.js 15',
          title: 'Optimisation performances', 
          description: 'Optimiser les performances de l\'application',
          completed: false,
          dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
          priority: 'low',
          progress: 0,
          tasks: [
            { id: 't7', stepId: '4', title: 'Analyser les performances actuelles', completed: false, priority: 'high', dueDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000) },
            { id: 't8', stepId: '4', title: 'Optimiser le bundle', completed: false, priority: 'medium', dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) },
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
      targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // dans 90 jours
      status: 'in-progress',
      progress: 30,
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      steps: [
        { 
          id: '5', 
          projectId: '2',
          projectTitle: 'Développer mon réseau professionnel',
          title: 'Inscription à 3 meetups', 
          description: 'S\'inscrire à des événements de développement',
          completed: true, 
          completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          priority: 'high',
          progress: 100,
          tasks: [
            { id: 't9', stepId: '5', title: 'Rechercher des événements locaux', completed: true, priority: 'high', completedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) },
            { id: 't10', stepId: '5', title: 'S\'inscrire aux meetups sélectionnés', completed: true, priority: 'high', completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
          ]
        },
        { 
          id: '6', 
          projectId: '2',
          projectTitle: 'Développer mon réseau professionnel',
          title: 'Participation à un événement', 
          description: 'Participer activement à un meetup',
          completed: false,
          dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
          priority: 'high',
          progress: 33,
          tasks: [
            { id: 't11', stepId: '6', title: 'Préparer elevator pitch', completed: true, priority: 'high', completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
            { id: 't12', stepId: '6', title: 'Participer au meetup', completed: false, priority: 'high', dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) },
            { id: 't13', stepId: '6', title: 'Follow-up avec les contacts', completed: false, priority: 'medium', dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
          ]
        },
        { 
          id: '7', 
          projectId: '2',
          projectTitle: 'Développer mon réseau professionnel',
          title: '10 nouvelles connexions LinkedIn', 
          description: 'Élargir mon réseau professionnel',
          completed: false,
          dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
          priority: 'medium',
          progress: 0,
          tasks: [
            { id: 't14', stepId: '7', title: 'Mettre à jour profil LinkedIn', completed: false, priority: 'high', dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) },
            { id: 't15', stepId: '7', title: 'Envoyer 10 invitations ciblées', completed: false, priority: 'medium', dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) },
          ]
        },
      ],
    },
    {
      id: '3',
      title: 'Lancer mon side project',
      description: 'Créer et lancer une application SaaS complète avec génération de revenus',
      category: 'personal',
      priority: 'high',
      targetDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000), // dans 120 jours
      status: 'not-started',
      progress: 0,
      createdAt: new Date(),
      steps: [
        { 
          id: '10', 
          projectId: '3',
          projectTitle: 'Lancer mon side project',
          title: 'Validation de l\'idée', 
          description: 'Faire une étude de marché et valider le concept',
          completed: false,
          dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
          priority: 'high',
          progress: 0,
          tasks: [
            { id: 't16', stepId: '10', title: 'Faire une étude de marché', completed: false, priority: 'high', dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) },
            { id: 't17', stepId: '10', title: 'Interviewer des clients potentiels', completed: false, priority: 'high', dueDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000) },
          ]
        },
        { 
          id: '11', 
          projectId: '3',
          projectTitle: 'Lancer mon side project',
          title: 'MVP développé', 
          description: 'Développer un prototype fonctionnel',
          completed: false,
          dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
          priority: 'high',
          progress: 0,
          tasks: [
            { id: 't18', stepId: '11', title: 'Créer les mockups UI', completed: false, priority: 'medium', dueDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000) },
            { id: 't19', stepId: '11', title: 'Configurer l\'environnement de dev', completed: false, priority: 'high', dueDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000) },
            { id: 't20', stepId: '11', title: 'Développer les fonctionnalités core', completed: false, priority: 'high', dueDate: new Date(Date.now() + 50 * 24 * 60 * 60 * 1000) },
          ]
        },
        { 
          id: '12', 
          projectId: '3',
          projectTitle: 'Lancer mon side project',
          title: 'Premiers utilisateurs', 
          description: 'Acquérir les premiers utilisateurs testeurs',
          completed: false,
          dueDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
          priority: 'medium',
          progress: 0,
          tasks: [
            { id: 't21', stepId: '12', title: 'Créer landing page', completed: false, priority: 'high', dueDate: new Date(Date.now() + 70 * 24 * 60 * 60 * 1000) },
            { id: 't22', stepId: '12', title: 'Lancer campagne beta', completed: false, priority: 'medium', dueDate: new Date(Date.now() + 85 * 24 * 60 * 60 * 1000) },
          ]
        },
        { 
          id: '13', 
          projectId: '3',
          projectTitle: 'Lancer mon side project',
          title: 'Premier revenu', 
          description: 'Générer le premier euro de revenu',
          completed: false,
          dueDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000),
          priority: 'low',
          progress: 0,
          tasks: [
            { id: 't23', stepId: '13', title: 'Implémenter système de paiement', completed: false, priority: 'high', dueDate: new Date(Date.now() + 100 * 24 * 60 * 60 * 1000) },
            { id: 't24', stepId: '13', title: 'Lancer version payante', completed: false, priority: 'medium', dueDate: new Date(Date.now() + 115 * 24 * 60 * 60 * 1000) },
          ]
        },
      ],
    },
  ]);

  const [isAddStepModalOpen, setIsAddStepModalOpen] = useState(false);
  const [newStep, setNewStep] = useState({
    title: '',
    description: '',
    projectId: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    dueDate: ''
  });
  
  // États pour la gestion CRUD des projets
  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    category: 'personal' as Project['category'],
    priority: 'medium' as Project['priority'],
    targetDate: ''
  });
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  
  // États pour les accordéons
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set());
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set()); // New state for milestone expansion
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  
  // État local des projets pour permettre les modifications
  const [localProjects, setLocalProjects] = useState(projects);
  
  // États pour l'édition de projets
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  
  // États pour les animations
  const [animatingTasks, setAnimatingTasks] = useState<Set<string>>(new Set());
  const [animatingSteps, setAnimatingSteps] = useState<Set<string>>(new Set());
  
  // États pour l'ajout de tâches
  const [addingTaskToStep, setAddingTaskToStep] = useState<string | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState<string>('');

  if (!user || user.role !== 'personal') {
    redirect('/');
  }

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

  const getCategoryColor = (category: Project['category']) => {
    switch (category) {
      case 'career': return 'bg-blue-100 text-blue-700';
      case 'learning': return 'bg-emerald-100 text-emerald-700';
      case 'health': return 'bg-rose-100 text-rose-600';
      case 'personal': return 'bg-purple-100 text-purple-700';
      case 'financial': return 'bg-amber-100 text-amber-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getStatusIcon = (status: Project['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-5 w-5 text-emerald-700" />;
      case 'in-progress': return <Play className="h-5 w-5 text-blue-700" />;
      case 'overdue': return <AlertCircle className="h-5 w-5 text-rose-600" />;
      case 'not-started': return <Clock className="h-5 w-5 text-slate-500" />;
      default: return <Clock className="h-5 w-5 text-slate-500" />;
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

  const getPriorityColor = (priority: Project['priority']) => {
    const colors = getPriorityColors(priority);
    return `${colors.backgroundLight} ${colors.text}`;
  };

  const toggleExpanded = (projectId: string) => {
    const newExpanded = new Set(expandedProjects);
    if (newExpanded.has(projectId)) {
      newExpanded.delete(projectId);
    } else {
      newExpanded.add(projectId);
    }
    setExpandedProjects(newExpanded);
  };

  const toggleStepExpanded = (stepId: string) => {
    const newExpandedSteps = new Set(expandedSteps);
    if (newExpandedSteps.has(stepId)) {
      newExpandedSteps.delete(stepId);
    } else {
      // Single expansion: close all other milestones first
      newExpandedSteps.clear();
      newExpandedSteps.add(stepId);
    }
    setExpandedSteps(newExpandedSteps);
  };
  
  const toggleStep = (projectId: string, stepId: string) => {
    // Animate milestone completion
    if (!animatingSteps.has(stepId)) {
      setAnimatingSteps(prev => new Set([...prev, stepId]));
      setTimeout(() => {
        setAnimatingSteps(prev => {
          const newSet = new Set(prev);
          newSet.delete(stepId);
          return newSet;
        });
      }, 800);
    }
    
    setLocalProjects(prevProjects =>
      prevProjects.map(project =>
        project.id === projectId
          ? {
              ...project,
              steps: project.steps.map(step =>
                step.id === stepId
                  ? { 
                      ...step, 
                      completed: !step.completed,
                      completedAt: !step.completed ? new Date() : undefined,
                      tasks: step.tasks.map(task => ({
                        ...task,
                        completed: !step.completed,
                        completedAt: !step.completed ? new Date() : undefined
                      })),
                      progress: !step.completed ? 100 : 0
                    }
                  : step
              )
            }
          : project
      )
    );

    // Mettre à jour aussi selectedProject si le modal est ouvert
    if (selectedProject && selectedProject.id === projectId) {
      setSelectedProject(prevSelected => 
        prevSelected ? {
          ...prevSelected,
          steps: prevSelected.steps.map(step =>
            step.id === stepId
              ? {
                  ...step,
                  completed: !step.completed,
                  completedAt: !step.completed ? new Date() : undefined,
                  tasks: step.tasks.map(task => ({
                    ...task,
                    completed: !step.completed,
                    completedAt: !step.completed ? new Date() : undefined
                  })),
                  progress: !step.completed ? 100 : 0
                }
              : step
          )
        } : prevSelected
      );
    }
  };

  const toggleTask = (projectId: string, stepId: string, taskId: string) => {
    // Animate task completion
    if (!animatingTasks.has(taskId)) {
      setAnimatingTasks(prev => new Set([...prev, taskId]));
      setTimeout(() => {
        setAnimatingTasks(prev => {
          const newSet = new Set(prev);
          newSet.delete(taskId);
          return newSet;
        });
      }, 600);
    }
    
    setLocalProjects(prevProjects =>
      prevProjects.map(project =>
        project.id === projectId
          ? {
              ...project,
              steps: project.steps.map(step =>
                step.id === stepId
                  ? {
                      ...step,
                      tasks: step.tasks.map(task =>
                        task.id === taskId
                          ? { 
                              ...task, 
                              completed: !task.completed,
                              completedAt: !task.completed ? new Date() : undefined
                            }
                          : task
                      ),
                      // Update step progress based on completed tasks
                      progress: Math.round(
                        (step.tasks.filter(t => t.id === taskId ? !t.completed : t.completed).length / 
                         step.tasks.length) * 100
                      )
                    }
                  : step
              )
            }
          : project
      )
    );

    // Mettre à jour aussi selectedProject si le modal est ouvert
    if (selectedProject && selectedProject.id === projectId) {
      setSelectedProject(prevSelected => 
        prevSelected ? {
          ...prevSelected,
          steps: prevSelected.steps.map(step =>
            step.id === stepId
              ? {
                  ...step,
                  tasks: step.tasks.map(task =>
                    task.id === taskId
                      ? { 
                          ...task, 
                          completed: !task.completed,
                          completedAt: !task.completed ? new Date() : undefined
                        }
                      : task
                  ),
                  progress: Math.round(
                    (step.tasks.filter(t => t.id === taskId ? !t.completed : t.completed).length / 
                     step.tasks.length) * 100
                  )
                }
              : step
          )
        } : prevSelected
      );
    }
  };

  const openProjectModal = (project: Project, editMode = false) => {
    setSelectedProject(project);
    setIsEditMode(editMode);
    if (editMode) {
      setEditingProject({...project});
    }
    setIsProjectModalOpen(true);
    // Désactiver le scroll du body
    document.body.style.overflow = 'hidden';
  };

  const closeProjectModal = () => {
    setIsProjectModalOpen(false);
    setSelectedProject(null);
    setIsEditMode(false);
    setEditingProject(null);
    setAddingTaskToStep(null);
    setNewTaskTitle('');
    // Réactiver le scroll du body
    document.body.style.overflow = 'unset';
  };

  const saveProjectChanges = () => {
    if (!editingProject) return;
    
    updateProject(editingProject);
    setIsEditMode(false);
    setEditingProject(null);
    closeProjectModal();
  };

  const handleEditingProjectChange = (field: keyof Project, value: string | Date | Project['category'] | Project['priority']) => {
    if (!editingProject) return;
    setEditingProject({
      ...editingProject,
      [field]: value
    });
  };

  const addStep = () => {
    if (!newStep.title || !newStep.projectId) return;
    
    // TODO: Ajouter la logique pour créer un jalon
    console.log('Creating milestone:', newStep);
    
    // Reset form
    setNewStep({
      title: '',
      description: '',
      projectId: '',
      priority: 'medium',
      dueDate: ''
    });
    setIsAddStepModalOpen(false);
  };

  // Fonctions CRUD pour les projets
  const createProject = () => {
    if (!newProject.title || !newProject.targetDate) return;
    
    const project: Project = {
      id: `project-${Date.now()}`,
      title: newProject.title,
      description: newProject.description,
      category: newProject.category,
      priority: newProject.priority,
      targetDate: new Date(newProject.targetDate),
      status: 'not-started',
      progress: 0,
      steps: [],
      createdAt: new Date()
    };
    
    setLocalProjects(prev => [...prev, project]);
    
    // Reset form
    setNewProject({
      title: '',
      description: '',
      category: 'personal',
      priority: 'medium',
      targetDate: ''
    });
    setIsCreateProjectModalOpen(false);
  };

  const updateProject = (updatedProject: Project) => {
    setLocalProjects(prev => 
      prev.map(project => 
        project.id === updatedProject.id ? updatedProject : project
      )
    );
  };

  const deleteProject = (projectId: string) => {
    setLocalProjects(prev => prev.filter(project => project.id !== projectId));
    setIsDeleteConfirmOpen(false);
    setProjectToDelete(null);
  };

  const confirmDeleteProject = (project: Project) => {
    setProjectToDelete(project);
    setIsDeleteConfirmOpen(true);
  };

  // Fonctions pour gérer les tâches
  const addTask = (projectId: string, stepId: string, taskTitle: string) => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      stepId: stepId,
      title: taskTitle,
      completed: false,
      priority: 'medium',
    };

    setLocalProjects(prevProjects =>
      prevProjects.map(project =>
        project.id === projectId
          ? {
              ...project,
              steps: project.steps.map(step =>
                step.id === stepId
                  ? {
                      ...step,
                      tasks: [...step.tasks, newTask],
                      progress: Math.round(
                        (step.tasks.filter(t => t.completed).length / (step.tasks.length + 1)) * 100
                      )
                    }
                  : step
              )
            }
          : project
      )
    );

    // Mettre à jour aussi selectedProject si le modal est ouvert
    if (selectedProject && selectedProject.id === projectId) {
      setSelectedProject(prevSelected => 
        prevSelected ? {
          ...prevSelected,
          steps: prevSelected.steps.map(step =>
            step.id === stepId
              ? {
                  ...step,
                  tasks: [...step.tasks, newTask],
                  progress: Math.round(
                    (step.tasks.filter(t => t.completed).length / (step.tasks.length + 1)) * 100
                  )
                }
              : step
          )
        } : prevSelected
      );
    }
  };

  const deleteTask = (projectId: string, stepId: string, taskId: string) => {
    setLocalProjects(prevProjects =>
      prevProjects.map(project =>
        project.id === projectId
          ? {
              ...project,
              steps: project.steps.map(step =>
                step.id === stepId
                  ? {
                      ...step,
                      tasks: step.tasks.filter(task => task.id !== taskId),
                      progress: step.tasks.length <= 1 ? 0 : Math.round(
                        (step.tasks.filter(t => t.completed && t.id !== taskId).length / (step.tasks.length - 1)) * 100
                      )
                    }
                  : step
              )
            }
          : project
      )
    );

    // Mettre à jour aussi selectedProject si le modal est ouvert
    if (selectedProject && selectedProject.id === projectId) {
      setSelectedProject(prevSelected => 
        prevSelected ? {
          ...prevSelected,
          steps: prevSelected.steps.map(step =>
            step.id === stepId
              ? {
                  ...step,
                  tasks: step.tasks.filter(task => task.id !== taskId),
                  progress: step.tasks.length <= 1 ? 0 : Math.round(
                    (step.tasks.filter(t => t.completed && t.id !== taskId).length / (step.tasks.length - 1)) * 100
                  )
                }
              : step
          )
        } : prevSelected
      );
    }
  };


  return (
    <MainLayout user={user} onLogout={logout}>
      <div className="space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-800 mb-2">Mes Projets</h1>
              <p className="text-slate-600">Gérez et suivez vos projets personnels</p>
            </div>
            <button 
              onClick={() => setIsCreateProjectModalOpen(true)}
              className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Nouveau projet</span>
            </button>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8 mobile-stats-grid xs-mobile-stats-grid">
            <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl p-6 shadow-sm border border-blue-100 hover:shadow-lg hover:from-blue-50 hover:to-blue-100 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-slate-900">{localProjects.length}</p>
                  <p className="text-sm text-slate-700 mt-1">Projets actifs</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center shadow-lg">
                  <Target className="h-6 w-6 text-blue-700" />
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-white to-orange-50 rounded-2xl p-6 shadow-sm border border-orange-100 hover:shadow-lg hover:from-orange-50 hover:to-orange-100 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-slate-900">
                    {localProjects.filter(p => p.status === 'in-progress').length}
                  </p>
                  <p className="text-sm text-slate-700 mt-1">En cours</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center shadow-lg">
                  <Play className="h-6 w-6 text-orange-700" />
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-white to-emerald-50 rounded-2xl p-6 shadow-sm border border-emerald-100 hover:shadow-lg hover:from-emerald-50 hover:to-emerald-100 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-slate-900">
                    {Math.round(localProjects.reduce((acc, p) => acc + p.progress, 0) / localProjects.length)}%
                  </p>
                  <p className="text-sm text-slate-700 mt-1">Progression moyenne</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl flex items-center justify-center shadow-lg">
                  <TrendingUp className="h-6 w-6 text-emerald-700" />
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-white to-purple-50 rounded-2xl p-6 shadow-sm border border-purple-100 hover:shadow-lg hover:from-purple-50 hover:to-purple-100 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-slate-900">
                    {localProjects.flatMap(p => p.steps).filter(s => s.completed).length}
                  </p>
                  <p className="text-sm text-slate-700 mt-1">Étapes accomplies</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center shadow-lg">
                  <CheckCircle className="h-6 w-6 text-purple-700" />
                </div>
              </div>
            </div>
          </div>

          {/* Projects Grid with Accordions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mobile-projects-grid">
            {localProjects.map((project) => {
              const isExpanded = expandedProjects.has(project.id);
              
              return (
                <div 
                  key={project.id} 
                  className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-slate-100 hover:shadow-lg hover:border-slate-200 transition-all duration-300 hover:-translate-y-1 mobile-project-card mobile-scroll-container"
                >
                  {/* Project Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-bold text-slate-900">{project.title}</h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(project.priority)}`}>
                          {project.priority === 'high' ? 'Urgent' : project.priority === 'medium' ? 'Normal' : 'Faible'}
                        </span>
                      </div>
                      <p className="text-slate-700 mb-3">{project.description}</p>
                      <div className="flex items-center space-x-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(project.category)}`}>
                          {getCategoryLabel(project.category)}
                        </span>
                        <div className="flex items-center space-x-1 text-sm text-slate-600">
                          {getStatusIcon(project.status)}
                          <span>{getStatusLabel(project.status)}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Action buttons */}
                    <div className="flex items-center space-x-1 ml-2 md:ml-4 mobile-button-group">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          confirmDeleteProject(project);
                        }}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-1"
                        title="Supprimer le projet"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm text-slate-700 mb-2">
                      <span>Progression</span>
                      <span className="font-semibold text-blue-800">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gradient-to-r from-slate-200 to-slate-100 rounded-full h-3 shadow-inner">
                      <div 
                        className={`h-3 rounded-full transition-all duration-500 shadow-sm ${
                          project.progress >= 80 ? 'bg-gradient-to-r from-emerald-400 to-emerald-500' :
                          project.progress >= 50 ? 'bg-gradient-to-r from-blue-400 to-blue-500' :
                          project.progress >= 25 ? 'bg-gradient-to-r from-orange-400 to-orange-500' :
                          'bg-gradient-to-r from-rose-400 to-rose-500'
                        }`}
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Enhanced Accordion Toggle */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExpanded(project.id);
                    }}
                    className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-all duration-200 mb-4 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                  >
                    <div className="flex items-center space-x-3">
                      <Trello className="h-4 w-4 text-slate-600" />
                      <span className="text-sm font-medium text-slate-800">
                        Étapes ({project.steps.filter(s => s.completed).length}/{project.steps.length})
                      </span>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-slate-400" />
                    )}
                  </button>

                  {/* Enhanced Accordion Content */}
                  {isExpanded && (
                    <div className="space-y-3 mb-4 accordion-content animate-slide-down">
                      {project.steps.map((step, stepIndex) => {
                        const isStepExpanded = expandedSteps.has(step.id);
                        const completedTasks = step.tasks.filter(t => t.completed).length;
                        
                        return (
                          <div 
                            key={step.id} 
                            className={`border rounded-xl shadow-sm mobile-milestone-card animate-accordion-item-fade-in transition-all duration-300 hover:shadow-md ${
                              stepIndex < 4 ? `accordion-item-delay-${stepIndex + 1}` : ''
                            } ${
                              step.completed 
                                ? 'border-emerald-200 bg-gradient-to-r from-emerald-50 to-emerald-25' 
                                : step.progress > 50 
                                  ? 'border-blue-200 bg-gradient-to-r from-blue-50 to-blue-25'
                                  : step.progress > 0 
                                    ? 'border-orange-200 bg-gradient-to-r from-orange-50 to-orange-25'
                                    : 'border-slate-200 bg-white'
                            }`}
                          >
                            {/* Step Header */}
                            <div className="p-4">
                              <div className="flex items-start space-x-3">
                                <button
                                  onClick={() => toggleStep(project.id, step.id)}
                                  className={`flex-shrink-0 mt-0.5 transition-all duration-200 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 ${
                                    animatingSteps.has(step.id) ? 'animate-milestone-complete' : ''
                                  }`}
                                >
                                  {step.completed ? (
                                    <div className="w-6 h-6 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-shadow">
                                      <CheckCircle className="h-4 w-4 text-white" />
                                    </div>
                                  ) : (
                                    <div className="w-6 h-6 border-2 border-slate-300 rounded-full hover:border-blue-500 hover:bg-blue-50 transition-all bg-white hover:shadow-sm" />
                                  )}
                                </button>
                                
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                      <h4 className={`text-base font-semibold ${step.completed ? 'text-slate-500 line-through' : 'text-slate-900'}`}>
                                        {step.title}
                                      </h4>
                                      {step.description && (
                                        <p className="text-sm text-slate-700 mt-1">{step.description}</p>
                                      )}
                                      
                                      {/* Step metadata */}
                                      <div className="flex items-center space-x-4 mt-2">
                                        <div className="flex items-center space-x-2">
                                          <span className="text-xs text-slate-600">
                                            {completedTasks}/{step.tasks.length} tâches
                                          </span>
                                          <div className="w-16 bg-slate-200 rounded-full h-2">
                                            <div 
                                              className="bg-gradient-to-r from-blue-400 to-blue-500 h-2 rounded-full transition-all duration-300"
                                              style={{ width: `${step.progress}%` }}
                                            ></div>
                                          </div>
                                        </div>
                                        
                                        {step.dueDate && (
                                          <div className="flex items-center space-x-1 text-xs text-slate-600">
                                            <Calendar className="h-3 w-3" />
                                            <span>{step.dueDate.toLocaleDateString('fr-FR')}</span>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                    
                                    <div className="flex items-center space-x-2 ml-4">
                                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        step.priority === 'high' ? 'bg-rose-100 text-rose-600' :
                                        step.priority === 'medium' ? 'bg-orange-100 text-orange-700' :
                                        'bg-emerald-100 text-emerald-700'
                                      }`}>
                                        {step.priority === 'high' ? 'Urgent' : step.priority === 'medium' ? 'Normal' : 'Faible'}
                                      </span>
                                      
                                      <button
                                        onClick={() => toggleStepExpanded(step.id)}
                                        className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors"
                                      >
                                        {isStepExpanded ? (
                                          <ChevronUp className="h-4 w-4" />
                                        ) : (
                                          <ChevronDown className="h-4 w-4" />
                                        )}
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            {/* Tasks within Step */}
                            {isStepExpanded && (
                              <div className="border-t border-slate-100 bg-slate-50 accordion-content animate-slide-down">
                                <div className="p-4 space-y-2">
                                  {step.tasks.length > 0 ? (
                                    step.tasks.map((task) => (
                                      <div key={task.id} className="flex items-start space-x-3 p-3 bg-white rounded-lg border border-slate-100 hover:border-slate-200 transition-colors mobile-task-item">
                                        <button
                                          onClick={() => toggleTask(project.id, step.id, task.id)}
                                          className={`flex-shrink-0 mt-0.5 transition-all duration-200 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 ${
                                            animatingTasks.has(task.id) ? 'animate-task-complete' : ''
                                          }`}
                                        >
                                          {task.completed ? (
                                            <div className="w-5 h-5 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-shadow">
                                              <CheckCircle className="h-3 w-3 text-white" />
                                            </div>
                                          ) : (
                                            <div className="w-5 h-5 border-2 border-slate-300 rounded-full hover:border-blue-500 hover:bg-blue-50 transition-all bg-white hover:shadow-sm" />
                                          )}
                                        </button>
                                        
                                        <div className="flex-1 min-w-0">
                                          <p className={`text-sm font-medium ${task.completed ? 'text-slate-500 line-through' : 'text-slate-800'}`}>
                                            {task.title}
                                          </p>
                                          {task.description && (
                                            <p className="text-xs text-slate-600 mt-1">{task.description}</p>
                                          )}
                                          {task.dueDate && (
                                            <div className="flex items-center space-x-1 text-xs text-slate-600 mt-1">
                                              <Calendar className="h-3 w-3" />
                                              <span>{task.dueDate.toLocaleDateString('fr-FR')}</span>
                                            </div>
                                          )}
                                        </div>
                                        
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                          task.priority === 'high' ? 'bg-rose-100 text-rose-600' :
                                          task.priority === 'medium' ? 'bg-orange-100 text-orange-700' :
                                          'bg-emerald-100 text-emerald-700'
                                        }`}>
                                          {task.priority === 'high' ? 'H' : task.priority === 'medium' ? 'M' : 'L'}
                                        </span>
                                      </div>
                                    ))
                                  ) : (
                                    <p className="text-sm text-slate-600 text-center py-4">Aucune tâche pour cette étape</p>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Target Date */}
                  <div className="flex items-center justify-between text-sm text-slate-700 pt-4 border-t border-slate-100">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>Échéance: {project.targetDate.toLocaleDateString('fr-FR')}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{Math.ceil((project.targetDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} jours restants</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Enhanced Add Step Modal */}
        {isAddStepModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 md:p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-fade-in-up mobile-modal xs-mobile-modal">
              {/* Modal Header */}
              <div className="p-6 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-slate-800">Nouvelle étape</h3>
                  <button
                    onClick={() => setIsAddStepModalOpen(false)}
                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-1"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Projet
                  </label>
                  <select
                    value={newStep.projectId}
                    onChange={(e) => setNewStep({ ...newStep, projectId: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Sélectionner un projet</option>
                    {projects.map(project => (
                      <option key={project.id} value={project.id}>
                        {project.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Titre de l&apos;étape
                  </label>
                  <input
                    type="text"
                    value={newStep.title}
                    onChange={(e) => setNewStep({ ...newStep, title: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ex: Terminer la configuration"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Description (optionnel)
                  </label>
                  <textarea
                    value={newStep.description}
                    onChange={(e) => setNewStep({ ...newStep, description: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    rows={2}
                    placeholder="Description de l&apos;étape..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Priorité
                    </label>
                    <select
                      value={newStep.priority}
                      onChange={(e) => setNewStep({ ...newStep, priority: e.target.value as 'low' | 'medium' | 'high' })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="low">Faible</option>
                      <option value="medium">Normal</option>
                      <option value="high">Urgent</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Date limite (optionnel)
                    </label>
                    <input
                      type="date"
                      value={newStep.dueDate}
                      onChange={(e) => setNewStep({ ...newStep, dueDate: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

              </div>
              
              {/* Modal Footer */}
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 rounded-b-2xl">
                <div className="flex space-x-3">
                  <button
                    onClick={() => setIsAddStepModalOpen(false)}
                    className="flex-1 px-4 py-2 text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-1"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={addStep}
                    disabled={!newStep.title || !newStep.projectId}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                  >
                    Créer l&apos;étape
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Project Modal */}
        {isProjectModalOpen && selectedProject && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 md:p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-fade-in-up mobile-modal xs-mobile-modal">
              {/* Sticky Header */}
              <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-slate-200 p-6 z-10">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-2">
                      <h3 className="text-2xl font-bold text-slate-900">
                        {selectedProject.title}
                      </h3>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(selectedProject.category)}`}>
                        {getCategoryLabel(selectedProject.category)}
                      </span>
                    </div>
                    <p className="text-slate-600 text-sm">{selectedProject.description}</p>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => closeProjectModal()}
                      className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-1"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="overflow-y-auto max-h-[calc(90vh-140px)] p-6 pb-20 space-y-6">
                {/* Informations résumées */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-50 rounded-lg p-4">
                    <div className="flex items-center justify-between text-sm text-slate-700 mb-2">
                      <span>Progression</span>
                      <span className="font-semibold">{selectedProject.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-blue-400 to-blue-500 h-3 rounded-full transition-all duration-300 shadow-sm"
                        style={{ width: `${selectedProject.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="bg-slate-50 rounded-lg p-4">
                    <p className="flex items-center space-x-1 text-sm text-slate-600 mb-1">
                      <Calendar className="h-4 w-4" />
                      <span>Échéance: {selectedProject.targetDate.toLocaleDateString('fr-FR')}</span>
                    </p>
                    <p className="flex items-center space-x-1 text-sm text-slate-600">
                      <Clock className="h-4 w-4" />
                      <span>{Math.ceil((selectedProject.targetDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} jours restants</span>
                    </p>
                  </div>
                  
                  <div className="bg-slate-50 rounded-lg p-4">
                    <div className="flex items-center space-x-1 text-sm text-slate-600 mb-2">
                      {getStatusIcon(selectedProject.status)}
                      <span>{getStatusLabel(selectedProject.status)}</span>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(selectedProject.priority)}`}>
                      {selectedProject.priority === 'high' ? 'Urgent' : selectedProject.priority === 'medium' ? 'Normal' : 'Faible'}
                    </span>
                  </div>
                </div>

                {/* Étapes et Tâches avec Accordéons */}
                <div>
                  <h4 className="font-semibold text-slate-800 mb-3 flex items-center space-x-2">
                    <Trello className="h-4 w-4" />
                    <span>Étapes ({selectedProject.steps.filter(s => s.completed).length}/{selectedProject.steps.length})</span>
                  </h4>
                  <div className="space-y-3">
                    {selectedProject.steps.map((step, stepIndex) => {
                      const isStepModalExpanded = expandedSteps.has(`modal-${step.id}`);
                      const completedTasks = step.tasks.filter(t => t.completed).length;
                      
                      return (
                        <div 
                          key={step.id} 
                          className={`border border-slate-200 rounded-lg bg-white animate-modal-content-slide-in ${
                            stepIndex < 4 ? `accordion-item-delay-${stepIndex + 1}` : ''
                          }`}
                        >
                          {/* Step Header - Accordion Toggle */}
                          <button
                            onClick={() => {
                              const newExpandedSteps = new Set(expandedSteps);
                              if (newExpandedSteps.has(`modal-${step.id}`)) {
                                newExpandedSteps.delete(`modal-${step.id}`);
                              } else {
                                newExpandedSteps.add(`modal-${step.id}`);
                              }
                              setExpandedSteps(newExpandedSteps);
                            }}
                            className="w-full flex items-start space-x-3 p-4 text-left hover:bg-slate-50 transition-colors"
                          >
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleStep(selectedProject.id, step.id);
                              }}
                              className={`w-5 h-5 rounded-full flex items-center justify-center mt-0.5 transition-all duration-200 hover:scale-110 ${
                                step.completed ? 'bg-emerald-500' : 'border-2 border-slate-300 hover:border-emerald-500'
                              }`}
                              title={step.completed ? 'Marquer l\'étape comme non terminée' : 'Marquer toutes les tâches comme terminées'}
                            >
                              {step.completed && <CheckCircle className="h-3 w-3 text-white" />}
                            </button>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <p className={`font-medium ${step.completed ? 'text-slate-500 line-through' : 'text-slate-800'}`}>
                                    {step.title}
                                  </p>
                                  {step.description && (
                                    <p className="text-sm text-slate-600 mt-1">{step.description}</p>
                                  )}
                                  
                                  {/* Progress and metadata */}
                                  <div className="flex items-center space-x-4 mt-2">
                                    <div className="flex items-center space-x-2">
                                      <span className="text-xs text-slate-500">
                                        {completedTasks}/{step.tasks.length} tâches
                                      </span>
                                      <div className="w-20 bg-slate-200 rounded-full h-2">
                                        <div 
                                          className="bg-gradient-to-r from-blue-400 to-blue-500 h-2 rounded-full transition-all duration-300"
                                          style={{ width: `${step.progress}%` }}
                                        ></div>
                                      </div>
                                    </div>
                                    
                                    {step.dueDate && (
                                      <div className="flex items-center space-x-1 text-xs text-slate-500">
                                        <Calendar className="h-3 w-3" />
                                        <span>{step.dueDate.toLocaleDateString('fr-FR')}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                
                                <div className="flex items-center space-x-2 ml-4">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    step.priority === 'high' ? 'bg-rose-100 text-rose-600' :
                                    step.priority === 'medium' ? 'bg-orange-100 text-orange-600' :
                                    'bg-emerald-100 text-emerald-700'
                                  }`}>
                                    {step.priority === 'high' ? 'Urgent' : step.priority === 'medium' ? 'Normal' : 'Faible'}
                                  </span>
                                  
                                  {isStepModalExpanded ? (
                                    <ChevronUp className="h-4 w-4 text-slate-400" />
                                  ) : (
                                    <ChevronDown className="h-4 w-4 text-slate-400" />
                                  )}
                                </div>
                              </div>
                            </div>
                          </button>
                          
                          {/* Tasks within Step - Collapsible */}
                          {isStepModalExpanded && (
                            <div className="border-t border-slate-100 bg-slate-50">
                              <div className="p-4 space-y-2">
                                {step.tasks.length > 0 ? (
                                  step.tasks.map((task) => (
                                    <div key={task.id} className="flex items-start space-x-4 p-4 bg-white rounded-lg border border-slate-100">
                                      <button
                                        onClick={() => toggleTask(selectedProject.id, step.id, task.id)}
                                        className={`w-5 h-5 rounded-full flex items-center justify-center mt-0.5 transition-all duration-200 hover:scale-110 ${
                                          task.completed ? 'bg-emerald-500' : 'border-2 border-slate-300 hover:border-emerald-500'
                                        }`}
                                      >
                                        {task.completed && <CheckCircle className="h-3 w-3 text-white" />}
                                      </button>
                                      
                                      <div className="flex-1 min-w-0">
                                        <p className={`text-base font-medium ${task.completed ? 'text-slate-500 line-through' : 'text-slate-800'}`}>
                                          {task.title}
                                        </p>
                                        {task.description && (
                                          <p className="text-sm text-slate-600 mt-1">{task.description}</p>
                                        )}
                                        {task.dueDate && (
                                          <div className="flex items-center space-x-1 text-sm text-slate-600 mt-1">
                                            <Calendar className="h-3 w-3" />
                                            <span>{task.dueDate.toLocaleDateString('fr-FR')}</span>
                                          </div>
                                        )}
                                      </div>
                                      
                                      <div className="flex items-center space-x-2">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                          task.priority === 'high' ? 'bg-rose-100 text-rose-600' :
                                          task.priority === 'medium' ? 'bg-orange-100 text-orange-600' :
                                          'bg-emerald-100 text-emerald-700'
                                        }`}>
                                          {task.priority === 'high' ? 'H' : task.priority === 'medium' ? 'M' : 'L'}
                                        </span>
                                        <button
                                          onClick={() => deleteTask(selectedProject.id, step.id, task.id)}
                                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-all duration-200"
                                          title="Supprimer la tâche"
                                        >
                                          <Trash2 className="h-3 w-3" />
                                        </button>
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <p className="text-sm text-slate-500 text-center py-4">Aucune tâche pour cette étape</p>
                                )}
                                
                                {/* Bouton d'ajout de tâche */}
                                {addingTaskToStep === step.id ? (
                                  <div className="p-3 bg-white rounded-lg border border-slate-200">
                                    <div className="flex space-x-2">
                                      <input
                                        type="text"
                                        value={newTaskTitle}
                                        onChange={(e) => setNewTaskTitle(e.target.value)}
                                        placeholder="Titre de la nouvelle tâche..."
                                        className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
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
                                        className="px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                                      >
                                        Ajouter
                                      </button>
                                      <button
                                        onClick={() => {
                                          setNewTaskTitle('');
                                          setAddingTaskToStep(null);
                                        }}
                                        className="px-3 py-2 text-slate-600 border border-slate-300 text-sm rounded-md hover:bg-slate-50 transition-colors"
                                      >
                                        Annuler
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => setAddingTaskToStep(step.id)}
                                    className="w-full p-2 text-sm text-slate-600 border-2 border-dashed border-slate-300 rounded-lg hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
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
                </div>
              </div>

              {/* Sticky Footer */}
              <div className="sticky bottom-0 bg-white/95 backdrop-blur-sm border-t border-slate-200 p-6">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-slate-600">
                    {selectedProject.steps.length} étapes • {selectedProject.steps.flatMap(m => m.tasks).length} tâches
                  </div>
                  <button
                    onClick={() => closeProjectModal()}
                    className="px-4 py-2 text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-1"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal de création de projet */}
        {isCreateProjectModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 md:p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-fade-in-up mobile-modal xs-mobile-modal">
              {/* Modal Header */}
              <div className="p-6 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-slate-800">Nouveau projet</h3>
                  <button
                    onClick={() => setIsCreateProjectModalOpen(false)}
                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-1"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Titre du projet *
                  </label>
                  <input
                    type="text"
                    value={newProject.title}
                    onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ex: Créer mon portfolio"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                    placeholder="Description du projet..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Catégorie
                    </label>
                    <select
                      value={newProject.category}
                      onChange={(e) => setNewProject({ ...newProject, category: e.target.value as Project['category'] })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="career">Carrière</option>
                      <option value="learning">Apprentissage</option>
                      <option value="health">Santé</option>
                      <option value="personal">Personnel</option>
                      <option value="financial">Financier</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Priorité
                    </label>
                    <select
                      value={newProject.priority}
                      onChange={(e) => setNewProject({ ...newProject, priority: e.target.value as Project['priority'] })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="low">Faible</option>
                      <option value="medium">Normal</option>
                      <option value="high">Urgent</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Date d&apos;échéance *
                  </label>
                  <input
                    type="date"
                    value={newProject.targetDate}
                    onChange={(e) => setNewProject({ ...newProject, targetDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              {/* Modal Footer */}
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 rounded-b-2xl">
                <div className="flex space-x-3">
                  <button
                    onClick={() => setIsCreateProjectModalOpen(false)}
                    className="flex-1 px-4 py-2 text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-1"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={createProject}
                    disabled={!newProject.title || !newProject.targetDate}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                  >
                    Créer le projet
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal de confirmation de suppression */}
        {isDeleteConfirmOpen && projectToDelete && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 md:p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-fade-in-up mobile-modal xs-mobile-modal">
              {/* Modal Header */}
              <div className="p-6 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-slate-800">Confirmer la suppression</h3>
                  <button
                    onClick={() => setIsDeleteConfirmOpen(false)}
                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-1"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center">
                    <Trash2 className="h-6 w-6 text-rose-600" />
                  </div>
                  <div>
                    <p className="text-slate-800 font-medium">
                      Êtes-vous sûr de vouloir supprimer ce projet ?
                    </p>
                    <p className="text-slate-600 text-sm mt-1">
                      &quot;{projectToDelete.title}&quot;
                    </p>
                  </div>
                </div>
                <div className="bg-rose-50 border border-rose-200 rounded-lg p-4">
                  <p className="text-rose-700 text-sm">
                    ⚠️ Cette action est irréversible. Toutes les étapes et tâches associés seront définitivement supprimés.
                  </p>
                </div>
              </div>
              
              {/* Modal Footer */}
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 rounded-b-2xl">
                <div className="flex space-x-3">
                  <button
                    onClick={() => setIsDeleteConfirmOpen(false)}
                    className="flex-1 px-4 py-2 text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-1"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={() => deleteProject(projectToDelete.id)}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-rose-600 to-rose-700 text-white rounded-lg hover:from-rose-700 hover:to-rose-800 transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-1"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}