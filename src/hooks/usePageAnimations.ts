'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ANIMATION_PRESETS, createAnimationClasses } from '@/lib/animation-config';

export const usePageAnimations = () => {
  const pathname = usePathname();
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  // Trigger re-animation when route changes
  useEffect(() => {
    setIsAnimating(true);
    setAnimationKey(prev => prev + 1);
    
    // Reset animation state after completion
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 600); // Slightly longer than longest animation

    return () => clearTimeout(timer);
  }, [pathname]);

  // Get page-specific animation classes based on current route
  const getPageAnimations = () => {
    switch (pathname) {
      case '/dashboard':
        return ANIMATION_PRESETS.statsGrid;
      case '/planning':
        return ANIMATION_PRESETS.scheduleCalendar;
      default:
        return {
          container: createAnimationClasses.pageEnter(),
          header: createAnimationClasses.sectionEnter(100),
          content: createAnimationClasses.sectionEnter(200)
        };
    }
  };

  // Helper to create staggered delays for multiple elements
  const getStaggeredDelay = (index: number, baseDelay = 100, increment = 75) => {
    return baseDelay + (index * increment);
  };

  // Check if user prefers reduced motion
  const prefersReducedMotion = () => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  };

  return {
    isAnimating,
    animationKey,
    getPageAnimations,
    getStaggeredDelay,
    prefersReducedMotion,
    pathname
  };
};

// Hook for individual component animations
export const useComponentAnimation = (
  animationType: 'card' | 'section' | 'micro' = 'card',
  delay = 0
) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  const getAnimationClass = () => {
    if (!isVisible) return 'opacity-0';

    switch (animationType) {
      case 'section':
        return createAnimationClasses.sectionEnter(delay);
      case 'micro':
        return createAnimationClasses.cardEnter(delay);
      default:
        return createAnimationClasses.cardEnter(delay);
    }
  };

  return {
    isVisible,
    animationClass: getAnimationClass()
  };
};