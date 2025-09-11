'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  CalendarDays,
  FileText,
  Trello,
  Settings,
  Users,
  Building,
  User,
  BookOpen,
  Target
} from 'lucide-react';
import { UserRole } from '@/types';

interface MobileNavProps {
  userRole: UserRole;
}

const adminNavItems = [
  { icon: LayoutDashboard, label: 'Admin', href: '/dashboard' },
  { icon: Users, label: 'Classes', href: '/classes' },
  { icon: Building, label: 'École', href: '/organization' },
  { icon: Settings, label: 'Config', href: '/settings' },
  { icon: User, label: 'Profil', href: '/profile' },
];

const studentNavItems = [
  { icon: LayoutDashboard, label: 'Accueil', href: '/dashboard' },
  { icon: CalendarDays, label: 'Calendrier', href: '/calendar' },
  { icon: Trello, label: 'Devoirs', href: '/devoirs' },
  { icon: BookOpen, label: 'Notes', href: '/notes' },
  { icon: FileText, label: 'Bulletin', href: '/bulletin' },
  { icon: Users, label: 'Classe', href: '/classes' },
];

const personalNavItems = [
  { icon: LayoutDashboard, label: 'Tableau', href: '/dashboard' },
  { icon: CalendarDays, label: 'Calendrier', href: '/calendar' },
  { icon: Trello, label: 'Tâches', href: '/devoirs' },
  { icon: BookOpen, label: 'Notes', href: '/notes' },
  { icon: Target, label: 'Projets', href: '/projects' },
  { icon: Settings, label: 'Config', href: '/settings' },
];

export default function MobileNav({ userRole }: MobileNavProps) {
  const pathname = usePathname();
  const navItems = userRole === 'admin' ? adminNavItems : 
                   userRole === 'personal' ? personalNavItems : studentNavItems;

  const isActive = (href: string) => {
    return pathname === href || 
           (pathname.startsWith(href) && href !== '/') ||
           (href === '/dashboard' && pathname === '/');
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 safe-area-pb">
      {/* Navigation scrollable avec carousel */}
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex items-center px-4 py-2 min-w-max">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center p-3 rounded-lg min-w-0 transition-colors mx-1 ${
                  active 
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
                style={{ minWidth: '80px' }}
              >
                <Icon className={`h-6 w-6 mb-1 ${active ? 'text-blue-600' : 'text-gray-500'}`} />
                <span className={`text-xs font-medium text-center leading-tight ${
                  active ? 'text-blue-600' : 'text-gray-600'
                }`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
      
      {/* Indicateur de scroll si nécessaire */}
      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
        <div className="flex space-x-1">
          {navItems.map((_, index) => (
            <div
              key={index}
              className="w-1 h-1 bg-gray-300 rounded-full opacity-50"
            />
          ))}
        </div>
      </div>
    </nav>
  );
}