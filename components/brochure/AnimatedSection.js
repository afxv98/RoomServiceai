'use client';

import { motion } from 'framer-motion';

/**
 * AnimatedSection - Reusable fade-in wrapper component
 * Animates children with smooth fade-in and slide-up effect
 *
 * @param {object} props
 * @param {React.ReactNode} props.children - Content to animate
 * @param {number} props.delay - Animation delay in seconds (default: 0)
 * @param {string} props.className - Additional CSS classes
 */
export default function AnimatedSection({
  children,
  delay = 0,
  className = ''
}) {
  // Luxury easing curve for premium feel
  const luxuryEasing = [0.21, 0.47, 0.32, 0.98];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{
        duration: 0.8,
        delay,
        ease: luxuryEasing,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
