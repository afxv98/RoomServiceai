'use client';

import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';

/**
 * SmoothScroll wrapper component
 * Implements Lenis smooth scrolling throughout the page
 */
export default function SmoothScroll({ children }) {
  useEffect(() => {
    // Initialize Lenis with luxury easing
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    // Animation frame loop
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Cleanup
    return () => {
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
