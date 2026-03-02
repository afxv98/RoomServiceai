'use client';

import { useEffect, useState } from 'react';
import { Globe, MapPin, Lightbulb } from 'lucide-react';

export const AboutHeroAnimation = () => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 500),
      setTimeout(() => setStep(2), 1500),
      setTimeout(() => setStep(3), 2500),
      setTimeout(() => setStep(4), 3500),
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="relative w-full bg-offwhite rounded-2xl overflow-hidden shadow-2xl" style={{ aspectRatio: '16/9' }}>
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(199, 141, 78, 0.15) 0%, transparent 60%)'
        }}
      />

      {/* Title */}
      <div className={`absolute top-12 left-0 right-0 text-center transition-all duration-700 ${step >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
        <div className="text-4xl md:text-5xl font-bold text-charcoal font-sora mb-3">
          Born from Experience
        </div>
        <div className="text-lg md:text-xl text-charcoal/70 font-inter">
          6 months. 100+ hotels. One clear problem.
        </div>
      </div>

      {/* Main Content */}
      <div className="absolute inset-0 flex items-center justify-center px-8 md:px-16">
        <div className="flex items-center justify-between w-full max-w-6xl">
          {/* Globe Section */}
          <div className={`flex-1 flex flex-col items-center transition-all duration-700 ${step >= 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
            <div className="relative w-48 h-48 md:w-64 md:h-64">
              <Globe
                size={200}
                className="text-copper opacity-30 animate-spin-slow"
                strokeWidth={1.5}
                style={{ filter: 'drop-shadow(0 20px 40px rgba(199, 141, 78, 0.2))' }}
              />

              {/* Hotel Pins */}
              {[
                { x: '45%', y: '35%', delay: 0 },
                { x: '55%', y: '40%', delay: 100 },
                { x: '50%', y: '45%', delay: 200 },
                { x: '60%', y: '38%', delay: 300 },
                { x: '48%', y: '50%', delay: 400 }
              ].map((pin, i) => (
                <div
                  key={i}
                  className={`absolute transition-all duration-500`}
                  style={{
                    left: pin.x,
                    top: pin.y,
                    transform: `translate(-50%, -100%) ${step >= 2 ? 'scale(1)' : 'scale(0)'}`,
                    transitionDelay: `${pin.delay}ms`
                  }}
                >
                  <MapPin size={24} fill="#DC2626" className="text-red-600 animate-bounce-slow" />
                </div>
              ))}
            </div>

            <div className={`mt-8 text-center transition-all duration-700 ${step >= 2 ? 'opacity-100' : 'opacity-0'}`}>
              <div className="text-4xl md:text-5xl font-bold text-copper font-sora">
                95%
              </div>
              <div className="text-base md:text-lg text-charcoal/70 font-inter mt-2">
                Hotels with room service issues
              </div>
            </div>
          </div>

          {/* Arrow */}
          <div className={`w-20 flex items-center justify-center transition-all duration-700 ${step >= 3 ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
            <div className="text-5xl md:text-6xl text-copper animate-pulse-slow">
              →
            </div>
          </div>

          {/* Solution Section */}
          <div className={`flex-1 flex flex-col items-center transition-all duration-700 ${step >= 4 ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
            <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-full bg-white flex items-center justify-center shadow-2xl border-4 border-copper">
              <Lightbulb
                size={80}
                className="text-copper animate-pulse-slow"
                fill="#FEF3C7"
              />

              {/* Radiating circles */}
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="absolute rounded-full border-2 border-copper/20 animate-ping-slow"
                  style={{
                    inset: `-${20 * i}px`,
                    animationDelay: `${i * 0.5}s`
                  }}
                />
              ))}
            </div>

            <div className="mt-8 text-center">
              <div className="text-2xl md:text-3xl font-bold text-charcoal font-sora mb-3">
                The Solution
              </div>
              <div className="text-lg md:text-xl text-copper font-inter font-semibold">
                AI-Powered Room Service
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Text */}
      <div className={`absolute bottom-12 left-0 right-0 text-center transition-all duration-700 ${step >= 4 ? 'opacity-100' : 'opacity-0'}`}>
        <div className="text-xl md:text-2xl text-charcoal font-sora font-semibold max-w-3xl mx-auto px-4">
          Communication barriers. Every single time.
        </div>
      </div>

      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes ping-slow {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        .animate-ping-slow {
          animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>
    </div>
  );
};
