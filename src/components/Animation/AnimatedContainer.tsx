'use client';

import { useEffect, useRef, useState } from 'react';

interface AnimatedContainerProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  animation?: 'fade-in-up' | 'fade-in-up-small' | 'fade-in-up-large' | 'fade-in';
  stagger?: number;
}

export default function AnimatedContainer({ 
  children, 
  className = '', 
  delay = 0,
  animation = 'fade-in-up',
  stagger = 0
}: AnimatedContainerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div 
      ref={ref}
      className={`${className} ${isVisible ? `animate-${animation}` : ''}`}
      style={{ 
        animationDelay: stagger > 0 ? `${stagger}ms` : undefined,
      }}
    >
      {children}
    </div>
  );
}

// Composant pour animer une liste d'éléments avec un délai en cascade
interface AnimatedListProps {
  children: React.ReactNode[];
  className?: string;
  staggerDelay?: number;
  animation?: 'fade-in-up' | 'fade-in-up-small' | 'fade-in-up-large' | 'fade-in';
  initialDelay?: number;
}

export function AnimatedList({ 
  children, 
  className = '', 
  staggerDelay = 100,
  animation = 'fade-in-up-small',
  initialDelay = 0
}: AnimatedListProps) {
  return (
    <>
      {children.map((child, index) => (
        <AnimatedContainer
          key={`child-${index}`}
          className={className}
          delay={initialDelay + (index * staggerDelay)}
          animation={animation}
        >
          {child}
        </AnimatedContainer>
      ))}
    </>
  );
}