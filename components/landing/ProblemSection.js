'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

export default function ProblemSection() {
  const sectionRef = useRef(null);
  const { ref: contentRef, isVisible } = useScrollAnimation({ threshold: 0.3 });

  return (
    <section
      ref={sectionRef}
      id="about-us"
      className="relative w-full min-h-screen overflow-hidden"
      style={{ backgroundColor: '#6B3A2A' }}
    >
      {/* Left image */}
      <div
        ref={contentRef}
        className={`absolute left-0 top-0 w-full lg:w-[50vw] h-full transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'
        }`}
      >
        <Image
          src="/feature_24h.jpg"
          alt="Room service challenges"
          fill
          className="object-cover"
          style={{ filter: 'contrast(1.05) saturate(0.92)' }}
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-warm-brown/90" />
      </div>

      {/* Right content */}
      <div className="relative z-10 min-h-screen flex flex-col justify-center px-6 lg:px-[5vw] py-32 lg:ml-[50vw]">
        <div
          className={`max-w-lg transition-all duration-700 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Micro label */}
          <span className="micro-label mb-4 block text-offwhite/70">THE CHALLENGE</span>

          {/* Headline */}
          <h2
            className="font-cormorant font-bold text-offwhite leading-tight tracking-tight mb-8"
            style={{ fontSize: 'clamp(32px, 3.6vw, 56px)' }}
          >
            Always on, never overwhelmed.
          </h2>

          {/* Description */}
          <div className="space-y-4 text-offwhite-muted">
            <p>
              Peak hours shouldn't mean missed calls, order errors, or frustrated guests. Yet that's the reality for most hotel operations.
            </p>
            <p>
              Staff are stretched thin, upsells are inconsistent, and dietary notes get lost in translation—turning what should be a luxury service into an operational liability.
            </p>
            <p className="text-offwhite font-semibold">
              This isn't a staffing problem. It's a call handling and accuracy problem—and it's solvable.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
