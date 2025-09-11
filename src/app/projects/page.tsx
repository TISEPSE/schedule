'use client';

import { useAuth } from '@/context/AuthContext';
import { redirect } from 'next/navigation';
import MainLayout from '@/components/Layout/MainLayout';
import { BookOpen, Plus, Clock, CheckCircle, Circle, Calendar } from 'lucide-react';
import { useState } from 'react';

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'on-hold';
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  progress: number; // 0-100
  tasks: Task[];
  timeSpent: number; // en minutes
}

interface Task {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: Date;
}

export default function ProjectsPage() {
  const { user, logout } = useAuth();
  const [projects] = useState<Project[]>([
    {
      id: '1',
      name: 'Site Web Portfolio',
      description: 'Création de mon portfolio personnel avec Next.js et TypeScript',
      status: 'active',
      priority: 'high',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // dans 7 jours
      progress: 75,
      timeSpent: 1200, // 20 heures
      tasks: [
        { id: '1', title: 'Design de l\'interface', completed: true },
        { id: '2', title: 'Développement des composants', completed: true },
        { id: '3', title: 'Intégration du contenu', completed: false, dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) },
        { id: '4', title: 'Tests et déploiement', completed: false },
      ],
    },
    {
      id: '2',
      name: 'Apprentissage React Native',
      description: 'Formation complète sur le développement mobile avec React Native',
      status: 'active',
      priority: 'medium',
      progress: 40,
      timeSpent: 480, // 8 heures
      tasks: [
        { id: '5', title: 'Introduction aux concepts de base', completed: true },
        { id: '6', title: 'Création de la première app', completed: true },
        { id: '7', title: 'Navigation et routing', completed: false },
        { id: '8', title: 'Gestion de l\'état', completed: false },
      ],
    },
    {
      id: '3',
      name: 'Blog Personnel',
      description: 'Blog avec système de gestion de contenu personnalisé',
      status: 'completed',
      priority: 'low',
      progress: 100,
      timeSpent: 960, // 16 heures
      tasks: [
        { id: '9', title: 'Setup initial', completed: true },
        { id: '10', title: 'Système d\'articles', completed: true },
        { id: '11', title: 'Interface d\'administration', completed: true },
        { id: '12', title: 'Déploiement', completed: true },
      ],
    },
  ]);

  if (!user || user.role !== 'personal') {
    redirect('/');
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${minutes % 60}m`;
  };

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'on-hold': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: Project['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-orange-100 text-orange-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: Project['status']) => {
    switch (status) {
      case 'active': return 'Actif';
      case 'completed': return 'Terminé';
      case 'on-hold': return 'En pause';
    }
  };

  const getPriorityLabel = (priority: Project['priority']) => {
    switch (priority) {
      case 'high': return 'Haute';
      case 'medium': return 'Moyenne';
      case 'low': return 'Basse';
    }
  };

  return (
    <MainLayout user={user} onLogout={logout}>
      <div className="space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Mes Projets</h1>
              <p className="text-gray-600">Gérez vos projets personnels et suivez leur progression</p>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
              <Plus className="h-4 w-4" />
              <span>Nouveau projet</span>
            </button>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Total</span>
              </div>
              <p className="text-2xl font-bold text-blue-600 mt-1">{projects.length}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-green-900">Terminés</span>
              </div>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {projects.filter(p => p.status === 'completed').length}
              </p>
            </div>
            <div className="bg-orange-50 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Circle className="h-5 w-5 text-orange-600" />
                <span className="text-sm font-medium text-orange-900">En cours</span>
              </div>
              <p className="text-2xl font-bold text-orange-600 mt-1">
                {projects.filter(p => p.status === 'active').length}
              </p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-purple-600" />
                <span className="text-sm font-medium text-purple-900">Temps total</span>
              </div>
              <p className="text-2xl font-bold text-purple-600 mt-1">
                {formatDuration(projects.reduce((total, p) => total + p.timeSpent, 0))}
              </p>
            </div>
          </div>

          {/* Liste des projets */}
          <div className="space-y-4">
            {projects.map((project) => (
              <div key={project.id} className="border rounded-lg p-6 hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                        {getStatusLabel(project.status)}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(project.priority)}`}>
                        {getPriorityLabel(project.priority)}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{project.description}</p>
                    
                    {/* Barre de progression */}
                    <div className="mb-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-600">Progression</span>
                        <span className="text-sm font-medium text-gray-900">{project.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right ml-6">
                    <div className="flex items-center space-x-2 text-sm text-gray-500 mb-1">
                      <Clock className="h-4 w-4" />
                      <span>{formatDuration(project.timeSpent)}</span>
                    </div>
                    {project.dueDate && (
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Calendar className="h-4 w-4" />
                        <span>{project.dueDate.toLocaleDateString('fr-FR')}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Tâches */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">
                    Tâches ({project.tasks.filter(t => t.completed).length}/{project.tasks.length})
                  </h4>
                  {project.tasks.slice(0, 3).map((task) => (
                    <div key={task.id} className="flex items-center space-x-3">
                      {task.completed ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <Circle className="h-4 w-4 text-gray-400" />
                      )}
                      <span className={`text-sm ${task.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                        {task.title}
                      </span>
                      {task.dueDate && !task.completed && (
                        <span className="text-xs text-orange-500">
                          Échéance: {task.dueDate.toLocaleDateString('fr-FR')}
                        </span>
                      )}
                    </div>
                  ))}
                  {project.tasks.length > 3 && (
                    <p className="text-xs text-gray-500">+{project.tasks.length - 3} autres tâches</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}