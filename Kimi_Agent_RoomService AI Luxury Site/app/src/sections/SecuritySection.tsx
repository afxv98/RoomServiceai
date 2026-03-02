import { useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const SecuritySection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { ref: contentRef, isVisible } = useScrollAnimation({ threshold: 0.3 });

  const badges = ['SOC 2', 'GDPR', 'PCI DSS'];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={sectionRef}
      id="security"
      className="relative w-full min-h-screen bg-charcoal overflow-hidden"
    >
      {/* Left image */}
      <div
        ref={contentRef as React.RefObject<HTMLDivElement>}
        className={`absolute left-0 top-0 w-full lg:w-[55vw] h-full transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'
        }`}
      >
        <img
          src="/security_laptop.jpg"
          alt="Secure laptop in hotel room"
          className="w-full h-full object-cover"
          style={{ filter: 'contrast(1.05) saturate(0.92)' }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-charcoal/80" />
      </div>

      {/* Right content */}
      <div className="relative z-10 min-h-screen flex flex-col justify-center px-6 lg:px-[5vw] py-32 lg:ml-[55vw]">
        <div
          className={`max-w-lg transition-all duration-700 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Micro label */}
          <span className="micro-label mb-4 block">SECURITY</span>

          {/* Headline */}
          <h2
            className="font-sora font-bold text-offwhite leading-tight tracking-tight"
            style={{ fontSize: 'clamp(32px, 3.6vw, 56px)' }}
          >
            Built for hospitality compliance.
          </h2>

          {/* Body */}
          <p className="mt-6 text-offwhite-muted text-lg leading-relaxed">
            Encryption in transit and at rest. Access controls, audit logs, and
            privacy-by-design.
          </p>

          {/* Badges */}
          <div className="mt-10 flex flex-wrap gap-3">
            {badges.map((badge, index) => (
              <span
                key={index}
                className={`compliance-badge transition-all duration-500 ${
                  isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
                }`}
                style={{ transitionDelay: `${400 + index * 100}ms` }}
              >
                {badge}
              </span>
            ))}
          </div>

          {/* CTA */}
          <button
            onClick={() => scrollToSection('#contact')}
            className={`mt-10 text-copper font-semibold inline-flex items-center gap-2 hover:text-copper-light transition-colors duration-300 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: '700ms' }}
          >
            Request a security brief
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default SecuritySection;
