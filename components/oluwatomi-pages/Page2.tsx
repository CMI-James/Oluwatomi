'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

const RomanticReveal = ({ text, baseDelay = 0 }: { text: string; baseDelay?: number }) => {
  const words = text.split(' ')

  return (
    <motion.div className="flex flex-wrap justify-center gap-x-2">
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, filter: 'blur(10px)', y: 10 }}
          animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
          transition={{
            duration: 0.8,
            delay: baseDelay + (i * 0.1),
            ease: "easeOut"
          }}
          className="inline-block px-1 py-1"
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  )
}


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

export default function Page2({ onNext, onComplete, direction = 1 }: { onNext: () => void; onComplete: () => void; direction?: number }) {



  const [displayedMessages, setDisplayedMessages] = useState(0)

  const messages = [
    "Every moment with you feels like a beautiful dream come true.",
    "Your smile is the light that guides me through my darkest days.",
    "You are my heart, my soul, and my greatest adventure.",
    "I am so incredibly lucky to call you mine."
  ]

  useEffect(() => {
    if (displayedMessages < messages.length - 1) {
      const timer = setTimeout(() => {
        setDisplayedMessages(prev => prev + 1)
      }, 4500) // Give Oluwatomi time to read each one
      return () => clearTimeout(timer)
    } else {
      onComplete()
    }
  }, [displayedMessages, messages.length, onComplete])


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

      <div className="text-center space-y-16 px-6 max-w-4xl z-10 flex flex-col items-center justify-center min-h-[400px] pb-32">
        <div className="w-full">
          {/* Header accent */}
          <motion.div
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="space-y-8 mb-16"
          >
            <div className="h-px bg-gradient-to-r from-transparent via-rose-200 to-transparent"></div>

            <p className="text-lg font-light text-neutral-400 tracking-widest uppercase">
              From My Heart
            </p>
          </motion.div>

          {/* Romantic Reveal messages - Fixed height container */}
          <div className="min-h-[12rem] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={displayedMessages}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
                transition={{ duration: 0.8 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl text-neutral-800 font-light leading-relaxed max-w-3xl italic pt-4">
                  <RomanticReveal
                    text={messages[displayedMessages]}
                    baseDelay={displayedMessages === 0 ? 1.2 : 0}
                  />
                </div>

              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom accent - Absolute positioning to prevent pushing content */}
        <AnimatePresence>
          {displayedMessages === messages.length - 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1 }}
              className="absolute bottom-12 left-0 right-0 space-y-6 pt-8 px-6"
            >
              <div className="h-px bg-gradient-to-r from-transparent via-rose-200 to-transparent max-w-4xl mx-auto"></div>

              <p className="text-4xl font-great-vibes text-rose-500">
                I love you more than words can say...
              </p>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onNext}
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="flex flex-col items-center gap-2 group cursor-pointer mx-auto"
              >
                <div className="text-rose-400 text-sm font-light group-hover:text-rose-500 transition-colors">scroll</div>
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-px h-8 bg-gradient-to-b from-rose-300 to-transparent group-hover:from-rose-500 transition-colors"
                ></motion.div>
                <ChevronDown className="w-6 h-6 text-rose-300 group-hover:text-rose-500 -mt-2 opacity-0 group-hover:opacity-100 transition-all" />
              </motion.button>

            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </motion.div>
  )
}
