'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import ScrollIndicator from '../ui/ScrollIndicator'

const variants = {
  enter: (direction: number) => ({
    y: direction * 100,
    opacity: 0
  }),
  center: {
    y: 0,
    opacity: 1
  },
  exit: (direction: number) => ({
    y: direction * -100,
    opacity: 0
  })
}

export default function Page1({
  name,
  onComplete,
  onNext,
  direction = 1,
  accentColor,
  isDark = false,
}: {
  name?: string;
  onComplete?: () => void;
  onNext: () => void;
  direction?: number;
  accentColor: string;
  isDark?: boolean;
}) {
  useEffect(() => {
    onComplete?.();
  }, [onComplete]);
  return (
    <motion.div
      custom={direction}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.8 }}
      className="h-screen w-full flex items-center justify-center relative overflow-hidden"
    >
      <div className="text-center space-y-8 px-6 max-w-2xl z-10">
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="h-px bg-linear-to-r from-transparent to-transparent mx-auto w-32"
          style={{ backgroundImage: `linear-gradient(to right, transparent, ${accentColor}, transparent)` }}
        ></motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="space-y-4"
        >
          <h1 className="text-6xl md:text-8xl font-great-vibes drop-shadow-sm flex items-center justify-center gap-3" style={{ color: accentColor }}>
            {name || 'Tomi'}
            <motion.span
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="inline-block text-4xl md:text-6xl"
            >
              ❤️
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1 }}
            className={`text-xl md:text-2xl font-light tracking-wide italic pt-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}
          >
            I have something special to share with you
          </motion.p>
        </motion.div>

      </div>

      <ScrollIndicator 
        onNext={onNext} 
        accentColor={accentColor} 
        delay={1.2} 
      />
    </motion.div>
  )
}
