'use client';

import { motion } from 'framer-motion';

interface LyricsStopScreenProps {
  name: string;
}

export default function LyricsStopScreen({ name }: LyricsStopScreenProps) {
  return (
    <motion.div
      key="lyrics-stop"
      initial={{ opacity: 0, y: 24, filter: 'blur(10px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: -16, filter: 'blur(8px)' }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 flex items-center justify-center px-6"
      style={{ background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)' }}
    >
      <div className="max-w-xl w-full rounded-4xl border border-slate-200 bg-white/88 backdrop-blur-xl p-10 text-center shadow-[0_24px_80px_rgba(15,23,42,0.10)]">
        <p className="text-xs uppercase tracking-[0.22em] text-slate-500 mb-3">Thank you</p>
        <h2 className="text-4xl text-slate-900 mb-2 font-great-vibes">
          {name || 'Beautiful soul'}
        </h2>
        <p className="text-slate-600">That is the end of this version.</p>
      </div>
    </motion.div>
  );
}
