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
  MapPin,
  User,
  BookOpen,
  AlertCircle,
  Calendar,
  Filter
} from 'lucide-react';

// Mock data pour le planning hebdomadaire
const mockPlanningData = {
  currentWeek: "Semaine du 15 au 21 Janvier 2024",
  events: [
    {
      id: '1',
      title: 'Mathématiques - Analyse',
      type: 'course',
      day: 'monday',
      startTime: '08:00',
      endTime: '10:00',
      location: 'Salle 201',
      teacher: 'M. Durand',
      color: 'bg-blue-500',
      description: 'Cours sur les limites et dérivées'
    },
    {
      id: '2',
      title: 'Physique - TP',
      type: 'practical',
      day: 'monday',
      startTime: '10:15',
      endTime: '12:15',
      location: 'Laboratoire A',
      teacher: 'Mme. Martin',
      color: 'bg-green-500',
      description: 'Travaux pratiques optique'
    },
    {
      id: '3',
      title: 'Français - Expression écrite',
      type: 'course',
      day: 'tuesday',
      startTime: '08:00',
      endTime: '09:00',
      location: 'Salle 105',
      teacher: 'M. Petit',
      color: 'bg-purple-500',
      description: 'Dissertation littéraire'
    },
    {
      id: '4',
      title: 'Contrôle Mathématiques',
      type: 'exam',
      day: 'tuesday',
      startTime: '14:00',
      endTime: '16:00',
      location: 'Amphithéâtre',
      teacher: 'M. Durand',
      color: 'bg-red-500',
      description: 'Évaluation sur les fonctions'
    },
    {
      id: '5',
      title: 'Anglais - Oral',
      type: 'course',
      day: 'wednesday',
      startTime: '09:00',
      endTime: '10:00',
      location: 'Salle 302',
      teacher: 'Mme. Smith',
      color: 'bg-orange-500',
      description: 'Présentation en anglais'
    },
    {
      id: '6',
      title: 'Projet Groupe - Soutenance',
      type: 'project',
      day: 'thursday',
      startTime: '15:00',
      endTime: '17:00',
      location: 'Salle 210',
      teacher: 'Mme. Dubois',
      color: 'bg-teal-500',
      description: 'Présentation projet économie'
    },
    {
      id: '7',
      title: 'Sport - Volleyball',
      type: 'sport',
      day: 'friday',
      startTime: '08:00',
      endTime: '10:00',
      location: 'Gymnase',
      teacher: 'M. Moreau',
      color: 'bg-indigo-500',
      description: 'Cours d\'éducation physique'
    },
    {
      id: '8',
      title: 'Révisions Physique',
      type: 'study',
      day: 'friday',
      startTime: '14:00',
      endTime: '16:00',
      location: 'Bibliothèque',
      teacher: 'Autonome',
      color: 'bg-gray-500',
      description: 'Travail personnel'
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
  course: 'Cours',
  practical: 'TP',
  exam: 'Contrôle',
  project: 'Projet', 
  sport: 'Sport',
  study: 'Révision'
};

const typeIcons: Record<string, React.ComponentType<{className?: string}>> = {
  course: BookOpen,
  practical: AlertCircle,
  exam: AlertCircle,
  project: User,
  sport: User,
  study: BookOpen
};

export default function PlanningPage() {
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
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Gestion des plannings</h1>
            <div className="bg-gray-50 rounded-xl p-8 text-center">
              <p className="text-gray-600">
                Gérez les plannings de tous les étudiants et créez de nouveaux événements.
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Fonctionnalités prévues : création d&apos;événements, gestion globale, templates...
              </p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  const getEventsForDay = (day: string) => {
    // Utilisateur test : renvoyer liste vide
    if (isTestUser) {
      return [];
    }
    return mockPlanningData.events.filter(event => 
      event.day === day && (selectedFilter === 'all' || event.type === selectedFilter)
    ).sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  const formatTime = (time: string) => {
    return time;
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Mon planning</h1>
              <p className="text-gray-600">{mockPlanningData.currentWeek}</p>
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
                <span>Nouvel événement</span>
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
                Tout
              </button>
              <button 
                onClick={() => setSelectedFilter('course')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  selectedFilter === 'course' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Cours
              </button>
              <button 
                onClick={() => setSelectedFilter('exam')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  selectedFilter === 'exam' ? 'bg-red-100 text-red-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Contrôles
              </button>
              <button 
                onClick={() => setSelectedFilter('project')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  selectedFilter === 'project' ? 'bg-teal-100 text-teal-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Projets
              </button>
            </div>
          </div>
        </div>

        {/* Vue planning hebdomadaire */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
            
            {daysOfWeek.map((day) => {
              const dayEvents = getEventsForDay(day.key);
              const isWeekend = day.key === 'saturday' || day.key === 'sunday';
              
              return (
                <div key={day.key} className={`${isWeekend ? 'opacity-60' : ''}`}>
                  {/* Header du jour */}
                  <div className="text-center mb-4 pb-3 border-b border-gray-200">
                    <div className="font-semibold text-gray-900 mb-1">{day.label}</div>
                    <div className={`text-2xl font-bold w-10 h-10 mx-auto rounded-full flex items-center justify-center ${
                      day.key === 'tuesday' ? 'bg-blue-500 text-white' : 'text-gray-600'
                    }`}>
                      {getDayDate(day.key)}
                    </div>
                  </div>

                  {/* Événements du jour */}
                  <div className="space-y-2">
                    {dayEvents.length === 0 ? (
                      <div className="p-4 text-center text-gray-500 bg-gray-50 rounded-lg">
                        <Calendar className="h-6 w-6 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm">Aucun événement</p>
                      </div>
                    ) : (
                      dayEvents.map((event) => {
                        const IconComponent = typeIcons[event.type];
                        return (
                          <div key={event.id} className={`${event.color} rounded-lg p-3 text-white shadow-sm group relative`}>
                            {/* Contenu de l'événement */}
                            <div className="mb-2">
                              <div className="flex items-center space-x-2 mb-1">
                                <IconComponent className="h-4 w-4" />
                                <span className="text-xs font-medium uppercase tracking-wide opacity-90">
                                  {typeLabels[event.type]}
                                </span>
                              </div>
                              <h3 className="font-semibold text-sm leading-tight">{event.title}</h3>
                            </div>

                            {/* Informations détaillées */}
                            <div className="space-y-1 text-xs opacity-90">
                              <div className="flex items-center space-x-1">
                                <Clock className="h-3 w-3" />
                                <span>{formatTime(event.startTime)} - {formatTime(event.endTime)}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <MapPin className="h-3 w-3" />
                                <span>{event.location}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <User className="h-3 w-3" />
                                <span>{event.teacher}</span>
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
                            {event.description && (
                              <div className="absolute bottom-full left-0 right-0 mb-2 p-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                                {event.description}
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

        {/* Statistiques de la semaine */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-2xl p-6 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {mockPlanningData.events.filter(e => e.type === 'course').length}
            </div>
            <div className="text-sm font-medium text-blue-700">Cours cette semaine</div>
          </div>
          
          <div className="bg-red-50 rounded-2xl p-6 text-center">
            <div className="text-2xl font-bold text-red-600 mb-1">
              {mockPlanningData.events.filter(e => e.type === 'exam').length}
            </div>
            <div className="text-sm font-medium text-red-700">Contrôles à venir</div>
          </div>
          
          <div className="bg-green-50 rounded-2xl p-6 text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {mockPlanningData.events.filter(e => e.type === 'practical').length}
            </div>
            <div className="text-sm font-medium text-green-700">Travaux pratiques</div>
          </div>
          
          <div className="bg-purple-50 rounded-2xl p-6 text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {mockPlanningData.events.length}
            </div>
            <div className="text-sm font-medium text-purple-700">Total événements</div>
          </div>
        </div>

      </div>
    </MainLayout>
  );
}