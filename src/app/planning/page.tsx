'use client';

import { useAuth } from '@/context/AuthContext';
import { redirect } from 'next/navigation';
import MainLayout from '@/components/Layout/MainLayout';
import { useState } from 'react';
import { useApiData } from '@/hooks/useApiData';
import { 
  ChevronLeft, 
  ChevronRight, 
  Clock,
  MapPin,
  BookOpen,
  AlertCircle,
  Calendar,
  Filter,
  GraduationCap,
  Camera,
  Upload,
  FileImage,
  Download,
  Globe
} from 'lucide-react';
import { getDayName, getWeekDates, getNextDateForDay, isToday } from '@/lib/dateUtils';

// Types pour les filtres
type FilterType = 'all' | 'courses' | 'assignments' | 'exams' | 'tasks' | 'events';

interface WeeklyItem {
  id: string;
  title: string;
  type: 'course' | 'practical' | 'exam' | 'project' | 'sport' | 'study' | 'assignment';
  day: string;
  startTime?: string;
  endTime?: string;
  dueTime?: string;
  location?: string;
  subject?: string;
  description: string;
  color: string;
  borderColor: string;
  bgColor: string;
  completed?: boolean;
  priority?: 'low' | 'medium' | 'high';
}

import { getItemColors } from '@/lib/colors';

export default function PlanningPage() {
  const { user, logout } = useAuth();
  const { events } = useApiData(user?.id || '');
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [activeFilter, setActiveFilter] = useState<FilterType>(user?.role === 'personal' ? 'tasks' : 'all');
  const [showOCRModal, setShowOCRModal] = useState(false);
  const [isProcessingOCR, setIsProcessingOCR] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importCredentials, setImportCredentials] = useState({
    platform: 'ecoledirecte' as 'ecoledirecte' | 'pronote' | 'netypareo',
    username: '',
    password: '',
    server: ''
  });

  if (!user) {
    redirect('/');
    return null;
  }


  const weekDates = getWeekDates(currentWeek);
  const weekStart = weekDates[0];
  const weekEnd = weekDates[6];

  // Convertir events et assignments en format unifié
  const weeklyItems: WeeklyItem[] = [
    // Événements (cours, examens, etc.)
    ...events
      .filter(event => {
        const eventDate = new Date(event.startTime);
        return eventDate >= weekStart && eventDate <= weekEnd;
      })
      .map(event => {
        const colors = getItemColors(event.type, undefined, event.title);
        return {
          id: event.id,
          title: event.title,
          type: event.type,
          day: getDayName(new Date(event.startTime)),
          startTime: new Date(event.startTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
          endTime: new Date(event.endTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
          location: event.location,
          description: event.description,
          color: colors.background,
          borderColor: colors.border,
          bgColor: colors.backgroundLight
        };
      }),
    // Note: Les devoirs sont maintenant gérés dans la page "Mes devoirs" avec un kanban board
  ];

  // Filtrer selon le type d'utilisateur
  const filteredItems = weeklyItems.filter(item => {
    if (user.role === 'personal') {
      if (activeFilter === 'tasks') return item.type === 'assignment';
      if (activeFilter === 'events') return ['course', 'practical', 'exam', 'project', 'sport', 'study'].includes(item.type);
      return true; // fallback
    } else {
      const courseTypes = ['course', 'practical', 'exam'];
      if (activeFilter === 'all') return courseTypes.includes(item.type);
      if (activeFilter === 'courses') return ['course', 'practical'].includes(item.type);
      if (activeFilter === 'exams') return item.type === 'exam';
      return courseTypes.includes(item.type);
    }
  });

  // Grouper par jour
  const itemsByDay = filteredItems.reduce((acc, item) => {
    if (!acc[item.day]) acc[item.day] = [];
    acc[item.day].push(item);
    return acc;
  }, {} as Record<string, WeeklyItem[]>);

  // Trier les éléments de chaque jour par heure
  Object.keys(itemsByDay).forEach(day => {
    itemsByDay[day].sort((a, b) => {
      const timeA = a.startTime || a.dueTime || '00:00';
      const timeB = b.startTime || b.dueTime || '00:00';
      return timeA.localeCompare(timeB);
    });
  });

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(currentWeek.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeek(newWeek);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
    }
  };

  const processOCR = async () => {
    if (!selectedImage) return;
    
    setIsProcessingOCR(true);
    
    try {
      const formData = new FormData();
      formData.append('image', selectedImage);
      
      const response = await fetch('/api/ocr', {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('OCR Result:', result);
        
        // Convertir les items OCR en événements
        if (result.scheduleItems && result.scheduleItems.length > 0) {
          const newEvents = result.scheduleItems.map((item: { day: string; time: string; title: string; location?: string }) => {
            const eventDate = getNextDateForDay(item.day);
            const [hours, minutes] = item.time.split(':');
            const startTime = new Date(eventDate);
            startTime.setHours(parseInt(hours), parseInt(minutes));
            
            const endTime = new Date(startTime);
            endTime.setHours(startTime.getHours() + 1); // Par défaut 1h
            
            return {
              id: `ocr-${Date.now()}-${Math.random()}`,
              title: item.title,
              type: 'course' as const,
              startTime: startTime.toISOString(),
              endTime: endTime.toISOString(),
              location: item.location || '',
              description: `Importé depuis OCR - ${item.title}`,
              userId: user?.id
            };
          });
          
          // Sauvegarder les nouveaux événements
          for (const event of newEvents) {
            await fetch('/api/events', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(event)
            });
          }
          
          // Recharger la page pour afficher les nouveaux événements
          window.location.reload();
        }
      }
    } catch (error) {
      console.error('Erreur OCR:', error);
      alert('Erreur lors du traitement de l&apos;image. Veuillez réessayer.');
    } finally {
      setIsProcessingOCR(false);
      setShowOCRModal(false);
      setSelectedImage(null);
    }
  };


  const handleImportFromPlatform = async () => {
    setIsImporting(true);
    
    try {
      const response = await fetch(`/api/import/${importCredentials.platform}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: importCredentials.username,
          password: importCredentials.password,
          server: importCredentials.server,
          userId: user?.id
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('Import result:', result);
        
        // Recharger la page pour afficher les nouveaux événements
        window.location.reload();
      } else {
        const error = await response.json();
        alert(`Erreur d'import: ${error.message}`);
      }
    } catch (error) {
      console.error('Erreur import:', error);
      alert('Erreur lors de l&apos;import. Veuillez vérifier vos identifiants.');
    } finally {
      setIsImporting(false);
      setShowImportModal(false);
      setImportCredentials({
        platform: 'ecoledirecte',
        username: '',
        password: '',
        server: ''
      });
    }
  };

  // Fonction supprimée - plus besoin de coches pour les cours

  const dayNames = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
  const dayKeys = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  const filters = user.role === 'personal' ? [
    { key: 'tasks', label: 'Tâches', icon: BookOpen },
    { key: 'events', label: 'Événements', icon: Calendar }
  ] : [
    { key: 'all', label: 'Tous', icon: Calendar },
    { key: 'courses', label: 'Cours', icon: GraduationCap },
    { key: 'exams', label: 'Examens', icon: AlertCircle }
  ];

  return (
    <MainLayout user={user} onLogout={logout}>
      <div className="space-y-6">
        
        {/* Header avec navigation et filtres - Consistent avec les autres pages */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 page-animate-delay-1">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center justify-between flex-1">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Mon emploi du temps</h1>
                <p className="text-gray-600">Vue hebdomadaire de vos cours</p>
              </div>
              
              {/* Boutons d'import */}
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowOCRModal(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                >
                  <Camera className="h-5 w-5" />
                  <span className="font-medium">Scanner</span>
                </button>
                
                <button
                  onClick={() => setShowImportModal(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                >
                  <Download className="h-5 w-5" />
                  <span className="font-medium">Importer</span>
                </button>
              </div>
            </div>
            
            {/* Navigation semaine */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => navigateWeek('prev')}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <div className="px-4 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg font-medium">
                Semaine du {weekStart.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })} au{' '}
                {weekEnd.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
              </div>
              <button
                onClick={() => navigateWeek('next')}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Filtres responsive */}
          <div className="flex items-center space-x-2 overflow-x-auto">
            <Filter className="h-5 w-5 text-gray-500 flex-shrink-0" />
            <div className="flex space-x-2">
              {filters.map((filter) => {
                const IconComponent = filter.icon;
                return (
                  <button
                    key={filter.key}
                    onClick={() => setActiveFilter(filter.key as FilterType)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                      activeFilter === filter.key 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <IconComponent className="h-4 w-4" />
                    <span className="hidden sm:inline">{filter.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Vue hebdomadaire - Design responsive */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 page-animate-delay-2">
          {/* Desktop View */}
          <div className="hidden lg:block p-6">
            <div className="grid grid-cols-7 gap-4">
              {dayKeys.map((dayKey, index) => {
                const dayItems = itemsByDay[dayKey] || [];
                const dayDate = weekDates[index];
                const todayCheckDesktop = isToday(dayDate);
                const isWeekend = dayKey === 'saturday' || dayKey === 'sunday';

                return (
                  <div 
                    key={dayKey} 
                    className={`${isWeekend ? 'opacity-60' : ''} rounded-xl`}
                  >
                  {/* Header du jour - Style uniforme */}
                  <div className="text-center mb-4 pb-3 border-b border-gray-200">
                    <div className="font-semibold text-gray-900 mb-2">{dayNames[index]}</div>
                    <div className={`text-2xl font-bold w-10 h-10 mx-auto rounded-full flex items-center justify-center transition-colors ${
                      todayCheckDesktop 
                        ? 'bg-blue-500 text-white shadow-md' 
                        : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
                    }`}>
                      {dayDate.getDate()}
                    </div>
                  </div>

                  {/* Éléments du jour */}
                  <div className="space-y-4 min-h-[300px]">
                    {dayItems.length === 0 ? (
                      <div className="p-6 text-center text-gray-500 bg-gray-50 rounded-xl">
                        <Calendar className="h-8 w-8 mx-auto mb-3 text-gray-400" />
                        <p className="text-sm font-medium">Aucun élément</p>
                        <p className="text-xs text-gray-400 mt-1">Journée libre</p>
                      </div>
                    ) : (
                      dayItems.map(item => (
                        <div
                          key={item.id}
                          className={`p-4 rounded-xl ${item.bgColor} hover:shadow-lg hover:scale-[1.02] transition-all duration-300 ease-out cursor-pointer group border border-gray-200 hover:border-gray-300`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="mb-2">
                                <h4 className="font-semibold text-sm leading-tight text-gray-900">
                                  {item.title}
                                </h4>
                              </div>
                              
                              <div className="space-y-2 text-xs text-gray-600 mb-3">
                                <div className="flex items-center space-x-2">
                                  <Clock className="h-3 w-3 flex-shrink-0" />
                                  <span className="font-medium">
                                    {item.type === 'assignment'
                                      ? `À rendre pour ${item.dueTime}`
                                      : `${item.startTime} - ${item.endTime}`
                                    }
                                  </span>
                                </div>
                                
                                {item.location && (
                                  <div className="flex items-center space-x-2">
                                    <MapPin className="h-3 w-3 flex-shrink-0" />
                                    <span className="truncate">{item.location}</span>
                                  </div>
                                )}
                                
                                {item.subject && (
                                  <div className="flex items-center space-x-2">
                                    <BookOpen className="h-3 w-3 flex-shrink-0" />
                                    <span className="truncate font-medium">{item.subject}</span>
                                  </div>
                                )}
                              </div>
                              
                              {item.description && (
                                <p className="text-xs text-gray-500 mb-3 line-clamp-2">{item.description}</p>
                              )}
                              
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
            </div>
          </div>

          {/* Mobile View */}
          <div className="lg:hidden">
            {dayKeys.map((dayKey, index) => {
              const dayItems = itemsByDay[dayKey] || [];
              const dayDate = weekDates[index];
              const todayCheck = isToday(dayDate);
              const isWeekend = dayKey === 'saturday' || dayKey === 'sunday';

              // Ne montrer que les jours avec du contenu + aujourd'hui
              if (!todayCheck && dayItems.length === 0) return null;

              return (
                <div 
                  key={dayKey} 
                  className={`mb-6 ${isWeekend ? 'opacity-75' : ''}`}
                >
                  {/* Header du jour mobile */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-t-xl">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${
                        todayCheck 
                          ? 'bg-blue-500 text-white shadow-md' 
                          : 'bg-white text-gray-700 border border-gray-200'
                      }`}>
                        {dayDate.getDate()}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">{dayNames[index]}</h3>
                        <p className="text-sm text-gray-500">{dayItems.length} événement(s)</p>
                      </div>
                    </div>
                    {todayCheck && (
                      <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                        Aujourd&apos;hui
                      </div>
                    )}
                  </div>

                  {/* Contenu du jour mobile */}
                  <div className="bg-white rounded-b-xl border border-gray-100">
                    {dayItems.length === 0 ? (
                      <div className="p-6 text-center text-gray-500">
                        <Calendar className="h-10 w-10 mx-auto mb-3 text-gray-400" />
                        <p className="font-medium">Aucun événement</p>
                        <p className="text-sm text-gray-400 mt-1">Journée libre</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-100">
                        {dayItems.map((item) => (
                          <div
                            key={item.id}
                            className={`p-4 ${item.bgColor} hover:bg-opacity-80 transition-colors active:scale-[0.98] transition-transform`}
                          >
                            <div className="flex items-start space-x-4">
                              {/* Indicateur de temps/couleur */}
                              <div className={`w-1 h-16 rounded-full ${item.borderColor} flex-shrink-0 mt-1`}></div>
                              
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-base leading-tight text-gray-900 mb-2">
                                  {item.title}
                                </h4>
                                
                                <div className="space-y-2 text-sm text-gray-600 mb-2">
                                  <div className="flex items-center space-x-2">
                                    <Clock className="h-4 w-4 flex-shrink-0 text-gray-500" />
                                    <span className="font-medium">
                                      {item.type === 'assignment'
                                        ? `À rendre pour ${item.dueTime}`
                                        : `${item.startTime} - ${item.endTime}`
                                      }
                                    </span>
                                  </div>
                                  
                                  {item.location && (
                                    <div className="flex items-center space-x-2">
                                      <MapPin className="h-4 w-4 flex-shrink-0 text-gray-500" />
                                      <span className="truncate">{item.location}</span>
                                    </div>
                                  )}
                                  
                                  {item.subject && (
                                    <div className="flex items-center space-x-2">
                                      <BookOpen className="h-4 w-4 flex-shrink-0 text-gray-500" />
                                      <span className="truncate font-medium">{item.subject}</span>
                                    </div>
                                  )}
                                </div>
                                
                                {item.description && (
                                  <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
                                    {item.description}
                                  </p>
                                )}
                              </div>
                              
                              {/* Chevron pour indiquer qu'on peut interagir */}
                              <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0 mt-2" />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal OCR */}
        {showOCRModal && (
          <div className="fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Camera className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Scanner un planning</h3>
                <p className="text-gray-600 text-sm">Prenez une photo de votre planning papier pour l&apos;importer automatiquement</p>
              </div>

              <div className="space-y-4">
                {/* Zone d'upload */}
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-purple-400 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    {selectedImage ? (
                      <div className="space-y-2">
                        <FileImage className="h-8 w-8 text-green-600 mx-auto" />
                        <p className="text-sm font-medium text-green-600">{selectedImage.name}</p>
                        <p className="text-xs text-gray-500">Cliquez pour changer l&apos;image</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="h-8 w-8 text-gray-400 mx-auto" />
                        <p className="text-sm font-medium text-gray-600">Cliquez pour sélectionner une image</p>
                        <p className="text-xs text-gray-500">ou glissez-déposez votre photo ici</p>
                      </div>
                    )}
                  </label>
                </div>

                {/* Boutons */}
                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      setShowOCRModal(false);
                      setSelectedImage(null);
                    }}
                    className="flex-1 px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={processOCR}
                    disabled={!selectedImage || isProcessingOCR}
                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center space-x-2"
                  >
                    {isProcessingOCR ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        <span>Traitement...</span>
                      </>
                    ) : (
                      <>
                        <Camera className="h-4 w-4" />
                        <span>Scanner</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal Import EcoleDirecte/Pronote */}
        {showImportModal && (
          <div className="fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-black mb-2">Importer depuis une plateforme</h3>
                <p className="text-gray-800 text-sm">Connectez-vous à EcoleDirecte ou Pronote pour importer automatiquement votre planning</p>
              </div>

              <div className="space-y-4">
                {/* Sélection de la plateforme */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Plateforme</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setImportCredentials({...importCredentials, platform: 'ecoledirecte'})}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        importCredentials.platform === 'ecoledirecte'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 hover:border-gray-400 bg-white'
                      }`}
                    >
                      <div className={`font-medium text-sm ${
                        importCredentials.platform === 'ecoledirecte' ? 'text-blue-700' : 'text-black'
                      }`}>EcoleDirecte</div>
                    </button>
                    <button
                      onClick={() => setImportCredentials({...importCredentials, platform: 'pronote'})}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        importCredentials.platform === 'pronote'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 hover:border-gray-400 bg-white'
                      }`}
                    >
                      <div className={`font-medium text-sm ${
                        importCredentials.platform === 'pronote' ? 'text-blue-700' : 'text-black'
                      }`}>Pronote</div>
                    </button>
                    <button
                      onClick={() => setImportCredentials({...importCredentials, platform: 'netypareo'})}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        importCredentials.platform === 'netypareo'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 hover:border-gray-400 bg-white'
                      }`}
                    >
                      <div className={`font-medium text-sm ${
                        importCredentials.platform === 'netypareo' ? 'text-blue-700' : 'text-black'
                      }`}>Nétyparéo</div>
                    </button>
                  </div>
                </div>

                {/* Champs de connexion */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Nom d&apos;utilisateur</label>
                  <input
                    type="text"
                    value={importCredentials.username}
                    onChange={(e) => setImportCredentials({...importCredentials, username: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black bg-white"
                    placeholder="Votre nom d'utilisateur"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">Mot de passe</label>
                  <input
                    type="password"
                    value={importCredentials.password}
                    onChange={(e) => setImportCredentials({...importCredentials, password: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black bg-white"
                    placeholder="Votre mot de passe"
                  />
                </div>

                {(importCredentials.platform === 'pronote' || importCredentials.platform === 'netypareo') && (
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      {importCredentials.platform === 'pronote' ? 'Serveur (URL)' : 'URL Nétyparéo'}
                    </label>
                    <input
                      type="text"
                      value={importCredentials.server}
                      onChange={(e) => setImportCredentials({...importCredentials, server: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black bg-white"
                      placeholder={
                        importCredentials.platform === 'pronote' 
                          ? "https://votre-etablissement.index-education.net"
                          : "https://plan.afpi-bretagne.com"
                      }
                    />
                  </div>
                )}

                {/* Boutons */}
                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => {
                      setShowImportModal(false);
                      setImportCredentials({
                        platform: 'ecoledirecte',
                        username: '',
                        password: '',
                        server: ''
                      });
                    }}
                    className="flex-1 px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleImportFromPlatform}
                    disabled={!importCredentials.username || !importCredentials.password || isImporting || 
                             ((importCredentials.platform === 'pronote' || importCredentials.platform === 'netypareo') && !importCredentials.server)}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center space-x-2"
                  >
                    {isImporting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        <span>Import...</span>
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4" />
                        <span>Importer</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}