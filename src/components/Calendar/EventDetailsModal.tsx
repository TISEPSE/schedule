'use client';

import { useEffect } from 'react';
import { X, Clock, MapPin, Calendar, Tag } from 'lucide-react';

interface EventDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
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

export default function EventDetailsModal({ isOpen, onClose, event }: EventDetailsModalProps) {
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
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
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

      </div>
    </div>
  );
}