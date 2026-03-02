'use client';

import { useEffect, useRef, useState } from 'react';

export default function CardAnimation({
  children,
  className = '',
  index = 0,
  staggerDelay = 100,
  animation = 'fade-up',
  duration = 600,
  threshold = 0.1
}) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold }
    );

    const currentElement = elementRef.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [threshold]);

  const getAnimationClass = () => {
    const baseClass = 'transition-all';

    if (!isVisible) {
      switch (animation) {
        case 'fade-up':
          return `${baseClass} opacity-0 translate-y-12`;
        case 'fade-down':
          return `${baseClass} opacity-0 -translate-y-12`;
        case 'fade-left':
          return `${baseClass} opacity-0 translate-x-12`;
        case 'fade-right':
          return `${baseClass} opacity-0 -translate-x-12`;
        case 'scale-up':
          return `${baseClass} opacity-0 scale-90`;
        case 'flip':
          return `${baseClass} opacity-0 rotate-y-12`;
        default:
          return `${baseClass} opacity-0 translate-y-12`;
      }
    } else {
      return `${baseClass} opacity-100 translate-y-0 translate-x-0 scale-100 rotate-y-0`;
    }
  };

  const delay = index * staggerDelay;

  return (
    <div
      ref={elementRef}
      className={`${getAnimationClass()} ${className}`}
      style={{
        transitionDelay: `${delay}ms`,
        transitionDuration: `${duration}ms`,
      }}
    >
      {children}
    </div>
  );
}
