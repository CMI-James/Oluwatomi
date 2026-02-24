'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronUp } from 'lucide-react';

interface ScrollIndicatorProps {
  onNext: () => void;
  onPrevious?: () => void;
  accentColor: string;
  delay?: number;
  label?: string;
  isLocked?: boolean;
}

export default function ScrollIndicator({
  onNext,
  onPrevious,
  accentColor,
  delay = 0.8,
  label = "Scroll up",
  isLocked = false
}: ScrollIndicatorProps) {
  const lastTriggerAtRef = useRef(0);
  const touchStartYRef = useRef<number | null>(null);

  useEffect(() => {
    if (isLocked) return;

    const triggerNext = () => {
      const now = Date.now();
      if (now - lastTriggerAtRef.current < 900) return;
      lastTriggerAtRef.current = now;
      onNext();
    };

    const triggerPrevious = () => {
      if (!onPrevious) return;
      const now = Date.now();
      if (now - lastTriggerAtRef.current < 900) return;
      lastTriggerAtRef.current = now;
      onPrevious();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === 'ArrowUp' ||
        event.key === 'PageUp' ||
        event.key === 'Enter' ||
        event.key === ' '
      ) {
        event.preventDefault();
        triggerPrevious();
      } else if (event.key === 'ArrowDown' || event.key === 'PageDown') {
        event.preventDefault();
        triggerNext();
      }
    };

    const handleWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) < 22) return;
      if (event.deltaY < 0) triggerPrevious();
      else triggerNext();
    };

    const handleTouchStart = (event: TouchEvent) => {
      touchStartYRef.current = event.touches[0]?.clientY ?? null;
    };

    const handleTouchEnd = (event: TouchEvent) => {
      if (touchStartYRef.current === null) return;
      const endY = event.changedTouches[0]?.clientY ?? touchStartYRef.current;
      const delta = touchStartYRef.current - endY;
      touchStartYRef.current = null;
      if (Math.abs(delta) < 28) return;
      if (delta > 0) triggerPrevious();
      else triggerNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onNext, onPrevious, isLocked]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 0.7 }}
      className="fixed bottom-0 left-0 right-0 z-40 flex justify-center pb-12 pointer-events-none"
    >
      <motion.button
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => !isLocked && onNext()}
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className={`flex flex-col items-center gap-2 group pointer-events-auto ${isLocked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <ChevronUp className="w-5 h-5 transition-colors" style={{ color: accentColor }} />
        <span className="text-sm font-light tracking-[0.2em] uppercase transition-colors" style={{ color: accentColor }}>
          {label}
        </span>
      </motion.button>
    </motion.div>
  );
}
