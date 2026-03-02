'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    // Disable browser's automatic scroll restoration
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // Clear any hash from URL and force scroll to top on page load
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname);
    }

    // Force scroll to top
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
