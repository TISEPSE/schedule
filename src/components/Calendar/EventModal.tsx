'use client';

import { useState, useEffect } from 'react';
import { X, Calendar, Clock, MapPin, Tag } from 'lucide-react';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (event: EventFormData) => void;
  selectedDate?: Date;
}

export interface EventFormData {
  title: string;
  description: string;
  type: 'course' | 'practical' | 'exam' | 'project' | 'sport' | 'study';
  startTime: string;
  endTime: string;
  location?: string;
}

const eventTypes = [
  { 
    value: 'course', 
    label: 'Cours', 
    color: 'bg-blue-500',
    lightColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    dotColor: 'bg-blue-500'
  },
  { 
    value: 'practical', 
    label: 'TP', 
    color: 'bg-green-500',
    lightColor: 'bg-green-50',
    textColor: 'text-green-700',
    dotColor: 'bg-green-500'
  },
  { 
    value: 'exam', 
    label: 'Contrôle', 
    color: 'bg-red-500',
    lightColor: 'bg-red-50',
    textColor: 'text-red-700',
    dotColor: 'bg-red-500'
  },
  { 
    value: 'project', 
    label: 'Projet', 
    color: 'bg-teal-500',
    lightColor: 'bg-teal-50',
    textColor: 'text-teal-700',
    dotColor: 'bg-teal-500'
  },
  { 
    value: 'sport', 
    label: 'Sport', 
    color: 'bg-purple-500',
    lightColor: 'bg-purple-50',
    textColor: 'text-purple-700',
    dotColor: 'bg-purple-500'
  },
  { 
    value: 'study', 
    label: 'Révision', 
    color: 'bg-amber-500',
    lightColor: 'bg-amber-50',
    textColor: 'text-amber-700',
    dotColor: 'bg-amber-500'
  }
] as const;

export default function EventModal({ isOpen, onClose, onSubmit, selectedDate }: EventModalProps) {
  // Bloquer le scroll du body quand le modal est ouvert
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup au démontage du composant
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    type: 'course',
    startTime: '08:00',
    endTime: '09:00',
    location: ''
  });

  const [errors, setErrors] = useState<Partial<EventFormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<EventFormData> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Le titre est obligatoire';
    }

    if (!formData.startTime) {
      newErrors.startTime = 'L\'heure de début est obligatoire';
    }

    if (!formData.endTime) {
      newErrors.endTime = 'L\'heure de fin est obligatoire';
    }

    if (formData.startTime && formData.endTime && formData.startTime >= formData.endTime) {
      newErrors.endTime = 'L\'heure de fin doit être après l\'heure de début';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      type: 'course',
      startTime: '08:00',
      endTime: '09:00',
      location: ''
    });
    setErrors({});
    onClose();
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50 p-4"
      onClick={handleClose}
    >
      <div 
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] shadow-xl border border-gray-200 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Custom scrollable container with hidden scrollbar */}
        <div className="max-h-[90vh] overflow-y-auto scrollbar-hide" 
             style={{
               scrollbarWidth: 'none', /* Firefox */
               msOverflowStyle: 'none', /* Internet Explorer 10+ */
             }}>
          <style jsx>{`
            .scrollbar-hide::-webkit-scrollbar {
              display: none; /* Safari and Chrome */
            }
          `}</style>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Créer un événement
            </h2>
            {selectedDate && (
              <p className="text-sm text-gray-500 mt-1">
                {formatDate(selectedDate)}
              </p>
            )}
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Titre */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              <Tag className="inline h-4 w-4 mr-1 text-blue-600" />
              Titre de l&rsquo;événement *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ex: Cours de Mathématiques"
              style={{ color: '#1f2937' }}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-2 font-medium">{errors.title}</p>
            )}
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Type d&rsquo;événement
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {eventTypes.map((type) => {
                const isSelected = formData.type === type.value;
                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, type: type.value })}
                    className={`p-4 border-2 rounded-2xl transition-all duration-150 hover:scale-[1.05] hover:shadow-lg flex items-center space-x-3 relative overflow-hidden ${
                      isSelected
                        ? `border-gray-300 ${type.lightColor} ${type.textColor} shadow-lg transform scale-[1.02]`
                        : 'border-gray-200 hover:border-gray-300 bg-white/50 text-gray-700'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"></div>
                    )}
                    <div className={`w-4 h-4 rounded-full ${type.dotColor} shadow-sm relative z-10`}></div>
                    <span className="text-sm font-bold relative z-10">{type.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Horaires */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-3">
                <Clock className="inline h-4 w-4 mr-2 text-gray-600" />
                Heure de début *
              </label>
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                style={{ color: '#1f2937' }}
                className={`w-full px-5 py-4 border-2 bg-white rounded-2xl focus:ring-2 focus:ring-gray-200 focus:border-gray-400 transition-all duration-150 hover:shadow-md ${
                  errors.startTime ? 'border-red-400 focus:ring-red-100' : 'border-gray-200 hover:border-gray-300'
                }`}
              />
              {errors.startTime && (
                <p className="text-red-500 text-sm mt-2 font-medium">{errors.startTime}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-3">
                <Clock className="inline h-4 w-4 mr-2 text-gray-600" />
                Heure de fin *
              </label>
              <input
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                style={{ color: '#1f2937' }}
                className={`w-full px-5 py-4 border-2 bg-white rounded-2xl focus:ring-2 focus:ring-gray-200 focus:border-gray-400 transition-all duration-150 hover:shadow-md ${
                  errors.endTime ? 'border-red-400 focus:ring-red-100' : 'border-gray-200 hover:border-gray-300'
                }`}
              />
              {errors.endTime && (
                <p className="text-red-500 text-sm mt-2 font-medium">{errors.endTime}</p>
              )}
            </div>
          </div>

          {/* Lieu */}
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-3">
              <MapPin className="inline h-4 w-4 mr-2 text-gray-600" />
              Lieu (optionnel)
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-5 py-4 border-2 border-gray-200 bg-white rounded-2xl focus:ring-2 focus:ring-gray-200 focus:border-gray-400 transition-all duration-150 hover:shadow-md hover:border-gray-300"
              placeholder="Ex: Salle 201"
              style={{ color: '#1f2937' }}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-3">
              Description (optionnel)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-5 py-4 border-2 border-gray-200 bg-white rounded-2xl focus:ring-2 focus:ring-gray-200 focus:border-gray-400 transition-all duration-150 hover:shadow-md hover:border-gray-300 resize-none"
              placeholder="Ajoutez des détails sur cet événement..."
              style={{ color: '#1f2937' }}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gradient-to-r from-indigo-200 to-purple-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-8 py-3 text-gray-700 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 hover:scale-[1.05] rounded-2xl font-bold transition-all duration-300 hover:shadow-lg"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:scale-[1.05] text-white rounded-2xl font-bold transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl"
            >
              <Calendar className="h-5 w-5" />
              <span>Créer l&rsquo;événement</span>
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
}