'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

export default function HowItWorksSection() {
  const sectionRef = useRef(null);
  const { ref: contentRef, isVisible } = useScrollAnimation({ threshold: 0.3 });

  const steps = [
    { number: '01', title: 'Guest calls room service', description: 'From their in-room phone or via chat' },
    { number: '02', title: 'AI answers instantly', description: 'Captures order, handles modifiers & allergies' },
    { number: '03', title: 'Smart upsells offered', description: 'Context-aware drinks, desserts, add-ons' },
    { number: '04', title: 'Order flows to kitchen', description: 'Direct POS integration, no manual entry' },
    { number: '05', title: 'Guest gets confirmation', description: 'Instant SMS with details & ETA' }
  ];

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="relative w-full min-h-screen overflow-hidden bg-warm-brown"
    >
      {/* Left image */}
      <div
        ref={contentRef}
        className={`absolute left-0 top-0 w-full lg:w-[55vw] h-full transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'
        }`}
      >
        <Image
          src="/howitworks_phone.jpg"
          alt="Guest using room service"
          fill
          className="object-cover"
          style={{ filter: 'contrast(1.05) saturate(0.92)' }}
          sizes="(max-width: 1024px) 100vw, 55vw"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-warm-brown/90" />
      </div>

      {/* Right content */}
      <div className="relative z-10 min-h-screen flex flex-col justify-center px-6 lg:px-[5vw] py-32 lg:ml-[55vw]">
        <div
          className={`max-w-lg transition-all duration-700 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Micro label */}
          <span className="micro-label mb-4 block text-offwhite/70">HOW IT WORKS</span>

          {/* Headline */}
          <h2
            className="font-cormorant font-bold text-offwhite leading-tight tracking-tight mb-12"
            style={{ fontSize: 'clamp(32px, 3.6vw, 56px)' }}
          >
            Guest → AI → Kitchen
          </h2>

          {/* Steps */}
          <div className="space-y-8">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`transition-all duration-500 ${
                  isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                }`}
                style={{ transitionDelay: `${400 + index * 100}ms` }}
              >
                <div className="flex gap-4">
                  <span className="font-mono text-copper text-sm font-bold flex-shrink-0">
                    {step.number}
                  </span>
                  <div>
                    <h3 className="font-cormorant font-semibold text-offwhite text-lg mb-1">
                      {step.title}
                    </h3>
                    <p className="text-offwhite-muted text-sm">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
