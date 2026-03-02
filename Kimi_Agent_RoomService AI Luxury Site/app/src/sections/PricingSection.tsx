import { useRef } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const PricingSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { ref: contentRef, isVisible } = useScrollAnimation({ threshold: 0.3 });

  const bullets = [
    'Unlimited calls & messages',
    'Kitchen integrations included',
    '24/7 support',
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={sectionRef}
      id="pricing"
      className="relative w-full min-h-screen overflow-hidden"
      style={{ backgroundColor: '#6B3A2A' }}
    >
      {/* Left image */}
      <div
        ref={contentRef as React.RefObject<HTMLDivElement>}
        className={`absolute left-0 top-0 w-full lg:w-[55vw] h-full transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'
        }`}
      >
        <img
          src="/pricing_room.jpg"
          alt="Luxury hotel room detail"
          className="w-full h-full object-cover"
          style={{ filter: 'contrast(1.05) saturate(0.92)' }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#6B3A2A]/90" />
      </div>

      {/* Right pricing block */}
      <div className="relative z-10 min-h-screen flex flex-col justify-center px-6 lg:px-[5vw] py-32 lg:ml-[55vw]">
        <div
          className={`max-w-lg transition-all duration-700 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Micro label */}
          <span className="micro-label mb-4 block text-offwhite/70">PRICING</span>

          {/* Headline */}
          <h2
            className="font-sora font-bold text-offwhite leading-tight tracking-tight"
            style={{ fontSize: 'clamp(32px, 3.6vw, 56px)' }}
          >
            Simple pricing for every property.
          </h2>

          {/* Price */}
          <div className="mt-10">
            <span className="font-sora font-bold text-copper" style={{ fontSize: 'clamp(36px, 4vw, 64px)' }}>
              $199
            </span>
            <span className="text-offwhite-muted text-lg ml-2">/month</span>
          </div>

          {/* Bullets */}
          <ul className="mt-8 space-y-4">
            {bullets.map((bullet, index) => (
              <li
                key={index}
                className={`flex items-center gap-3 text-offwhite transition-all duration-500 ${
                  isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                }`}
                style={{ transitionDelay: `${400 + index * 100}ms` }}
              >
                <Check size={20} className="text-copper flex-shrink-0" />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <button
            onClick={() => scrollToSection('#contact')}
            className={`mt-10 px-8 py-4 rounded-lg bg-copper text-white font-semibold
                       hover:bg-copper-dark transition-colors duration-300
                       flex items-center gap-2 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: '700ms' }}
          >
            Get a quote
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
