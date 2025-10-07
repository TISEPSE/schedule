/**
 * Date utility functions
 * Centralized date formatting and manipulation utilities
 * Enhanced with calendar performance optimizations
 */

// Performance-optimized calendar interfaces
export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  dateKey: string; // Pre-computed date key for efficient comparisons
  dayNumber: number;
  isToday: boolean;
  isWeekend: boolean;
}

export interface CalendarGrid {
  days: CalendarDay[];
  year: number;
  month: number;
  gridKey: string; // Unique key for memoization
}

export interface DateRange {
  start: Date;
  end: Date;
  rangeKey: string;
}

// Cache for expensive date calculations
const dateCalculationCache = new Map<string, CalendarGrid>();
const dateFormatCache = new Map<string, string>();

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

// Enhanced calendar-specific utilities with performance optimizations

/**
 * Creates a cache key for date calculations
 */
export const createDateKey = (date: Date): string => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

/**
 * Creates a cache key for month grids
 */
export const createMonthKey = (year: number, month: number): string => {
  return `${year}-${month}`;
};

/**
 * Efficiently checks if two dates are the same day
 */
export const isSameDay = (date1: Date, date2: Date): boolean => {
  return createDateKey(date1) === createDateKey(date2);
};

/**
 * Enhanced isToday function that works with calendar optimization
 */
export const isTodayOptimized = (date: Date): boolean => {
  const today = new Date();
  return isSameDay(date, today);
};

/**
 * Checks if a date is a weekend (Saturday or Sunday)
 */
export const isWeekend = (date: Date): boolean => {
  const day = date.getDay();
  return day === 0 || day === 6;
};

/**
 * Formats a date to a locale string with caching
 */
export const formatDateCached = (date: Date, options: Intl.DateTimeFormatOptions): string => {
  const cacheKey = `${createDateKey(date)}-${JSON.stringify(options)}`;

  if (dateFormatCache.has(cacheKey)) {
    return dateFormatCache.get(cacheKey)!;
  }

  const formatted = date.toLocaleDateString('fr-FR', options);
  dateFormatCache.set(cacheKey, formatted);

  // Prevent cache from growing too large
  if (dateFormatCache.size > 1000) {
    const firstKey = dateFormatCache.keys().next().value;
    if (firstKey) {
      dateFormatCache.delete(firstKey);
    }
  }

  return formatted;
};

/**
 * Formats time with caching
 */
export const formatTimeCached = (date: Date): string => {
  const cacheKey = `time-${date.getHours()}-${date.getMinutes()}`;

  if (dateFormatCache.has(cacheKey)) {
    return dateFormatCache.get(cacheKey)!;
  }

  const formatted = date.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  });
  dateFormatCache.set(cacheKey, formatted);

  return formatted;
};

/**
 * Efficiently generates calendar grid for a month with caching
 */
export const generateCalendarGrid = (date: Date): CalendarGrid => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const monthKey = createMonthKey(year, month);

  // Clear cache to ensure fresh calculation after bug fix
  // This can be removed after first deployment
  dateCalculationCache.clear();

  // Return cached result if available
  if (dateCalculationCache.has(monthKey)) {
    return dateCalculationCache.get(monthKey)!;
  }

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();

  // Monday = 0 (instead of Sunday = 0)
  const startingDayOfWeek = (firstDay.getDay() + 6) % 7;
  const days: CalendarDay[] = [];

  // Previous month days
  const prevMonth = new Date(year, month, 0);
  const daysInPrevMonth = prevMonth.getDate();

  for (let i = 0; i < startingDayOfWeek; i++) {
    const dayDate = new Date(year, month - 1, daysInPrevMonth - startingDayOfWeek + i + 1);
    days.push({
      date: dayDate,
      isCurrentMonth: false,
      dateKey: createDateKey(dayDate),
      dayNumber: dayDate.getDate(),
      isToday: isTodayOptimized(dayDate),
      isWeekend: isWeekend(dayDate)
    });
  }

  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    const dayDate = new Date(year, month, day);
    days.push({
      date: dayDate,
      isCurrentMonth: true,
      dateKey: createDateKey(dayDate),
      dayNumber: day,
      isToday: isTodayOptimized(dayDate),
      isWeekend: isWeekend(dayDate)
    });
  }

  // Next month days (complete to 42 days - 6 weeks)
  let nextMonthDay = 1;
  while (days.length < 42) {
    const dayDate = new Date(year, month + 1, nextMonthDay);
    days.push({
      date: dayDate,
      isCurrentMonth: false,
      dateKey: createDateKey(dayDate),
      dayNumber: nextMonthDay,
      isToday: isTodayOptimized(dayDate),
      isWeekend: isWeekend(dayDate)
    });
    nextMonthDay++;
  }

  const grid: CalendarGrid = {
    days,
    year,
    month,
    gridKey: monthKey
  };

  // Cache the result
  dateCalculationCache.set(monthKey, grid);

  // Prevent cache from growing too large (keep last 12 months)
  if (dateCalculationCache.size > 12) {
    const firstKey = dateCalculationCache.keys().next().value;
    if (firstKey) {
      dateCalculationCache.delete(firstKey);
    }
  }

  return grid;
};

/**
 * Gets the week range for a given date
 */
export const getWeekRange = (date: Date): DateRange => {
  const startOfWeek = new Date(date);
  const day = startOfWeek.getDay();
  const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Monday as first day
  startOfWeek.setDate(diff);
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  return {
    start: startOfWeek,
    end: endOfWeek,
    rangeKey: `${createDateKey(startOfWeek)}-${createDateKey(endOfWeek)}`
  };
};

/**
 * Gets the month range for a given date
 */
export const getMonthRange = (date: Date): DateRange => {
  const year = date.getFullYear();
  const month = date.getMonth();

  const startOfMonth = new Date(year, month, 1);
  startOfMonth.setHours(0, 0, 0, 0);

  const endOfMonth = new Date(year, month + 1, 0);
  endOfMonth.setHours(23, 59, 59, 999);

  return {
    start: startOfMonth,
    end: endOfMonth,
    rangeKey: createMonthKey(year, month)
  };
};

/**
 * Navigates to the next/previous month efficiently
 */
export const navigateMonth = (currentDate: Date, direction: 'prev' | 'next'): Date => {
  const newDate = new Date(currentDate);
  newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
  return newDate;
};

/**
 * Navigates to the next/previous week efficiently
 */
export const navigateWeek = (currentDate: Date, direction: 'prev' | 'next'): Date => {
  const newDate = new Date(currentDate);
  newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
  return newDate;
};

/**
 * Clears the date calculation cache (useful for testing or memory management)
 */
export const clearDateCache = (): void => {
  dateCalculationCache.clear();
  dateFormatCache.clear();
};

/**
 * Gets cache statistics for debugging
 */
export const getCacheStats = () => {
  return {
    dateCalculations: dateCalculationCache.size,
    dateFormats: dateFormatCache.size
  };
};