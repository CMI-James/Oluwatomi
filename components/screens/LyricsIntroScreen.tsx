'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import RomanticReveal from '../ui/RomanticReveal';

interface LyricsIntroScreenProps {
  name: string;
  accentColor: string;
  isDark?: boolean;
  onContinue: () => void;
}

export default function LyricsIntroScreen({
  name,
  accentColor,
  isDark = false,
  onContinue,
}: LyricsIntroScreenProps) {
  const [isComplete, setIsComplete] = useState(false);

  return (
    <motion.div
      key="lyrics-intro"
      initial={{ opacity: 0, y: 34, scale: 0.96, filter: 'blur(12px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: -16, filter: 'blur(8px)' }}
      transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 overflow-hidden"
      style={{
        backgroundColor: isDark ? '#0b0f16' : '#f8fafc',
        background: isDark
          ? 'radial-gradient(circle at 14% 16%, rgba(244,63,94,.18) 0%, transparent 40%), radial-gradient(circle at 84% 82%, rgba(59,130,246,.12) 0%, transparent 42%), linear-gradient(180deg, #06080d 0%, #0b0f16 100%)'
          : 'radial-gradient(circle at 14% 16%, rgba(244,63,94,.14) 0%, transparent 40%), radial-gradient(circle at 84% 82%, rgba(59,130,246,.12) 0%, transparent 42%), linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
      }}
    >
      <div className="h-full w-full flex items-center justify-center px-6">
      <div
        className={`max-w-2xl w-full h-[30rem] md:h-[33rem] rounded-4xl border backdrop-blur-xl p-8 md:p-11 text-center shadow-[0_24px_80px_rgba(15,23,42,0.10)] flex flex-col justify-center ${
          isDark ? 'bg-black/45' : 'bg-white/88'
        }`}
        style={{ borderColor: `${accentColor}33` }}
      >
        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22, duration: 0.7 }}
          className="text-4xl md:text-5xl mb-4 leading-tight font-great-vibes"
          style={{ color: accentColor }}
        >
          Hey {name},
        </motion.h2>
        <p className={`min-h-[7.5rem] text-lg md:text-2xl font-light italic leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
          <RomanticReveal
            text="let's begin with a song that softly tells my story."
            baseDelay={1.8}
            onComplete={() => setIsComplete(true)}
          />
        </p>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.9, duration: 0.7 }}
          className={`mt-4 h-6 text-sm md:text-base ${isDark ? 'text-slate-400' : 'text-slate-500'}`}
        >
          Hope you've increased your volume a little.
        </motion.p>
        <div className="mt-6 h-[3.25rem] w-full">
          <motion.button
            initial={false}
            animate={{
              opacity: isComplete ? 1 : 0,
              y: isComplete ? 0 : 10,
              filter: isComplete ? 'blur(0px)' : 'blur(4px)',
            }}
            transition={{ duration: 0.45 }}
            onClick={onContinue}
            disabled={!isComplete}
            className={`w-full rounded-2xl px-6 py-3.5 text-white text-sm md:text-base font-semibold tracking-[0.05em] ${
              isComplete ? 'cursor-pointer' : 'pointer-events-none'
            }`}
            style={{
              background: `linear-gradient(135deg, ${accentColor}, ${accentColor}d9)`,
              boxShadow: `0 12px 26px ${accentColor}40`,
            }}
          >
            Continue
          </motion.button>
        </div>
      </div>
      </div>
    </motion.div>
  );
}
