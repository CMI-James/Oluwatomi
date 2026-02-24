'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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

export default function Page3({ 
  direction = 1, 
  accentColor,
  isDark = false,
  onComplete,
  onNext,
  name
}: { 
  direction?: number; 
  accentColor: string;
  isDark?: boolean;
  onComplete?: () => void;
  onNext?: () => void;
  name?: string;
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
      className="h-screen w-full flex items-center justify-center relative overflow-hidden px-6"
    >
      <div className="text-center z-10 relative max-w-4xl w-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 1 }}
          className="space-y-4 mb-10"
        >
          {/* <h1 className="text-6xl md:text-8xl font-great-vibes drop-shadow-md" style={{ color: accentColor }}>
            I’m Falling For You
          </h1> */}
           <h1 className="text-6xl md:text-8xl font-great-vibes drop-shadow-md" style={{ color: accentColor }}>
            I’m **** For You
          </h1>
          <p className={`text-5xl md:text-7xl font-great-vibes ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
            {name || 'Oluwatomi'}
          </p>
        </motion.div>
        
        <div className="relative mb-12">
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="h-px bg-gradient-to-r from-transparent to-transparent"
            style={{ backgroundImage: `linear-gradient(to right, transparent, ${accentColor}, transparent)` }}
          ></motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0, rotate: -30 }}
            animate={{ opacity: 1, scale: 1, rotate: -30 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            className="absolute -top-16 md:-top-20 left-0 md:-left-8 w-20 h-20 md:w-28 md:h-28 pointer-events-none"
          >
            <img src="/video/oluwatomi/heart-sticker-left.gif" alt="heart sticker" className="w-full h-full object-contain" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0, rotate: 30 }}
            animate={{ opacity: 1, scale: 1, rotate: 30 }}
            transition={{ delay: 1.7, duration: 0.8 }}
            className="absolute -top-16 md:-top-20 right-0 md:-right-8 w-20 h-20 md:w-28 md:h-28 pointer-events-none"
          >
            <img src="/video/oluwatomi/heart-sticker-right.gif" alt="heart sticker" className="w-full h-full object-contain" />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="space-y-6"
        >
          <h2 className="text-4xl md:text-6xl font-great-vibes" style={{ color: accentColor }}>
            My Bestie
          </h2>
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className={`text-xl md:text-2xl font-light italic pt-4 leading-loose mb-12 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}
          >
            You're one of the best parts of my days.
          </motion.div>
        </motion.div>
        
        <div className="flex justify-center mt-4">
          <ScrollIndicator 
            onNext={() => onNext?.()} 
            accentColor={accentColor} 
            delay={2.2} 
          />
        </div>
      </div>
    </motion.div>
  )
}
