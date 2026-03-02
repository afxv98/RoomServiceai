'use client';

import { useEffect, useState, useRef } from 'react';
import { TrendingUp, DollarSign, Clock, Users } from 'lucide-react';

export const ROIMetricsAnimation = () => {
  const [visible, setVisible] = useState(false);
  const [counts, setCounts] = useState({ revenue: 0, savings: 0, time: 0, accuracy: 0 });
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;

    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    const targets = { revenue: 35, savings: 125, time: 90, accuracy: 100 };
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / steps;

      setCounts({
        revenue: Math.floor(targets.revenue * progress),
        savings: Math.floor(targets.savings * progress),
        time: Math.floor(targets.time * progress),
        accuracy: Math.floor(targets.accuracy * progress)
      });

      if (step >= steps) clearInterval(timer);
    }, interval);

    return () => clearInterval(timer);
  }, [visible]);

  const metrics = [
    { icon: TrendingUp, value: `${counts.revenue}%`, label: 'Revenue Increase', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-500', delay: '0ms' },
    { icon: DollarSign, value: `$${counts.savings}K`, label: 'Avg. Annual Savings', color: 'text-copper', bg: 'bg-orange-50', border: 'border-copper', delay: '200ms' },
    { icon: Clock, value: `${counts.time}%`, label: 'Time Saved', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-500', delay: '400ms' },
    { icon: Users, value: `${counts.accuracy}%`, label: 'Order Accuracy', color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-500', delay: '600ms' }
  ];

  return (
    <div ref={ref} className="relative w-full bg-offwhite rounded-2xl overflow-hidden shadow-2xl p-8 md:p-12">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(199, 141, 78, 0.05) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}
      />

      {/* Title */}
      <div className={`text-center mb-12 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
        <div className="text-4xl md:text-5xl font-bold text-charcoal font-sora mb-3">
          Real Results
        </div>
        <div className="text-lg md:text-xl text-charcoal/70 font-inter">
          Industry-leading performance metrics
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 relative z-10 mb-12">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div
              key={index}
              className={`${metric.bg} rounded-2xl p-6 md:p-8 border-3 ${metric.border} transition-all duration-700 hover:scale-105 hover:shadow-2xl relative overflow-hidden group`}
              style={{
                transitionDelay: visible ? metric.delay : '0ms',
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(30px)'
              }}
            >
              {/* Background Icon */}
              <div className="absolute -right-8 -bottom-8 opacity-5 transition-transform duration-500 group-hover:scale-110">
                <Icon size={150} />
              </div>

              {/* Content */}
              <div className="relative z-10">
                <div className={`w-16 h-16 md:w-20 md:h-20 ${metric.bg} rounded-2xl flex items-center justify-center mb-4 md:mb-6 ${metric.border} border-2`}>
                  <Icon size={36} className={metric.color} />
                </div>

                <div className={`text-4xl md:text-5xl font-bold ${metric.color} font-sora mb-2 md:mb-3`}>
                  {metric.value}
                </div>

                <div className="text-base md:text-lg text-charcoal/70 font-inter font-medium">
                  {metric.label}
                </div>
              </div>

              {/* Animated border pulse */}
              {visible && (
                <div className={`absolute inset-0 rounded-2xl border-3 ${metric.border} opacity-0 animate-border-pulse`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <div className={`text-center transition-all duration-700 delay-800 ${visible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="text-2xl md:text-3xl text-charcoal font-sora font-semibold">
          Your ROI. <span className="text-copper">Guaranteed.</span>
        </div>
      </div>

      <style jsx>{`
        @keyframes border-pulse {
          0%, 100% { opacity: 0; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.02); }
        }
        .animate-border-pulse {
          animation: border-pulse 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};
