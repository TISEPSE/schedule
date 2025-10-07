'use client';

import { useEffect, useState } from 'react';
import { X, Clock, MapPin, Calendar, Tag, Trash2 } from 'lucide-react';

interface EventDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete?: (id: string) => Promise<void>;
  event: {
    id: string;
    title: string;
    description?: string;
    type: string;
    startTime: Date;
    endTime: Date;
    location?: string;
  } | null;
}

const eventTypeLabels: Record<string, string> = {
  course: 'Cours',
  practical: 'TP', 
  exam: 'Contrôle',
  project: 'Projet',
  sport: 'Sport',
  study: 'Révision'
};

const eventTypeColors: Record<string, string> = {
  course: 'text-blue-600 bg-blue-50',
  practical: 'text-green-600 bg-green-50',
  exam: 'text-red-600 bg-red-50',
  project: 'text-teal-600 bg-teal-50',
  sport: 'text-purple-600 bg-purple-50',
  study: 'text-amber-600 bg-amber-50'
};

export default function EventDetailsModal({ isOpen, onClose, onDelete, event }: EventDetailsModalProps) {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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

  // Reset confirmation state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setShowConfirmation(false);
      setIsDeleting(false);
    }
  }, [isOpen]);

  const handleDeleteClick = () => {
    setShowConfirmation(true);
  };

  const handleConfirmDelete = async () => {
    if (!event || !onDelete) return;

    try {
      setIsDeleting(true);
      await onDelete(event.id);
      onClose();
    } catch (error) {
      console.error('Error deleting event:', error);
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmation(false);
  };

  if (!isOpen || !event) return null;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div 
      className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl w-full max-w-md shadow-xl border border-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <Calendar className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Détails de l&rsquo;événement</h2>
          </div>
          <div className="flex items-center space-x-1">
            {/* Discreet delete button */}
            {onDelete && !showConfirmation && (
              <button
                onClick={handleDeleteClick}
                className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
                title="Supprimer l'événement"
              >
                <Trash2 className="h-4 w-4 text-gray-400 group-hover:text-red-500 transition-colors" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Title and Type */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">{event.title}</h3>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${eventTypeColors[event.type] || 'text-gray-600 bg-gray-50'}`}>
              <Tag className="h-3 w-3 mr-1" />
              {eventTypeLabels[event.type] || event.type}
            </span>
          </div>

          {/* Date and Time */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
              <Calendar className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium text-blue-900">{formatDate(event.startTime)}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
              <Clock className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-green-900">
                  {formatTime(event.startTime)} - {formatTime(event.endTime)}
                </p>
              </div>
            </div>
          </div>

          {/* Location */}
          {event.location && (
            <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
              <MapPin className="h-5 w-5 text-purple-600" />
              <p className="font-medium text-purple-900">{event.location}</p>
            </div>
          )}

          {/* Description */}
          {event.description && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
              <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{event.description}</p>
            </div>
          )}
        </div>

        {/* Confirmation overlay - shown when delete is clicked */}
        {onDelete && showConfirmation && (
          <div className="px-6 pb-6">
            <div className="space-y-3">
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-sm text-red-800 font-medium mb-3">
                  Êtes-vous sûr de vouloir supprimer cet événement ? Cette action est irréversible.
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={handleConfirmDelete}
                    disabled={isDeleting}
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-medium rounded-lg transition-colors"
                  >
                    {isDeleting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Suppression...</span>
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4" />
                        <span>Confirmer</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleCancelDelete}
                    disabled={isDeleting}
                    className="flex-1 px-4 py-2 bg-white hover:bg-gray-50 disabled:bg-gray-100 text-gray-700 font-medium rounded-lg transition-colors border border-gray-300"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}