'use client';

import { 
 
  Trash2, 
  Archive, 
  ArchiveRestore, 
  Calendar, 
  Tag,
  Clock
} from 'lucide-react';
import { Note, Category } from '@/app/notes/page';

interface NotesListProps {
  notes: Note[];
  selectedNote: Note | null;
  onSelectNote: (note: Note) => void;
  onDeleteNote: (noteId: string) => void;
  onToggleArchive: (noteId: string) => void;
  categories: Category[];
}

export default function NotesList({
  notes,
  selectedNote,
  onSelectNote,
  onDeleteNote,
  onToggleArchive,
  categories
}: NotesListProps) {
  
  const getCategoryInfo = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId) || categories[0];
  };

  const getCategoryColor = (categoryId: string) => {
    const category = getCategoryInfo(categoryId);
    return category.color;
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Hier';
    } else if (diffDays < 7) {
      return `Il y a ${diffDays} jours`;
    } else {
      return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
    }
  };

  const getPreviewText = (content: string, maxLength = 100) => {
    // Nettoyer le markdown pour l'aperçu
    const cleanText = content
      .replace(/[#*`>\-\[\]]/g, '')
      .replace(/\n+/g, ' ')
      .trim();
    
    if (cleanText.length <= maxLength) return cleanText;
    return cleanText.substring(0, maxLength) + '...';
  };

  if (notes.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-100">
      <div className="p-4 bg-gray-50 rounded-t-2xl">
        <h3 className="text-sm font-semibold text-black uppercase tracking-wide">
          Notes ({notes.length})
        </h3>
      </div>
      
      <div className="max-h-[600px] overflow-y-auto">
        {notes.map((note) => {
          const isSelected = selectedNote?.id === note.id;
          const categoryColor = getCategoryColor(note.category);
          const categoryInfo = getCategoryInfo(note.category);
          
          return (
            <div
              key={note.id}
              className={`relative p-4 cursor-pointer transition-all duration-200 hover:bg-gray-50 ${
                isSelected ? 'bg-blue-50 border-r-4 border-blue-500' : ''
              }`}
              onClick={() => onSelectNote(note)}
            >
              {/* En-tête de la note */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <h4 className={`font-semibold truncate text-sm ${
                    isSelected ? 'text-blue-900' : 'text-black'
                  }`}>
                    {note.title || 'Sans titre'}
                  </h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium bg-${categoryColor}-100 text-${categoryColor}-700`}>
                      {categoryInfo.name}
                    </span>
                    {note.isArchived && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                        Archivée
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleArchive(note.id);
                    }}
                    className={`p-1.5 rounded-lg transition-colors ${
                      note.isArchived
                        ? 'text-blue-600 hover:bg-blue-100'
                        : 'text-gray-400 hover:bg-gray-100'
                    }`}
                    title={note.isArchived ? 'Restaurer' : 'Archiver'}
                  >
                    {note.isArchived ? (
                      <ArchiveRestore className="h-4 w-4" />
                    ) : (
                      <Archive className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteNote(note.id);
                    }}
                    className="p-1.5 text-red-400 hover:bg-red-100 rounded-lg transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Aperçu du contenu */}
              <p className="text-xs text-gray-600 mb-3 leading-relaxed">
                {getPreviewText(note.content) || 'Aucun contenu'}
              </p>

              {/* Tags */}
              {note.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {note.tags.slice(0, 3).map((tag, tagIndex) => (
                    <span
                      key={`${note.id}-tag-${tagIndex}`}
                      className="inline-flex items-center space-x-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs"
                    >
                      <Tag className="h-3 w-3" />
                      <span>{tag}</span>
                    </span>
                  ))}
                  {note.tags.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded-md text-xs">
                      +{note.tags.length - 3}
                    </span>
                  )}
                </div>
              )}

              {/* Footer avec date */}
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>{formatDate(note.updatedAt)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3" />
                  <span>{note.createdAt.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</span>
                </div>
              </div>

              {/* Indicateur de sélection */}
              {isSelected && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-r-full"></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}