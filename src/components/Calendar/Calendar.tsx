'use client';

import React from 'react';
import OptimizedCalendar from './OptimizedCalendar';
import CalendarErrorBoundary from './CalendarErrorBoundary';

/**
 * Calendar Component - Now using optimized implementation
 *
 * This component provides a backward-compatible interface while using
 * the new optimized calendar implementation under the hood.
 *
 * Performance improvements include:
 * - Memoized calendar grid generation
 * - Efficient event filtering and caching
 * - Optimized re-rendering with React.memo
 * - Smart date calculations with caching
 * - Pre-loading of events for improved responsiveness
 */

interface CalendarProps {
  className?: string;
}

/**
 * Calendar Component - Main entry point
 *
 * This component now uses the optimized calendar implementation
 * for better performance while maintaining the same API.
 * Includes error boundary for graceful error handling.
 */
export default function Calendar({ className }: CalendarProps = {}) {
  return (
    <CalendarErrorBoundary>
      <OptimizedCalendar className={className} />
    </CalendarErrorBoundary>
  );
}