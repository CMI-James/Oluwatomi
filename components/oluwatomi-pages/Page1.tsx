'use client'

import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

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

export default function Page1({ onNext, direction = 1 }: { onNext: () => void; direction?: number }) {
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
        {/* Elegant accent line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="h-px bg-gradient-to-r from-transparent via-rose-300 to-transparent mx-auto w-24"
        ></motion.div>

        {/* Main message */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="space-y-4"
        >
          <h1 className="text-7xl md:text-9xl font-great-vibes text-rose-500 drop-shadow-sm flex items-center justify-center gap-4">
            Oluwatomi
            <motion.span
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="inline-block text-5xl md:text-7xl"
            >
              ❤️
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="text-2xl md:text-3xl text-neutral-500 font-light tracking-wide italic pt-2"
          >
            I have something special to share with you
          </motion.p>
        </motion.div>


        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="flex justify-center pt-8"
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onNext}
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="flex flex-col items-center gap-2 group cursor-pointer"
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

      </div>
    </motion.div>
  )
}
