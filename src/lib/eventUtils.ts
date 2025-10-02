/**
 * Optimized event filtering and caching utilities for calendar performance
 * Features efficient event lookup, filtering, and memoization strategies
 */

import { Event } from '@/types';
import { createDateKey, formatTimeCached } from './dateUtils';
import { getLegacyEventColor } from './colors';

export interface ProcessedEvent {
  id: string;
  title: string;
  time: string;
  type: string;
  color: string;
  location?: string;
  startTime: Date;
  endTime: Date;
  dateKey: string;
}

export interface EventsByDate {
  [dateKey: string]: ProcessedEvent[];
}

export interface EventFilterOptions {
  startDate?: Date;
  endDate?: Date;
  types?: string[];
  searchTerm?: string;
}

// Cache for processed events
const eventProcessingCache = new Map<string, ProcessedEvent>();
const eventsByDateCache = new Map<string, EventsByDate>();
const eventFilterCache = new Map<string, ProcessedEvent[]>();

/**
 * Creates a cache key for an event
 */
export const createEventCacheKey = (event: Event): string => {
  return `${event.id}-${event.updatedAt.getTime()}`;
};

/**
 * Creates a cache key for event filtering
 */
export const createFilterCacheKey = (
  events: Event[],
  options: EventFilterOptions = {}
): string => {
  const eventsHash = events.length > 0
    ? `${events.length}-${Math.max(...events.map(e => e.updatedAt.getTime()))}`
    : 'empty';

  const optionsStr = JSON.stringify({
    start: options.startDate?.getTime(),
    end: options.endDate?.getTime(),
    types: options.types?.sort(),
    search: options.searchTerm?.toLowerCase()
  });

  return `${eventsHash}-${btoa(optionsStr)}`;
};

/**
 * Processes a single event with caching
 */
export const processEvent = (event: Event): ProcessedEvent => {
  const cacheKey = createEventCacheKey(event);

  if (eventProcessingCache.has(cacheKey)) {
    return eventProcessingCache.get(cacheKey)!;
  }

  const processed: ProcessedEvent = {
    id: event.id,
    title: event.title,
    time: formatTimeCached(event.startTime),
    type: event.type,
    color: getLegacyEventColor(event.type),
    location: event.location,
    startTime: event.startTime,
    endTime: event.endTime,
    dateKey: createDateKey(event.startTime)
  };

  eventProcessingCache.set(cacheKey, processed);

  // Prevent cache from growing too large
  if (eventProcessingCache.size > 5000) {
    const firstKey = eventProcessingCache.keys().next().value;
    if (firstKey) {
      eventProcessingCache.delete(firstKey);
    }
  }

  return processed;
};

/**
 * Efficiently groups events by date with caching
 */
export const groupEventsByDate = (
  events: Event[],
  dateRange?: { start: Date; end: Date }
): EventsByDate => {
  const cacheKey = dateRange
    ? `${createDateKey(dateRange.start)}-${createDateKey(dateRange.end)}-${events.length}`
    : `all-${events.length}`;

  if (eventsByDateCache.has(cacheKey)) {
    return eventsByDateCache.get(cacheKey)!;
  }

  const grouped: EventsByDate = {};

  events.forEach(event => {
    // Filter by date range if provided
    if (dateRange) {
      if (event.startTime < dateRange.start || event.startTime > dateRange.end) {
        return;
      }
    }

    const processed = processEvent(event);
    const dateKey = processed.dateKey;

    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }
    grouped[dateKey].push(processed);
  });

  // Sort events within each date by start time
  Object.keys(grouped).forEach(dateKey => {
    grouped[dateKey].sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
  });

  eventsByDateCache.set(cacheKey, grouped);

  // Prevent cache from growing too large
  if (eventsByDateCache.size > 50) {
    const firstKey = eventsByDateCache.keys().next().value;
    if (firstKey) {
      eventsByDateCache.delete(firstKey);
    }
  }

  return grouped;
};

/**
 * Gets events for a specific date with caching
 */
export const getEventsForDate = (events: Event[], date: Date): ProcessedEvent[] => {
  const dateKey = createDateKey(date);
  const eventsByDate = groupEventsByDate(events);
  return eventsByDate[dateKey] || [];
};

/**
 * Efficiently filters events with caching
 */
export const filterEvents = (
  events: Event[],
  options: EventFilterOptions = {}
): ProcessedEvent[] => {
  const cacheKey = createFilterCacheKey(events, options);

  if (eventFilterCache.has(cacheKey)) {
    return eventFilterCache.get(cacheKey)!;
  }

  let filteredEvents = events;

  // Filter by date range
  if (options.startDate || options.endDate) {
    filteredEvents = filteredEvents.filter(event => {
      if (options.startDate && event.startTime < options.startDate) return false;
      if (options.endDate && event.startTime > options.endDate) return false;
      return true;
    });
  }

  // Filter by types
  if (options.types && options.types.length > 0) {
    filteredEvents = filteredEvents.filter(event =>
      options.types!.includes(event.type)
    );
  }

  // Filter by search term
  if (options.searchTerm && options.searchTerm.trim()) {
    const searchLower = options.searchTerm.toLowerCase();
    filteredEvents = filteredEvents.filter(event =>
      event.title.toLowerCase().includes(searchLower) ||
      event.description.toLowerCase().includes(searchLower) ||
      (event.location && event.location.toLowerCase().includes(searchLower))
    );
  }

  // Process and sort results
  const processed = filteredEvents
    .map(processEvent)
    .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

  eventFilterCache.set(cacheKey, processed);

  // Prevent cache from growing too large
  if (eventFilterCache.size > 100) {
    const firstKey = eventFilterCache.keys().next().value;
    if (firstKey) {
      eventFilterCache.delete(firstKey);
    }
  }

  return processed;
};

/**
 * Gets events for a month range with optimization
 */
export const getEventsForMonth = (events: Event[], date: Date): EventsByDate => {
  const year = date.getFullYear();
  const month = date.getMonth();

  const startOfMonth = new Date(year, month, 1);
  startOfMonth.setHours(0, 0, 0, 0);

  const endOfMonth = new Date(year, month + 1, 0);
  endOfMonth.setHours(23, 59, 59, 999);

  return groupEventsByDate(events, { start: startOfMonth, end: endOfMonth });
};

/**
 * Gets events for a week range with optimization
 */
export const getEventsForWeek = (events: Event[], date: Date): EventsByDate => {
  const startOfWeek = new Date(date);
  const day = startOfWeek.getDay();
  const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Monday as first day
  startOfWeek.setDate(diff);
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  return groupEventsByDate(events, { start: startOfWeek, end: endOfWeek });
};

/**
 * Checks if an event spans multiple days
 */
export const isMultiDayEvent = (event: Event): boolean => {
  return createDateKey(event.startTime) !== createDateKey(event.endTime);
};

/**
 * Gets all dates an event spans across
 */
export const getEventSpanDates = (event: Event): string[] => {
  const dates: string[] = [];
  const currentDate = new Date(event.startTime);
  const endDate = new Date(event.endTime);

  while (currentDate <= endDate) {
    dates.push(createDateKey(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
};

/**
 * Optimized conflict detection for events
 */
export const detectEventConflicts = (events: Event[]): Event[][] => {
  const conflicts: Event[][] = [];
  const sortedEvents = [...events].sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

  for (let i = 0; i < sortedEvents.length; i++) {
    const currentEvent = sortedEvents[i];
    const conflictGroup: Event[] = [currentEvent];

    for (let j = i + 1; j < sortedEvents.length; j++) {
      const compareEvent = sortedEvents[j];

      // Check if events overlap
      if (
        currentEvent.startTime < compareEvent.endTime &&
        currentEvent.endTime > compareEvent.startTime
      ) {
        conflictGroup.push(compareEvent);
      }
    }

    if (conflictGroup.length > 1) {
      conflicts.push(conflictGroup);
    }
  }

  return conflicts;
};

/**
 * Clears all event caches
 */
export const clearEventCaches = (): void => {
  eventProcessingCache.clear();
  eventsByDateCache.clear();
  eventFilterCache.clear();
};

/**
 * Gets cache statistics for debugging
 */
export const getEventCacheStats = () => {
  return {
    processing: eventProcessingCache.size,
    byDate: eventsByDateCache.size,
    filtering: eventFilterCache.size
  };
};

/**
 * Preloads events for a date range to improve performance
 */
export const preloadEvents = (events: Event[], startDate: Date, endDate: Date): void => {
  // Pre-process events in the range
  const relevantEvents = events.filter(event =>
    event.startTime >= startDate && event.startTime <= endDate
  );

  relevantEvents.forEach(processEvent);
  groupEventsByDate(relevantEvents, { start: startDate, end: endDate });
};