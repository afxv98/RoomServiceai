'use client';

import { motion } from 'framer-motion';

/**
 * TextReveal - Word-by-word animation component
 * Splits text into words and animates each word individually
 *
 * @param {object} props
 * @param {string} props.text - Text to animate
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.as - HTML tag to use (default: 'h2')
 */
export default function TextReveal({
  text,
  className = '',
  as: Tag = 'h2'
}) {
  // Split text into words
  const words = text.split(' ');

  // Luxury easing curve
  const luxuryEasing = [0.21, 0.47, 0.32, 0.98];

  // Container animation
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  // Individual word animation
  const wordVariant = {
    hidden: { y: 100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: luxuryEasing,
      },
    },
  };

  return (
    <Tag className={className}>
      <motion.span
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        className="inline-block"
      >
        {words.map((word, i) => (
          <span key={i} className="inline-block overflow-hidden">
            <motion.span
              variants={wordVariant}
              className="inline-block"
              style={{ display: 'inline-block' }}
            >
              {word}
              {i < words.length - 1 && '\u00A0'}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}
