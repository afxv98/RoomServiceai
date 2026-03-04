'use client';

import { useEffect, useState } from 'react';
import { ArrowRight, Phone } from 'lucide-react';
import Image from 'next/image';

export default function Hero() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full min-h-screen overflow-hidden">
      {/* Background Image - Brown Curtain */}
      <div className="absolute inset-0">
        <Image
          src="/hero_roomservice.jpg"
          alt="Luxury hotel room service"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        {/* Stronger overlay with gradient for consistent text contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal-darker/80 via-charcoal-darker/75 to-charcoal-darker/85" />
        <div className="absolute inset-0 bg-charcoal-darker/20" />
      </div>

      {/* Content - Left-aligned in centered container */}
      <div className="relative z-10 min-h-screen flex flex-col justify-center items-center px-6 py-32">
        <div className="max-w-4xl w-full mx-auto">
          {/* Micro Label */}
          <div
            className={`font-mono text-xs uppercase tracking-[0.12em] text-copper/90 mb-6 transition-all duration-700 delay-200 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            Enterprise AI Voice System
          </div>

          {/* Headline */}
          <h1
            className={`font-cormorant font-bold text-white leading-[1.1] tracking-tight mb-6 transition-all duration-700 delay-300 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
            style={{ fontSize: 'clamp(30px, 4.5vw, 72px)' }}
          >
            Room Service, rebuilt for<br />
            <span className="text-copper">24/7 call coverage</span>
          </h1>

          {/* Subheadline */}
          <p
            className={`text-lg md:text-xl text-white/90 max-w-3xl leading-relaxed mb-8 font-light transition-all duration-700 delay-400 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Enterprise-grade AI voice system trained for hotel operations. Every call answered, every order confirmed — without increasing headcount.
          </p>

          {/* Key Features List */}
          <div
            className={`mb-10 transition-all duration-700 delay-500 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <ul className="text-white/90 space-y-4 text-base md:text-lg">
              <li className="flex items-start gap-3">
                <span className="text-copper mt-1.5 flex-shrink-0 font-bold">✓</span>
                <span>AI voice ordering via in-room phones (chat optional)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-copper mt-1.5 flex-shrink-0 font-bold">✓</span>
                <span>Built-in upsells on every order</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-copper mt-1.5 flex-shrink-0 font-bold">✓</span>
                <span>POS & kitchen integration</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-copper mt-1.5 flex-shrink-0 font-bold">✓</span>
                <span>Reduced labour pressure during peak hours</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-copper mt-1.5 flex-shrink-0 font-bold">✓</span>
                <span>Faster service, fewer errors, higher guest satisfaction</span>
              </li>
            </ul>
          </div>

          {/* CTAs */}
          <div
            className={`flex flex-col sm:flex-row gap-4 items-start transition-all duration-700 delay-500 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <a
              href="https://calendly.com/theresa-roomserviceai/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-copper text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 hover:bg-copper-dark hover:shadow-copper hover:scale-[1.02] inline-flex items-center gap-2"
            >
              Book a Demo
              <ArrowRight size={18} />
            </a>
            <button
              onClick={() => scrollToSection('contact')}
              className="border border-white/40 bg-transparent text-white hover:bg-white/10 hover:border-white/60 px-8 py-4 rounded-lg font-medium transition-all duration-300 inline-flex items-center gap-2"
            >
              <Phone size={18} />
              Contact
            </button>
          </div>

          {/* Proof line */}
          <p
            className={`mt-12 text-white/70 text-sm transition-all duration-700 delay-600 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Trusted by Leading Hotels
          </p>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-2 bg-copper rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}
