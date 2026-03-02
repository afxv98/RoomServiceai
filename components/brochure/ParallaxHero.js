'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import Image from 'next/image';

/**
 * ParallaxHero - Hero section with parallax effects
 * Features parallax background, fade on scroll, sequential reveals, and scroll indicator
 *
 * @param {object} props
 * @param {string} props.badge - Small badge text
 * @param {string} props.headline - Main headline
 * @param {string} props.subheadline - Supporting text
 * @param {object} props.primaryCTA - Primary button { text, onClick }
 * @param {object} props.secondaryCTA - Secondary button { text, onClick }
 */
export default function ParallaxHero({
  badge,
  headline,
  subheadline,
  primaryCTA,
  secondaryCTA
}) {
  const ref = useRef(null);

  // Track scroll progress
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  // Parallax transforms
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const luxuryEasing = [0.21, 0.47, 0.32, 0.98];

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Parallax background with luxury room image */}
      <motion.div
        style={{ y: backgroundY }}
        className="absolute inset-0 z-0"
      >
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/brochure/hero-luxury-room.jpg"
            alt="Luxury hotel room with premium room service"
            fill
            className="object-cover"
            priority
            quality={90}
          />
        </div>

        {/* Dark gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal-950/90 via-charcoal-900/85 to-charcoal-800/90" />

        {/* Geometric pattern - subtle circles */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-96 h-96 rounded-full border border-copper-500/20 blur-sm" />
          <div className="absolute top-40 right-20 w-[500px] h-[500px] rounded-full border border-copper-500/10 blur-md" />
          <div className="absolute bottom-20 left-1/3 w-64 h-64 rounded-full border border-copper-500/15" />
        </div>

        {/* Copper accent glow */}
        <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px]
                        bg-copper-500/10 rounded-full blur-[120px]" />
      </motion.div>

      {/* Content with fade on scroll */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 container mx-auto px-8 text-center"
      >
        <div className="max-w-5xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: luxuryEasing }}
            className="mb-6 inline-block"
          >
            <span className="px-4 py-2 rounded-full bg-copper-500/10 border border-copper-500/30
                           text-copper-400 text-sm font-inter font-medium tracking-wide">
              {badge}
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease: luxuryEasing }}
            className="text-5xl md:text-6xl lg:text-7xl font-outfit font-bold text-white mb-6
                       leading-tight pb-2"
          >
            {headline}
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8, ease: luxuryEasing }}
            className="text-lg md:text-xl text-gray-300 font-inter mb-10 max-w-3xl mx-auto
                       leading-relaxed"
          >
            {subheadline}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8, ease: luxuryEasing }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            {/* Primary CTA */}
            <button
              onClick={primaryCTA.onClick}
              className="px-8 py-4 rounded-xl bg-copper-500 text-white font-outfit font-semibold
                       hover:bg-copper-600 hover:shadow-[0_0_30px_rgba(184,115,51,0.3)]
                       transition-all duration-300 hover:scale-105"
            >
              {primaryCTA.text}
            </button>

            {/* Secondary CTA */}
            <button
              onClick={secondaryCTA.onClick}
              className="px-8 py-4 rounded-xl bg-transparent border-2 border-copper-500
                       text-copper-400 font-outfit font-semibold
                       hover:bg-copper-500/10 hover:border-copper-400
                       transition-all duration-300"
            >
              {secondaryCTA.text}
            </button>
          </motion.div>
        </div>
      </motion.div>

      {/* Animated scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="flex flex-col items-center gap-2 text-copper-400"
        >
          <span className="text-sm font-inter tracking-wide opacity-70">Scroll</span>
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </motion.div>
    </section>
  );
}
