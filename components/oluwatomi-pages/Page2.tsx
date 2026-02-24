'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ScrollIndicator from '../ui/ScrollIndicator'
import RomanticReveal from '../ui/RomanticReveal'


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

export default function Page2({ onComplete, onNext, direction = 1, accentColor }: { onComplete?: () => void; onNext: () => void; direction?: number; accentColor: string }) {
  const [displayedMessages, setDisplayedMessages] = useState(0)
  const [showFinalPrompt, setShowFinalPrompt] = useState(false)

  useEffect(() => {
    if (showFinalPrompt) {
      onComplete?.()
    }
  }, [showFinalPrompt, onComplete])

  const messages = [
    'Every moment with you feels warm and easy.',
    'Your smile makes my day better every time.',
    'I really enjoy being around you.',
    'I am so incredibly lucky to have you in my life.'
  ]

  useEffect(() => {
    if (showFinalPrompt) return

    const timer = setTimeout(() => {
      if (displayedMessages < messages.length - 1) {
        setDisplayedMessages((prev) => prev + 1)
      } else {
        setShowFinalPrompt(true)
      }
    }, 4500)

    return () => clearTimeout(timer)
  }, [displayedMessages, messages.length, showFinalPrompt])

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
      <div className="text-center space-y-12 px-6 max-w-4xl z-10 flex flex-col items-center justify-center min-h-[420px] pb-24">
        <div className="w-full">
          <motion.div
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="space-y-8 mb-16"
          >
            <div
              className="h-px bg-gradient-to-r from-transparent to-transparent"
              style={{ backgroundImage: `linear-gradient(to right, transparent, ${accentColor}, transparent)` }}
            ></div>

            <p className="text-lg font-light text-neutral-400 tracking-widest uppercase">
              From My Heart
            </p>
          </motion.div>

          <div className="min-h-[14rem] flex items-center justify-center">
            <AnimatePresence mode="wait">
              {!showFinalPrompt && (
                <motion.div
                  key={`message-${displayedMessages}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.04, filter: 'blur(10px)' }}
                  transition={{ duration: 0.9 }}
                  className="text-center"
                >
                  <div className="text-3xl md:text-5xl text-slate-800 font-light leading-relaxed max-w-3xl italic pt-4">
                    <RomanticReveal
                      text={messages[displayedMessages]}
                      baseDelay={0.2}
                    />
                  </div>
                </motion.div>
              )}

              {showFinalPrompt && (
                <motion.div
                  key="final-prompt"
                  initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="space-y-6 text-center"
                >
                  <p className="text-4xl font-great-vibes" style={{ color: accentColor }}>
                    I really **** you, more than words can say...
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showFinalPrompt && (
          <ScrollIndicator 
            onNext={onNext} 
            accentColor={accentColor} 
            delay={0.6} 
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}
