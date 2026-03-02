import { useRef } from 'react';
import { ArrowRight, Phone, MessageSquare, ChefHat } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const HowItWorksSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { ref: contentRef, isVisible } = useScrollAnimation({ threshold: 0.3 });

  const steps = [
    {
      icon: Phone,
      text: 'Guest calls or messages',
    },
    {
      icon: MessageSquare,
      text: 'AI confirms and suggests',
    },
    {
      icon: ChefHat,
      text: 'Kitchen receives a clear ticket',
    },
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
      id="howitworks"
      className="relative w-full min-h-screen bg-charcoal overflow-hidden"
    >
      {/* Image (right) */}
      <div
        ref={contentRef as React.RefObject<HTMLDivElement>}
        className={`absolute right-0 top-0 w-full lg:w-1/2 h-full transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'
        }`}
      >
        <img
          src="/howitworks_phone.jpg"
          alt="Guest using smartphone"
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
          <span className="micro-label mb-4 block">HOW IT WORKS</span>

          {/* Headline */}
          <h2
            className="font-sora font-bold text-offwhite leading-tight tracking-tight"
            style={{ fontSize: 'clamp(32px, 3.6vw, 56px)' }}
          >
            Three steps to a faster order
          </h2>

          {/* Steps */}
          <div className="mt-10 space-y-6">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`flex items-center gap-4 group transition-all duration-500 ${
                  isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                }`}
                style={{ transitionDelay: `${300 + index * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-xl bg-copper/10 border border-copper/30 flex items-center justify-center group-hover:bg-copper/20 transition-colors duration-300">
                  <step.icon size={22} className="text-copper" />
                </div>
                <span className="text-offwhite text-lg font-medium">
                  {step.text}
                </span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <button
            onClick={() => scrollToSection('#features')}
            className={`mt-12 btn-primary flex items-center gap-2 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: '600ms' }}
          >
            Explore the platform
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
