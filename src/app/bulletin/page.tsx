'use client';

import { useAuth } from '@/context/AuthContext';
import { redirect } from 'next/navigation';
import MainLayout from '@/components/Layout/MainLayout';
import { useState } from 'react';
import EmptyUserState from '@/components/EmptyState/EmptyUserState';
import { useTestUser } from '@/hooks/useTestUser';
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  BookOpen,
  Award,
  Target,
  BarChart3,
  PieChart,
  User,
  ChevronDown,
  MessageSquare
} from 'lucide-react';

// Mock data pour le bulletin
const mockBulletinData = {
  currentYear: "2023-2024",
  currentTrimester: "Trimestre 2",
  student: {
    name: "Marie Dupont",
    class: "BTS 1",
    rank: "3ème / 28 élèves"
  },
  years: ["2023-2024", "2022-2023", "2021-2022"],
  trimesters: ["Trimestre 1", "Trimestre 2", "Trimestre 3"],
  subjects: [
    {
      id: "math",
      name: "Mathématiques",
      average: 16.5,
      coefficient: 4,
      teacher: "M. Durand",
      notes: [15, 18, 16, 17],
      appreciation: "Très bon niveau. Élève sérieuse et appliquée. Continue ainsi !",
      color: "bg-blue-500"
    },
    {
      id: "physics",
      name: "Physique-Chimie", 
      average: 14.2,
      coefficient: 3,
      teacher: "Mme. Martin",
      notes: [13, 15, 14, 14.5],
      appreciation: "Bon travail général. Peut mieux faire en chimie.",
      color: "bg-green-500"
    },
    {
      id: "french",
      name: "Français",
      average: 13.8,
      coefficient: 3,
      teacher: "M. Petit",
      notes: [14, 12, 15, 14],
      appreciation: "Expression écrite à améliorer. Participation orale satisfaisante.",
      color: "bg-purple-500"
    },
    {
      id: "english",
      name: "Anglais",
      average: 17.2,
      coefficient: 2,
      teacher: "Mme. Smith",
      notes: [18, 16, 17, 18],
      appreciation: "Excellent niveau ! Très bon accent et participation active.",
      color: "bg-orange-500"
    },
    {
      id: "history",
      name: "Histoire-Géographie",
      average: 12.5,
      coefficient: 2,
      teacher: "M. Moreau",
      notes: [11, 13, 12, 14],
      appreciation: "Connaissances correctes. Méthode à approfondir.",
      color: "bg-red-500"
    },
    {
      id: "economy",
      name: "Économie",
      average: 15.8,
      coefficient: 4,
      teacher: "Mme. Dubois",
      notes: [16, 15, 16, 15.5],
      appreciation: "Très bonne compréhension des concepts. Élève motivée.",
      color: "bg-teal-500"
    }
  ],
  generalAppreciation: "Trimestre satisfaisant dans l'ensemble. Marie fait preuve de sérieux et de motivation. Il faut maintenir cet effort, particulièrement en Histoire-Géographie. Félicitations pour l'excellent niveau en Anglais et Mathématiques.",
  generalAverage: 15.1,
  absences: {
    justified: 2,
    unjustified: 0,
    delays: 1
  }
};

export default function BulletinPage() {
  const { user, logout } = useAuth();
  const [selectedYear, setSelectedYear] = useState(mockBulletinData.currentYear);
  const [selectedTrimester, setSelectedTrimester] = useState(mockBulletinData.currentTrimester);
  const { isTestUser } = useTestUser(user);

  if (!user) {
    redirect('/');
  }

  // Utilisateur test : interface normale mais données vides

  if (user.role === 'admin') {
    return (
      <MainLayout user={user} onLogout={logout}>
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Gestion des bulletins</h1>
                <p className="text-gray-600">Consultez et gérez les bulletins de tous les étudiants</p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-8 text-center">
              <p className="text-sm text-gray-500 mt-2">
                Fonctionnalités prévues : vue d&apos;ensemble, export PDF, statistiques générales...
              </p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  const getDisplayData = () => {
    if (isTestUser) {
      return {
        ...mockBulletinData,
        subjects: [],
        generalAverage: 0,
        absences: { justified: 0, unjustified: 0, delays: 0 },
        generalAppreciation: "",
        student: { name: "", class: "", rank: "" }
      };
    }
    return mockBulletinData;
  };

  const displayData = getDisplayData();

  const calculateWeightedAverage = () => {
    if (isTestUser || displayData.subjects.length === 0) {
      return '0.00';
    }
    const totalPoints = displayData.subjects.reduce((sum, subject) => 
      sum + (subject.average * subject.coefficient), 0
    );
    const totalCoefficients = displayData.subjects.reduce((sum, subject) => 
      sum + subject.coefficient, 0
    );
    return (totalPoints / totalCoefficients).toFixed(2);
  };

  return (
    <MainLayout user={user} onLogout={logout}>
      <div className="space-y-6">
        
        {/* Header avec sélecteurs */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Mon bulletin</h1>
              {displayData.student.name ? (
                <p className="text-gray-600">{displayData.student.name} - {displayData.student.class}</p>
              ) : (
                <p className="text-gray-600">Consultez vos résultats scolaires et appréciations</p>
              )}
            </div>
            
            {!isTestUser && (
              <div className="flex items-center space-x-4">
              {/* Sélecteur d'année */}
              <div className="relative">
                <select 
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="appearance-none bg-blue-50 border border-blue-200 text-blue-700 py-3 px-4 pr-8 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {displayData.years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-600 pointer-events-none" />
              </div>

              {/* Sélecteur de trimestre */}
              <div className="relative">
                <select 
                  value={selectedTrimester}
                  onChange={(e) => setSelectedTrimester(e.target.value)}
                  className="appearance-none bg-purple-50 border border-purple-200 text-purple-700 py-3 px-4 pr-8 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {displayData.trimesters.map(trimester => (
                    <option key={trimester} value={trimester}>{trimester}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-600 pointer-events-none" />
              </div>
              </div>
            )}
          </div>
        </div>

        {/* Statistiques générales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 font-medium">Moyenne générale</p>
                <p className="text-3xl font-bold">{calculateWeightedAverage()}</p>
              </div>
              <Target className="h-8 w-8 text-blue-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 font-medium">Classement</p>
                <p className="text-3xl font-bold">{displayData.student.rank ? displayData.student.rank.split(' ')[0] : '-'}</p>
                <p className="text-green-200 text-sm">{displayData.student.rank ? displayData.student.rank.split(' ').slice(1).join(' ') : 'sur - élèves'}</p>
              </div>
              <Award className="h-8 w-8 text-green-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 font-medium">Matières</p>
                <p className="text-3xl font-bold">{displayData.subjects.length}</p>
                <p className="text-orange-200 text-sm">évaluées</p>
              </div>
              <BookOpen className="h-8 w-8 text-orange-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 font-medium">Absences</p>
                <p className="text-3xl font-bold">{displayData.absences.justified + displayData.absences.unjustified}</p>
                <p className="text-purple-200 text-sm">{displayData.absences.delays} retard</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-200" />
            </div>
          </div>
        </div>

        {/* Section principale avec état vide pour utilisateur test */}
        {isTestUser ? (
          <EmptyUserState 
            user={user}
            title="Bulletin scolaire vide"
            description="Aucune donnée de bulletin n'est disponible pour cet utilisateur de test."
            icon="book"
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Notes par matière */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-2 mb-6">
              <BarChart3 className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Notes par matière</h2>
            </div>

            <div className="space-y-4">
              {displayData.subjects.map((subject) => (
                <div key={subject.id} className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 ${subject.color} rounded-full`}></div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{subject.name}</h3>
                        <p className="text-sm text-gray-600">Coef. {subject.coefficient} • {subject.teacher}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">{subject.average}</p>
                      <div className="flex items-center space-x-1">
                        {subject.average >= 15 ? (
                          <TrendingUp className="h-4 w-4 text-green-500" />
                        ) : subject.average >= 12 ? (
                          <div className="w-4 h-4 bg-orange-400 rounded-full"></div>
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-500" />
                        )}
                        <span className={`text-sm font-medium ${
                          subject.average >= 15 ? 'text-green-600' : 
                          subject.average >= 12 ? 'text-orange-600' : 'text-red-600'
                        }`}>
                          /20
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Barre de progression */}
                  <div className="mb-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${subject.color}`}
                        style={{ width: `${(subject.average / 20) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Notes individuelles */}
                  <div className="flex items-center justify-between text-sm mb-3">
                    <div className="flex space-x-2">
                      {subject.notes.map((note, index) => (
                        <span key={`${subject.id}-note-${index}`} className="px-2 py-1 bg-white rounded-lg font-medium text-gray-700">
                          {note}
                        </span>
                      ))}
                    </div>
                    <span className="text-gray-500">{subject.notes.length} notes</span>
                  </div>

                  {/* Appréciation du professeur */}
                  {subject.appreciation && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <MessageSquare className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-medium text-blue-700 mb-1">{subject.teacher}</p>
                          <p className="text-sm text-blue-800">{subject.appreciation}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Graphique et appréciations */}
          <div className="space-y-6">
            
            {/* Placeholder pour graphique */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center space-x-2 mb-6">
                <PieChart className="h-6 w-6 text-purple-600" />
                <h2 className="text-xl font-semibold text-gray-900">Répartition</h2>
              </div>
              
              <div className="text-center p-8 bg-gray-50 rounded-xl">
                <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <BarChart3 className="h-8 w-8 text-gray-500" />
                </div>
                <p className="text-gray-600 font-medium">Graphique dynamique</p>
                <p className="text-gray-500 text-sm mt-1">Visualisation des moyennes à venir</p>
              </div>
            </div>

            {/* Appréciation générale */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center space-x-2 mb-4">
                <MessageSquare className="h-6 w-6 text-green-600" />
                <h2 className="text-xl font-semibold text-gray-900">Appréciation générale</h2>
              </div>
              
              {displayData.generalAppreciation ? (
                <div className="p-4 bg-green-50 rounded-xl">
                  <div className="flex items-center space-x-2 mb-3">
                    <User className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-green-700">Conseil de classe</span>
                  </div>
                  <p className="text-green-800 leading-relaxed">
                    {displayData.generalAppreciation}
                  </p>
                </div>
              ) : (
                <div className="p-4 bg-gray-50 rounded-xl text-center">
                  <p className="text-gray-500">Aucune appréciation générale disponible</p>
                </div>
              )}
            </div>

            {/* Détail des absences */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center space-x-2 mb-4">
                <Calendar className="h-6 w-6 text-purple-600" />
                <h2 className="text-xl font-semibold text-gray-900">Détail des absences</h2>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <span className="text-red-700 font-medium">Absences justifiées</span>
                  <span className="text-red-900 font-bold">{displayData.absences.justified}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <span className="text-orange-700 font-medium">Absences non justifiées</span>
                  <span className="text-orange-900 font-bold">{displayData.absences.unjustified}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <span className="text-yellow-700 font-medium">Retards</span>
                  <span className="text-yellow-900 font-bold">{displayData.absences.delays}</span>
                </div>
              </div>
            </div>

          </div>

        </div>
        )}

      </div>
    </MainLayout>
  );
}