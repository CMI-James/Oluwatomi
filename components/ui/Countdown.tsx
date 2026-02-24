'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CountdownProps {
  accentColor: string;
  isDark?: boolean;
  targetDateString?: string; // Default: '2026-04-16T21:00:00'
}

const TimeUnit = ({ label, value, accentColor, isDark = false }: { label: string; value: number; accentColor: string; isDark?: boolean }) => (
  <div className="flex flex-col items-center gap-1 mx-2 md:mx-6 min-w-[70px]">
    <div className="h-16 md:h-24 flex items-center justify-center overflow-hidden">
      <AnimatePresence mode="popLayout">
        <motion.span
          key={value}
          initial={{ y: 30, opacity: 0, filter: 'blur(5px)' }}
          animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
          exit={{ y: -30, opacity: 0, filter: 'blur(5px)' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className={`text-4xl md:text-6xl font-light tabular-nums ${isDark ? 'text-slate-100' : 'text-slate-900'}`}
        >
          {String(value).padStart(2, '0')}
        </motion.span>
      </AnimatePresence>
    </div>
    <span className={`text-[10px] md:text-xs uppercase tracking-[0.2em] font-medium ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>
      {label}
    </span>
  </div>
);

export default function Countdown({ 
  accentColor, 
  isDark = false,
  targetDateString = '2026-04-16T21:00:00' 
}: CountdownProps) {
  const targetDate = useMemo(() => new Date(targetDateString), [targetDateString]);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();
      
      if (diff <= 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / 1000 / 60) % 60),
        seconds: Math.floor((diff / 1000) % 60)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="flex items-center justify-center mt-12">
      <TimeUnit label="Days" value={timeLeft.days} accentColor={accentColor} isDark={isDark} />
      <div className={`text-2xl md:text-4xl opacity-20 pb-6 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>:</div>
      <TimeUnit label="Hours" value={timeLeft.hours} accentColor={accentColor} isDark={isDark} />
      <div className={`text-2xl md:text-4xl opacity-20 pb-6 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>:</div>
      <TimeUnit label="Minutes" value={timeLeft.minutes} accentColor={accentColor} isDark={isDark} />
      <div className={`text-2xl md:text-4xl opacity-20 pb-6 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>:</div>
      <TimeUnit label="Seconds" value={timeLeft.seconds} accentColor={accentColor} isDark={isDark} />
    </div>
  );
}
