import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  color: string;
  trend: string;
}

export default function StatsCard({ title, value, icon: Icon, color, trend }: StatsCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 ease-out cursor-pointer group">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-gray-600 text-base font-medium mb-1 transition-colors group-hover:text-gray-700">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-1 transition-colors group-hover:text-gray-800">{value}</p>
          <p className="text-sm text-gray-500 transition-colors group-hover:text-gray-600">{trend}</p>
        </div>
        <div className={`${color} p-3 rounded-lg transition-transform duration-300 ease-out group-hover:scale-110 group-hover:rotate-3`}>
          <Icon className="h-6 w-6 text-white transition-transform duration-300 ease-out" />
        </div>
      </div>
    </div>
  );
}