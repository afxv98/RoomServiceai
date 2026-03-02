import { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';

const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Trigger entrance animation after mount
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

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
      {/* Background vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(0,0,0,0.4)_100%)]" />

      {/* Hero Image (right half) */}
      <div
        className={`absolute right-0 top-0 w-full lg:w-1/2 h-full transition-all duration-1000 ease-out ${
          isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
        }`}
      >
        <img
          src="/hero_roomservice.jpg"
          alt="Luxury room service"
          className="w-full h-full object-cover"
          style={{ filter: 'contrast(1.05) saturate(0.92)' }}
        />
        {/* Gradient overlay on image */}
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/60 to-transparent lg:from-charcoal/55 lg:to-transparent" />
      </div>

      {/* Content (left side) */}
      <div className="relative z-10 min-h-screen flex flex-col justify-center px-6 lg:px-[7vw] py-32">
        <div className="max-w-2xl">
          {/* Headline */}
          <h1
            className={`font-sora font-bold text-offwhite leading-[0.95] tracking-tight transition-all duration-700 delay-200 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
            style={{ fontSize: 'clamp(36px, 4.5vw, 72px)' }}
          >
            Room service,
            <br />
            <span className="text-copper">reimagined by AI.</span>
          </h1>

          {/* Subheadline */}
          <p
            className={`mt-8 text-offwhite-muted text-lg lg:text-xl leading-relaxed max-w-md transition-all duration-700 delay-400 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            An intelligent agent that answers calls, takes orders, and coordinates
            with your team—so guests feel cared for, instantly.
          </p>

          {/* CTAs */}
          <div
            className={`mt-10 flex flex-wrap items-center gap-5 transition-all duration-700 delay-500 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <button
              onClick={() => scrollToSection('#contact')}
              className="btn-primary flex items-center gap-2"
            >
              Book a demo
              <ArrowRight size={18} />
            </button>
            <button
              onClick={() => scrollToSection('#pricing')}
              className="text-copper font-semibold inline-flex items-center gap-2 hover:text-copper-light transition-colors duration-300"
            >
              View pricing
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Proof line */}
          <p
            className={`mt-16 text-offwhite-muted/70 text-sm transition-all duration-700 delay-600 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Used by boutique hotels and luxury groups worldwide.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
