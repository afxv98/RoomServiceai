import { useRef } from 'react';
import { Brain, Zap, Heart } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const FeaturesSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { ref: headingRef, isVisible: headingVisible } = useScrollAnimation({ threshold: 0.3 });
  const { ref: cardsRef, isVisible: cardsVisible } = useScrollAnimation({ threshold: 0.2 });

  const features = [
    {
      icon: Brain,
      title: 'Smart Ordering',
      description:
        'Natural conversation, upsells, and dietary checks—handled automatically.',
    },
    {
      icon: Zap,
      title: 'Kitchen Sync',
      description:
        'Tickets go straight to the kitchen display with timing, mods, and guest context.',
    },
    {
      icon: Heart,
      title: 'Guest Preferences',
      description:
        'Remember allergies, favorites, and special requests—without extra work.',
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="features"
      className="relative bg-charcoal py-24 lg:py-32"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Heading */}
        <div
          ref={headingRef as React.RefObject<HTMLDivElement>}
          className={`mb-16 transition-all duration-700 ${
            headingVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <span className="micro-label mb-4 block">FEATURES</span>
          <h2
            className="font-sora font-bold text-offwhite leading-tight tracking-tight max-w-2xl"
            style={{ fontSize: 'clamp(28px, 3.2vw, 48px)' }}
          >
            Everything you need to run room service—smarter.
          </h2>
        </div>

        {/* Feature Cards */}
        <div
          ref={cardsRef as React.RefObject<HTMLDivElement>}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => (
            <div
              key={index}
              className={`feature-card p-8 rounded-2xl bg-charcoal-soft/30 border border-offwhite-muted/10
                         hover:border-copper/40 transition-all duration-700 ${
                cardsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="w-14 h-14 rounded-xl bg-copper/10 border border-copper/30 flex items-center justify-center mb-6">
                <feature.icon size={26} className="text-copper" />
              </div>
              <h3 className="font-sora font-semibold text-offwhite text-xl mb-4">
                {feature.title}
              </h3>
              <p className="text-offwhite-muted leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
