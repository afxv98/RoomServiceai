'use client';

import { useEffect, useState, useRef } from 'react';
import { Zap, CheckCircle } from 'lucide-react';

export const IntegrationAnimation = () => {
  const [visible, setVisible] = useState(false);
  const [connected, setConnected] = useState([]);
  const ref = useRef(null);

  const partners = [
    { name: 'Oracle', color: '#F80000', position: 'top-left' },
    { name: 'Micros', color: '#0052CC', position: 'top-right' },
    { name: 'Apaleo', color: '#00B8D4', position: 'bottom-left' },
    { name: 'Mews', color: '#8B5CF6', position: 'middle-left' },
    { name: 'Cloudbeds', color: '#10B981', position: 'middle-right' },
    { name: 'Protel', color: '#F59E0B', position: 'bottom-right' }
  ];

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

    partners.forEach((_, index) => {
      setTimeout(() => {
        setConnected(prev => [...prev, index]);
      }, 1000 + index * 300);
    });
  }, [visible]);

  const getPositionClass = (position) => {
    switch (position) {
      case 'top-left': return 'top-12 left-12';
      case 'top-right': return 'top-12 right-12';
      case 'middle-left': return 'top-1/2 -translate-y-1/2 left-12';
      case 'middle-right': return 'top-1/2 -translate-y-1/2 right-12';
      case 'bottom-left': return 'bottom-12 left-12';
      case 'bottom-right': return 'bottom-12 right-12';
      default: return '';
    }
  };

  return (
    <div ref={ref} className="relative w-full bg-offwhite rounded-2xl overflow-hidden shadow-2xl" style={{ aspectRatio: '16/9' }}>
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(199, 141, 78, 0.05) 2px, transparent 2px)',
          backgroundSize: '40px 40px'
        }}
      />

      {/* Title */}
      <div className={`absolute top-8 left-0 right-0 text-center transition-all duration-700 ${visible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="text-3xl md:text-4xl font-bold text-charcoal font-sora mb-2">
          Seamless Integration
        </div>
        <div className="text-base md:text-lg text-charcoal/70 font-inter">
          Works with your existing systems
        </div>
      </div>

      {/* Central Hub */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
        <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full bg-white shadow-2xl border-4 border-copper flex flex-col items-center justify-center">
          <Zap size={48} className="text-copper mb-1" fill="#FEF3C7" />
          <div className="text-xl md:text-2xl font-bold text-copper font-sora">
            RS AI
          </div>

          {/* Pulse rings */}
          {visible && [1, 2, 3].map((i) => (
            <div
              key={i}
              className="absolute rounded-full border-3 border-copper/30 animate-ping-slow"
              style={{
                inset: `-${20 * i}px`,
                animationDelay: `${i * 0.7}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Partner Nodes */}
      {partners.map((partner, index) => (
        <div
          key={index}
          className={`absolute ${getPositionClass(partner.position)} transition-all duration-700`}
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'scale(1)' : 'scale(0)',
            transitionDelay: `${index * 150}ms`
          }}
        >
          <div
            className="relative w-28 h-16 md:w-36 md:h-20 rounded-xl bg-white shadow-lg flex items-center justify-center border-2 transition-all duration-300 hover:scale-110 hover:shadow-2xl"
            style={{
              borderColor: connected.includes(index) ? partner.color : '#E5E7EB'
            }}
          >
            <div
              className="text-base md:text-lg font-bold font-sora"
              style={{ color: partner.color }}
            >
              {partner.name}
            </div>

            {/* Connected checkmark */}
            {connected.includes(index) && (
              <div className="absolute -top-2 -right-2 animate-bounce-in">
                <CheckCircle size={24} className="text-green-600" fill="#D1FAE5" />
              </div>
            )}

            {/* Animated connection line */}
            {connected.includes(index) && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1">
                <div
                  className="absolute w-2 h-2 rounded-full animate-pulse"
                  style={{ backgroundColor: partner.color }}
                />
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Bottom Stats */}
      <div className={`absolute bottom-8 left-0 right-0 flex justify-center gap-8 md:gap-16 transition-all duration-700 delay-1000 ${visible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="text-center">
          <div className="text-2xl md:text-3xl font-bold text-copper font-sora">
            &lt;5 min
          </div>
          <div className="text-xs md:text-sm text-charcoal/70 font-inter">
            Setup Time
          </div>
        </div>
        <div className="text-center">
          <div className="text-2xl md:text-3xl font-bold text-green-600 font-sora">
            100%
          </div>
          <div className="text-xs md:text-sm text-charcoal/70 font-inter">
            Compatibility
          </div>
        </div>
        <div className="text-center">
          <div className="text-2xl md:text-3xl font-bold text-blue-600 font-sora">
            Real-time
          </div>
          <div className="text-xs md:text-sm text-charcoal/70 font-inter">
            Sync
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes ping-slow {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        @keyframes bounce-in {
          0% { transform: scale(0); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        .animate-ping-slow {
          animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        .animate-bounce-in {
          animation: bounce-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};
