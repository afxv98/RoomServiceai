'use client';

import { useRef } from 'react';
import { MessageSquare, TrendingUp, Database, MessageCircle, BarChart3, UserCheck } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

export default function CoreFeaturesSection() {
  const sectionRef = useRef(null);
  const { ref: headingRef, isVisible: headingVisible } = useScrollAnimation({ threshold: 0.3 });
  const { ref: cardsRef, isVisible: cardsVisible } = useScrollAnimation({ threshold: 0.2 });

  const features = [
    {
      icon: MessageSquare,
      title: 'AI Ordering (Chat + Voice)',
      description: 'Natural language ordering with modifiers, substitutions, dietary notes, and multi-language support—24/7 without staff involvement.'
    },
    {
      icon: TrendingUp,
      title: 'Intelligent Upsells',
      description: 'Context-aware recommendations with time-based offers for drinks, desserts, add-ons, and bundles on every order.'
    },
    {
      icon: Database,
      title: 'POS & Kitchen Integration',
      description: 'Orders flow directly to your POS and kitchen systems with automatic routing—no manual re-entry, fewer errors.'
    },
    {
      icon: MessageCircle,
      title: 'SMS Order Confirmation',
      description: 'Instant guest confirmation with clear delivery expectations, reducing follow-up calls.'
    },
    {
      icon: BarChart3,
      title: 'Revenue & Operations Analytics',
      description: 'Track average order value, upsell performance, peak demand, labour deflection, and executive-level dashboards.'
    },
    {
      icon: UserCheck,
      title: 'Human Escalation & Safety',
      description: 'Complex requests route to staff with full context. Emergency or urgent requests escalated immediately.'
    }
  ];

  return (
    <section
      ref={sectionRef}
      id="capabilities"
      className="relative bg-white py-24 lg:py-32"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Heading */}
        <div
          ref={headingRef}
          className={`mb-16 transition-all duration-700 ${
            headingVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <span className="font-mono text-xs uppercase tracking-[0.12em] text-copper mb-4 block">CAPABILITIES</span>
          <h2
            className="font-sora font-bold text-charcoal leading-tight tracking-tight max-w-2xl"
            style={{ fontSize: 'clamp(28px, 3.2vw, 48px)' }}
          >
            Everything you need to run room service—smarter.
          </h2>
        </div>

        {/* Feature Cards */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className={`feature-card p-8 rounded-lg bg-offwhite border border-gray-200
                           hover:border-copper/40 hover:shadow-lg transition-all duration-700 ${
                  cardsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="w-14 h-14 rounded-xl bg-copper/10 border border-copper/30 flex items-center justify-center mb-6">
                  <Icon size={26} className="text-copper" />
                </div>
                <h3 className="font-sora font-semibold text-charcoal text-xl mb-4">
                  {feature.title}
                </h3>
                <p className="text-charcoal/70 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
