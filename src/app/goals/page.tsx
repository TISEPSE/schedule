'use client';

import { useAuth } from '@/context/AuthContext';
import { redirect } from 'next/navigation';
import MainLayout from '@/components/Layout/MainLayout';
import { Target, Plus, Calendar, TrendingUp, CheckCircle, AlertCircle, Clock, Play } from 'lucide-react';
import { useState } from 'react';

interface Goal {
  id: string;
  title: string;
  description: string;
  category: 'career' | 'learning' | 'health' | 'personal' | 'financial';
  priority: 'low' | 'medium' | 'high';
  targetDate: Date;
  status: 'not-started' | 'in-progress' | 'completed' | 'overdue';
  progress: number; // 0-100
  milestones: Milestone[];
  createdAt: Date;
}

interface Milestone {
  id: string;
  title: string;
  completed: boolean;
  completedAt?: Date;
}

export default function GoalsPage() {
  const { user, logout } = useAuth();
  const [goals] = useState<Goal[]>([
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
      milestones: [
        { id: '1', title: 'Configuration de base', completed: true, completedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) },
        { id: '2', title: 'App Router avancé', completed: true, completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
        { id: '3', title: 'Server Components', completed: false },
        { id: '4', title: 'Optimisation des performances', completed: false },
        { id: '5', title: 'Projet final', completed: false },
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
      milestones: [
        { id: '6', title: 'Inscription à 3 meetups', completed: true, completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
        { id: '7', title: 'Participation à un événement', completed: false },
        { id: '8', title: '10 nouvelles connexions LinkedIn', completed: false },
        { id: '9', title: 'Présentation ou talk', completed: false },
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
      milestones: [
        { id: '10', title: 'Validation de l\'idée', completed: false },
        { id: '11', title: 'MVP développé', completed: false },
        { id: '12', title: 'Premiers utilisateurs', completed: false },
        { id: '13', title: 'Premier revenu', completed: false },
      ],
    },
  ]);

  if (!user || user.role !== 'personal') {
    redirect('/');
  }

  const getCategoryLabel = (category: Goal['category']) => {
    switch (category) {
      case 'career': return 'Carrière';
      case 'learning': return 'Apprentissage';
      case 'health': return 'Santé';
      case 'personal': return 'Personnel';
      case 'financial': return 'Financier';
      default: return 'Autre';
    }
  };

  const getCategoryColor = (category: Goal['category']) => {
    switch (category) {
      case 'career': return 'bg-blue-100 text-blue-800';
      case 'learning': return 'bg-green-100 text-green-800';
      case 'health': return 'bg-red-100 text-red-800';
      case 'personal': return 'bg-purple-100 text-purple-800';
      case 'financial': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: Goal['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'in-progress': return <Clock className="h-5 w-5 text-blue-500" />;
      case 'overdue': return <AlertCircle className="h-5 w-5 text-red-500" />;
      default: return <Play className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusLabel = (status: Goal['status']) => {
    switch (status) {
      case 'completed': return 'Terminé';
      case 'in-progress': return 'En cours';
      case 'overdue': return 'En retard';
      case 'not-started': return 'Pas commencé';
    }
  };

  const getDaysRemaining = (targetDate: Date) => {
    const today = new Date();
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <MainLayout user={user} onLogout={logout}>
      <div className="space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Mes Objectifs</h1>
              <p className="text-gray-600">Définissez et suivez vos objectifs personnels et professionnels</p>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
              <Plus className="h-4 w-4" />
              <span>Nouvel objectif</span>
            </button>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Total</span>
              </div>
              <p className="text-2xl font-bold text-blue-600 mt-1">{goals.length}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-green-900">Terminés</span>
              </div>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {goals.filter(g => g.status === 'completed').length}
              </p>
            </div>
            <div className="bg-orange-50 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-orange-600" />
                <span className="text-sm font-medium text-orange-900">En cours</span>
              </div>
              <p className="text-2xl font-bold text-orange-600 mt-1">
                {goals.filter(g => g.status === 'in-progress').length}
              </p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-purple-600" />
                <span className="text-sm font-medium text-purple-900">Ce mois-ci</span>
              </div>
              <p className="text-2xl font-bold text-purple-600 mt-1">
                {goals.filter(g => {
                  const daysRemaining = getDaysRemaining(g.targetDate);
                  return daysRemaining <= 30 && daysRemaining > 0;
                }).length}
              </p>
            </div>
          </div>

          {/* Liste des objectifs */}
          <div className="space-y-4">
            {goals.map((goal) => {
              const daysRemaining = getDaysRemaining(goal.targetDate);
              const isOverdue = daysRemaining < 0;
              
              return (
                <div key={goal.id} className="border rounded-lg p-6 hover:shadow-sm transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{goal.title}</h3>
                        <div className="flex items-center space-x-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(goal.category)}`}>
                            {getCategoryLabel(goal.category)}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            goal.priority === 'high' ? 'bg-red-100 text-red-800' :
                            goal.priority === 'medium' ? 'bg-orange-100 text-orange-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {goal.priority === 'high' ? 'Haute' : goal.priority === 'medium' ? 'Moyenne' : 'Basse'}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-3">{goal.description}</p>
                      
                      {/* Barre de progression */}
                      <div className="mb-3">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-gray-600">Progression</span>
                          <span className="text-sm font-medium text-gray-900">{goal.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${
                              goal.status === 'completed' ? 'bg-green-500' : 
                              goal.status === 'overdue' ? 'bg-red-500' : 'bg-blue-600'
                            }`}
                            style={{ width: `${goal.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right ml-6">
                      <div className="flex items-center justify-end space-x-2 mb-1">
                        {getStatusIcon(goal.status)}
                        <span className="text-sm font-medium text-gray-900">{getStatusLabel(goal.status)}</span>
                      </div>
                      <div className={`text-sm ${isOverdue ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
                        {isOverdue ? `En retard de ${Math.abs(daysRemaining)} jours` : 
                         daysRemaining === 0 ? 'Échéance aujourd\'hui' :
                         `${daysRemaining} jours restants`}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        Échéance: {goal.targetDate.toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                  </div>

                  {/* Jalons */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      Jalons ({goal.milestones.filter(m => m.completed).length}/{goal.milestones.length})
                    </h4>
                    {goal.milestones.map((milestone) => (
                      <div key={milestone.id} className="flex items-center space-x-3">
                        {milestone.completed ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <div className="h-4 w-4 rounded-full border-2 border-gray-300"></div>
                        )}
                        <span className={`text-sm ${milestone.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                          {milestone.title}
                        </span>
                        {milestone.completedAt && (
                          <span className="text-xs text-gray-400">
                            {milestone.completedAt.toLocaleDateString('fr-FR')}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}