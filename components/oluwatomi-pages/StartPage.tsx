'use client'

import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'

interface StartPageProps {
    onStart: () => void
    accentColor: string
}

export default function StartPage({ onStart, accentColor }: StartPageProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 1.02, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -24, filter: 'blur(6px)' }}
            transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1] }}
            className="h-screen w-full flex flex-col items-center justify-center relative overflow-hidden"
        >
            <div className="absolute -top-24 -left-16 w-72 h-72 rounded-full blur-[110px] opacity-40" style={{ backgroundColor: accentColor }} />
            <div className="absolute -bottom-28 -right-20 w-80 h-80 rounded-full blur-[120px] opacity-30" style={{ backgroundColor: accentColor }} />

            <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.12, duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className="text-center space-y-8 z-10 px-8 py-10 md:px-12 md:py-12 bg-white/82 backdrop-blur-xl rounded-[2rem] border border-rose-100 shadow-[0_30px_100px_rgba(190,24,93,0.16)]"
            >
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.28, duration: 0.65 }}
                    className="text-xs tracking-[0.3em] uppercase"
                    style={{ color: accentColor }}
                >
                    A Letter For You
                </motion.p>
                <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="flex justify-center"
                >
                    <div className="bg-white p-6 rounded-full shadow-xl border border-rose-100">
                        <Heart className="w-16 h-16" style={{ color: accentColor, fill: accentColor }} />
                    </div>
                </motion.div>

                <div className="space-y-4">
                    <motion.h1
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.34, duration: 0.7 }}
                        className="text-4xl md:text-5xl font-great-vibes"
                        style={{ color: accentColor }}
                    >
                        I have a message for you
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.42, duration: 0.7 }}
                        className="text-rose-900/70 font-light italic text-lg md:text-xl"
                    >
                        Take your time and enjoy each part.
                    </motion.p>
                </div>

                <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.52, duration: 0.6 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onStart}
                    className="px-12 py-4 text-white rounded-full font-medium tracking-[0.18em] shadow-lg transition-all duration-300 uppercase text-sm"
                    style={{ backgroundColor: accentColor }}
                >
                    Open Message
                </motion.button>
            </motion.div>
        </motion.div>
    )
}
