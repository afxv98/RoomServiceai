import { useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const AlwaysOnSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { ref: contentRef, isVisible } = useScrollAnimation({ threshold: 0.3 });

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen bg-charcoal overflow-hidden"
    >
      {/* Large Image (left) */}
      <div
        ref={contentRef as React.RefObject<HTMLDivElement>}
        className={`absolute left-0 top-0 w-full lg:w-[56vw] h-full transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'
        }`}
      >
        <img
          src="/feature_24h.jpg"
          alt="Luxury hotel hallway"
          className="w-full h-full object-cover"
          style={{ filter: 'contrast(1.05) saturate(0.92)' }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-charcoal/80" />
      </div>

      {/* Right text area */}
      <div className="relative z-10 min-h-screen flex flex-col justify-center px-6 lg:px-[4vw] py-32 lg:ml-[56vw]">
        <div
          className={`max-w-lg transition-all duration-700 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Micro label */}
          <span className="micro-label mb-4 block">ALWAYS ON</span>

          {/* Headline */}
          <h2
            className="font-sora font-bold text-offwhite leading-tight tracking-tight"
            style={{ fontSize: 'clamp(32px, 3.6vw, 56px)' }}
          >
            24/7 availability
          </h2>

          {/* Body */}
          <p className="mt-8 text-offwhite-muted text-lg leading-relaxed">
            Guests order when they want. The agent handles calls, confirmations,
            and kitchen handoffs—day or night.
          </p>

          {/* CTA */}
          <button
            onClick={() => scrollToSection('#howitworks')}
            className="mt-10 text-copper font-semibold inline-flex items-center gap-2 hover:text-copper-light transition-colors duration-300"
          >
            See how it works
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default AlwaysOnSection;
