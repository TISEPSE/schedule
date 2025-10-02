/**
 * Performance monitoring utilities for calendar components
 * Provides tools to measure and optimize calendar performance
 */

interface PerformanceMetric {
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  metadata?: Record<string, unknown>;
}

interface CalendarPerformanceData {
  gridGeneration: number;
  eventFiltering: number;
  rendering: number;
  totalEvents: number;
  cacheHits: number;
  cacheMisses: number;
}

class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetric> = new Map();
  private enabled: boolean = process.env.NODE_ENV === 'development';

  /**
   * Start measuring a performance metric
   */
  start(name: string, metadata?: Record<string, unknown>): void {
    if (!this.enabled) return;

    this.metrics.set(name, {
      name,
      startTime: performance.now(),
      metadata
    });
  }

  /**
   * End measuring a performance metric
   */
  end(name: string): number | null {
    if (!this.enabled) return null;

    const metric = this.metrics.get(name);
    if (!metric) {
      console.warn(`Performance metric "${name}" was not started`);
      return null;
    }

    const endTime = performance.now();
    const duration = endTime - metric.startTime;

    metric.endTime = endTime;
    metric.duration = duration;

    // Log performance data in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔥 Performance: ${name} took ${duration.toFixed(2)}ms`, metric.metadata);
    }

    return duration;
  }

  /**
   * Measure the execution time of a function
   */
  measure<T>(name: string, fn: () => T, metadata?: Record<string, unknown>): T {
    if (!this.enabled) return fn();

    this.start(name, metadata);
    try {
      const result = fn();
      this.end(name);
      return result;
    } catch (error) {
      this.end(name);
      throw error;
    }
  }

  /**
   * Measure the execution time of an async function
   */
  async measureAsync<T>(
    name: string,
    fn: () => Promise<T>,
    metadata?: Record<string, unknown>
  ): Promise<T> {
    if (!this.enabled) return fn();

    this.start(name, metadata);
    try {
      const result = await fn();
      this.end(name);
      return result;
    } catch (error) {
      this.end(name);
      throw error;
    }
  }

  /**
   * Get all recorded metrics
   */
  getMetrics(): PerformanceMetric[] {
    return Array.from(this.metrics.values()).filter(m => m.duration !== undefined);
  }

  /**
   * Get performance summary
   */
  getSummary(): Record<string, number> {
    const metrics = this.getMetrics();
    const summary: Record<string, number> = {};

    metrics.forEach(metric => {
      if (metric.duration) {
        summary[metric.name] = metric.duration;
      }
    });

    return summary;
  }

  /**
   * Clear all metrics
   */
  clear(): void {
    this.metrics.clear();
  }

  /**
   * Enable or disable performance monitoring
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor();

/**
 * React hook for measuring component render performance
 */
export function usePerformanceMonitor(componentName: string) {
  React.useEffect(() => {
    performanceMonitor.start(`${componentName}-render`);
    return () => {
      performanceMonitor.end(`${componentName}-render`);
    };
  });

  return {
    measureRender: (name: string, fn: () => void) => {
      performanceMonitor.measure(`${componentName}-${name}`, fn);
    },
    measureRenderAsync: async (name: string, fn: () => Promise<void>) => {
      await performanceMonitor.measureAsync(`${componentName}-${name}`, fn);
    }
  };
}

/**
 * Calendar-specific performance utilities
 */
export class CalendarPerformanceTracker {
  private data: Partial<CalendarPerformanceData> = {};

  recordGridGeneration(duration: number): void {
    this.data.gridGeneration = duration;
  }

  recordEventFiltering(duration: number, eventCount: number): void {
    this.data.eventFiltering = duration;
    this.data.totalEvents = eventCount;
  }

  recordCacheHit(): void {
    this.data.cacheHits = (this.data.cacheHits || 0) + 1;
  }

  recordCacheMiss(): void {
    this.data.cacheMisses = (this.data.cacheMisses || 0) + 1;
  }

  getReport(): CalendarPerformanceData {
    return {
      gridGeneration: this.data.gridGeneration || 0,
      eventFiltering: this.data.eventFiltering || 0,
      rendering: this.data.rendering || 0,
      totalEvents: this.data.totalEvents || 0,
      cacheHits: this.data.cacheHits || 0,
      cacheMisses: this.data.cacheMisses || 0
    };
  }

  getCacheEfficiency(): number {
    const { cacheHits = 0, cacheMisses = 0 } = this.data;
    const total = cacheHits + cacheMisses;
    return total > 0 ? (cacheHits / total) * 100 : 0;
  }

  reset(): void {
    this.data = {};
  }
}

/**
 * Performance decorator for functions
 */
export function withPerformanceTracking<T extends (...args: unknown[]) => unknown>(
  fn: T,
  name: string
): T {
  return ((...args: unknown[]) => {
    return performanceMonitor.measure(name, () => fn(...args));
  }) as T;
}

/**
 * Performance decorator for async functions
 */
export function withAsyncPerformanceTracking<T extends (...args: unknown[]) => Promise<unknown>>(
  fn: T,
  name: string
): T {
  return ((...args: unknown[]) => {
    return performanceMonitor.measureAsync(name, () => fn(...args));
  }) as T;
}

/**
 * Performance budget checker
 */
export class PerformanceBudget {
  private budgets: Map<string, number> = new Map();

  setBudget(operation: string, maxDuration: number): void {
    this.budgets.set(operation, maxDuration);
  }

  checkBudget(operation: string, actualDuration: number): boolean {
    const budget = this.budgets.get(operation);
    if (!budget) return true;

    const withinBudget = actualDuration <= budget;
    if (!withinBudget && process.env.NODE_ENV === 'development') {
      console.warn(
        `⚠️ Performance budget exceeded for "${operation}": ${actualDuration.toFixed(2)}ms > ${budget}ms`
      );
    }

    return withinBudget;
  }
}

// Default performance budgets for calendar operations
export const calendarPerformanceBudget = new PerformanceBudget();
calendarPerformanceBudget.setBudget('calendar-grid-generation', 50); // 50ms max
calendarPerformanceBudget.setBudget('event-filtering', 20); // 20ms max
calendarPerformanceBudget.setBudget('component-render', 16); // 16ms for 60fps

/**
 * Memory usage tracker
 */
export class MemoryTracker {
  private enabled: boolean = 'memory' in performance;

  getMemoryUsage(): Record<string, number> | null {
    if (!this.enabled || !('memory' in performance)) {
      return null;
    }

    const memory = (performance as unknown as { memory?: { usedJSHeapSize: number; totalJSHeapSize: number; jsHeapSizeLimit: number } }).memory;
    if (!memory) {
      return null;
    }
    return {
      used: Math.round(memory.usedJSHeapSize / 1024 / 1024), // MB
      total: Math.round(memory.totalJSHeapSize / 1024 / 1024), // MB
      limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024) // MB
    };
  }

  logMemoryUsage(context: string): void {
    const usage = this.getMemoryUsage();
    if (usage && process.env.NODE_ENV === 'development') {
      console.log(`📊 Memory usage (${context}):`, usage);
    }
  }
}

export const memoryTracker = new MemoryTracker();

// Re-export React for the hook
import React from 'react';