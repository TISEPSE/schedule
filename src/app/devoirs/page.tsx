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
  Filter,
  CheckCircle,
  Circle,
  Star,
  TrendingUp,
  CalendarDays,
  Search,
  SortAsc,
  Archive
} from 'lucide-react';

// Mock data pour les devoirs - structure améliorée
const mockDevoirsData = {
  currentWeek: "Semaine du 15 au 21 Janvier 2024",
  devoirs: [
    {
      id: '1',
      title: 'Exercices Mathématiques - Chapitre 5',
      subject: 'Mathématiques',
      type: 'homework',
      dueDate: '2024-01-15',
      dueTime: '08:00',
      teacher: 'M. Durand',
      description: 'Exercices 1 à 15 page 87',
      completed: false,
      priority: 'medium',
      estimatedTime: 60,
      createdDate: '2024-01-10'
    },
    {
      id: '2',
      title: 'Rapport de TP Physique',
      subject: 'Physique-Chimie',
      type: 'report',
      dueDate: '2024-01-16',
      dueTime: '10:00',
      teacher: 'Mme. Martin',
      description: 'Compte-rendu du TP optique',
      completed: true,
      priority: 'high',
      estimatedTime: 120,
      createdDate: '2024-01-08'
    },
    {
      id: '3',
      title: 'Dissertation Français',
      subject: 'Français',
      type: 'essay',
      dueDate: '2024-01-16',
      dueTime: '08:00',
      teacher: 'M. Petit',
      description: 'Sujet : "Le romantisme dans la littérature"',
      completed: false,
      priority: 'high',
      estimatedTime: 180,
      createdDate: '2024-01-05'
    },
    {
      id: '4',
      title: 'Révisions pour Contrôle Maths',
      subject: 'Mathématiques',
      type: 'study',
      dueDate: '2024-01-16',
      dueTime: '14:00',
      teacher: 'M. Durand',
      description: 'Préparer le contrôle sur les fonctions',
      completed: false,
      priority: 'high',
      estimatedTime: 90,
      createdDate: '2024-01-12'
    },
    {
      id: '5',
      title: 'Présentation Anglais',
      subject: 'Anglais',
      type: 'presentation',
      dueDate: '2024-01-17',
      dueTime: '09:00',
      teacher: 'Mme. Smith',
      description: 'Présentation de 5 min sur un pays anglophone',
      completed: true,
      priority: 'medium',
      estimatedTime: 45,
      createdDate: '2024-01-09'
    },
    {
      id: '6',
      title: 'Recherches Économie',
      subject: 'Économie',
      type: 'research',
      dueDate: '2024-01-18',
      dueTime: '15:00',
      teacher: 'Mme. Dubois',
      description: 'Rechercher 3 articles sur l\'inflation',
      completed: false,
      priority: 'low',
      estimatedTime: 30,
      createdDate: '2024-01-13'
    },
    {
      id: '7',
      title: 'Exercices Histoire',
      subject: 'Histoire-Géographie',
      type: 'homework',
      dueDate: '2024-01-19',
      dueTime: '08:00',
      teacher: 'M. Moreau',
      description: 'Questions chapitre Première Guerre mondiale',
      completed: false,
      priority: 'low',
      estimatedTime: 40,
      createdDate: '2024-01-14'
    },
    {
      id: '8',
      title: 'Fiche de lecture',
      subject: 'Français',
      type: 'reading',
      dueDate: '2024-01-19',
      dueTime: '14:00',
      teacher: 'M. Petit',
      description: 'Fiche de lecture "Le Rouge et le Noir"',
      completed: false,
      priority: 'medium',
      estimatedTime: 75,
      createdDate: '2024-01-11'
    }
  ]
};

const typeLabels: Record<string, string> = {
  homework: 'Exercices',
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

const priorityConfig = {
  high: { label: 'Urgente', color: 'bg-red-100 text-red-700 border-red-200', icon: '🔥' },
  medium: { label: 'Normale', color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: '⚡' },
  low: { label: 'Faible', color: 'bg-green-100 text-green-700 border-green-200', icon: '🌿' }
};

export default function DevoirsPage() {
  const { user, logout } = useAuth();
  const [selectedFilter, setSelectedFilter] = useState('pending');
  const [selectedView, setSelectedView] = useState('priority'); // 'priority', 'date', 'subject'
  const [searchTerm, setSearchTerm] = useState('');
  const { isTestUser } = useTestUser(user);

  if (!user) {
    redirect('/');
  }

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

  // Fonction pour filtrer et trier les devoirs
  const getFilteredDevoirs = () => {
    let filtered = isTestUser ? [] : mockDevoirsData.devoirs;

    // Filtrage par statut
    if (selectedFilter === 'pending') {
      filtered = filtered.filter(d => !d.completed);
    } else if (selectedFilter === 'completed') {
      filtered = filtered.filter(d => d.completed);
    } else if (selectedFilter === 'urgent') {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      filtered = filtered.filter(d => {
        const dueDate = new Date(d.dueDate);
        return !d.completed && dueDate <= tomorrow;
      });
    }

    // Recherche
    if (searchTerm) {
      filtered = filtered.filter(d => 
        d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.teacher.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Tri selon la vue
    if (selectedView === 'priority') {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      filtered.sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });
    } else if (selectedView === 'date') {
      filtered.sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      });
    } else if (selectedView === 'subject') {
      filtered.sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        return a.subject.localeCompare(b.subject);
      });
    }

    return filtered;
  };

  const filteredDevoirs = getFilteredDevoirs();

  // Groupement par priorité pour l'affichage
  const devoirsByPriority = {
    high: filteredDevoirs.filter(d => d.priority === 'high' && !d.completed),
    medium: filteredDevoirs.filter(d => d.priority === 'medium' && !d.completed),
    low: filteredDevoirs.filter(d => d.priority === 'low' && !d.completed),
    completed: filteredDevoirs.filter(d => d.completed)
  };

  const formatDueDate = (dueDate: string, dueTime: string) => {
    const date = new Date(dueDate);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return `Aujourd'hui à ${dueTime}`;
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return `Demain à ${dueTime}`;
    } else {
      return `${date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })} à ${dueTime}`;
    }
  };

  const toggleCompletion = (devoirId: string) => {
    // Implementation would update the devoir completion status
    console.log('Toggle completion for:', devoirId);
  };

  const getTotalEstimatedTime = () => {
    return filteredDevoirs
      .filter(d => !d.completed)
      .reduce((total, d) => total + d.estimatedTime, 0);
  };

  return (
    <MainLayout user={user} onLogout={logout}>
      <div className="space-y-6">
        
        {/* Header avec statistiques */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Mes devoirs</h1>
              <p className="text-gray-600">Gérez et organisez vos travaux à rendre</p>
            </div>
            
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors">
              <Plus className="h-4 w-4" />
              <span>Ajouter</span>
            </button>
          </div>


          {/* Contrôles et filtres */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              {/* Recherche */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher un devoir..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              {/* Vue */}
              <div className="flex items-center space-x-2">
                <SortAsc className="h-4 w-4 text-gray-500" />
                <select 
                  value={selectedView}
                  onChange={(e) => setSelectedView(e.target.value)}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="priority">Par priorité</option>
                  <option value="date">Par date</option>
                  <option value="subject">Par matière</option>
                </select>
              </div>
            </div>

            {/* Filtres */}
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <div className="flex space-x-2">
                <button 
                  onClick={() => setSelectedFilter('pending')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedFilter === 'pending' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  En cours
                </button>
                <button 
                  onClick={() => setSelectedFilter('urgent')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedFilter === 'urgent' ? 'bg-red-100 text-red-700' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Urgents
                </button>
                <button 
                  onClick={() => setSelectedFilter('completed')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedFilter === 'completed' ? 'bg-green-100 text-green-700' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Terminés
                </button>
                <button 
                  onClick={() => setSelectedFilter('all')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedFilter === 'all' ? 'bg-gray-100 text-gray-700' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Tous
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Liste des devoirs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          {filteredDevoirs.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {isTestUser ? "Aucun devoir pour le moment" : "Aucun devoir trouvé"}
              </h3>
              <p className="text-gray-600 mb-4">
                {isTestUser 
                  ? "Vos devoirs apparaîtront ici une fois qu'ils seront ajoutés."
                  : searchTerm 
                    ? "Aucun devoir ne correspond à votre recherche."
                    : "Tous vos devoirs sont terminés pour ce filtre !"
                }
              </p>
              {!isTestUser && (
                <button className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
                  <Plus className="h-4 w-4" />
                  <span>Ajouter un devoir</span>
                </button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {selectedView === 'priority' && selectedFilter === 'pending' ? (
                // Vue par priorité avec groupement
                <>
                  {devoirsByPriority.high.length > 0 && (
                    <div className="p-6">
                      <div className="flex items-center space-x-2 mb-4">
                        <span className="text-lg">🔥</span>
                        <h3 className="text-lg font-semibold text-red-700">Priorité Urgente</h3>
                        <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium">
                          {devoirsByPriority.high.length}
                        </span>
                      </div>
                      <div className="space-y-3">
                        {devoirsByPriority.high.map((devoir) => (
                          <DevoirCard key={devoir.id} devoir={devoir} onToggleCompletion={toggleCompletion} formatDueDate={formatDueDate} />
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {devoirsByPriority.medium.length > 0 && (
                    <div className="p-6">
                      <div className="flex items-center space-x-2 mb-4">
                        <span className="text-lg">⚡</span>
                        <h3 className="text-lg font-semibold text-yellow-700">Priorité Normale</h3>
                        <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-medium">
                          {devoirsByPriority.medium.length}
                        </span>
                      </div>
                      <div className="space-y-3">
                        {devoirsByPriority.medium.map((devoir) => (
                          <DevoirCard key={devoir.id} devoir={devoir} onToggleCompletion={toggleCompletion} formatDueDate={formatDueDate} />
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {devoirsByPriority.low.length > 0 && (
                    <div className="p-6">
                      <div className="flex items-center space-x-2 mb-4">
                        <span className="text-lg">🌿</span>
                        <h3 className="text-lg font-semibold text-green-700">Priorité Faible</h3>
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                          {devoirsByPriority.low.length}
                        </span>
                      </div>
                      <div className="space-y-3">
                        {devoirsByPriority.low.map((devoir) => (
                          <DevoirCard key={devoir.id} devoir={devoir} onToggleCompletion={toggleCompletion} formatDueDate={formatDueDate} />
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                // Vue liste simple
                <div className="p-6">
                  <div className="space-y-3">
                    {filteredDevoirs.map((devoir) => (
                      <DevoirCard key={devoir.id} devoir={devoir} onToggleCompletion={toggleCompletion} formatDueDate={formatDueDate} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

// Composant pour les cartes de devoirs
function DevoirCard({ devoir, onToggleCompletion, formatDueDate }: any) {
  const IconComponent = typeIcons[devoir.type];
  const priorityInfo = priorityConfig[devoir.priority];
  
  return (
    <div className={`group relative bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-200 ${
      devoir.completed ? 'opacity-75' : ''
    }`}>
      <div className="flex items-start space-x-4">
        {/* Checkbox de completion */}
        <button
          onClick={() => onToggleCompletion(devoir.id)}
          className="flex-shrink-0 mt-1 hover:scale-110 transition-transform"
        >
          {devoir.completed ? (
            <CheckCircle className="h-6 w-6 text-green-600" />
          ) : (
            <Circle className="h-6 w-6 text-gray-400 hover:text-green-500" />
          )}
        </button>
        
        {/* Contenu principal */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h3 className={`font-semibold text-gray-900 mb-1 ${
                devoir.completed ? 'line-through text-gray-500' : ''
              }`}>
                {devoir.title}
              </h3>
              
              <div className="flex items-center space-x-4 text-sm text-gray-700 mb-2">
                <div className="flex items-center space-x-1">
                  <BookOpen className="h-4 w-4" />
                  <span className="font-medium">{devoir.subject}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span>{devoir.teacher}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <IconComponent className="h-4 w-4" />
                  <span>{typeLabels[devoir.type]}</span>
                </div>
              </div>
              
              {devoir.description && (
                <p className="text-sm text-gray-700 mb-3">{devoir.description}</p>
              )}
            </div>
            
            {/* Actions */}
            <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Modifier"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button 
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Supprimer"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          {/* Footer avec échéance et priorité */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1 text-sm text-gray-700">
                <Clock className="h-4 w-4" />
                <span className="font-medium">{formatDueDate(devoir.dueDate, devoir.dueTime)}</span>
              </div>
              
              {devoir.estimatedTime && (
                <div className="flex items-center space-x-1 text-sm text-gray-700">
                  <TrendingUp className="h-4 w-4" />
                  <span>{devoir.estimatedTime}min</span>
                </div>
              )}
            </div>
            
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${priorityInfo.color}`}>
              <span className="mr-1">{priorityInfo.icon}</span>
              {priorityInfo.label}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}