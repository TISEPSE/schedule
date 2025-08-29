'use client';

import { useAuth } from '@/context/AuthContext';
import { redirect } from 'next/navigation';
import MainLayout from '@/components/Layout/MainLayout';
import { useState } from 'react';

interface SyncEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  room: string;
  description?: string;
  source?: string;
}

interface SyncAssignment {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  status: string;
  description?: string;
}

interface SyncGrade {
  id: string;
  subject: string;
  assignment: string;
  grade: string;
  date: string;
}

interface SyncNews {
  id: string;
  title: string;
  content: string;
  date: string;
}

interface SyncData {
  events: SyncEvent[];
  assignments: SyncAssignment[];
  grades: SyncGrade[];
  news: SyncNews[];
}
import { 
  Settings, 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  Eye, 
  EyeOff, 
  Calendar,
  BookOpen,
  GraduationCap,
  Bell,
  CheckCircle
} from 'lucide-react';

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [netypareoCredentials, setNetypareoCredentials] = useState({
    username: '',
    password: ''
  });
  const [connectionStatus, setConnectionStatus] = useState('disconnected'); // 'disconnected' | 'connecting' | 'connected' | 'error'
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [syncData, setSyncData] = useState<SyncData>({
    events: [],
    assignments: [],
    grades: [],
    news: []
  });
  const [isLoading, setIsLoading] = useState(false);

  if (!user) {
    redirect('/');
  }

  const handleConnect = async () => {
    setIsLoading(true);
    setConnectionStatus('connecting');
    
    try {
      console.log('🚀 Connexion à NetYParéo...');
      
      // Appel à l'API de scrapping réelle
      const response = await fetch('/api/netypareo/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: netypareoCredentials.username,
          password: netypareoCredentials.password
        })
      });

      const responseText = await response.text();
      console.log('📄 Réponse brute:', responseText.substring(0, 500));
      
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error('❌ Erreur de parsing JSON:', parseError);
        console.log('📄 Réponse complète:', responseText);
        throw new Error('Réponse invalide du serveur - probablement une page HTML d\'erreur');
      }

      if (!response.ok) {
        throw new Error(result.error || 'Erreur de connexion');
      }

      if (result.success) {
        console.log('✅ Données récupérées:', result.data);
        setSyncData(result.data);
        setConnectionStatus('connected');
        setLastSync(new Date(result.lastSync));
      } else {
        throw new Error('Connexion échouée');
      }
      
    } catch (error: unknown) {
      setConnectionStatus('error');
      console.error('❌ Erreur de connexion NetYParéo:', error);
      
      // Afficher l'erreur à l'utilisateur
      alert(`Erreur de connexion: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = () => {
    setConnectionStatus('disconnected');
    setSyncData({ events: [], assignments: [], grades: [], news: [] });
    setLastSync(null);
    setNetypareoCredentials({ username: '', password: '' });
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'text-green-600';
      case 'connecting': return 'text-orange-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected': return <Wifi className={`h-5 w-5 ${getStatusColor()}`} />;
      case 'connecting': return <RefreshCw className={`h-5 w-5 ${getStatusColor()} animate-spin`} />;
      case 'error': return <WifiOff className={`h-5 w-5 ${getStatusColor()}`} />;
      default: return <WifiOff className={`h-5 w-5 ${getStatusColor()}`} />;
    }
  };

  return (
    <MainLayout user={user} onLogout={logout}>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Paramètres NetYParéo</h1>
              <p className="text-gray-600">Connectez-vous pour synchroniser toutes vos données</p>
            </div>
            <Settings className="h-8 w-8 text-gray-400" />
          </div>
        </div>

        {/* Connexion NetYParéo */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              {getStatusIcon()}
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Connexion NetYParéo</h2>
                <p className={`text-sm ${getStatusColor()}`}>
                  {connectionStatus === 'disconnected' && 'Non connecté'}
                  {connectionStatus === 'connecting' && 'Connexion en cours...'}
                  {connectionStatus === 'connected' && 'Connecté'}
                  {connectionStatus === 'error' && 'Erreur de connexion'}
                </p>
              </div>
            </div>
            {lastSync && (
              <div className="text-right">
                <p className="text-sm text-gray-500">Dernière sync</p>
                <p className="text-xs text-gray-400">{lastSync.toLocaleString('fr-FR')}</p>
              </div>
            )}
          </div>

          {connectionStatus === 'disconnected' || connectionStatus === 'error' ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom d&apos;utilisateur
                  </label>
                  <input
                    type="text"
                    value={netypareoCredentials.username}
                    onChange={(e) => setNetypareoCredentials({...netypareoCredentials, username: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                    placeholder="Votre identifiant NetYParéo"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={netypareoCredentials.password}
                      onChange={(e) => setNetypareoCredentials({...netypareoCredentials, password: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10 text-gray-900 placeholder-gray-400"
                      placeholder="Votre mot de passe"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleConnect}
                  disabled={!netypareoCredentials.username || !netypareoCredentials.password || isLoading}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
                >
                  <Wifi className="h-4 w-4" />
                  <span>{isLoading ? 'Connexion...' : 'Se connecter'}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between bg-green-50 p-4 rounded-lg">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-900">Connecté à NetYParéo</span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handleConnect}
                  className="flex items-center space-x-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Synchroniser</span>
                </button>
                <button
                  onClick={handleDisconnect}
                  className="flex items-center space-x-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm"
                >
                  <WifiOff className="h-4 w-4" />
                  <span>Déconnecter</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Données synchronisées */}
        {connectionStatus === 'connected' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Planning */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Planning</h3>
                </div>
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                  {syncData.events.length} événements
                </span>
              </div>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {syncData.events.map((event, index) => (
                  <div key={event.id || index} className="p-3 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-gray-900">{event.title || "Événement"}</h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                      <span> 📅 {event.date || "Date inconnue"}</span>
                      <span> 🕒 {event.time || "Heure inconnue"}</span>
                      <span> 📍 {event.room || "Lieu inconnu"}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Devoirs */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5 text-green-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Devoirs</h3>
                </div>
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                  {syncData.assignments.length} devoirs
                </span>
              </div>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {syncData.assignments.map((assignment, index) => (
                  <div key={assignment.id || index} className="p-3 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-gray-900">{assignment.title}</h4>
                    <div className="flex items-center justify-between text-sm text-gray-600 mt-1">
                      <span>{assignment.subject}</span>
                      <span className="font-medium">à rendre le {assignment.dueDate}</span>
                    </div>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs mt-2 ${
                      assignment.status === 'En cours' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {assignment.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <GraduationCap className="h-5 w-5 text-purple-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Notes</h3>
                </div>
                <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-medium">
                  {syncData.grades.length} notes
                </span>
              </div>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {syncData.grades.map((grade, index) => (
                  <div key={grade.id || index} className="p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{grade.assignment}</h4>
                        <p className="text-sm text-gray-600">{grade.subject}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold text-purple-600">{grade.grade}</span>
                        <p className="text-xs text-gray-500">{grade.date}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actualités */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Bell className="h-5 w-5 text-orange-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Actualités</h3>
                </div>
                <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-medium">
                  {syncData.news.length} nouvelles
                </span>
              </div>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {syncData.news.map((news, index) => (
                  <div key={news.id || index} className="p-3 bg-orange-50 rounded-lg">
                    <h4 className="font-medium text-gray-900">{news.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{news.content}</p>
                    <p className="text-xs text-gray-500 mt-2">{news.date}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}