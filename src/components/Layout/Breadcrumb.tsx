'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href: string;
  isActive?: boolean;
}

export default function Breadcrumb() {
  const pathname = usePathname();
  
  // Mapping des routes vers des labels plus lisibles
  const routeLabels: Record<string, string> = {
    '/': 'Tableau de bord',
    '/dashboard': 'Tableau de bord',
    '/classes': 'Ma classe',
    '/devoirs': 'Mes devoirs',
    '/planning': 'Mon emploi du temps',
    '/calendar': 'Calendrier',
    '/profile': 'Mon profil',
    '/settings': 'Paramètres',
    '/organization': 'Organisation',
    '/bulletin': 'Bulletin',
    '/debug': 'Debug'
  };

  // Génération des breadcrumbs basés sur le pathname
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const segments = pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];

    // Toujours commencer par l'accueil
    breadcrumbs.push({
      label: 'Accueil',
      href: '/',
      isActive: pathname === '/'
    });

    // Ajouter les segments
    let currentPath = '';
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === segments.length - 1;
      
      breadcrumbs.push({
        label: routeLabels[currentPath] || segment.charAt(0).toUpperCase() + segment.slice(1),
        href: currentPath,
        isActive: isLast
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  // Ne rien afficher si on est sur la page d'accueil avec juste un élément
  if (breadcrumbs.length <= 1) {
    return (
      <div className="flex items-center space-x-2 text-sm">
        <Home className="h-4 w-4 text-gray-400" />
        <span className="text-gray-500">Accueil</span>
      </div>
    );
  }

  return (
    <nav className="flex items-center space-x-2 text-sm">
      <Home className="h-4 w-4 text-gray-400" />
      
      {breadcrumbs.map((item, index) => (
        <div key={item.href} className="flex items-center space-x-2">
          {index > 0 && (
            <ChevronRight className="h-4 w-4 text-gray-400" />
          )}
          
          {item.isActive ? (
            <span className="font-medium text-gray-900">{item.label}</span>
          ) : (
            <Link 
              href={item.href}
              className="text-gray-600 hover:text-gray-900 transition-colors hover:underline"
            >
              {item.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}