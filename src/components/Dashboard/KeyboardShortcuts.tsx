'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Keyboard, X, Command, Plus, BookOpen } from 'lucide-react';
import { UserRole } from '@/types';

interface KeyboardShortcutsProps {
  userRole: UserRole;
}

interface Shortcut {
  keys: string[];
  description: string;
  action: () => void;
  category: 'navigation' | 'creation' | 'views';
}

export default function KeyboardShortcuts({ userRole }: KeyboardShortcutsProps) {
  const [showModal, setShowModal] = useState(false);
  const [shortcuts, setShortcuts] = useState<Shortcut[]>([]);
  const router = useRouter();

  // Define shortcuts based on user role
  useEffect(() => {
    const baseShortcuts: Shortcut[] = [
      // Navigation shortcuts
      {
        keys: ['Ctrl', 'H'],
        description: 'Aller au tableau de bord',
        action: () => router.push('/'),
        category: 'navigation'
      },
      {
        keys: ['Ctrl', 'C'],
        description: 'Ouvrir le calendrier',
        action: () => router.push('/calendar'),
        category: 'navigation'
      },
      {
        keys: ['Ctrl', 'S'],
        description: 'Ouvrir les paramètres',
        action: () => router.push('/settings'),
        category: 'navigation'
      },
      {
        keys: ['?'],
        description: 'Afficher les raccourcis',
        action: () => setShowModal(true),
        category: 'views'
      },
    ];

    const roleSpecificShortcuts: Record<UserRole, Shortcut[]> = {
      student: [
        {
          keys: ['Ctrl', 'D'],
          description: 'Mes devoirs',
          action: () => router.push('/devoirs'),
          category: 'navigation'
        },
        {
          keys: ['Ctrl', 'P'],
          description: 'Mon planning',
          action: () => router.push('/planning'),
          category: 'navigation'
        },
        {
          keys: ['Ctrl', 'N'],
          description: 'Nouveau devoir',
          action: () => router.push('/devoirs?new=true'),
          category: 'creation'
        },
      ],
      personal: [
        {
          keys: ['Ctrl', 'B'],
          description: 'Mes notes',
          action: () => router.push('/notes'),
          category: 'navigation'
        },
        {
          keys: ['Ctrl', 'G'],
          description: 'Mes projets',
          action: () => router.push('/projects'),
          category: 'navigation'
        },
        {
          keys: ['Ctrl', 'R'],
          description: 'Mes projets',
          action: () => router.push('/projects'),
          category: 'navigation'
        },
        {
          keys: ['Ctrl', 'N'],
          description: 'Nouvelle tâche',
          action: () => router.push('/devoirs?new=true'),
          category: 'creation'
        },
        {
          keys: ['Ctrl', 'Shift', 'N'],
          description: 'Nouvelle note',
          action: () => router.push('/notes'),
          category: 'creation'
        },
      ],
      admin: [
        {
          keys: ['Ctrl', 'U'],
          description: 'Gestion utilisateurs',
          action: () => router.push('/classes'),
          category: 'navigation'
        },
        {
          keys: ['Ctrl', 'A'],
          description: 'Administration',
          action: () => router.push('/admin'),
          category: 'navigation'
        },
      ],
    };

    setShortcuts([...baseShortcuts, ...roleSpecificShortcuts[userRole]]);
  }, [userRole, router]);

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      const pressedKeys: string[] = [];
      if (event.ctrlKey) pressedKeys.push('Ctrl');
      if (event.shiftKey) pressedKeys.push('Shift');
      if (event.altKey) pressedKeys.push('Alt');
      if (event.key !== 'Control' && event.key !== 'Shift' && event.key !== 'Alt') {
        pressedKeys.push(event.key.toUpperCase());
      }

      // Find matching shortcut
      const matchingShortcut = shortcuts.find(shortcut => 
        shortcut.keys.length === pressedKeys.length &&
        shortcut.keys.every((key, index) => key === pressedKeys[index] || key.toUpperCase() === pressedKeys[index])
      );

      if (matchingShortcut) {
        event.preventDefault();
        matchingShortcut.action();
        setShowModal(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'navigation': return <BookOpen className="h-4 w-4" />;
      case 'creation': return <Plus className="h-4 w-4" />;
      case 'views': return <Keyboard className="h-4 w-4" />;
      default: return <Command className="h-4 w-4" />;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'navigation': return 'Navigation';
      case 'creation': return 'Création';
      case 'views': return 'Affichage';
      default: return 'Autre';
    }
  };

  const groupedShortcuts = shortcuts.reduce((acc, shortcut) => {
    if (!acc[shortcut.category]) {
      acc[shortcut.category] = [];
    }
    acc[shortcut.category].push(shortcut);
    return acc;
  }, {} as Record<string, Shortcut[]>);

  return (
    <>
      {/* Help button */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-4 right-4 bg-gray-900 hover:bg-gray-800 text-white p-3 rounded-full shadow-lg transition-colors z-40"
        title="Raccourcis clavier (Appuyez sur ?)"
      >
        <Keyboard className="h-5 w-5" />
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Raccourcis clavier</h2>
                <p className="text-gray-600 text-sm">Gagnez du temps avec ces raccourcis</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {Object.entries(groupedShortcuts).map(([category, categoryShortcuts]) => (
                <div key={category} className="mb-6 last:mb-0">
                  <div className="flex items-center space-x-2 mb-3">
                    {getCategoryIcon(category)}
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                      {getCategoryLabel(category)}
                    </h3>
                  </div>
                  
                  <div className="space-y-2">
                    {categoryShortcuts.map((shortcut, index) => (
                      <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                        <span className="text-gray-700">{shortcut.description}</span>
                        <div className="flex items-center space-x-1">
                          {shortcut.keys.map((key, keyIndex) => (
                            <span key={keyIndex} className="flex items-center">
                              <kbd className="px-2 py-1 text-xs bg-gray-100 border border-gray-300 rounded text-gray-900 font-mono">
                                {key}
                              </kbd>
                              {keyIndex < shortcut.keys.length - 1 && (
                                <span className="mx-1 text-gray-400">+</span>
                              )}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-4 bg-gray-50 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Astuce: Les raccourcis ne fonctionnent pas lorsque vous tapez dans un champ de texte.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}