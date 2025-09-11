'use client';

import { useState } from 'react';
import { Plus, X, Clock, Target, BookOpen, Zap, Save } from 'lucide-react';
import { UserRole } from '@/types';
import { LucideIcon } from 'lucide-react';

interface QuickTaskCreatorProps {
  userRole: UserRole;
}

interface TaskTemplate {
  id: string;
  title: string;
  icon: LucideIcon;
  color: string;
  defaultTitle: string;
  defaultDescription: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  estimatedTime?: number; // en minutes
}

export default function QuickTaskCreator({ userRole }: QuickTaskCreatorProps) {
  const [showModal, setShowModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<TaskTemplate | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    estimatedTime: 60,
  });

  const templates: Record<UserRole, TaskTemplate[]> = {
    student: [
      {
        id: 'homework',
        title: 'Devoir',
        icon: BookOpen,
        color: 'bg-blue-500',
        defaultTitle: 'Devoir de [Matière]',
        defaultDescription: 'Terminer les exercices pages...',
        category: 'homework',
        priority: 'medium',
        estimatedTime: 120,
      },
      {
        id: 'exam-prep',
        title: 'Révisions',
        icon: Target,
        color: 'bg-purple-500',
        defaultTitle: 'Révisions [Matière]',
        defaultDescription: 'Réviser le chapitre sur...',
        category: 'study',
        priority: 'high',
        estimatedTime: 180,
      },
      {
        id: 'project',
        title: 'Projet',
        icon: Zap,
        color: 'bg-orange-500',
        defaultTitle: 'Projet [Nom]',
        defaultDescription: 'Avancer sur la partie...',
        category: 'project',
        priority: 'medium',
        estimatedTime: 240,
      },
      {
        id: 'reading',
        title: 'Lecture',
        icon: BookOpen,
        color: 'bg-green-500',
        defaultTitle: 'Lecture obligatoire',
        defaultDescription: 'Lire les chapitres...',
        category: 'reading',
        priority: 'low',
        estimatedTime: 90,
      },
    ],
    personal: [
      {
        id: 'quick-task',
        title: 'Tâche rapide',
        icon: Zap,
        color: 'bg-yellow-500',
        defaultTitle: 'Tâche rapide',
        defaultDescription: 'À faire rapidement...',
        category: 'general',
        priority: 'medium',
        estimatedTime: 30,
      },
      {
        id: 'project-work',
        title: 'Travail projet',
        icon: Target,
        color: 'bg-blue-500',
        defaultTitle: 'Travail sur [Projet]',
        defaultDescription: 'Avancer sur...',
        category: 'project',
        priority: 'high',
        estimatedTime: 120,
      },
      {
        id: 'learning',
        title: 'Apprentissage',
        icon: BookOpen,
        color: 'bg-green-500',
        defaultTitle: 'Apprendre [Sujet]',
        defaultDescription: 'Étudier et pratiquer...',
        category: 'learning',
        priority: 'medium',
        estimatedTime: 90,
      },
      {
        id: 'admin-task',
        title: 'Tâche admin',
        icon: Clock,
        color: 'bg-gray-500',
        defaultTitle: 'Tâche administrative',
        defaultDescription: 'Gérer/organiser...',
        category: 'admin',
        priority: 'low',
        estimatedTime: 45,
      },
    ],
    admin: [
      {
        id: 'user-management',
        title: 'Gestion utilisateurs',
        icon: Target,
        color: 'bg-blue-500',
        defaultTitle: 'Gestion des utilisateurs',
        defaultDescription: 'Traiter les demandes...',
        category: 'management',
        priority: 'high',
        estimatedTime: 60,
      },
      {
        id: 'system-maintenance',
        title: 'Maintenance système',
        icon: Zap,
        color: 'bg-red-500',
        defaultTitle: 'Maintenance système',
        defaultDescription: 'Vérifier et maintenir...',
        category: 'technical',
        priority: 'high',
        estimatedTime: 180,
      },
      {
        id: 'report-review',
        title: 'Révision rapport',
        icon: BookOpen,
        color: 'bg-purple-500',
        defaultTitle: 'Révision de rapport',
        defaultDescription: 'Analyser et valider...',
        category: 'review',
        priority: 'medium',
        estimatedTime: 90,
      },
    ],
  };

  const userTemplates = templates[userRole] || [];

  const handleTemplateSelect = (template: TaskTemplate) => {
    setSelectedTemplate(template);
    setFormData({
      title: template.defaultTitle,
      description: template.defaultDescription,
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Tomorrow
      priority: template.priority,
      estimatedTime: template.estimatedTime || 60,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would integrate with your task management system
    console.log('Creating task:', {
      ...formData,
      template: selectedTemplate?.id,
      category: selectedTemplate?.category,
    });
    
    // Reset form and close modal
    setFormData({
      title: '',
      description: '',
      dueDate: '',
      priority: 'medium',
      estimatedTime: 60,
    });
    setSelectedTemplate(null);
    setShowModal(false);
    
    // Show success notification (you could add toast here)
    alert('Tâche créée avec succès !');
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <>
      {/* Quick create button in dashboard */}
      <button
        onClick={() => setShowModal(true)}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-4 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 shadow-sm hover:shadow-md"
      >
        <Plus className="h-5 w-5" />
        <span className="font-medium">Création rapide</span>
        <kbd className="ml-2 px-1.5 py-0.5 text-xs bg-white bg-opacity-20 rounded text-white">
          Ctrl+N
        </kbd>
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Création rapide</h2>
                <p className="text-gray-600 text-sm">Choisissez un modèle pour commencer</p>
              </div>
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedTemplate(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {!selectedTemplate ? (
              // Template selection
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userTemplates.map((template) => {
                    const Icon = template.icon;
                    return (
                      <button
                        key={template.id}
                        onClick={() => handleTemplateSelect(template)}
                        className="p-6 border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-sm transition-all duration-200 text-left group"
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`${template.color} p-3 rounded-lg text-white`}>
                            <Icon className="h-6 w-6" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">{template.title}</h3>
                            <p className="text-sm text-gray-600 mb-2">{template.defaultTitle}</p>
                            <div className="flex items-center space-x-2 text-xs text-gray-500">
                              <Clock className="h-3 w-3" />
                              <span>{template.estimatedTime}min</span>
                              <span className={`px-2 py-1 rounded-full border ${getPriorityColor(template.priority)}`}>
                                {template.priority === 'high' ? 'Haute' : 
                                 template.priority === 'medium' ? 'Moyenne' : 'Basse'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              // Task creation form
              <div className="p-6 overflow-y-auto max-h-[70vh]">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Titre de la tâche
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nom de la tâche..."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      rows={3}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Description détaillée..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Échéance
                      </label>
                      <input
                        type="date"
                        value={formData.dueDate}
                        onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Priorité
                      </label>
                      <select
                        value={formData.priority}
                        onChange={(e) => setFormData({...formData, priority: e.target.value as 'low' | 'medium' | 'high'})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="low">Basse</option>
                        <option value="medium">Moyenne</option>
                        <option value="high">Haute</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Temps estimé (min)
                      </label>
                      <input
                        type="number"
                        value={formData.estimatedTime}
                        onChange={(e) => setFormData({...formData, estimatedTime: parseInt(e.target.value)})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min="5"
                        step="5"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <button
                      type="button"
                      onClick={() => setSelectedTemplate(null)}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      ← Retour aux modèles
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                    >
                      <Save className="h-4 w-4" />
                      <span>Créer la tâche</span>
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}