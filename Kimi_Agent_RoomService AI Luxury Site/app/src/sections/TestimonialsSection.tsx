import { useRef } from 'react';
import { ArrowRight, Quote } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const TestimonialsSection = () => {
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
      {/* Right image */}
      <div
        ref={contentRef as React.RefObject<HTMLDivElement>}
        className={`absolute right-0 top-0 w-full lg:w-1/2 h-full transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'
        }`}
      >
        <img
          src="/testimonial_bed.jpg"
          alt="Guest relaxing in hotel room"
          className="w-full h-full object-cover"
          style={{ filter: 'contrast(1.05) saturate(0.92)' }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-l from-transparent to-charcoal/70" />
      </div>

      {/* Left quote block */}
      <div className="relative z-10 min-h-screen flex flex-col justify-center px-6 lg:px-[7vw] py-32">
        <div
          className={`max-w-lg transition-all duration-700 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Quote icon */}
          <Quote size={48} className="text-copper/40 mb-6" />

          {/* Large quote */}
          <blockquote
            className="font-sora font-bold text-offwhite leading-tight tracking-tight"
            style={{ fontSize: 'clamp(28px, 3.2vw, 48px)' }}
          >
            "It feels like having a concierge who never sleeps."
          </blockquote>

          {/* Attribution */}
          <p
            className={`mt-8 text-offwhite-muted text-lg transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: '400ms' }}
          >
            — Director of Guest Experience, Boutique Hotel Group
          </p>

          {/* CTA */}
          <button
            onClick={() => scrollToSection('#contact')}
            className={`mt-10 text-copper font-semibold inline-flex items-center gap-2 hover:text-copper-light transition-colors duration-300 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: '500ms' }}
          >
            Read more stories
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
