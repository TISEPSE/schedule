// Système de couleurs cohérent pour toute l'application

export interface ColorScheme {
  background: string;
  border: string;
  text: string;
  ring: string;
}

export const EVENT_COLORS = {
  course: {
    background: 'bg-blue-700',
    backgroundLight: 'bg-blue-200',
    border: 'border-l-blue-700',
    borderLight: 'border-l-blue-500',
    text: 'text-blue-700',
    ring: 'ring-blue-500'
  },
  practical: {
    background: 'bg-emerald-700',
    backgroundLight: 'bg-emerald-200',
    border: 'border-l-emerald-700',
    borderLight: 'border-l-emerald-500',
    text: 'text-emerald-700',
    ring: 'ring-emerald-500'
  },
  exam: {
    background: 'bg-rose-600',
    backgroundLight: 'bg-rose-100',
    border: 'border-l-rose-600',
    borderLight: 'border-l-rose-400',
    text: 'text-rose-600',
    ring: 'ring-rose-400'
  },
  project: {
    background: 'bg-teal-700',
    backgroundLight: 'bg-teal-200',
    border: 'border-l-teal-700',
    borderLight: 'border-l-teal-500',
    text: 'text-teal-700',
    ring: 'ring-teal-500'
  },
  sport: {
    background: 'bg-indigo-700',
    backgroundLight: 'bg-indigo-200',
    border: 'border-l-indigo-700',
    borderLight: 'border-l-indigo-500',
    text: 'text-indigo-700',
    ring: 'ring-indigo-500'
  },
  study: {
    background: 'bg-purple-700',
    backgroundLight: 'bg-purple-200',
    border: 'border-l-purple-700',
    borderLight: 'border-l-purple-500',
    text: 'text-purple-700',
    ring: 'ring-purple-500'
  }
} as const;


export const PRIORITY_COLORS = {
  high: {
    background: 'bg-rose-600',
    backgroundLight: 'bg-rose-100',
    border: 'border-l-rose-600',
    borderLight: 'border-l-rose-400',
    text: 'text-rose-600',
    ring: 'ring-rose-400'
  },
  medium: {
    background: 'bg-orange-600',
    backgroundLight: 'bg-orange-100',
    border: 'border-l-orange-600',
    borderLight: 'border-l-orange-400',
    text: 'text-orange-600',
    ring: 'ring-orange-400'
  },
  low: {
    background: 'bg-emerald-700',
    backgroundLight: 'bg-emerald-200',
    border: 'border-l-emerald-700',
    borderLight: 'border-l-emerald-500',
    text: 'text-emerald-700',
    ring: 'ring-emerald-500'
  }
} as const;

// Système de couleurs par matière pour les cours français
export const SUBJECT_COLORS = {
  // Sciences exactes - Tons froids et neutres
  'Mathématiques': {
    background: 'bg-blue-700',
    backgroundLight: 'bg-blue-100',
    border: 'border-l-blue-700',
    borderLight: 'border-l-blue-500',
    text: 'text-blue-700',
    ring: 'ring-blue-500'
  },
  'Physique-Chimie': {
    background: 'bg-indigo-700',
    backgroundLight: 'bg-indigo-100',
    border: 'border-l-indigo-700',
    borderLight: 'border-l-indigo-500',
    text: 'text-indigo-700',
    ring: 'ring-indigo-500'
  },
  'SVT': {
    background: 'bg-emerald-700',
    backgroundLight: 'bg-emerald-100',
    border: 'border-l-emerald-700',
    borderLight: 'border-l-emerald-500',
    text: 'text-emerald-700',
    ring: 'ring-emerald-500'
  },
  'Sciences': {
    background: 'bg-teal-700',
    backgroundLight: 'bg-teal-100',
    border: 'border-l-teal-700',
    borderLight: 'border-l-teal-500',
    text: 'text-teal-700',
    ring: 'ring-teal-500'
  },
  
  // Langues - Tons chauds
  'Français': {
    background: 'bg-purple-700',
    backgroundLight: 'bg-purple-100',
    border: 'border-l-purple-700',
    borderLight: 'border-l-purple-500',
    text: 'text-purple-700',
    ring: 'ring-purple-500'
  },
  'Anglais': {
    background: 'bg-rose-600',
    backgroundLight: 'bg-rose-100',
    border: 'border-l-rose-600',
    borderLight: 'border-l-rose-400',
    text: 'text-rose-600',
    ring: 'ring-rose-400'
  },
  'Espagnol': {
    background: 'bg-red-600',
    backgroundLight: 'bg-red-100',
    border: 'border-l-red-600',
    borderLight: 'border-l-red-400',
    text: 'text-red-600',
    ring: 'ring-red-400'
  },
  'Allemand': {
    background: 'bg-slate-700',
    backgroundLight: 'bg-slate-100',
    border: 'border-l-slate-700',
    borderLight: 'border-l-slate-500',
    text: 'text-slate-700',
    ring: 'ring-slate-500'
  },
  
  // Sciences humaines - Tons terreux
  'Histoire-Géographie': {
    background: 'bg-amber-700',
    backgroundLight: 'bg-amber-100',
    border: 'border-l-amber-700',
    borderLight: 'border-l-amber-500',
    text: 'text-amber-700',
    ring: 'ring-amber-500'
  },
  'Histoire': {
    background: 'bg-yellow-700',
    backgroundLight: 'bg-yellow-100',
    border: 'border-l-yellow-700',
    borderLight: 'border-l-yellow-500',
    text: 'text-yellow-700',
    ring: 'ring-yellow-500'
  },
  'Géographie': {
    background: 'bg-lime-700',
    backgroundLight: 'bg-lime-100',
    border: 'border-l-lime-700',
    borderLight: 'border-l-lime-500',
    text: 'text-lime-700',
    ring: 'ring-lime-500'
  },
  'Philosophie': {
    background: 'bg-violet-700',
    backgroundLight: 'bg-violet-100',
    border: 'border-l-violet-700',
    borderLight: 'border-l-violet-500',
    text: 'text-violet-700',
    ring: 'ring-violet-500'
  },
  
  // Activités pratiques - Tons dynamiques
  'EPS': {
    background: 'bg-green-700',
    backgroundLight: 'bg-green-100',
    border: 'border-l-green-700',
    borderLight: 'border-l-green-500',
    text: 'text-green-700',
    ring: 'ring-green-500'
  },
  'Arts plastiques': {
    background: 'bg-pink-600',
    backgroundLight: 'bg-pink-100',
    border: 'border-l-pink-600',
    borderLight: 'border-l-pink-400',
    text: 'text-pink-600',
    ring: 'ring-pink-400'
  },
  'Musique': {
    background: 'bg-fuchsia-600',
    backgroundLight: 'bg-fuchsia-100',
    border: 'border-l-fuchsia-600',
    borderLight: 'border-l-fuchsia-400',
    text: 'text-fuchsia-600',
    ring: 'ring-fuchsia-400'
  },
  'Technologie': {
    background: 'bg-gray-700',
    backgroundLight: 'bg-gray-100',
    border: 'border-l-gray-700',
    borderLight: 'border-l-gray-500',
    text: 'text-gray-700',
    ring: 'ring-gray-500'
  },
  
  // Spécialités et options
  'Économie': {
    background: 'bg-cyan-700',
    backgroundLight: 'bg-cyan-100',
    border: 'border-l-cyan-700',
    borderLight: 'border-l-cyan-500',
    text: 'text-cyan-700',
    ring: 'ring-cyan-500'
  },
  'Informatique': {
    background: 'bg-sky-700',
    backgroundLight: 'bg-sky-100',
    border: 'border-l-sky-700',
    borderLight: 'border-l-sky-500',
    text: 'text-sky-700',
    ring: 'ring-sky-500'
  }
} as const;

export type EventType = keyof typeof EVENT_COLORS;
export type PriorityType = keyof typeof PRIORITY_COLORS;
export type SubjectType = keyof typeof SUBJECT_COLORS;

// Fonctions utilitaires
export const getEventColors = (type: string) => {
  return EVENT_COLORS[type as EventType] || EVENT_COLORS.course;
};

export const getPriorityColors = (priority: string) => {
  return PRIORITY_COLORS[priority as PriorityType] || PRIORITY_COLORS.medium;
};

export const getSubjectColors = (subject: string) => {
  return SUBJECT_COLORS[subject as SubjectType] || EVENT_COLORS.course;
};

// Fonction principale pour récupérer les couleurs d'un élément
export const getItemColors = (type: string, priority?: string, subject?: string) => {
  // Pour les devoirs (assignments), utiliser les couleurs de priorité
  if (type === 'assignment' && priority) {
    return getPriorityColors(priority);
  }
  
  // Pour les examens, garder le système actuel (couleur par type)
  if (type === 'exam') {
    return getEventColors(type);
  }
  
  // Pour les cours et TP, utiliser les couleurs par matière si disponible
  if ((type === 'course' || type === 'practical') && subject) {
    return getSubjectColors(subject);
  }
  
  // Fallback sur les couleurs par type
  return getEventColors(type);
};

// Pour compatibilité avec l'ancien système
export const getLegacyEventColor = (type: string) => {
  const colors = getEventColors(type);
  return colors.background;
};

export const getLegacyBorderColor = (type: string, priority?: string) => {
  if (priority) {
    return getPriorityColors(priority).borderLight;
  }
  return getEventColors(type).borderLight;
};