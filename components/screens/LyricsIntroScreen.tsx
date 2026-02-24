'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import RomanticReveal from '../ui/RomanticReveal';
import ScrollIndicator from '../ui/ScrollIndicator';

interface LyricsIntroScreenProps {
  name: string;
  accentColor: string;
  onContinue: () => void;
  onBack: () => void;
}

export default function LyricsIntroScreen({
  name,
  accentColor,
  onContinue,
  onBack,
}: LyricsIntroScreenProps) {
  const [isComplete, setIsComplete] = useState(false);

  return (
    <motion.div
      key="lyrics-intro"
      initial={{ opacity: 0, y: 34, scale: 0.96, filter: 'blur(12px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: -16, filter: 'blur(8px)' }}
      transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 flex items-center justify-center px-6"
      style={{
        background:
          'radial-gradient(circle at 14% 16%, rgba(244,63,94,.14) 0%, transparent 40%), radial-gradient(circle at 84% 82%, rgba(59,130,246,.12) 0%, transparent 42%), linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
      }}
    >
      <div
        className="max-w-2xl w-full rounded-4xl border bg-white/88 backdrop-blur-xl p-8 md:p-11 text-center shadow-[0_24px_80px_rgba(15,23,42,0.10)]"
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
        <p className="text-lg md:text-2xl text-slate-700 font-light italic leading-relaxed">
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
          className="mt-4 text-sm md:text-base text-slate-500"
        >
          Hope you've increased your volume a little.
        </motion.p>
      </div>
      <ScrollIndicator 
        onNext={() => isComplete && onContinue()} 
        onPrevious={onBack} 
        accentColor={accentColor} 
        delay={2.5}
        isLocked={!isComplete}
      />
    </motion.div>
  );
}
