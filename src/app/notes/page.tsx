'use client';

import { useAuth } from '@/context/AuthContext';
import { redirect } from 'next/navigation';
import MainLayout from '@/components/Layout/MainLayout';
import { useState, useEffect } from 'react';
import { Plus, Search } from 'lucide-react';
import CreateNoteModal from '@/components/Notes/CreateNoteModal';
import DeleteNoteModal from '@/components/Notes/DeleteNoteModal';
import NoteCard from '@/components/Notes/NoteCard';
import NoteReadView from '@/components/Notes/NoteReadView';
import SimpleNoteEditor from '@/components/Notes/SimpleNoteEditor';

export interface Note {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  isArchived: boolean;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}

const defaultCategories: Category[] = [
  { id: 'general', name: 'Général', color: 'blue', icon: 'BookOpen' },
  { id: 'work', name: 'Travail', color: 'green', icon: 'Briefcase' },
  { id: 'personal', name: 'Personnel', color: 'purple', icon: 'Heart' },
  { id: 'ideas', name: 'Idées', color: 'yellow', icon: 'Lightbulb' },
  { id: 'projects', name: 'Projets', color: 'red', icon: 'Rocket' },
];

export default function NotesPage() {
  const { user, logout } = useAuth();
  
  // États
  const [notes, setNotes] = useState<Note[]>([]);
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Charger les données depuis localStorage
  useEffect(() => {
    const savedNotes = localStorage.getItem('notes');
    const savedCategories = localStorage.getItem('note-categories');
    
    if (savedNotes) {
      try {
        const parsedNotes = JSON.parse(savedNotes).map((note: Note & { createdAt: string; updatedAt: string }) => ({
          ...note,
          description: note.description || '',
          createdAt: new Date(note.createdAt),
          updatedAt: new Date(note.updatedAt)
        }));
        setNotes(parsedNotes);
      } catch (error) {
        console.error('Erreur lors du chargement des notes:', error);
      }
    }
    
    if (savedCategories) {
      try {
        setCategories(JSON.parse(savedCategories));
      } catch (error) {
        console.error('Erreur lors du chargement des catégories:', error);
      }
    }
  }, []);

  // Sauvegarder dans localStorage
  const saveToStorage = (notesToSave: Note[], categoriesToSave: Category[]) => {
    localStorage.setItem('notes', JSON.stringify(notesToSave));
    localStorage.setItem('note-categories', JSON.stringify(categoriesToSave));
  };

  if (!user) {
    redirect('/');
  }

  // Fonctions de gestion des notes
  const createNote = (data: { title: string; description: string; category: string }) => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: data.title,
      description: data.description,
      content: '',
      category: data.category,
      tags: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      isArchived: false
    };

    const updatedNotes = [newNote, ...notes];
    setNotes(updatedNotes);
    saveToStorage(updatedNotes, categories);
    setSelectedNote(newNote);
    setIsEditing(true);
  };

  const updateNoteContent = (noteId: string, content: string, description?: string, title?: string) => {
    const updatedNotes = notes.map(note => 
      note.id === noteId 
        ? { 
            ...note, 
            content, 
            description: description !== undefined ? description : note.description,
            title: title !== undefined ? title : note.title,
            updatedAt: new Date() 
          }
        : note
    );
    setNotes(updatedNotes);
    saveToStorage(updatedNotes, categories);
    
    if (selectedNote && selectedNote.id === noteId) {
      setSelectedNote({ 
        ...selectedNote, 
        content, 
        description: description !== undefined ? description : selectedNote.description,
        title: title !== undefined ? title : selectedNote.title,
        updatedAt: new Date() 
      });
    }
  };

  const openDeleteModal = (note: Note) => {
    setNoteToDelete(note);
    setIsDeleteModalOpen(true);
  };

  const deleteNote = () => {
    if (noteToDelete) {
      const updatedNotes = notes.filter(note => note.id !== noteToDelete.id);
      setNotes(updatedNotes);
      saveToStorage(updatedNotes, categories);
      
      if (selectedNote && selectedNote.id === noteToDelete.id) {
        setSelectedNote(null);
      }
      
      setNoteToDelete(null);
    }
  };

  // Filtrer les notes
  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch && !note.isArchived;
  });

  const getCategoryInfo = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId) || categories[0];
  };

  const handleNoteClick = (note: Note) => {
    setSelectedNote(note);
    setIsEditing(false); // Afficher d'abord la vue de lecture
  };

  const handleEditClick = (note: Note) => {
    setSelectedNote(note);
    setIsEditing(true);
  };

  const handleBackToList = () => {
    setSelectedNote(null);
    setIsEditing(false);
  };

  if (selectedNote && isEditing) {
    return (
      <MainLayout user={user} onLogout={logout}>
        <SimpleNoteEditor
          note={selectedNote}
          category={getCategoryInfo(selectedNote.category)}
          onBack={handleBackToList}
          onUpdate={(content, description, title) => updateNoteContent(selectedNote.id, content, description, title)}
        />
      </MainLayout>
    );
  }

  if (selectedNote && !isEditing) {
    return (
      <MainLayout user={user} onLogout={logout}>
        <div className="space-y-6">
          <NoteReadView
            note={selectedNote}
            category={getCategoryInfo(selectedNote.category)}
            onBack={handleBackToList}
            onEdit={() => setIsEditing(true)}
          />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout user={user} onLogout={logout}>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Mes Notes</h1>
                <p className="text-gray-600">Organisez vos idées et réflexions en markdown</p>
              </div>
              <button 
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Nouvelle note</span>
              </button>
            </div>

            {/* Recherche */}
            <div className="relative max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-500" />
              </div>
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg text-sm text-black placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Grille des notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                category={getCategoryInfo(note.category)}
                onClick={() => handleNoteClick(note)}
                onEdit={(e) => {
                  e.stopPropagation();
                  handleEditClick(note);
                }}
                onDelete={(e) => {
                  e.stopPropagation();
                  openDeleteModal(note);
                }}
              />
            ))}
          </div>
        </div>

        <CreateNoteModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={createNote}
          categories={categories}
        />
        
        <DeleteNoteModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setNoteToDelete(null);
          }}
          onConfirm={deleteNote}
          note={noteToDelete}
        />
    </MainLayout>
  );
}