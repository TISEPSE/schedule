'use client';

import { useState } from 'react';
import { GraduationCap, Mail, Lock, Eye, EyeOff, ArrowLeft, User, Building2 } from 'lucide-react';
import { AccountType } from './AccountTypeSelector';

interface LoginFormProps {
  accountType?: AccountType;
  onLogin: (email: string, password: string) => void;
  onBack?: () => void;
  onSwitchToSignup?: () => void;
  isLoading?: boolean;
  error?: string | null;
}

export default function LoginForm({ accountType, onLogin, onBack, onSwitchToSignup, isLoading, error }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Définir les comptes de démonstration selon le type
  const demoAccounts = {
    personal: { email: 'perso@test.fr', password: 'perso123' },
    student: { email: 'test@app.com', password: 'test123' },
    admin: { email: 'admin@test.fr', password: 'admin123' }
  };

  // Configuration selon le type de compte
  const getAccountConfig = () => {
    switch (accountType) {
      case 'personal':
        return {
          icon: User,
          title: 'Connexion Personnelle',
          description: 'Accédez à votre espace de productivité',
          color: 'bg-blue-600'
        };
      case 'student':
        return {
          icon: GraduationCap,
          title: 'Connexion Étudiant',
          description: 'Accédez à votre espace étudiant',
          color: 'bg-green-600'
        };
      case 'admin':
        return {
          icon: Building2,
          title: 'Connexion Administrateur',
          description: 'Accédez à l\'administration',
          color: 'bg-purple-600'
        };
      default:
        return {
          icon: GraduationCap,
          title: 'Connexion',
          description: 'Connectez-vous à votre compte',
          color: 'bg-blue-600'
        };
    }
  };

  const config = getAccountConfig();
  const IconComponent = config.icon;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
  };

  const handleFillDemo = () => {
    if (accountType && demoAccounts[accountType]) {
      setEmail(demoAccounts[accountType].email);
      setPassword(demoAccounts[accountType].password);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        {onBack && (
          <button
            onClick={onBack}
            className="mb-6 flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Choisir un autre type de compte
          </button>
        )}

        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className={`p-3 ${config.color} rounded-full`}>
              <IconComponent className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">MySchedule</h1>
          <p className="text-gray-600">{config.description}</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 text-center">
              {config.title}
            </h2>
            {accountType && (
              <div className="mt-4">
                <button
                  type="button"
                  onClick={handleFillDemo}
                  className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm"
                >
                  Utiliser le compte de démonstration
                </button>
              </div>
            )}
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-400 bg-white"
                  placeholder="votre@email.com"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-400 bg-white"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Se connecter'
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800 mb-2 font-medium">🧪 Application en phase de test</p>
            <p className="text-xs text-blue-600 mb-2">Utilisateur de test :</p>
            <div className="text-center">
              <p className="text-sm font-semibold text-blue-700">test@app.com</p>
              <p className="text-xs text-blue-600">Mot de passe : <strong>test123</strong> ou <strong>vide</strong></p>
            </div>
          </div>

          {/* Signup Link */}
          {onSwitchToSignup && (
            <div className="mt-6 text-center">
              <p className="text-gray-600 text-sm">
                Pas encore de compte ?{' '}
                <button
                  onClick={onSwitchToSignup}
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  Créer un compte
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}