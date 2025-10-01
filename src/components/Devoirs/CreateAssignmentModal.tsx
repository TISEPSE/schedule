'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

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
  const [mounted, setMounted] = useState(false);

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

  useEffect(() => {
    setMounted(true);

    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div className="fixed inset-0 flex items-center justify-center z-[9999]" style={{ backdropFilter: 'blur(4px)' }}>
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-black">Nouveau devoir</h3>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Titre du devoir *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={`w-full px-3 py-2 border border-gray-200 rounded-lg text-black focus:outline-none focus:border-blue-500 ${
                errors.title ? 'border-red-300 bg-red-50' : ''
              }`}
              placeholder="Ex: Exercices de mathématiques chapitre 5"
              autoFocus
            />
            {errors.title && (
              <p className="mt-2 text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Matière *
            </label>
            <select
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className={`w-full px-3 py-2 border border-gray-200 rounded-lg text-black focus:outline-none focus:border-blue-500 ${
                errors.subject ? 'border-red-300 bg-red-50' : ''
              }`}
            >
              <option value="">Sélectionnez une matière</option>
              {SUBJECTS.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
            {errors.subject && (
              <p className="mt-2 text-sm text-red-600">{errors.subject}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Niveau de priorité
            </label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'low' | 'medium' | 'high' })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-black focus:outline-none focus:border-blue-500"
            >
              <option value="low">Faible</option>
              <option value="medium">Normale</option>
              <option value="high">Urgente</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Date d&apos;échéance *
            </label>
            <input
              type="date"
              value={formData.dueDate.split('T')[0]}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className={`w-full px-3 py-2 border border-gray-200 rounded-lg text-black focus:outline-none focus:border-blue-500 ${
                errors.dueDate ? 'border-red-300 bg-red-50' : ''
              }`}
              min={new Date().toISOString().slice(0, 10)}
            />
            {errors.dueDate && (
              <p className="mt-2 text-sm text-red-600">{errors.dueDate}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Description (optionnel)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-black focus:outline-none focus:border-blue-500 resize-none"
              placeholder="Décrivez les détails de ce devoir..."
              rows={3}
            />
          </div>
          <div className="flex items-center justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              disabled={isSubmitting}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !formData.title || !formData.subject || !formData.dueDate}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Création...' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}