'use client';

import { useAuth } from '@/context/AuthContext';
import { redirect } from 'next/navigation';
import MainLayout from '@/components/Layout/MainLayout';
import { useState } from 'react';
import { useApiData } from '@/hooks/useApiData';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Clock,
  BookOpen,
  Search,
  MoreVertical
} from 'lucide-react';
import { getSubjectColors } from '@/lib/colors';
import CreateAssignmentModal from '@/components/Devoirs/CreateAssignmentModal';

interface Assignment {
  id: string;
  title: string;
  description: string;
  subject: string;
  dueDate: Date;
  priority: string;
  completed: boolean;
  status?: string;
}

export default function DevoirsPage() {
  const { user, logout } = useAuth();
  const { assignments, updateAssignment, createAssignment } = useApiData(user?.id || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [draggedItem, setDraggedItem] = useState<Assignment | null>(null);

  if (!user) {
    redirect('/');
  }

  if (user.role === 'admin') {
    return (
      <MainLayout user={user} onLogout={logout}>
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-2 duration-400 ease-out delay-100 motion-reduce:animate-none">
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

  // Fonction pour filtrer les devoirs
  const getFilteredAssignments = () => {
    let filtered = assignments;

    // Recherche
    if (searchTerm) {
      filtered = filtered.filter(a => 
        a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.subject.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  const filteredAssignments = getFilteredAssignments();


  function isInProgress(assignment: { dueDate: Date; priority: string; status?: string }) {
    const now = new Date();
    const dueDate = new Date(assignment.dueDate);
    const daysDiff = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return assignment.status === 'in-progress' || (daysDiff <= 3 && daysDiff > 1 && assignment.priority !== 'low');
  }

  // Groupement pour le kanban board avec design cohérent et backgrounds complets
  const kanbanColumns = {
    todo: {
      title: '📝 À faire',
      items: filteredAssignments.filter(a => !a.completed && !isInProgress(a)),
      lightBg: 'bg-blue-100/80',
      headerBg: 'bg-blue-500/90',
      border: 'border-blue-200/40',
      textColor: 'text-blue-700',
      headerText: 'text-white',
      accent: 'bg-blue-500',
    },
    inProgress: {
      title: 'En cours',
      items: filteredAssignments.filter(a => !a.completed && isInProgress(a)),
      lightBg: 'bg-amber-100/80',
      headerBg: 'bg-amber-500/90',
      border: 'border-amber-200/40',
      textColor: 'text-amber-700',
      headerText: 'text-white',
      accent: 'bg-amber-500',
    },
    review: {
      title: 'À vérifier',
      items: filteredAssignments.filter(a => !a.completed && a.status === 'review'),
      lightBg: 'bg-purple-100/80',
      headerBg: 'bg-purple-500/90',
      border: 'border-purple-200/40',
      textColor: 'text-purple-700',
      headerText: 'text-white',
      accent: 'bg-purple-500',
    },
    completed: {
      title: 'Terminé',
      items: filteredAssignments.filter(a => a.completed),
      lightBg: 'bg-emerald-100/80',
      headerBg: 'bg-emerald-500/90',
      border: 'border-emerald-200/40',
      textColor: 'text-emerald-700',
      headerText: 'text-white',
      accent: 'bg-emerald-500',
    }
  };

  // Fonction pour créer un devoir
  const handleCreateAssignment = async (formData: {
    title: string;
    description: string;
    subject: string;
    dueDate: Date;
    priority: string;
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
    // TODO: Implémenter le modal d'édition
  };

  const handleDeleteAssignment = async (assignmentId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce devoir ?')) {
      // TODO: Implémenter la suppression via l'API
      console.log('Suppression du devoir:', assignmentId);
    }
  };

  const toggleCompletion = async (assignmentId: string) => {
    const assignment = assignments.find(a => a.id === assignmentId);
    if (assignment) {
      await updateAssignment({
        ...assignment,
        completed: !assignment.completed
      });
    }
  };

  // Fonctions pour le drag & drop
  const handleDragStart = (assignment: Assignment) => {
    setDraggedItem(assignment);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const handleDrop = async (targetColumn: string) => {
    if (!draggedItem) return;

    let newStatus = '';
    let completed = false;

    // Déterminer le nouveau statut en fonction de la colonne
    switch (targetColumn) {
      case 'todo':
        newStatus = 'pending';
        break;
      case 'inProgress':
        newStatus = 'in-progress';
        break;
      case 'review':
        newStatus = 'review';
        break;
      case 'completed':
        completed = true;
        newStatus = 'completed';
        break;
      default:
        return;
    }

    // Mettre à jour le devoir
    await updateAssignment({
      ...draggedItem,
      status: newStatus,
      completed: completed
    });

    setDraggedItem(null);
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
      } else {
        return dueDate.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' });
      }
    }
  };


  return (
    <MainLayout user={user} onLogout={logout}>
      <div className="space-y-8 min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 -m-6 p-6">
        
        {/* Header avec statistiques */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-sm border border-white/50 page-animate-delay-1">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Kanban Board</h1>
              <p className="text-gray-600">Organisez vos travaux avec un tableau kanban</p>
            </div>
            
            <div className="flex items-center space-x-4">
              
              <button 
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Ajouter un devoir</span>
              </button>
            </div>
          </div>

          {/* Recherche */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un devoir..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Kanban Board */}
        {filteredAssignments.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-lg border border-white/50 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchTerm ? "Aucun devoir trouvé" : "Aucun devoir pour le moment"}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm 
                ? "Aucun devoir ne correspond à votre recherche."
                : "Vos devoirs apparaîtront ici une fois qu'ils seront ajoutés."
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 xl:gap-8 page-animate-delay-2">
              {Object.entries(kanbanColumns).map(([columnId, column]) => (
                <div key={columnId}>
                <KanbanColumn 
                  columnId={columnId}
                  title={column.title}
                  items={column.items}
                  lightBg={column.lightBg}
                  headerBg={column.headerBg}
                  border={column.border}
                  textColor={column.textColor}
                  headerText={column.headerText}
                  accent={column.accent}
                  description={column.description}
                  onToggleCompletion={toggleCompletion}
                  onEditAssignment={handleEditAssignment}
                  onDeleteAssignment={handleDeleteAssignment}
                  formatDueDate={formatDueDate}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  onDrop={handleDrop}
                  draggedItem={draggedItem}
                />
                </div>
              ))}
          </div>
        )}
        
        {/* Modal de création de devoir */}
        <CreateAssignmentModal 
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateAssignment}
        />
      </div>
    </MainLayout>
  );
}

// Composant colonne Kanban avec design cohérent et backgrounds complets
function KanbanColumn({ 
  columnId, 
  title, 
  items, 
  lightBg,
  headerBg,
  border,
  textColor, 
  onToggleCompletion, 
  onEditAssignment, 
  onDeleteAssignment, 
  formatDueDate, 
  onDragStart, 
  onDragEnd, 
  onDrop, 
  draggedItem 
}: {
  columnId: string;
  title: string;
  items: Assignment[];
  lightBg: string;
  headerBg: string;
  border: string;
  textColor: string;
  headerText: string;
  accent: string;
  description: string;
  onToggleCompletion: (id: string) => void;
  onEditAssignment: (assignment: Assignment) => void;
  onDeleteAssignment: (id: string) => void;
  formatDueDate: (date: Date) => string;
  onDragStart: (assignment: Assignment) => void;
  onDragEnd: () => void;
  onDrop: (targetColumn: string) => void;
  draggedItem: Assignment | null;
}) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedItem) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    onDrop(columnId);
  };

  return (
    <div 
      className={`${lightBg} backdrop-blur-sm rounded-2xl border ${border} shadow-sm transition-all duration-300 min-h-[600px] ${
        isDragOver 
          ? 'scale-[1.02] shadow-xl ring-2 ring-white/50' 
          : 'hover:shadow-md'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* En-tête avec design cohérent */}
      <div className={`${headerBg} rounded-t-2xl p-5 text-white relative overflow-hidden`}>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <h3 className="font-bold text-xl">{title}</h3>
            </div>
            <div className="bg-white/20 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-bold">
              {items.length}
            </div>
          </div>
        </div>
        
      </div>
      
      {/* Corps de la colonne avec background coloré */}
      <div className="p-4 min-h-[520px]">
        <div className="space-y-3">
          {items.map((assignment) => (
            <AssignmentCard 
              key={assignment.id}
              assignment={assignment}
              onToggleCompletion={onToggleCompletion}
              onEditAssignment={onEditAssignment}
              onDeleteAssignment={onDeleteAssignment}
              formatDueDate={formatDueDate}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              isDragging={draggedItem?.id === assignment.id}
            />
          ))}
        </div>
        
        {isDragOver && (
          <div className="border-2 border-dashed border-white/40 bg-white/30 rounded-2xl p-6 mt-4 text-center transition-all duration-200">
            <div className={`${textColor} text-lg font-semibold mb-1`}>
              Déposer ici
            </div>
            <div className={`${textColor} opacity-80 text-sm`}>
              pour déplacer vers "{title}"
            </div>
          </div>
        )}
        
        {items.length === 0 && !isDragOver && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-white/50 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-3 border-2 border-white/30">
              <span className="text-2xl opacity-60">📋</span>
            </div>
            <p className={`${textColor} text-sm font-medium opacity-80`}>
              Aucun devoir dans cette catégorie
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Composant carte de devoir modernisé avec couleurs par matière
function AssignmentCard({ 
  assignment, 
  onToggleCompletion, 
  onEditAssignment, 
  onDeleteAssignment, 
  formatDueDate, 
  onDragStart, 
  onDragEnd, 
  isDragging 
}: {
  assignment: Assignment;
  onToggleCompletion: (id: string) => void;
  onEditAssignment: (assignment: Assignment) => void;
  onDeleteAssignment: (id: string) => void;
  formatDueDate: (date: Date) => string;
  onDragStart: (assignment: Assignment) => void;
  onDragEnd: () => void;
  isDragging: boolean;
}) {
  // Utilise les couleurs par matière au lieu de la priorité
  const subjectColors = getSubjectColors(assignment.subject);
  const [showMenu, setShowMenu] = useState(false);
  
  const isUrgent = () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return new Date(assignment.dueDate) <= tomorrow;
  };

  const handleDragStart = (e: React.DragEvent) => {
    onDragStart(assignment);
    e.dataTransfer.effectAllowed = 'move';
  };
  
  return (
    <div 
      className={`bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300 cursor-move group relative overflow-hidden border border-white/40 ${
        assignment.completed ? 'opacity-75' : ''
      } ${isDragging ? 'opacity-50 scale-95 rotate-2 shadow-xl' : ''}`}
      draggable={true}
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
    >
      
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleCompletion(assignment.id);
              }}
              className="flex-shrink-0 hover:scale-110 transition-transform"
            >
              {assignment.completed ? (
                <div className="h-6 w-6 bg-emerald-600 rounded-full flex items-center justify-center shadow-sm">
                  <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              ) : (
                <div className="h-6 w-6 border-2 border-gray-300 rounded-full hover:border-emerald-500 transition-colors"></div>
              )}
            </button>
            
            <h4 className={`font-bold text-gray-900 line-clamp-2 ${
              assignment.completed ? 'line-through text-gray-500' : ''
            }`}>
              {assignment.title}
            </h4>
          </div>
          
          {/* Badge de matière */}
          <div className="flex items-center space-x-2 mb-3">
            <div className={`flex items-center space-x-2 ${subjectColors.backgroundLight} px-3 py-1.5 rounded-full`}>
              <BookOpen className={`h-3 w-3 ${subjectColors.text}`} />
              <span className={`text-xs font-semibold ${subjectColors.text}`}>
                {assignment.subject}
              </span>
            </div>
            
          </div>
          
          {assignment.description && (
            <p className="text-gray-600 text-sm line-clamp-2 mb-3 leading-relaxed">
              {assignment.description}
            </p>
          )}
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-gray-400" />
              <span className={`text-sm font-medium ${
                isUrgent() && !assignment.completed 
                  ? 'text-red-600 font-bold' 
                  : 'text-gray-700'
              }`}>
                {formatDueDate(assignment.dueDate)}
              </span>
              {isUrgent() && !assignment.completed && (
                <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-xs font-bold">
                  Urgent
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="relative ml-2">
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-gray-100 rounded-lg"
          >
            <MoreVertical className="h-4 w-4 text-gray-400" />
          </button>
          
          {showMenu && (
            <div className="absolute right-0 mt-1 w-36 bg-white/95 backdrop-blur-sm border border-white/40 rounded-xl shadow-lg z-20 overflow-hidden">
              <button
                onClick={() => {
                  onEditAssignment(assignment);
                  setShowMenu(false);
                }}
                className="flex items-center space-x-3 w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50/80 transition-colors"
              >
                <Edit className="h-4 w-4" />
                <span>Modifier</span>
              </button>
              <div className="border-t border-gray-100/60"></div>
              <button
                onClick={() => {
                  onDeleteAssignment(assignment.id);
                  setShowMenu(false);
                }}
                className="flex items-center space-x-3 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50/80 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                <span>Supprimer</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}