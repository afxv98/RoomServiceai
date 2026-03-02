'use client';

import { motion } from 'framer-motion';

/**
 * FeatureCard - Interactive feature card with hover effects
 * Includes lift, scale, border glow, and icon rotation on hover
 *
 * @param {object} props
 * @param {React.ReactNode} props.icon - Icon component (from lucide-react)
 * @param {string} props.title - Card title
 * @param {string} props.description - Card description
 * @param {Array<string>} props.metrics - List of metrics/features
 * @param {string} props.subtext - Optional subtext after metrics
 * @param {number} props.delay - Animation delay (default: 0)
 */
export default function FeatureCard({
  icon: Icon,
  title,
  description,
  metrics = [],
  subtext,
  delay = 0
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      whileHover={{
        y: -8,
        scale: 1.02,
        transition: { duration: 0.3 },
      }}
      className="group relative"
    >
      {/* Card with gradient border effect */}
      <div className="relative h-full p-8 rounded-2xl bg-charcoal-900 border border-charcoal-800
                      transition-all duration-500
                      hover:border-copper-500/50 hover:shadow-[0_0_30px_rgba(184,115,51,0.15)]">

        {/* Subtle gradient background shift on hover */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100
                        transition-opacity duration-500 pointer-events-none
                        bg-gradient-to-br from-copper-500/5 to-transparent" />

        {/* Icon with rotation on hover */}
        <motion.div
          whileHover={{ rotate: 5 }}
          transition={{ duration: 0.3 }}
          className="relative mb-6 inline-flex items-center justify-center
                     w-14 h-14 rounded-xl bg-copper-500/10 text-copper-500"
        >
          <Icon className="w-7 h-7" />
        </motion.div>

        {/* Content */}
        <div className="relative">
          <h3 className="text-2xl font-outfit font-semibold text-white mb-3">
            {title}
          </h3>

          <p className="text-gray-400 font-inter mb-6 leading-relaxed">
            {description}
          </p>

          {/* Metrics list */}
          {metrics.length > 0 && (
            <ul className="space-y-2.5">
              {metrics.map((metric, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-300 font-inter text-sm">
                  <span className="block w-1.5 h-1.5 rounded-full bg-copper-500 mt-1.5 flex-shrink-0" />
                  <span>{metric}</span>
                </li>
              ))}
            </ul>
          )}

          {/* Optional subtext */}
          {subtext && (
            <p className="text-gray-400 font-inter text-sm mt-4 leading-relaxed">
              {subtext}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
