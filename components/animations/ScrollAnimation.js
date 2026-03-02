'use client';

import { useEffect, useRef, useState } from 'react';

export default function ScrollAnimation({
  children,
  className = '',
  animation = 'fade-up',
  delay = 0,
  duration = 600,
  threshold = 0.1,
  triggerOnce = true
}) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) {
            observer.unobserve(entry.target);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
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
  }, [threshold, triggerOnce]);

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
        case 'fade':
          return `${baseClass} opacity-0`;
        case 'zoom-in':
          return `${baseClass} opacity-0 scale-95`;
        case 'zoom-out':
          return `${baseClass} opacity-0 scale-105`;
        case 'flip-up':
          return `${baseClass} opacity-0 rotate-x-90`;
        default:
          return `${baseClass} opacity-0 translate-y-12`;
      }
    } else {
      return `${baseClass} opacity-100 translate-y-0 translate-x-0 scale-100 rotate-x-0`;
    }
  };

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
