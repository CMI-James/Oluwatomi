'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import RomanticReveal from '../ui/RomanticReveal';

interface PostLyricsBridgeScreenProps {
  name: string;
  accentColor: string;
  onContinue: () => void;
}

export default function PostLyricsBridgeScreen({
  name,
  accentColor,
  onContinue,
}: PostLyricsBridgeScreenProps) {
  const [showQuestionLine, setShowQuestionLine] = useState(false);
  const [showPointLine, setShowPointLine] = useState(false);
  const [canContinue, setCanContinue] = useState(false);

  useEffect(() => {
    setShowQuestionLine(false);
    setShowPointLine(false);
    setCanContinue(false);

    const questionTimer = setTimeout(() => setShowQuestionLine(true), 950);
    const pointTimer = setTimeout(() => setShowPointLine(true), 3200);

    return () => {
      clearTimeout(questionTimer);
      clearTimeout(pointTimer);
    };
  }, [name]);

  return (
    <motion.div
      key="post-lyrics-bridge"
      initial={{ opacity: 0, y: 44, scale: 0.94, filter: 'blur(14px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: -16, filter: 'blur(8px)' }}
      transition={{ duration: 1.35, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 flex items-center justify-center px-6"
      style={{
        background:
          'radial-gradient(circle at 16% 18%, rgba(244,63,94,.16) 0%, transparent 42%), radial-gradient(circle at 84% 84%, rgba(59,130,246,.12) 0%, transparent 44%), linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
      }}
    >
      <div
        className="max-w-2xl w-full h-[30rem] md:h-[33rem] rounded-4xl border bg-white/88 backdrop-blur-xl p-8 md:p-11 text-center shadow-[0_24px_80px_rgba(15,23,42,0.10)] flex flex-col justify-center"
        style={{ borderColor: `${accentColor}33` }}
      >
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22, duration: 0.8 }}
          className="text-5xl md:text-6xl leading-tight mb-3 font-great-vibes"
          style={{ color: accentColor }}
        >
          <RomanticReveal text={`Okay Tomi`} baseDelay={0.06} />
        </motion.p>

        <div className="min-h-42 md:min-h-46 flex flex-col items-center justify-start">
          <AnimatePresence>
            {showQuestionLine && (
              <motion.p
                initial={{ opacity: 0, y: 14, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -8, filter: 'blur(8px)' }}
                transition={{ duration: 0.75 }}
                className="text-3xl md:text-4xl leading-snug text-slate-900 font-semibold font-fraunces"
              >
                <RomanticReveal text="You weren't satisfied?" baseDelay={0.08} />
              </motion.p>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showPointLine && (
              <motion.p
                initial={{ opacity: 0, y: 14, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -8, filter: 'blur(8px)' }}
                transition={{ duration: 0.75 }}
                className="text-2xl md:text-3xl leading-snug text-slate-700 mt-4 font-bold tracking-tight font-outfit"
              >
                <RomanticReveal
                  text="Let's go straight to the point then."
                  baseDelay={0.08}
                  onComplete={() => setCanContinue(true)}
                />
              </motion.p>
            )}
          </AnimatePresence>
        </div>
        <AnimatePresence>
          {canContinue && (
            <motion.button
              initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -6, filter: 'blur(4px)' }}
              transition={{ delay: 0.35, duration: 0.55 }}
              onClick={onContinue}
              className="mt-4 w-full rounded-2xl px-6 py-3.5 text-white text-sm md:text-base font-semibold tracking-[0.05em] cursor-pointer"
              style={{
                background: `linear-gradient(135deg, ${accentColor}, ${accentColor}d9)`,
                boxShadow: `0 12px 26px ${accentColor}40`,
              }}
            >
              Continue
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
