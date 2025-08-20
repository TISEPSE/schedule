'use client';

import { useState } from 'react';
import { useApiData } from '@/hooks/useApiData';
import { 
  Database, 
  Cloud, 
  HardDrive, 
  RefreshCw, 
  Plus, 
  BookOpen,
  Calendar,
  Trash2,
  Wifi,
  WifiOff
} from 'lucide-react';

interface DataTestPanelProps {
  userId: string;
}

export default function DataTestPanel({ userId }: DataTestPanelProps) {
  const {
    assignments,
    events,
    syncing,
    isOnline,
    lastSync,
    error,
    createAssignment,
    createEvent,
    deleteAssignment,
    deleteEvent,
    syncNow,
    refreshData
  } = useApiData(userId);

  const [showPanel, setShowPanel] = useState(false);

  const handleCreateTestAssignment = async () => {
    const subjects = ['Mathématiques', 'Français', 'Histoire', 'Anglais', 'Sciences'];
    const types = ['homework', 'essay', 'research', 'reading'] as const;
    
    await createAssignment({
      title: `Test Devoir ${Date.now()}`,
      description: 'Devoir créé pour tester la synchronisation',
      subject: subjects[Math.floor(Math.random() * subjects.length)],
      type: types[Math.floor(Math.random() * types.length)],
      dueDate: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000),
      priority: 'medium'
    });
  };

  const handleCreateTestEvent = async () => {
    const eventTypes = ['course', 'practical', 'exam', 'study'] as const;
    
    await createEvent({
      title: `Test Événement ${Date.now()}`,
      description: 'Événement créé pour tester la synchronisation',
      type: eventTypes[Math.floor(Math.random() * eventTypes.length)],
      startTime: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000),
      endTime: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
      location: 'Salle Test'
    });
  };

  if (!showPanel) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setShowPanel(true)}
          className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
          title="Ouvrir le panel de test des données"
        >
          <Database className="h-5 w-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 bg-white border rounded-xl shadow-xl z-50 max-h-96 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gray-50 rounded-t-xl">
        <div className="flex items-center space-x-2">
          <Database className="h-5 w-5 text-blue-600" />
          <span className="font-semibold">Test Sync Neon</span>
        </div>
        <button
          onClick={() => setShowPanel(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>

      {/* Status */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            {isOnline ? (
              <>
                <Wifi className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-600">En ligne</span>
              </>
            ) : (
              <>
                <WifiOff className="h-4 w-4 text-red-500" />
                <span className="text-sm text-red-600">Hors ligne</span>
              </>
            )}
          </div>
          <button
            onClick={syncNow}
            disabled={syncing}
            className="flex items-center space-x-1 text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 disabled:opacity-50"
          >
            <RefreshCw className={`h-3 w-3 ${syncing ? 'animate-spin' : ''}`} />
            <span>{syncing ? 'Sync...' : 'Sync'}</span>
          </button>
        </div>
        
        {lastSync && (
          <div className="text-xs text-gray-500">
            Dernière sync: {lastSync.toLocaleTimeString()}
          </div>
        )}
        
        {error && (
          <div className="text-xs text-red-500 mt-1">
            ❌ {error}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="p-4 border-b">
        <h3 className="font-medium mb-2">Actions de test</h3>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleCreateTestAssignment}
            className="flex items-center justify-center space-x-1 text-sm bg-green-100 text-green-700 p-2 rounded hover:bg-green-200"
          >
            <Plus className="h-3 w-3" />
            <BookOpen className="h-3 w-3" />
            <span>Devoir</span>
          </button>
          
          <button
            onClick={handleCreateTestEvent}
            className="flex items-center justify-center space-x-1 text-sm bg-purple-100 text-purple-700 p-2 rounded hover:bg-purple-200"
          >
            <Plus className="h-3 w-3" />
            <Calendar className="h-3 w-3" />
            <span>Événement</span>
          </button>
          
          <button
            onClick={refreshData}
            className="flex items-center justify-center space-x-1 text-sm bg-yellow-100 text-yellow-700 p-2 rounded hover:bg-yellow-200 col-span-2"
          >
            <Database className="h-3 w-3" />
            <span>Rafraîchir les données</span>
          </button>
        </div>
      </div>

      {/* Data Overview */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4 mb-3">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <HardDrive className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium">Local</span>
            </div>
            <div className="text-xs text-gray-600">
              {assignments.length} devoirs<br />
              {events.length} événements
            </div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <Cloud className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Neon</span>
            </div>
            <div className="text-xs text-blue-600">
              Mock DB<br />
              Prêt à sync
            </div>
          </div>
        </div>

        {/* Recent Items */}
        {(assignments.length > 0 || events.length > 0) && (
          <div className="max-h-32 overflow-y-auto">
            <h4 className="text-xs font-medium text-gray-700 mb-1">Éléments récents:</h4>
            {assignments.slice(-2).map(assignment => (
              <div key={assignment.id} className="flex items-center justify-between text-xs py-1">
                <div className="flex items-center space-x-1">
                  <BookOpen className="h-3 w-3 text-green-600" />
                  <span className="truncate max-w-32">{assignment.title}</span>
                </div>
                <button
                  onClick={() => deleteAssignment(assignment.id)}
                  className="text-red-400 hover:text-red-600"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
            
            {events.slice(-2).map(event => (
              <div key={event.id} className="flex items-center justify-between text-xs py-1">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3 text-purple-600" />
                  <span className="truncate max-w-32">{event.title}</span>
                </div>
                <button
                  onClick={() => deleteEvent(event.id)}
                  className="text-red-400 hover:text-red-600"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}