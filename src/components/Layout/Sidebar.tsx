'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Building, 
  Settings, 
  User,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  FileText,
  CalendarDays,
  ClipboardList
} from 'lucide-react';
import { UserRole } from '@/types';

interface SidebarProps {
  userRole: UserRole;
  isCollapsed: boolean;
  onToggle: () => void;
}

const adminNavItems = [
  { icon: LayoutDashboard, label: 'Administration', href: '/dashboard' },
  { icon: Users, label: 'Utilisateurs', href: '/classes' },
  { icon: Building, label: 'Organigramme', href: '/organization' },
  { icon: Settings, label: 'Configuration', href: '/settings' },
  { icon: User, label: 'Profil', href: '/profile' },
];

const studentNavItems = [
  { icon: LayoutDashboard, label: 'Tableau de bord', href: '/dashboard' },
  { icon: CalendarDays, label: 'Mon calendrier', href: '/calendar' },
  { icon: ClipboardList, label: 'Mes devoirs', href: '/devoirs' },
  { icon: FileText, label: 'Mon bulletin', href: '/bulletin' },
  { icon: Users, label: 'Ma classe', href: '/classes' },
  { icon: Building, label: 'Mon école', href: '/organization' },
  { icon: Settings, label: 'Paramètres', href: '/settings' },
  { icon: User, label: 'Mon profil', href: '/profile' },
];

export default function Sidebar({ userRole, isCollapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const navItems = userRole === 'admin' ? adminNavItems : studentNavItems;

  return (
    <aside className={`bg-white h-full transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        {!isCollapsed ? (
          <div className="flex items-center space-x-2">
            <GraduationCap className="h-8 w-8 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900">MySchedule</h1>
          </div>
        ) : (
          <div className="flex justify-center w-full">
            <GraduationCap className="h-8 w-8 text-blue-600" />
          </div>
        )}
        
        {!isCollapsed && (
          <button
            onClick={onToggle}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft className="h-5 w-5 text-gray-500" />
          </button>
        )}
      </div>

      {/* Bouton expand quand replié */}
      {isCollapsed && (
        <div className="p-2">
          <button
            onClick={onToggle}
            className="w-full p-2 rounded-lg hover:bg-gray-100 transition-colors flex justify-center"
            title="Développer la navigation"
          >
            <ChevronRight className="h-5 w-5 text-gray-500" />
          </button>
        </div>
      )}

      {/* Navigation */}
      <nav className={`${isCollapsed ? 'p-2' : 'p-4'} space-y-3`}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center rounded-lg transition-colors group relative ${
                isCollapsed 
                  ? 'justify-center p-3' 
                  : 'space-x-3 px-3 py-2'
              } ${
                isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              title={isCollapsed ? item.label : ''}
            >
              <Icon className={`${isCollapsed ? 'h-5 w-5' : 'h-4 w-4'} ${
                isActive ? 'text-blue-600' : 'text-gray-500'
              }`} />
              {!isCollapsed && (
                <span className="font-medium text-base">{item.label}</span>
              )}
              
              {/* Tooltip en mode replié */}
              {isCollapsed && (
                <div className="absolute left-16 bg-gray-900 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                  {item.label}
                </div>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}