'use client';

import { useState } from 'react';
import { Plus, FileText, Calendar, Users, X } from 'lucide-react';

interface FloatingActionButtonProps {
  onCreateAssignment: () => void;
  onCreateClass: () => void;
  onCreateSchedule: () => void;
}

export default function FloatingActionButton({ 
  onCreateAssignment, 
  onCreateClass, 
  onCreateSchedule 
}: FloatingActionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    {
      icon: FileText,
      label: 'Nouveau devoir',
      action: onCreateAssignment,
      color: 'bg-blue-600 hover:bg-blue-700',
    },
    {
      icon: Users,
      label: 'Nouvelle classe',
      action: onCreateClass,
      color: 'bg-green-600 hover:bg-green-700',
    },
    {
      icon: Calendar,
      label: 'Nouveau cours',
      action: onCreateSchedule,
      color: 'bg-purple-600 hover:bg-purple-700',
    },
  ];

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-25 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* FAB Container - Mobile uniquement */}
      <div className="fixed bottom-6 right-6 z-50 md:hidden">
        {/* Actions Menu */}
        {isOpen && (
          <div className="absolute bottom-16 right-0 space-y-3 animate-in slide-in-from-bottom-2 duration-200">
            {actions.map((action, index) => {
              const Icon = action.icon;
              return (
                <div
                  key={index}
                  className="flex items-center space-x-3 animate-in slide-in-from-right-1 duration-200"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <span className="bg-white px-3 py-2 rounded-lg shadow-lg text-sm font-medium text-gray-800 whitespace-nowrap">
                    {action.label}
                  </span>
                  <button
                    onClick={() => {
                      action.action();
                      setIsOpen(false);
                    }}
                    className={`w-12 h-12 rounded-full ${action.color} text-white shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200 flex items-center justify-center`}
                  >
                    <Icon className="h-5 w-5" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Main FAB Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transform transition-all duration-200 flex items-center justify-center ${
            isOpen ? 'rotate-45 scale-110' : 'hover:scale-110'
          }`}
        >
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Plus className="h-6 w-6" />
          )}
        </button>
      </div>
    </>
  );
}