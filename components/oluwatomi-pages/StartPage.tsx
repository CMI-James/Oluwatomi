'use client'

import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'

interface StartPageProps {
    onStart: () => void
}

export default function StartPage({ onStart }: StartPageProps) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 1 }}
            className="h-screen w-full flex flex-col items-center justify-center relative overflow-hidden bg-rose-50"
        >
            <div className="text-center space-y-12 z-10 px-6">
                <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="flex justify-center"
                >
                    <div className="bg-white p-6 rounded-full shadow-xl shadow-rose-200/50 border border-rose-100">
                        <Heart className="w-16 h-16 text-rose-500 fill-rose-500" />
                    </div>
                </motion.div>

                <div className="space-y-4">
                    <h1 className="text-4xl md:text-5xl font-great-vibes text-rose-600">
                        I have a message for you...
                    </h1>
                    <p className="text-neutral-500 font-light italic text-lg md:text-xl">
                        (Please turn on your sound)
                    </p>
                </div>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onStart}
                    className="px-12 py-4 bg-rose-500 hover:bg-rose-600 text-white rounded-full font-light tracking-[0.2em] shadow-lg shadow-rose-300 transition-all duration-300 uppercase text-sm"
                >
                    Open Message
                </motion.button>
            </div>

            {/* Decorative background pulses */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white rounded-full blur-3xl opacity-40 -z-0 animate-pulse"></div>
        </motion.div>
    )
}
