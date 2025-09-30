/**
 * Date utility functions
 * Centralized date formatting and manipulation utilities
 */

export const formatDueDate = (dueDate: Date): string => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  if (dueDate.toDateString() === today.toDateString()) {
    return "Aujourd'hui";
  } else if (dueDate.toDateString() === tomorrow.toDateString()) {
    return 'Demain';
  } else {
    const daysDiff = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (daysDiff > 0 && daysDiff <= 7) {
      return `Dans ${daysDiff} jours`;
    } else if (daysDiff < 0) {
      return `En retard de ${Math.abs(daysDiff)} jours`;
    } else {
      return dueDate.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' });
    }
  }
};

export const getDaysRemaining = (dueDate: Date): number => {
  const today = new Date();
  const diffTime = dueDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export const getDayName = (date: Date): string => {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  return days[date.getDay()];
};

export const getWeekDates = (date: Date): Date[] => {
  const week = [];
  const startOfWeek = new Date(date);
  const day = startOfWeek.getDay();
  const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Lundi = 1
  startOfWeek.setDate(diff);

  for (let i = 0; i < 7; i++) {
    const weekDay = new Date(startOfWeek);
    weekDay.setDate(startOfWeek.getDate() + i);
    week.push(weekDay);
  }
  return week;
};

export const getNextDateForDay = (dayName: string): Date => {
  const daysMap: { [key: string]: number } = {
    'dimanche': 0, 'lundi': 1, 'mardi': 2, 'mercredi': 3,
    'jeudi': 4, 'vendredi': 5, 'samedi': 6
  };
  
  const targetDay = daysMap[dayName.toLowerCase()];
  const today = new Date();
  const currentDay = today.getDay();
  
  let daysUntilTarget = targetDay - currentDay;
  if (daysUntilTarget <= 0) {
    daysUntilTarget += 7; // Prochaine semaine
  }
  
  const targetDate = new Date(today);
  targetDate.setDate(today.getDate() + daysUntilTarget);
  return targetDate;
};

export const isToday = (date: Date): boolean => {
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

export const isOverdue = (dueDate: Date): boolean => {
  return getDaysRemaining(dueDate) < 0;
};