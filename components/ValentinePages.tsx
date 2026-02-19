'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Page1 from './oluwatomi-pages/Page1';
import Page2 from './oluwatomi-pages/Page2';
import Page3 from './oluwatomi-pages/Page3';
import { Volume2, VolumeX, ChevronUp } from 'lucide-react';

interface ValentinePagesProps {
  accentColor: string;
}

type Page = 'question' | 'yes-response' | 'yes-response-message' | 'pre-oluwatomi-message' | 'oluwatomi-page1' | 'oluwatomi-page2' | 'oluwatomi-page3';

const PAGE_ORDER: Page[] = [
  'question',
  'yes-response',
  'yes-response-message',
  'pre-oluwatomi-message',
  'oluwatomi-page1',
  'oluwatomi-page2',
  'oluwatomi-page3'
];

const pageVariants = {
  enter: (direction: number) => ({
    y: direction * 90,
    opacity: 0,
    scale: 0.98,
    filter: 'blur(10px)'
  }),
  center: {
    y: 0,
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)'
  },
  exit: (direction: number) => ({
    y: direction * -90,
    opacity: 0,
    scale: 1.01,
    filter: 'blur(8px)'
  })
};

const ScrollHint = ({ onNext, accentColor, delay = 0.8 }: { onNext: () => void; accentColor: string; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay, duration: 0.6 }}
    className="flex justify-center pt-6"
  >
    <motion.button
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.94 }}
      onClick={onNext}
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 1.5, repeat: Infinity }}
      className="flex flex-col items-center gap-2 group cursor-pointer"
    >
      <ChevronUp className="w-5 h-5 transition-colors" style={{ color: accentColor }} />
      <span className="text-sm font-light tracking-[0.2em] uppercase transition-colors" style={{ color: accentColor }}>
        Scroll up
      </span>
    </motion.button>
  </motion.div>
);

const NO_TEXT_SEQUENCE = [
  'Are you sure?',
  'Really Sure?',
  'Are you positive?',
  'Pookie please',
  'Just think about it',
  'If you click no again i would be sad',
  'Well I tried',
  'I will be very sad',
];

const RomanticReveal = ({ text, baseDelay = 0, onComplete }: { text: string; baseDelay?: number, onComplete?: () => void }) => {
  const words = text.split(' ')

  useEffect(() => {
    if (onComplete) {
      const totalTime = (baseDelay + words.length * 0.1 + 0.8) * 1000
      const timer = setTimeout(onComplete, totalTime)
      return () => clearTimeout(timer)
    }
  }, [baseDelay, words.length, onComplete])

  return (
    <motion.div className="flex flex-wrap justify-center gap-x-2">
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, filter: 'blur(10px)', y: 10 }}
          animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
          transition={{
            duration: 0.8,
            delay: baseDelay + (i * 0.1),
            ease: "easeOut"
          }}
          className="inline-block px-1 py-1"
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  )
}

const FloatingElement = ({ accentColor }: { accentColor: string }) => {
  const elements = useMemo(() => {
    return [...Array(10)].map((_, i) => ({
      id: i,
      size: Math.random() * 14 + 8,
      duration: Math.random() * 6 + 8,
      delay: Math.random() * 5,
      opacity: Math.random() * 0.2 + 0.05,
      left: Math.random() * 100,
      type: i % 2 === 0 ? '❤️' : '✦',
      drift: Math.random() * 10 - 5
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {elements.map((el) => (
        <motion.div
          key={el.id}
          initial={{ y: '110vh', x: `${el.left}vw`, rotate: 0, opacity: 0 }}
          animate={{
            y: '-10vh',
            rotate: 360,
            opacity: [0, el.opacity, el.opacity, 0],
            x: `${el.left + el.drift}vw`
          }}
          transition={{
            duration: el.duration,
            delay: el.delay,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute"
          style={{
            color: el.id % 2 === 0 ? accentColor : `${accentColor}88`,
            fontSize: `${el.size}px`
          }}
        >
          {el.type}
        </motion.div>
      ))}
    </div>
  );
};

const ConfettiBurst = ({ accentColor }: { accentColor: string }) => {
  const particles = useMemo(() => {
    const colors = [accentColor, `${accentColor}cc`, `${accentColor}99`, '#ffd700', '#ffffff', '#e8ebf0'];
    return [...Array(60)].map((_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 1200,
      y: -(Math.random() * 800 + 200),
      rotation: Math.random() * 720 - 360,
      scale: Math.random() * 1.5 + 0.5,
      color: colors[i % colors.length],
      delay: Math.random() * 0.8,
      duration: Math.random() * 2 + 2,
      shape: i % 4,
    }));
  }, [accentColor]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ x: '50vw', y: '50vh', scale: 0, rotate: 0, opacity: 1 }}
          animate={{
            x: `calc(50vw + ${p.x}px)`,
            y: `calc(50vh + ${p.y}px)`,
            scale: p.scale,
            rotate: p.rotation,
            opacity: [1, 1, 0],
          }}
          transition={{ duration: p.duration, delay: p.delay, ease: 'easeOut' }}
          className="absolute"
          style={{
            width: p.shape === 2 ? '14px' : '10px',
            height: p.shape === 2 ? '14px' : '10px',
            backgroundColor: p.shape === 2 ? 'transparent' : p.color,
            borderRadius: p.shape === 0 ? '50%' : p.shape === 1 ? '2px' : '0',
            fontSize: p.shape === 2 ? '14px' : p.shape === 3 ? '12px' : undefined,
          }}
        >
          {p.shape === 2 ? '💗' : p.shape === 3 ? '⭐' : ''}
        </motion.div>
      ))}
    </div>
  );
};

export default function ValentinePages({ accentColor }: ValentinePagesProps) {
  const [currentPage, setCurrentPage] = useState<Page>('question');
  const [noClickCount, setNoClickCount] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [direction, setDirection] = useState(1);
  const [isYesMessageComplete, setIsYesMessageComplete] = useState(false);
  const [isPreludeMessageComplete, setIsPreludeMessageComplete] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastNavTimeRef = useRef(0);
  const touchStartYRef = useRef<number | null>(null);
  const wheelAccumRef = useRef(0);
  const wheelLastTimeRef = useRef(0);

  useEffect(() => {
    const audio = new Audio('/music/blue.mp3');
    audio.loop = true;
    audio.volume = 0.4;
    audioRef.current = audio;
    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  useEffect(() => {
    if (!audioRef.current) return;
    if (currentPage === 'question' && !isAudioPlaying) {
      audioRef.current.play()
        .then(() => setIsAudioPlaying(true))
        .catch(console.error);
    }
  }, [currentPage, isAudioPlaying]);

  const handleNavigation = useCallback((dir: 1 | -1) => {
    const now = Date.now();
    if (now - lastNavTimeRef.current < 1050) return;

    const currentIndex = PAGE_ORDER.indexOf(currentPage);
    if (currentIndex === -1) return;

    if (dir === 1) {
      if (currentPage === 'question') return;
      if (currentPage === 'yes-response-message' && !isYesMessageComplete) return;
      if (currentPage === 'pre-oluwatomi-message' && !isPreludeMessageComplete) return;
      if (currentIndex >= PAGE_ORDER.length - 1) return;

      lastNavTimeRef.current = now;
      setDirection(1);
      setCurrentPage(PAGE_ORDER[currentIndex + 1]);
    } else {
      if (currentIndex <= 0) return;
      lastNavTimeRef.current = now;
      setDirection(-1);
      setCurrentPage(PAGE_ORDER[currentIndex - 1]);
    }
  }, [currentPage, isYesMessageComplete, isPreludeMessageComplete]);

  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      const now = Date.now();
      if (now - wheelLastTimeRef.current > 180) {
        wheelAccumRef.current = 0;
      }
      wheelLastTimeRef.current = now;
      wheelAccumRef.current += event.deltaY;

      if (Math.abs(wheelAccumRef.current) < 65) return;

      if (wheelAccumRef.current > 0) handleNavigation(1);
      else handleNavigation(-1);

      wheelAccumRef.current = 0;
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowUp' || event.key === 'PageUp') {
        event.preventDefault();
        handleNavigation(-1);
      } else if (event.key === 'ArrowDown' || event.key === 'PageDown') {
        event.preventDefault();
        handleNavigation(1);
      }
    };

    const handleTouchStart = (event: TouchEvent) => {
      touchStartYRef.current = event.touches[0]?.clientY ?? null;
    };

    const handleTouchEnd = (event: TouchEvent) => {
      if (touchStartYRef.current === null) return;
      const endY = event.changedTouches[0]?.clientY ?? touchStartYRef.current;
      const delta = touchStartYRef.current - endY;
      touchStartYRef.current = null;
      if (Math.abs(delta) < 30) return;
      if (delta > 0) handleNavigation(1);
      else handleNavigation(-1);
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleNavigation]);

  const handleYes = useCallback(() => {
    setShowConfetti(true);
    setTimeout(() => setCurrentPage('yes-response'), 300);
    setTimeout(() => setShowConfetti(false), 2600);
  }, []);

  const handleNo = useCallback(() => {
    setNoClickCount(prev => prev + 1);
  }, []);

  const toggleMusic = useCallback(() => {
    if (audioRef.current) {
      if (isAudioPlaying) audioRef.current.pause();
      else audioRef.current.play().catch(console.error);
      setIsAudioPlaying(!isAudioPlaying);
    }
  }, [isAudioPlaying]);

  const currentNoText = noClickCount === 0 ? 'No' : NO_TEXT_SEQUENCE[(noClickCount - 1) % NO_TEXT_SEQUENCE.length];
  return (
    <div
      className="fixed inset-0 overflow-hidden"
      style={{
        background: `radial-gradient(circle at 12% 12%, ${accentColor}30 0%, transparent 42%), radial-gradient(circle at 88% 85%, ${accentColor}18 0%, transparent 46%), linear-gradient(180deg, #ffffff 0%, #fcfcfd 45%, #f7f8fa 100%)`,
      }}
    >
      {showConfetti && <ConfettiBurst accentColor={accentColor} />}
      <FloatingElement accentColor={accentColor} />

      <AnimatePresence mode="wait" custom={direction}>
        {currentPage === 'question' && (
          <motion.div
            key="question"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -100 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 flex items-center justify-center overflow-hidden"
          >
            <div className="relative z-10 flex flex-col items-center gap-8 text-center px-6">
              <p className="text-sm tracking-[0.24em] uppercase text-slate-900">For Oluwatomi</p>
              <h1 className="text-6xl md:text-8xl font-great-vibes" style={{ color: accentColor }}>Will you be my Valentine?</h1>
              <div className="flex flex-col items-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleYes}
                  className="min-w-52 rounded-full px-12 py-4 text-white text-lg font-semibold shadow-xl"
                  style={{ backgroundColor: accentColor }}
                >
                  Yes, absolutely
                </motion.button>
                <button
                  onClick={handleNo}
                  className="rounded-full px-8 py-3 text-sm font-medium bg-white/80 border"
                  style={{ color: accentColor, borderColor: `${accentColor}66` }}
                >
                  {currentNoText}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {currentPage === 'yes-response' && (
          <motion.div
            key="yes-response"
            custom={direction}
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 1.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 flex items-center justify-center px-6"
          >
            <div
              className="relative z-10 text-center space-y-6 bg-white/86 backdrop-blur-xl border rounded-[2.2rem] px-8 py-10 md:px-14 md:py-12 overflow-hidden"
              style={{ borderColor: `${accentColor}44`, boxShadow: `0 36px 110px ${accentColor}33` }}
            >
              <div className="absolute -top-20 -left-14 w-56 h-56 rounded-full blur-[95px] opacity-35" style={{ backgroundColor: accentColor }} />
              <div className="absolute -bottom-20 -right-14 w-56 h-56 rounded-full blur-[95px] opacity-20" style={{ backgroundColor: accentColor }} />

              <motion.img
                initial={{ opacity: 0, y: 24, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 1.05, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
                src="/video/teddy-bear.gif"
                alt="Teddy Bear"
                className="w-44 h-44 md:w-56 md:h-56 mx-auto rounded-3xl shadow-lg relative z-10"
              />
              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.24 }}
                className="text-5xl md:text-6xl font-great-vibes relative z-10"
                style={{ color: accentColor }}
              >
                Knew you would say yes
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.32 }}
                className="text-lg md:text-2xl text-slate-700 relative z-10"
              >
                I am definitely a lucky one.
              </motion.p>
              <ScrollHint accentColor={accentColor} onNext={() => handleNavigation(1)} />
            </div>
          </motion.div>
        )}

        {currentPage === 'yes-response-message' && (
          <motion.div
            key="yes-response-message"
            custom={direction}
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 1.45, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 flex items-center justify-center"
          >
            <div className="relative z-10 w-full max-w-3xl px-6 text-center">
              <motion.div
                initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                className="text-3xl md:text-5xl text-slate-800 font-light leading-relaxed italic max-w-3xl mx-auto"
              >
                <RomanticReveal
                  text="I'm so glad we met. You always know how to make me smile and I really appreciate having you around. Happy Valentine's Day, Oluwatomi! 💗"
                  baseDelay={0.5}
                  onComplete={() => setIsYesMessageComplete(true)}
                />
              </motion.div>
              <div className="h-24"></div>
              <AnimatePresence>
                {isYesMessageComplete && (
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-2 w-full">
                    <ScrollHint accentColor={accentColor} delay={0.1} onNext={() => handleNavigation(1)} />
                  </div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {currentPage === 'pre-oluwatomi-message' && (
          <motion.div
            key="pre-oluwatomi-message"
            custom={direction}
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 flex items-center justify-center"
          >
            <div className="relative z-10 w-full max-w-3xl px-6 text-center">
              <motion.div
                initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-6 text-3xl md:text-5xl text-slate-800 font-light leading-relaxed italic max-w-3xl mx-auto"
              >
                <RomanticReveal text="Though it's past valentine" baseDelay={0.25} />
                <RomanticReveal text="Though it's too soon" baseDelay={1.8} />
                <RomanticReveal
                  text="Though it might be a feeling"
                  baseDelay={3.2}
                />
                <RomanticReveal
                  text="But....."
                  baseDelay={4.8}
                  onComplete={() => setIsPreludeMessageComplete(true)}
                />
              </motion.div>
              <div className="h-24"></div>
              <AnimatePresence>
                {isPreludeMessageComplete && (
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-2 w-full">
                    <ScrollHint accentColor={accentColor} delay={0.1} onNext={() => handleNavigation(1)} />
                  </div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {currentPage === 'oluwatomi-page1' && (
          <Page1
            key="oluwatomi-page1"
            direction={direction}
            accentColor={accentColor}
            onNext={() => { setDirection(1); setCurrentPage('oluwatomi-page2'); }}
          />
        )}

        {currentPage === 'oluwatomi-page2' && (
          <Page2
            key="oluwatomi-page2"
            direction={direction}
            accentColor={accentColor}
            onNext={() => { setDirection(1); setCurrentPage('oluwatomi-page3'); }}
          />
        )}

        {currentPage === 'oluwatomi-page3' && (
          <Page3 key="oluwatomi-page3" direction={direction} accentColor={accentColor} />
        )}
      </AnimatePresence>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={toggleMusic}
        className="fixed bottom-6 left-6 z-[100] p-3 bg-white/80 backdrop-blur-md rounded-full shadow-lg border"
        style={{ color: accentColor, borderColor: `${accentColor}66` }}
      >
        {isAudioPlaying ? <Volume2 size={24} /> : <VolumeX size={24} />}
      </motion.button>
    </div>
  );
}
