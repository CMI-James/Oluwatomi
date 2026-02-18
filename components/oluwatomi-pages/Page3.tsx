'use client'

import { motion } from 'framer-motion'

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

export default function Page3({ direction = 1 }: { direction?: number }) {
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
          className="space-y-4 mb-12"
        >
          <h1 className="text-7xl md:text-9xl font-great-vibes text-rose-500 drop-shadow-md">
            I Love You
          </h1>
          <p className="text-6xl md:text-8xl font-great-vibes text-neutral-800">
            Oluwatomi
          </p>
        </motion.div>

        <div className="relative mb-12">
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="h-px bg-gradient-to-r from-transparent via-rose-300 to-transparent"
          ></motion.div>

          {/* Left GIF: -30deg rotation, on top of the beginning */}
          <motion.div
            initial={{ opacity: 0, scale: 0, rotate: -30 }}
            animate={{ opacity: 1, scale: 1, rotate: -30 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            className="absolute -top-24 -left-12 w-32 h-32 pointer-events-none"
          >
            <img src="/video/oluwatomi/giphy.gif" alt="heart sticker" className="w-full h-full object-contain" />
          </motion.div>

          {/* Right GIF: 30deg rotation, at the end */}
          <motion.div
            initial={{ opacity: 0, scale: 0, rotate: 30 }}
            animate={{ opacity: 1, scale: 1, rotate: 30 }}
            transition={{ delay: 1.7, duration: 0.8 }}
            className="absolute -top-24 -right-12 w-32 h-32 pointer-events-none"
          >
            <img src="/video/oluwatomi/giphy(1).gif" alt="heart sticker" className="w-full h-full object-contain" />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="space-y-6"
        >
          <h2 className="text-5xl md:text-7xl font-great-vibes text-rose-600">
            My Shark Slayer
          </h2>
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-2xl text-neutral-400 font-light italic pt-4 leading-loose"
          >
            My everything, forever and always.
          </motion.div>
        </motion.div>


      </div>
    </motion.div>
  )
}
