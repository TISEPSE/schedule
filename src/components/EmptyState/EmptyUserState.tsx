import { User } from '@/types';
import { Database, FileX, Calendar, BookOpen } from 'lucide-react';

interface EmptyUserStateProps {
  user: User;
  title: string;
  description: string;
  icon?: 'database' | 'file' | 'calendar' | 'book';
}

export default function EmptyUserState({ user, title, description, icon = 'database' }: EmptyUserStateProps) {
  const isTestUser = user.id === '4' || user.email === 'test@app.com';
  
  if (!isTestUser) {
    return null; // Ne pas afficher pour les autres utilisateurs
  }

  const iconMap = {
    database: Database,
    file: FileX,
    calendar: Calendar,
    book: BookOpen,
  };

  const IconComponent = iconMap[icon];

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-8">
        <div className="mb-6">
          <IconComponent className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">{title}</h2>
          <p className="text-gray-500 text-sm mb-4">{description}</p>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-center mb-2">
            <Database className="h-4 w-4 text-blue-600 mr-2" />
            <span className="text-sm font-medium text-blue-900">Utilisateur de test</span>
          </div>
          <p className="text-xs text-blue-700">
            Cet utilisateur est configuré sans données pour tester l&apos;interface vide.
            Utilisez le panel de test dans le Dashboard pour ajouter du contenu.
          </p>
        </div>
      </div>
    </div>
  );
}