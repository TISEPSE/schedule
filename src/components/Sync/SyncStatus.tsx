'use client';

import { useState, useEffect } from 'react';
import { SyncService, SyncStatus as SyncStatusType } from '@/lib/services/syncService';
import { WifiOff, RefreshCw, Clock, AlertCircle, CheckCircle } from 'lucide-react';

interface SyncStatusProps {
  className?: string;
}

export default function SyncStatus({ className = '' }: SyncStatusProps) {
  const [syncStatus, setSyncStatus] = useState<SyncStatusType>(SyncService.getSyncStatus());

  useEffect(() => {
    // Initialize sync service
    SyncService.initialize();

    // Subscribe to status changes
    const unsubscribe = SyncService.subscribe(setSyncStatus);

    return unsubscribe;
  }, []);

  const handleManualSync = async () => {
    if (!syncStatus.syncing) {
      await SyncService.syncToCloud();
    }
  };

  const getStatusIcon = () => {
    if (syncStatus.syncing) {
      return <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />;
    }
    
    if (!syncStatus.isOnline) {
      return <WifiOff className="h-4 w-4 text-red-500" />;
    }
    
    if (syncStatus.error) {
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
    
    if (syncStatus.pendingChanges > 0) {
      return <Clock className="h-4 w-4 text-yellow-500" />;
    }
    
    return <CheckCircle className="h-4 w-4 text-green-500" />;
  };

  const getStatusText = () => {
    if (syncStatus.syncing) {
      return 'Synchronisation...';
    }
    
    if (!syncStatus.isOnline) {
      return 'Hors ligne';
    }
    
    if (syncStatus.error) {
      return 'Erreur de sync';
    }
    
    if (syncStatus.pendingChanges > 0) {
      return `${syncStatus.pendingChanges} en attente`;
    }
    
    if (syncStatus.lastSync) {
      return `Sync: ${syncStatus.lastSync.toLocaleTimeString()}`;
    }
    
    return 'Jamais synchronisé';
  };

  const getStatusColor = () => {
    if (syncStatus.syncing) return 'text-blue-600';
    if (!syncStatus.isOnline) return 'text-red-600';
    if (syncStatus.error) return 'text-red-600';
    if (syncStatus.pendingChanges > 0) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {getStatusIcon()}
      <span className={`text-sm ${getStatusColor()}`}>
        {getStatusText()}
      </span>
      
      {syncStatus.isOnline && !syncStatus.syncing && (
        <button
          onClick={handleManualSync}
          className="p-1 hover:bg-gray-100 rounded"
          title="Synchroniser maintenant"
        >
          <RefreshCw className="h-3 w-3 text-gray-500" />
        </button>
      )}
      
      {syncStatus.error && (
        <div className="text-xs text-red-500 max-w-xs truncate" title={syncStatus.error}>
          {syncStatus.error}
        </div>
      )}
    </div>
  );
}