'use client';

import { motion } from 'framer-motion';
import { Volume2 } from 'lucide-react';

interface AudioEnableScreenProps {
  accentColor: string;
  onEnable: () => void;
}

export default function AudioEnableScreen({
  accentColor,
  onEnable,
}: AudioEnableScreenProps) {
  return (
    <motion.div
      key="audio-enable"
      initial={{ opacity: 0, y: 20, scale: 0.98, filter: 'blur(8px)' }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: -12, scale: 0.99, filter: 'blur(8px)' }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 flex items-center justify-center px-6"
      style={{
        background:
          'radial-gradient(circle at 20% 20%, rgba(244,63,94,.15) 0%, transparent 42%), radial-gradient(circle at 82% 80%, rgba(59,130,246,.12) 0%, transparent 45%), linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
      }}
    >
      <div
        className="w-full max-w-xl rounded-4xl border bg-white/90 backdrop-blur-xl p-8 md:p-10 text-center shadow-[0_24px_80px_rgba(15,23,42,0.10)]"
        style={{ borderColor: `${accentColor}33` }}
      >
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
          <Volume2 className="h-7 w-7" style={{ color: accentColor }} />
        </div>
        <h2 className="text-2xl md:text-3xl font-semibold text-slate-900">
          Tap to enable sound
        </h2>
        <p className="mt-3 text-sm md:text-base text-slate-600">
          This only enables audio permission on your phone. Music still starts at the right pages.
        </p>
        <button
          onClick={onEnable}
          className="mt-6 w-full rounded-2xl px-6 py-4 text-white text-base font-semibold tracking-[0.05em]"
          style={{
            background: `linear-gradient(135deg, ${accentColor}, ${accentColor}d9)`,
            boxShadow: `0 12px 28px ${accentColor}40`,
          }}
        >
          Enable Sound
        </button>
      </div>
    </motion.div>
  );
}
