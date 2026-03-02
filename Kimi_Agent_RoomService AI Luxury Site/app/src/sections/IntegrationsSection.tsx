import { useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const IntegrationsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { ref: contentRef, isVisible } = useScrollAnimation({ threshold: 0.3 });

  const partners = ['Oracle Opera', 'Toast', 'Mews', 'Hapi'];

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
      {/* Right image */}
      <div
        ref={contentRef as React.RefObject<HTMLDivElement>}
        className={`absolute right-0 top-0 w-full lg:w-1/2 h-full transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'
        }`}
      >
        <img
          src="/integrations_bathroom.jpg"
          alt="Hotel bathroom amenities"
          className="w-full h-full object-cover"
          style={{ filter: 'contrast(1.05) saturate(0.92)' }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-l from-transparent to-charcoal/70" />
      </div>

      {/* Left content */}
      <div className="relative z-10 min-h-screen flex flex-col justify-center px-6 lg:px-[7vw] py-32">
        <div
          className={`max-w-lg transition-all duration-700 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Micro label */}
          <span className="micro-label mb-4 block">INTEGRATIONS</span>

          {/* Headline */}
          <h2
            className="font-sora font-bold text-offwhite leading-tight tracking-tight"
            style={{ fontSize: 'clamp(32px, 3.6vw, 56px)' }}
          >
            Works with your stack.
          </h2>

          {/* Body */}
          <p className="mt-6 text-offwhite-muted text-lg leading-relaxed">
            Connect your PMS, POS, and kitchen display in minutes. No
            rip-and-replace required.
          </p>

          {/* Partner pills */}
          <div className="mt-10 flex flex-wrap gap-3">
            {partners.map((partner, index) => (
              <span
                key={index}
                className={`partner-pill transition-all duration-500 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
                style={{ transitionDelay: `${400 + index * 100}ms` }}
              >
                {partner}
              </span>
            ))}
          </div>

          {/* CTA */}
          <button
            onClick={() => scrollToSection('#contact')}
            className={`mt-10 text-copper font-semibold inline-flex items-center gap-2 hover:text-copper-light transition-colors duration-300 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: '800ms' }}
          >
            View all integrations
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default IntegrationsSection;
