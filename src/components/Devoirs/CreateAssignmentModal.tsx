'use client';

import { useState } from 'react';
import { X, BookOpen, Calendar, Flag, FileText } from 'lucide-react';

interface CreateAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {title: string; description: string; subject: string; dueDate: Date; priority: 'low' | 'medium' | 'high'}) => Promise<void>;
}

const SUBJECTS = [
  'Mathématiques',
  'Physique-Chimie',
  'SVT',
  'Sciences',
  'Français',
  'Anglais',
  'Espagnol',
  'Allemand',
  'Histoire-Géographie',
  'Histoire',
  'Géographie',
  'Philosophie',
  'EPS',
  'Arts plastiques',
  'Musique',
  'Technologie',
  'Économie',
  'Informatique'
];

const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Faible', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: '🟢' },
  { value: 'medium', label: 'Normale', color: 'bg-amber-100 text-amber-700 border-amber-200', icon: '🟡' },
  { value: 'high', label: 'Urgente', color: 'bg-red-100 text-red-700 border-red-200', icon: '🔴' }
];

export default function CreateAssignmentModal({ isOpen, onClose, onSubmit }: CreateAssignmentModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    dueDate: '',
    priority: 'medium' as 'low' | 'medium' | 'high'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Le titre est requis';
    }
    if (!formData.subject) {
      newErrors.subject = 'La matière est requise';
    }
    if (!formData.dueDate) {
      newErrors.dueDate = 'L\'échéance est requise';
    } else {
      const dueDate = new Date(formData.dueDate + 'T23:59:59');
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (dueDate < today) {
        newErrors.dueDate = 'L\'échéance ne peut pas être dans le passé';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      // Définir l'heure à 23:59:59 pour la fin de journée
      const dueDate = new Date(formData.dueDate + 'T23:59:59');
      
      await onSubmit({
        ...formData,
        dueDate: dueDate
      });
      
      // Reset form
      setFormData({ 
        title: '', 
        description: '', 
        subject: '', 
        dueDate: '', 
        priority: 'medium' 
      });
      setErrors({});
      onClose();
    } catch (error) {
      console.error('Erreur lors de la création du devoir:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({ 
      title: '', 
      description: '', 
      subject: '', 
      dueDate: '', 
      priority: 'medium' 
    });
    setErrors({});
    onClose();
  };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50 p-4" onClick={handleClose}>
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl border border-gray-100 overflow-hidden" onClick={(e) => e.stopPropagation()}>
        
        {/* Header coloré */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/5"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Créer un devoir</h2>
                <p className="text-white/80 text-sm">Ajoutez un nouveau travail à faire</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-white/20 rounded-xl transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          {/* Effet décoratif */}
          <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-white/10 rounded-full"></div>
          <div className="absolute -top-3 -left-3 w-16 h-16 bg-white/5 rounded-full"></div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Titre */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-semibold text-gray-900 mb-3">
              <FileText className="h-4 w-4 text-blue-500" />
              <span>Titre du devoir *</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-gray-500 ${
                errors.title ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
              }`}
              placeholder="Ex: Exercices de mathématiques chapitre 5"
            />
            {errors.title && (
              <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                <span>⚠️</span>
                <span>{errors.title}</span>
              </p>
            )}
          </div>

          {/* Matière et Priorité sur la même ligne */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Matière */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-900 mb-3">
                <BookOpen className="h-4 w-4 text-purple-500" />
                <span>Matière *</span>
              </label>
              <select
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 text-gray-900 ${
                  errors.subject ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <option value="">Choisir une matière</option>
                {SUBJECTS.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
              {errors.subject && (
                <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                  <span>⚠️</span>
                  <span>{errors.subject}</span>
                </p>
              )}
            </div>

            {/* Priorité */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-900 mb-3">
                <Flag className="h-4 w-4 text-orange-500" />
                <span>Priorité</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {PRIORITY_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, priority: option.value as 'low' | 'medium' | 'high' })}
                    className={`p-3 border-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                      formData.priority === option.value 
                        ? option.color + ' scale-105' 
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex flex-col items-center space-y-1">
                      <span className="text-lg">{option.icon}</span>
                      <span>{option.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Échéance */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-semibold text-gray-900 mb-3">
              <Calendar className="h-4 w-4 text-green-500" />
              <span>Date d&apos;échéance *</span>
            </label>
            <input
              type="date"
              value={formData.dueDate.split('T')[0]}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200 text-gray-500 ${
                errors.dueDate ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
              }`}
              min={new Date().toISOString().slice(0, 10)}
            />
            {errors.dueDate && (
              <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                <span>⚠️</span>
                <span>{errors.dueDate}</span>
              </p>
            )}
          </div>
          
          {/* Description */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-semibold text-gray-900 mb-3">
              <FileText className="h-4 w-4 text-indigo-500" />
              <span>Description (optionnel)</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 hover:border-gray-300 transition-all duration-200 resize-none text-gray-500"
              placeholder="Décrivez les détails du devoir, les consignes particulières..."
              rows={4}
            />
          </div>
          
          {/* Boutons d'action */}
          <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-3 text-gray-600 hover:text-gray-800 font-semibold transition-colors rounded-xl hover:bg-gray-50"
              disabled={isSubmitting}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !formData.title || !formData.subject || !formData.dueDate}
              className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Création...</span>
                </>
              ) : (
                <>
                  <span>Ajouter</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}