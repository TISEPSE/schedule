'use client';

import { useAuth } from '@/context/AuthContext';
import { redirect } from 'next/navigation';
import MainLayout from '@/components/Layout/MainLayout';
import { useState } from 'react';
import { Users, Mail, Phone, MapPin, Award, BookOpen, Clock, MessageCircle, GraduationCap, UserCog, Plus, Grid, Layout, FileText } from 'lucide-react';

// Mock data pour la classe
const mockClassmates = [
  {
    id: '1',
    name: 'Emma Martin',
    email: 'emma.martin@student.com',
    avatar: 'EM',
    role: 'Délégué de classe',
    subjects: ['Mathématiques', 'Physique'],
    status: 'online',
    color: 'bg-blue-500'
  },
  {
    id: '2', 
    name: 'Lucas Dubois',
    email: 'lucas.dubois@student.com',
    avatar: 'LD',
    role: 'Étudiant',
    subjects: ['Histoire', 'Français'],
    status: 'away',
    color: 'bg-green-500'
  },
  {
    id: '3',
    name: 'Sophie Chen',
    email: 'sophie.chen@student.com',
    avatar: 'SC',
    role: 'Secrétaire',
    subjects: ['Chimie', 'Biologie'],
    status: 'online',
    color: 'bg-purple-500'
  },
  {
    id: '4',
    name: 'Thomas Moreau',
    email: 'thomas.moreau@student.com',
    avatar: 'TM',
    role: 'Étudiant',
    subjects: ['Informatique', 'Mathématiques'],
    status: 'offline',
    color: 'bg-orange-500'
  },
  {
    id: '5',
    name: 'Julie Laurent',
    email: 'julie.laurent@student.com',
    avatar: 'JL',
    role: 'Étudiant',
    subjects: ['Arts', 'Littérature'],
    status: 'online',
    color: 'bg-pink-500'
  },
  {
    id: '6',
    name: 'Alexandre Roy',
    email: 'alexandre.roy@student.com',
    avatar: 'AR',
    role: 'Étudiant',
    subjects: ['Géographie', 'Économie'],
    status: 'away',
    color: 'bg-indigo-500'
  }
];

const mockTeachers = [
  {
    id: 'prof1',
    name: 'Dr. Marie Leclerc',
    email: 'marie.leclerc@school.edu',
    avatar: 'ML',
    subject: 'Mathématiques',
    office: 'Salle 201',
    color: 'bg-blue-600',
    type: 'teacher'
  },
  {
    id: 'prof2',
    name: 'M. Pierre Durand',
    email: 'pierre.durand@school.edu',
    avatar: 'PD',
    subject: 'Physique-Chimie',
    office: 'Laboratoire A',
    color: 'bg-green-600',
    type: 'teacher'
  },
  {
    id: 'prof3',
    name: 'Mme. Claire Petit',
    email: 'claire.petit@school.edu',
    avatar: 'CP',
    subject: 'Français',
    office: 'Salle 105',
    color: 'bg-purple-600',
    type: 'teacher'
  }
];

const mockStaff = [
  {
    id: 'staff1',
    name: 'Mme. Sophie Moreau',
    email: 'sophie.moreau@school.edu',
    avatar: 'SM',
    role: 'Secrétaire générale',
    office: 'Bureau 001',
    color: 'bg-orange-600',
    type: 'staff'
  },
  {
    id: 'staff2',
    name: 'M. Jean Dubois',
    email: 'jean.dubois@school.edu',
    avatar: 'JD',
    role: 'Conseiller pédagogique',
    office: 'Bureau 102',
    color: 'bg-teal-600',
    type: 'staff'
  },
  {
    id: 'staff3',
    name: 'Mme. Anne Rousseau',
    email: 'anne.rousseau@school.edu',
    avatar: 'AR',
    role: 'Infirmière scolaire',
    office: 'Infirmerie',
    color: 'bg-rose-600',
    type: 'staff'
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'online': return 'bg-green-400';
    case 'away': return 'bg-yellow-400';
    case 'offline': return 'bg-gray-400';
    default: return 'bg-gray-400';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'online': return 'En ligne';
    case 'away': return 'Absent(e)';
    case 'offline': return 'Hors ligne';
    default: return 'Inconnu';
  }
};

export default function ClassesPage() {
  const { user, logout } = useAuth();
  const [viewMode, setViewMode] = useState<'list' | 'classroom'>('list');

  if (!user) {
    redirect('/');
  }

  if (user.role === 'admin') {
    return (
      <MainLayout user={user} onLogout={logout}>
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Gestion des utilisateurs</h1>
            <div className="bg-gray-50 rounded-xl p-8 text-center">
              <p className="text-gray-600">Modérez les comptes utilisateurs et gérez les accès.</p>
              <p className="text-sm text-gray-500 mt-2">
                Fonctionnalités prévues : liste des utilisateurs, modération, permissions...
              </p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout user={user} onLogout={logout}>
      <div className="space-y-6">
        {/* Actions rapides */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Ma classe - BTS 1</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="p-4 text-center rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors">
              <FileText className="h-6 w-6 mx-auto mb-2" />
              <span className="text-sm font-medium">Documents et informations</span>
            </button>
            <button className="p-4 text-center rounded-xl bg-green-50 hover:bg-green-100 text-green-700 transition-colors">
              <BookOpen className="h-6 w-6 mx-auto mb-2" />
              <span className="text-sm font-medium">Projets</span>
            </button>
            <button className="p-4 text-center rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 transition-colors">
              <Clock className="h-6 w-6 mx-auto mb-2" />
              <span className="text-sm font-medium">Planning</span>
            </button>
            <button className="p-4 text-center rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 transition-colors">
              <GraduationCap className="h-6 w-6 mx-auto mb-2" />
              <span className="text-sm font-medium">Changer de niveau</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Équipe éducative */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-2 mb-6">
              <Award className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Équipe éducative</h2>
            </div>
            
            <div className="space-y-6">
              {/* Enseignants */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <GraduationCap className="h-4 w-4 text-blue-600" />
                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Enseignants</h3>
                  </div>
                  <button className="flex items-center space-x-2 px-3 py-2 text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-sm font-medium">
                    <Plus className="h-4 w-4" />
                    <span>Ajouter</span>
                  </button>
                </div>
                <div className="space-y-3">
                  {mockTeachers.map((teacher) => (
                    <div key={teacher.id} className="flex items-center space-x-3 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className={`w-12 h-12 ${teacher.color} rounded-full flex items-center justify-center text-white font-semibold`}>
                        {teacher.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 truncate">{teacher.name}</h4>
                        <p className="text-sm text-gray-600 flex items-center space-x-1">
                          <BookOpen className="h-4 w-4" />
                          <span>{teacher.subject}</span>
                        </p>
                        <p className="text-xs text-gray-500 flex items-center space-x-1">
                          <MapPin className="h-3 w-3" />
                          <span>{teacher.office}</span>
                        </p>
                      </div>
                      <button className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-white transition-colors">
                        <Mail className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Personnel administratif */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <UserCog className="h-4 w-4 text-orange-600" />
                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Personnel administratif</h3>
                  </div>
                  <button className="flex items-center space-x-2 px-3 py-2 text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors text-sm font-medium">
                    <Plus className="h-4 w-4" />
                    <span>Ajouter</span>
                  </button>
                </div>
                <div className="space-y-3">
                  {mockStaff.map((staff) => (
                    <div key={staff.id} className="flex items-center space-x-3 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className={`w-12 h-12 ${staff.color} rounded-full flex items-center justify-center text-white font-semibold`}>
                        {staff.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 truncate">{staff.name}</h4>
                        <p className="text-sm text-gray-600 flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>{staff.role}</span>
                        </p>
                        <p className="text-xs text-gray-500 flex items-center space-x-1">
                          <MapPin className="h-3 w-3" />
                          <span>{staff.office}</span>
                        </p>
                      </div>
                      <button className="p-2 text-gray-400 hover:text-orange-600 rounded-lg hover:bg-white transition-colors">
                        <Mail className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Camarades de classe */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-fit">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <Users className="h-6 w-6 text-purple-600" />
                <h2 className="text-xl font-semibold text-gray-900">Camarades de classe</h2>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-500">{mockClassmates.length} étudiants</span>
                
                {/* Sélecteur de vue */}
                <div className="flex items-center bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('list')}
                    className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                      viewMode === 'list'
                        ? 'bg-white text-purple-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    <Grid className="h-3.5 w-3.5" />
                    <span>Liste</span>
                  </button>
                  <button
                    onClick={() => setViewMode('classroom')}
                    className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                      viewMode === 'classroom'
                        ? 'bg-white text-purple-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    <Layout className="h-3.5 w-3.5" />
                    <span>Plan de classe</span>
                  </button>
                </div>

                <button className="flex items-center space-x-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-xl transition-colors">
                  <Plus className="h-4 w-4" />
                  <span>Ajouter</span>
                </button>
              </div>
            </div>

            {viewMode === 'list' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockClassmates.map((classmate) => (
                  <div key={classmate.id} className="p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all">
                    <div className="flex items-start space-x-3">
                      <div className={`w-12 h-12 ${classmate.color} rounded-full flex items-center justify-center text-white font-semibold`}>
                        {classmate.avatar}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-gray-900 truncate">{classmate.name}</h3>
                          {classmate.role !== 'Étudiant' && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                              {classmate.role}
                            </span>
                          )}
                        </div>
                        
                        <div className="text-sm text-gray-600 flex items-center space-x-1 mt-1">
                          <div className={`w-2 h-2 ${getStatusColor(classmate.status)} rounded-full`}></div>
                          <span>{getStatusLabel(classmate.status)}</span>
                        </div>
                        
                        <div className="flex flex-wrap gap-1 mt-2">
                          {classmate.subjects.map((subject) => (
                            <span key={subject} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-lg">
                              {subject}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <button className="p-2 text-gray-400 hover:text-purple-600 rounded-lg hover:bg-purple-50 transition-colors">
                        <MessageCircle className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Mode Plan de classe */
              <div className="bg-gray-50 rounded-xl p-6 min-h-96">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Plan de la classe</h3>
                  <span className="text-sm text-gray-500">Mode édition disponible prochainement</span>
                </div>
                
                {/* Tableau du professeur */}
                <div className="mb-6">
                  <div className="w-24 h-4 bg-gray-800 rounded-lg mx-auto mb-2"></div>
                  <p className="text-center text-xs text-gray-600 mb-3">Tableau</p>
                </div>
                
                {/* Disposition des bureaux (3 rangées de 2 colonnes) */}
                <div className="grid grid-cols-2 gap-x-12 gap-y-6 max-w-md mx-auto">
                  {mockClassmates.map((classmate, index) => (
                    <div key={classmate.id} className="flex flex-col items-center">
                      {/* Bureau avec étudiant assis */}
                      <div className="w-16 h-12 bg-amber-100 border-2 border-amber-200 rounded-lg mb-2 relative">
                        {/* Étudiant assis à la table */}
                        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                          <div className={`w-8 h-8 ${classmate.color} rounded-full flex items-center justify-center text-white font-semibold text-xs`}>
                            {classmate.avatar}
                          </div>
                        </div>
                      </div>
                      {/* Nom */}
                      <span className="text-xs font-medium text-gray-700 text-center">
                        {classmate.name.split(' ')[0]}
                      </span>
                    </div>
                  ))}
                </div>
                
                {/* Info */}
                <div className="mt-8 text-center">
                  <p className="text-sm text-gray-500">
                    Glissez-déposez pour réorganiser la disposition (fonctionnalité à venir)
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Statistiques de la classe */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-2xl p-6 shadow-sm border border-blue-100 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{mockClassmates.length}</div>
            <div className="text-base font-medium text-blue-700">Étudiants</div>
          </div>
          <div className="bg-purple-50 rounded-2xl p-6 shadow-sm border border-purple-100 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">{mockTeachers.length + mockStaff.length}</div>
            <div className="text-base font-medium text-purple-700">Membres de l&apos;équipe éducative</div>
          </div>
          <div className="bg-green-50 rounded-2xl p-6 shadow-sm border border-green-100 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{mockClassmates.filter(s => s.status === 'online').length}</div>
            <div className="text-base font-medium text-green-700">En ligne</div>
          </div>
          <div className="bg-orange-50 rounded-2xl p-6 shadow-sm border border-orange-100 text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">12</div>
            <div className="text-base font-medium text-orange-700">Matières</div>
          </div>
        </div>

      </div>
    </MainLayout>
  );
}