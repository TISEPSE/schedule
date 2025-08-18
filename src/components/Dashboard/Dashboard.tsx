'use client';

import { Users, Calendar, BookOpen, School, Clock, TrendingUp } from 'lucide-react';
import { User, DashboardStats } from '@/types';
import StatsCard from './StatsCard';
import QuickActions from './QuickActions';
import RecentActivity from './RecentActivity';
import UpcomingEvents from './UpcomingEvents';
import WeatherWidget from './WeatherWidget';
import NextClass from './NextClass';
import Assignments from './Assignments';

interface DashboardProps {
  user: User;
}

// Mock data
const mockStats: DashboardStats = {
  totalStudents: 1245,
  totalTeachers: 87,
  totalClasses: 32,
  totalSubjects: 15,
};

const adminStats = [
  {
    title: 'Utilisateurs actifs',
    value: mockStats.totalStudents.toLocaleString(),
    icon: Users,
    color: 'bg-blue-500',
    trend: '+12%',
  },
  {
    title: 'Plannings créés',
    value: mockStats.totalTeachers.toString(),
    icon: Calendar,
    color: 'bg-green-500',
    trend: '+3%',
  },
  {
    title: 'Groupes',
    value: mockStats.totalClasses.toString(),
    icon: BookOpen,
    color: 'bg-purple-500',
    trend: '+5%',
  },
  {
    title: 'Activités',
    value: mockStats.totalSubjects.toString(),
    icon: School,
    color: 'bg-orange-500',
    trend: 'Stable',
  },
];

const studentStats = [
  {
    title: 'Aujourd\'hui',
    value: '6',
    icon: Calendar,
    color: 'bg-blue-500',
    trend: 'activités',
  },
  {
    title: 'Cette semaine',
    value: '32h',
    icon: Clock,
    color: 'bg-green-500',
    trend: 'planifiées',
  },
  {
    title: 'Mes matières',
    value: '8',
    icon: BookOpen,
    color: 'bg-purple-500',
    trend: 'actives',
  },
  {
    title: 'Objectifs',
    value: '3/5',
    icon: TrendingUp,
    color: 'bg-orange-500',
    trend: 'complétés',
  },
];

export default function Dashboard({ user }: DashboardProps) {
  const stats = user.role === 'admin' ? adminStats : studentStats;

  return (
    <div className="space-y-6">

      {/* Stats Grid - Full width */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Layout prioritaire selon le rôle */}
      {user.role === 'student' ? (
        // Layout étudiant - focalisé sur les cours et devoirs
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Zone principale - Informations critiques */}
          <div className="lg:col-span-8 space-y-6">
            {/* Prochain cours - PRIORITÉ 1 */}
            <NextClass />
            
            {/* Devoirs et Événements - PRIORITÉ 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Assignments userRole={user.role} />
              <UpcomingEvents userRole={user.role} />
            </div>
            
            {/* Activité récente - PRIORITÉ 3 */}
            <RecentActivity userRole={user.role} />
          </div>

          {/* Zone secondaire - Actions et infos supplémentaires */}
          <div className="lg:col-span-4 space-y-4">
            <QuickActions userRole={user.role} />
            <WeatherWidget />
          </div>
          
        </div>
      ) : (
        // Layout admin - focalisé sur la gestion et surveillance
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Zone principale - Vue d'ensemble et gestion */}
          <div className="lg:col-span-8 space-y-6">
            {/* Tâches urgentes et événements - PRIORITÉ 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Assignments userRole={user.role} />
              <UpcomingEvents userRole={user.role} />
            </div>
            
            {/* Activité récente - PRIORITÉ 2 */}
            <RecentActivity userRole={user.role} />
          </div>

          {/* Zone secondaire - Actions rapides et météo */}
          <div className="lg:col-span-4 space-y-4">
            <QuickActions userRole={user.role} />
            <WeatherWidget />
          </div>
          
        </div>
      )}
    </div>
  );
}