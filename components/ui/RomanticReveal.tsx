'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';

interface RomanticRevealProps {
  text: string;
  baseDelay?: number;
  wordDelay?: number;
  wordDuration?: number;
  onComplete?: () => void;
  className?: string; // Additional classes for the container
}

export default function RomanticReveal({
  text,
  baseDelay = 0,
  wordDelay = 0.12,
  wordDuration = 0.8,
  onComplete,
  className = "inline-flex flex-wrap justify-center gap-x-2"
}: RomanticRevealProps) {
  const words = text.split(' ');

  useEffect(() => {
    if (onComplete) {
      const totalTime = (baseDelay + words.length * wordDelay + wordDuration) * 1000;
      const timer = setTimeout(onComplete, totalTime);
      return () => clearTimeout(timer);
    }
  }, [baseDelay, words.length, onComplete, wordDelay, wordDuration]);

  return (
    <span className={className}>
      {words.map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          initial={{ opacity: 0, y: 10, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ 
            duration: wordDuration, 
            delay: baseDelay + index * wordDelay, 
            ease: 'easeOut' 
          }}
          className="inline-block"
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}
