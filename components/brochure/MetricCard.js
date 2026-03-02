'use client';

import { motion } from 'framer-motion';

/**
 * MetricCard - Animated statistic display
 * Features scale-in animation, gradient text, and glow effect
 *
 * @param {object} props
 * @param {string} props.number - Large metric number to display
 * @param {string} props.label - Main label
 * @param {string} props.sublabel - Secondary label/description
 * @param {number} props.delay - Animation delay (default: 0)
 * @param {React.ReactNode} props.icon - Optional icon component
 * @param {string} props.description - Optional additional description
 */
export default function MetricCard({
  number,
  label,
  sublabel,
  delay = 0,
  icon: Icon,
  description
}) {
  const luxuryEasing = [0.21, 0.47, 0.32, 0.98];

  // Sequential reveal delays
  const numberDelay = delay;
  const labelDelay = delay + 0.2;
  const sublabelDelay = delay + 0.3;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{
        duration: 0.8,
        delay,
        ease: luxuryEasing,
      }}
      className="relative group h-full"
    >
      {/* Glow background effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-copper-500/10 to-copper-500/5
                      opacity-50 group-hover:opacity-100 transition-opacity duration-500
                      blur-xl" />

      {/* Card content */}
      <div className="relative p-8 rounded-2xl bg-charcoal-900 border border-charcoal-800
                      hover:border-copper-500/30 transition-all duration-500 h-full">

        {/* Icon if provided */}
        {Icon && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: delay + 0.1, duration: 0.5 }}
            className="mb-4 inline-flex items-center justify-center
                       w-12 h-12 rounded-lg bg-copper-500/10 text-copper-500"
          >
            <Icon className="w-6 h-6" />
          </motion.div>
        )}

        {/* Number with gradient effect */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            delay: numberDelay,
            duration: 0.8,
            ease: luxuryEasing,
          }}
          className="mb-2"
        >
          <span className="text-5xl md:text-6xl font-outfit font-bold
                         bg-gradient-to-r from-copper-400 via-copper-500 to-copper-600
                         bg-clip-text text-transparent">
            {number}
          </span>
        </motion.div>

        {/* Label */}
        <motion.h4
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            delay: labelDelay,
            duration: 0.8,
            ease: luxuryEasing,
          }}
          className="text-xl font-outfit font-semibold text-white mb-1"
        >
          {label}
        </motion.h4>

        {/* Sublabel */}
        {sublabel && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              delay: sublabelDelay,
              duration: 0.8,
              ease: luxuryEasing,
            }}
            className="text-gray-400 font-inter text-sm"
          >
            {sublabel}
          </motion.p>
        )}

        {/* Description if provided */}
        {description && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              delay: sublabelDelay + 0.1,
              duration: 0.8,
              ease: luxuryEasing,
            }}
            className="mt-4 text-gray-300 font-inter text-sm leading-relaxed"
          >
            {description}
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}
