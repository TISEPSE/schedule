'use client';

import { GraduationCap, User, Building2, ArrowRight, CheckCircle } from 'lucide-react';

export type AccountType = 'personal' | 'student' | 'admin';

interface AccountTypeOption {
  type: AccountType;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  features: string[];
  demoAccount: {
    email: string;
    password: string;
  };
}

interface AccountTypeSelectorProps {
  onSelectType: (type: AccountType) => void;
  onCreateAccount: (type: AccountType) => void;
}

const accountTypes: AccountTypeOption[] = [
  {
    type: 'personal',
    title: 'Compte Personnel',
    description: 'Gérez votre productivité personnelle',
    icon: User,
    color: 'bg-blue-500',
    features: [
      'Suivi du temps personnel',
      'Gestion de projets',
      'Objectifs et jalons',
      'Calendrier personnel',
      'Tâches et todo lists'
    ],
    demoAccount: {
      email: 'perso@test.fr',
      password: 'perso123'
    }
  },
  {
    type: 'student',
    title: 'Compte Étudiant',
    description: 'Organisez vos études et devoirs',
    icon: GraduationCap,
    color: 'bg-green-500',
    features: [
      'Planning des cours',
      'Gestion des devoirs',
      'Suivi des notes',
      'Calendrier scolaire',
      'Ma classe'
    ],
    demoAccount: {
      email: 'test@app.com',
      password: 'test123'
    }
  },
  {
    type: 'admin',
    title: 'Compte Administrateur',
    description: 'Gérez un établissement scolaire',
    icon: Building2,
    color: 'bg-purple-500',
    features: [
      'Gestion des utilisateurs',
      'Organisation des classes',
      'Planification globale',
      'Statistiques',
      'Administration complète'
    ],
    demoAccount: {
      email: 'admin@test.fr',
      password: 'admin123'
    }
  }
];

export default function AccountTypeSelector({ onSelectType, onCreateAccount }: AccountTypeSelectorProps) {
  const handleSelectType = (type: AccountType) => {
    onSelectType(type);
  };

  const handleCreateAccount = (type: AccountType) => {
    onCreateAccount(type);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 pt-8">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-blue-600 rounded-full shadow-lg">
              <GraduationCap className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Bienvenue sur MySchedule
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choisissez le type de compte qui correspond à vos besoins
          </p>
        </div>

        {/* Account Type Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {accountTypes.map((option) => {
            const Icon = option.icon;

            return (
              <div
                key={option.type}
                className="relative shadow-md"
              >
                <div className="bg-white rounded-xl p-6 h-full border-2 border-transparent">
                  {/* Header */}
                  <div className="text-center mb-6">
                    <div className={`inline-flex p-4 rounded-full ${option.color} mb-4`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {option.title}
                    </h3>
                    <p className="text-gray-600">
                      {option.description}
                    </p>
                  </div>

                  {/* Features */}
                  <div className="space-y-3 mb-6">
                    {option.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-700">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Demo Account Info */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <p className="text-xs font-medium text-gray-500 mb-2">COMPTE DE DÉMONSTRATION</p>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Email:</span> {option.demoAccount.email}
                      </p>
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Mot de passe:</span> {option.demoAccount.password}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <button 
                      onClick={() => handleSelectType(option.type)}
                      className="w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md hover:shadow-lg transform hover:scale-[1.02]"
                    >
                      <span>Essayer avec le compte de démo</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                    
                    <button
                      onClick={() => handleCreateAccount(option.type)}
                      className="w-full py-2 px-4 rounded-lg font-medium transition-all duration-200 border border-blue-500 text-blue-600 hover:bg-blue-50 flex items-center justify-center space-x-2"
                    >
                      <span>Créer un {option.title.toLowerCase()}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}