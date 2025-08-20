'use client';

import { useAuth } from '@/context/AuthContext';
import { redirect } from 'next/navigation';
import MainLayout from '@/components/Layout/MainLayout';
import { useState } from 'react';
import { useTestUser } from '@/hooks/useTestUser';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Edit, 
  Trash2, 
  Clock,
  User,
  BookOpen,
  AlertCircle,
  Calendar,
  Filter
} from 'lucide-react';

// Mock data pour les devoirs hebdomadaires
const mockDevoirsData = {
  currentWeek: "Semaine du 15 au 21 Janvier 2024",
  devoirs: [
    {
      id: '1',
      title: 'Exercices Mathématiques - Chapitre 5',
      subject: 'Mathématiques',
      type: 'homework',
      day: 'monday',
      dueTime: '08:00',
      teacher: 'M. Durand',
      color: 'bg-blue-500',
      description: 'Exercices 1 à 15 page 87',
      completed: false,
      difficulty: 'medium'
    },
    {
      id: '2',
      title: 'Rapport de TP Physique',
      subject: 'Physique-Chimie',
      type: 'report',
      day: 'tuesday',
      dueTime: '10:00',
      teacher: 'Mme. Martin',
      color: 'bg-green-500',
      description: 'Compte-rendu du TP optique',
      completed: true,
      difficulty: 'hard'
    },
    {
      id: '3',
      title: 'Dissertation Français',
      subject: 'Français',
      type: 'essay',
      day: 'tuesday',
      dueTime: '08:00',
      teacher: 'M. Petit',
      color: 'bg-purple-500',
      description: 'Sujet : "Le romantisme dans la littérature"',
      completed: false,
      difficulty: 'hard'
    },
    {
      id: '4',
      title: 'Révisions pour Contrôle Maths',
      subject: 'Mathématiques',
      type: 'study',
      day: 'tuesday',
      dueTime: '14:00',
      teacher: 'M. Durand',
      color: 'bg-red-500',
      description: 'Préparer le contrôle sur les fonctions',
      completed: false,
      difficulty: 'medium'
    },
    {
      id: '5',
      title: 'Présentation Anglais',
      subject: 'Anglais',
      type: 'presentation',
      day: 'wednesday',
      dueTime: '09:00',
      teacher: 'Mme. Smith',
      color: 'bg-orange-500',
      description: 'Présentation de 5 min sur un pays anglophone',
      completed: true,
      difficulty: 'medium'
    },
    {
      id: '6',
      title: 'Recherches Économie',
      subject: 'Économie',
      type: 'research',
      day: 'thursday',
      dueTime: '15:00',
      teacher: 'Mme. Dubois',
      color: 'bg-teal-500',
      description: 'Rechercher 3 articles sur l\'inflation',
      completed: false,
      difficulty: 'easy'
    },
    {
      id: '7',
      title: 'Exercices Histoire',
      subject: 'Histoire-Géographie',
      type: 'homework',
      day: 'friday',
      dueTime: '08:00',
      teacher: 'M. Moreau',
      color: 'bg-indigo-500',
      description: 'Questions chapitre Première Guerre mondiale',
      completed: false,
      difficulty: 'easy'
    },
    {
      id: '8',
      title: 'Fiche de lecture',
      subject: 'Français',
      type: 'reading',
      day: 'friday',
      dueTime: '14:00',
      teacher: 'M. Petit',
      color: 'bg-purple-500',
      description: 'Fiche de lecture "Le Rouge et le Noir"',
      completed: false,
      difficulty: 'medium'
    }
  ]
};

const daysOfWeek = [
  { key: 'monday', label: 'Lundi', shortLabel: 'Lun' },
  { key: 'tuesday', label: 'Mardi', shortLabel: 'Mar' },
  { key: 'wednesday', label: 'Mercredi', shortLabel: 'Mer' },
  { key: 'thursday', label: 'Jeudi', shortLabel: 'Jeu' },
  { key: 'friday', label: 'Vendredi', shortLabel: 'Ven' },
  { key: 'saturday', label: 'Samedi', shortLabel: 'Sam' },
  { key: 'sunday', label: 'Dimanche', shortLabel: 'Dim' }
];

const typeLabels: Record<string, string> = {
  homework: 'Exercice',
  report: 'Rapport',
  essay: 'Rédaction',
  study: 'Révisions',
  presentation: 'Exposé',
  research: 'Recherches',
  reading: 'Lecture'
};

const typeIcons: Record<string, React.ComponentType<{className?: string}>> = {
  homework: BookOpen,
  report: BookOpen,
  essay: BookOpen,
  study: AlertCircle,
  presentation: User,
  research: BookOpen,
  reading: BookOpen
};


export default function DevoirsPage() {
  const { user, logout } = useAuth();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const { isTestUser } = useTestUser(user);

  if (!user) {
    redirect('/');
  }

  // Utilisateur test : interface normale mais données vides (sera géré par le composant)

  if (user.role === 'admin') {
    return (
      <MainLayout user={user} onLogout={logout}>
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Gestion des devoirs</h1>
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

  const getDevoirsForDay = (day: string) => {
    // Utilisateur test : renvoyer liste vide
    if (isTestUser) {
      return [];
    }
    return mockDevoirsData.devoirs.filter(devoir => 
      devoir.day === day && (selectedFilter === 'all' || devoir.type === selectedFilter)
    ).sort((a, b) => a.dueTime.localeCompare(b.dueTime));
  };

  const formatTime = (time: string) => {
    return `À rendre pour ${time}`;
  };

  const getDayDate = (dayKey: string) => {
    const dates: Record<string, string> = {
      monday: '15',
      tuesday: '16', 
      wednesday: '17',
      thursday: '18',
      friday: '19',
      saturday: '20',
      sunday: '21'
    };
    return dates[dayKey] || '';
  };


  return (
    <MainLayout user={user} onLogout={logout}>
      <div className="space-y-6">
        
        {/* Header avec navigation et filtres */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Mes devoirs</h1>
              <p className="text-gray-600">{mockDevoirsData.currentWeek}</p>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Navigation semaine */}
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button className="px-4 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                  Semaine actuelle
                </button>
                <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>

              {/* Bouton ajouter */}
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors">
                <Plus className="h-4 w-4" />
                <span>Nouveau devoir</span>
              </button>
            </div>
          </div>

          {/* Filtres */}
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-500" />
            <div className="flex space-x-2">
              <button 
                onClick={() => setSelectedFilter('all')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  selectedFilter === 'all' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Tous
              </button>
              <button 
                onClick={() => setSelectedFilter('homework')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  selectedFilter === 'homework' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Exercice
              </button>
              <button 
                onClick={() => setSelectedFilter('exam')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  selectedFilter === 'exam' ? 'bg-red-100 text-red-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Évaluation
              </button>
              <button 
                onClick={() => setSelectedFilter('project')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  selectedFilter === 'project' ? 'bg-green-100 text-green-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Travail en groupe
              </button>
            </div>
          </div>
        </div>

        {/* Vue devoirs hebdomadaire */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
            
            {daysOfWeek.map((day) => {
              const dayDevoirs = getDevoirsForDay(day.key);
              const isWeekend = day.key === 'saturday' || day.key === 'sunday';
              
              return (
                <div key={day.key} className={`${isWeekend ? 'opacity-60' : ''}`}>
                  {/* Header du jour */}
                  <div className="text-center mb-4 pb-3 border-b border-gray-200">
                    <div className="font-semibold text-gray-900 mb-1">{day.label}</div>
                    <div className={`text-xl font-bold w-8 h-8 mx-auto rounded-full flex items-center justify-center ${
                      day.key === 'tuesday' ? 'bg-blue-500 text-white' : 'text-gray-600'
                    }`}>
                      {getDayDate(day.key)}
                    </div>
                  </div>

                  {/* Devoirs du jour */}
                  <div className="space-y-2">
                    {dayDevoirs.length === 0 ? (
                      <div className="p-4 text-center text-gray-500 bg-gray-50 rounded-lg">
                        <Calendar className="h-6 w-6 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm">Aucun devoir</p>
                      </div>
                    ) : (
                      dayDevoirs.map((devoir) => {
                        const IconComponent = typeIcons[devoir.type];
                        return (
                          <div key={devoir.id} className={`${devoir.color} rounded-lg p-3 text-white shadow-sm group relative`}>
                            {/* Contenu du devoir */}
                            <div className="mb-2">
                              <div className="flex items-center space-x-2 mb-2">
                                <IconComponent className="h-4 w-4" />
                                <span className="text-xs font-medium uppercase tracking-wide opacity-90">
                                  {typeLabels[devoir.type]}
                                </span>
                              </div>
                              <h3 className={`font-semibold text-sm leading-tight ${devoir.completed ? 'line-through opacity-75' : ''}`}>
                                {devoir.title}
                              </h3>
                            </div>

                            {/* Informations détaillées */}
                            <div className="space-y-1 text-xs opacity-90">
                              <div className="flex items-center space-x-1">
                                <Clock className="h-3 w-3" />
                                <span>{formatTime(devoir.dueTime)}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <BookOpen className="h-3 w-3" />
                                <span>{devoir.subject}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <User className="h-3 w-3" />
                                <span>{devoir.teacher}</span>
                              </div>
                            </div>

                            {/* Boutons d'action */}
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                              <button 
                                className="p-1 bg-white/20 hover:bg-white/30 rounded transition-colors"
                                title="Modifier"
                              >
                                <Edit className="h-3 w-3" />
                              </button>
                              <button 
                                className="p-1 bg-white/20 hover:bg-red-500 rounded transition-colors"
                                title="Supprimer"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>

                            {/* Description (au survol) */}
                            {devoir.description && (
                              <div className="absolute bottom-full left-0 right-0 mb-2 p-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                                {devoir.description}
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
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