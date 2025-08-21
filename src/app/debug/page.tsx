'use client';

import { useState } from 'react';
import { User } from '@/types';

export default function DebugPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleInitDB = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/init-db', {
        method: 'POST'
      });
      const data = await response.json();
      
      if (data.success) {
        setMessage(`✅ ${data.message}`);
        if (data.testUser) {
          setMessage(prev => prev + `\n📧 Email: ${data.testUser.email}\n🔑 Mot de passe: ${data.testUser.password}`);
        }
      } else {
        setMessage(`❌ ${data.error}`);
      }
    } catch (error) {
      setMessage(`❌ Erreur: ${error}`);
    }
    setLoading(false);
  };

  const handleClearDB = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/init-db', {
        method: 'DELETE'
      });
      const data = await response.json();
      
      if (data.success) {
        setMessage(`✅ ${data.message}`);
        if (data.testUser) {
          setMessage(prev => prev + `\n📧 Email: ${data.testUser.email}\n🔑 Mot de passe: ${data.testUser.password}`);
        }
      } else {
        setMessage(`❌ ${data.error}`);
      }
    } catch (error) {
      setMessage(`❌ Erreur: ${error}`);
    }
    setLoading(false);
  };

  const handleLoadUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      
      if (data.success) {
        setUsers(data.users);
        setMessage(`👥 ${data.users.length} utilisateur(s) trouvé(s)`);
      } else {
        setMessage(`❌ Erreur: ${data.error}`);
      }
    } catch (error) {
      setMessage(`❌ Erreur: ${error}`);
    }
    setLoading(false);
  };

  const handleSetupTestData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/setup-test-data', {
        method: 'POST'
      });
      const data = await response.json();
      
      if (data.success) {
        setMessage(`✅ ${data.message}`);
        if (data.testCredentials) {
          let credentialsText = '\n🔐 Identifiants de test créés:\n';
          data.testCredentials.forEach((cred: {description: string; email: string; password: string; role: string}) => {
            credentialsText += `\n${cred.description}:\n`;
            credentialsText += `📧 Email: ${cred.email}\n`;
            credentialsText += `🔑 Mot de passe: ${cred.password}\n`;
            credentialsText += `👤 Rôle: ${cred.role}\n`;
          });
          setMessage(prev => prev + credentialsText);
        }
        
        // Recharger les utilisateurs
        await handleLoadUsers();
      } else {
        setMessage(`❌ ${data.error}`);
      }
    } catch (error) {
      setMessage(`❌ Erreur: ${error}`);
    }
    setLoading(false);
  };

  const handleDiagnostic = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/diagnostic');
      const data = await response.json();
      
      if (data.success) {
        let diagnosticText = '🔍 Diagnostic de la base de données:\n\n';
        diagnosticText += `👤 Utilisateurs: ${data.diagnostic.users.length}\n`;
        data.diagnostic.users.forEach((user: {id: string; email: string; role: string}) => {
          diagnosticText += `  - ${user.email} (ID: ${user.id}, Rôle: ${user.role})\n`;
        });
        diagnosticText += `\n📅 Événements: ${data.diagnostic.totalEvents}\n`;
        diagnosticText += `📝 Devoirs: ${data.diagnostic.totalAssignments}`;
        
        setMessage(diagnosticText);
      } else {
        setMessage(`❌ Diagnostic échoué: ${data.error}`);
        if (data.stack) {
          setMessage(prev => prev + `\n\nStack trace:\n${data.stack}`);
        }
      }
    } catch (error) {
      setMessage(`❌ Erreur: ${error}`);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Debug - Base de données SQLite</h1>
        
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
          <h2 className="text-xl font-semibold mb-4">Actions sur la base de données</h2>
          
          <div className="flex flex-wrap gap-4 mb-6">
            <button
              onClick={handleInitDB}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-xl transition-colors disabled:opacity-50"
            >
              {loading ? 'Initialisation...' : 'Initialiser la DB'}
            </button>
            
            <button
              onClick={handleClearDB}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-xl transition-colors disabled:opacity-50"
            >
              {loading ? 'Suppression...' : 'Vider la DB'}
            </button>
            
            <button
              onClick={handleLoadUsers}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-xl transition-colors disabled:opacity-50"
            >
              {loading ? 'Chargement...' : 'Charger utilisateurs'}
            </button>

            <button
              onClick={handleSetupTestData}
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-xl transition-colors disabled:opacity-50"
            >
              {loading ? 'Création...' : 'Créer données de test'}
            </button>

            <button
              onClick={handleDiagnostic}
              disabled={loading}
              className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-6 rounded-xl transition-colors disabled:opacity-50"
            >
              {loading ? 'Diagnostic...' : 'Diagnostic DB'}
            </button>
          </div>
          
          {message && (
            <div className="bg-gray-100 rounded-xl p-4 mb-4">
              <pre className="text-sm text-gray-800 whitespace-pre-wrap">{message}</pre>
            </div>
          )}
        </div>

        {users.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-4">Utilisateurs dans la base</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left p-2">ID</th>
                    <th className="text-left p-2">Email</th>
                    <th className="text-left p-2">Nom</th>
                    <th className="text-left p-2">Rôle</th>
                    <th className="text-left p-2">Créé le</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-gray-100">
                      <td className="p-2 font-mono text-xs">{user.id}</td>
                      <td className="p-2">{user.email}</td>
                      <td className="p-2">{user.firstName} {user.lastName}</td>
                      <td className="p-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          user.role === 'admin' 
                            ? 'bg-red-100 text-red-700' 
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="p-2 text-xs text-gray-500">
                        {user.createdAt ? new Date(user.createdAt).toLocaleString('fr-FR') : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="mt-8 bg-blue-50 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Instructions</h3>
          <div className="space-y-2 text-blue-800">
            <p>1. <strong>Initialiser la DB</strong> : Crée les tables et un utilisateur test basique</p>
            <p>2. <strong>Vider la DB</strong> : Supprime toutes les données</p>
            <p>3. <strong>Charger utilisateurs</strong> : Affiche tous les utilisateurs de la base</p>
            <p>4. <strong>Créer données de test</strong> : Crée utilisateurs, événements et devoirs de test complets</p>
            
            <p className="mt-4 font-semibold">Utilise &ldquo;Créer données de test&rdquo; pour avoir :</p>
            <div className="flex justify-center mt-2">
              <div className="bg-white p-3 rounded-lg border border-blue-200">
                <p className="text-sm font-medium text-center">🧪 Utilisateur de test</p>
                <p className="text-sm font-semibold text-center text-blue-700">test@app.com</p>
                <p className="text-xs text-center text-blue-600">Mot de passe : test123 ou vide</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}