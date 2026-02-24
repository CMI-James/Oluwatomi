'use client';

import { motion } from 'framer-motion';

interface LyricsStopScreenProps {
  name: string;
  isDark?: boolean;
}

export default function LyricsStopScreen({ name, isDark = false }: LyricsStopScreenProps) {
  return (
    <motion.div
      key="lyrics-stop"
      initial={{ opacity: 0, y: 24, filter: 'blur(10px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: -16, filter: 'blur(8px)' }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 flex items-center justify-center px-6"
      style={{
        background: isDark
          ? 'radial-gradient(circle at 14% 16%, rgba(244,63,94,.18) 0%, transparent 40%), radial-gradient(circle at 84% 82%, rgba(59,130,246,.12) 0%, transparent 42%), linear-gradient(180deg, #06080d 0%, #0b0f16 100%)'
          : 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
      }}
    >
      <div className={`max-w-xl w-full rounded-4xl border backdrop-blur-xl p-10 text-center shadow-[0_24px_80px_rgba(15,23,42,0.10)] ${isDark ? 'border-white/10 bg-black/45' : 'border-slate-200 bg-white/88'}`}>
        <p className={`text-xs uppercase tracking-[0.22em] mb-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Thank you</p>
        <h2 className={`text-4xl mb-2 font-great-vibes ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
          {name || 'Beautiful soul'}
        </h2>
        <p className={isDark ? 'text-slate-300' : 'text-slate-600'}>That is the end of this version.</p>
      </div>
    </motion.div>
  );
}
