'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Page1 from './oluwatomi-pages/Page1';
import Page2 from './oluwatomi-pages/Page2';
import Page3 from './oluwatomi-pages/Page3';
import StartPage from './oluwatomi-pages/StartPage';
import { Volume2, VolumeX, ChevronDown } from 'lucide-react';

interface ValentinePagesProps {
  accentColor: string;
}

type Page = 'question' | 'yes-response' | 'yes-response-message' | 'oluwatomi-start' | 'oluwatomi-page1' | 'oluwatomi-page2' | 'oluwatomi-page3';

const PAGE_ORDER: Page[] = [
  'question',
  'yes-response',
  'yes-response-message',
  'oluwatomi-start',
  'oluwatomi-page1',
  'oluwatomi-page2',
  'oluwatomi-page3'
];

const pageVariants = {
  enter: (direction: number) => ({
    y: direction * 100,
    opacity: 0,
    filter: 'blur(10px)'
  }),
  center: {
    y: 0,
    opacity: 1,
    filter: 'blur(0px)'
  },
  exit: (direction: number) => ({
    y: direction * -100,
    opacity: 0,
    filter: 'blur(10px)'
  })
};

const ScrollHint = ({ onNext, delay = 1 }: { onNext: () => void; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay, duration: 0.8 }}
    className="flex justify-center pt-8"
  >
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onNext}
      animate={{ y: [0, 8, 0] }}
      transition={{ duration: 1.5, repeat: Infinity }}
      className="flex flex-col items-center gap-2 group cursor-pointer"
    >
      <div className="text-rose-400 text-sm font-light group-hover:text-rose-500 transition-colors">scroll</div>
      <motion.div
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="w-px h-8 bg-gradient-to-b from-rose-300 to-transparent group-hover:from-rose-500 transition-colors"
      ></motion.div>
      <ChevronDown className="w-6 h-6 text-rose-300 group-hover:text-rose-500 -mt-2 opacity-0 group-hover:opacity-100 transition-all" />
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
    return [...Array(15)].map((_, i) => ({
      id: i,
      size: Math.random() * 20 + 10,
      duration: Math.random() * 5 + 5,
      delay: Math.random() * 5,
      opacity: Math.random() * 0.3 + 0.1,
      left: Math.random() * 100,
      type: i % 3 === 0 ? '❤️' : i % 3 === 1 ? '✨' : '🌸',
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
            color: el.id % 2 === 0 ? accentColor : '#ffb6c1',
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
    const colors = [accentColor, '#ff6b9d', '#ffc0cb', '#ff1493', '#ff69b4', '#ffb6c1', '#ffd700', '#fff'];
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
  const [yesButtonScale, setYesButtonScale] = useState(0);
  const [noButtonPosition, setNoButtonPosition] = useState<{ x: number; y: number } | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [direction, setDirection] = useState(1);
  const [isPage2Complete, setIsPage2Complete] = useState(false);
  const [isYesMessageComplete, setIsYesMessageComplete] = useState(false);
  const lastScrollTimeRef = useRef(0);
  const touchStartRef = useRef(0);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio('/music/blue.mp3');
    audio.loop = true;
    audio.volume = 0.1;
    audioRef.current = audio;
    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  const handleNavigation = useCallback((dir: 1 | -1) => {
    const now = Date.now();
    if (now - lastScrollTimeRef.current < 1000) return;

    const currentIndex = PAGE_ORDER.indexOf(currentPage);
    if (currentIndex === -1 || currentPage === 'question') return;

    if (dir === 1) {
      if (currentPage === 'yes-response-message' && !isYesMessageComplete) return;
      if (currentPage === 'oluwatomi-page2' && !isPage2Complete) return;
      if (currentIndex >= PAGE_ORDER.length - 1) return;

      lastScrollTimeRef.current = now;
      setDirection(1);
      setCurrentPage(PAGE_ORDER[currentIndex + 1]);
    } else {
      if (currentIndex <= 1) return;
      lastScrollTimeRef.current = now;
      setDirection(-1);
      setCurrentPage(PAGE_ORDER[currentIndex - 1]);
    }
  }, [currentPage, isYesMessageComplete, isPage2Complete]);

  useEffect(() => {
    if (currentPage === 'question') return;
    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < 10) return;
      handleNavigation(e.deltaY > 0 ? 1 : -1);
    };
    const handleTouchStart = (e: TouchEvent) => { touchStartRef.current = e.touches[0].clientY; };
    const handleTouchEnd = (e: TouchEvent) => {
      const deltaY = touchStartRef.current - e.changedTouches[0].clientY;
      if (Math.abs(deltaY) < 30) return;
      handleNavigation(deltaY > 0 ? 1 : -1);
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') handleNavigation(1);
      else if (e.key === 'ArrowUp' || e.key === 'PageUp') handleNavigation(-1);
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleNavigation, currentPage]);

  const handleYes = useCallback(() => {
    setShowConfetti(true);
    setTimeout(() => setCurrentPage('yes-response'), 300);
  }, []);

  const handleNo = useCallback(() => {
    setNoClickCount(prev => prev + 1);
    setNoButtonPosition({
      x: (Math.random() * (window.innerWidth - 120)) + 20,
      y: (Math.random() * (window.innerHeight - 60)) + 20
    });
    setYesButtonScale(prev => prev + 0.1);
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
    <>
      {showConfetti && <ConfettiBurst accentColor={accentColor} />}

      <AnimatePresence mode="wait" custom={direction}>
        {currentPage === 'question' && (
          <motion.div
            key="question"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -100 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 flex items-center justify-center overflow-hidden bg-white"
          >
            <FloatingElement accentColor={accentColor} />
            <div className="relative z-10 flex flex-col items-center gap-12 text-center">
              <h1 className="text-6xl md:text-8xl font-great-vibes" style={{ color: accentColor }}>Will you be my Valentine?</h1>
              <div className="flex flex-col items-center gap-8">
                <motion.button
                  whileHover={{ scale: 1.1 + yesButtonScale }}
                  whileTap={{ scale: 0.9 + yesButtonScale }}
                  onClick={handleYes}
                  className="relative flex items-center justify-center text-white font-bold"
                  style={{ width: 140 + yesButtonScale * 50, height: 140 + yesButtonScale * 50 }}
                >
                  <svg viewBox="0 0 24 24" className="w-full h-full" fill={accentColor}><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
                  <span className="absolute">Yes</span>
                </motion.button>
                {noClickCount < NO_TEXT_SEQUENCE.length && (
                  <motion.button
                    onClick={handleNo}
                    className="bg-gray-400 text-white rounded-full px-8 py-3"
                    style={{
                      position: noButtonPosition ? 'fixed' : 'relative',
                      left: noButtonPosition?.x,
                      top: noButtonPosition?.y,
                    }}
                  >
                    {currentNoText}
                  </motion.button>
                )}
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
            className="fixed inset-0 flex items-center justify-center bg-rose-50"
          >
            <FloatingElement accentColor={accentColor} />
            <div className="relative z-10 text-center space-y-8">
              <img src="/video/teddybear.gif" alt="Teddy Bear" className="w-64 h-64 mx-auto" />
              <h1 className="text-6xl font-great-vibes text-rose-500">Knew you would say yes</h1>
              <p className="text-2xl text-gray-600">I am definitely a lucky one 💕</p>
              <ScrollHint onNext={() => handleNavigation(1)} />
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
            className="fixed inset-0 flex items-center justify-center bg-white"
          >
            <FloatingElement accentColor={accentColor} />
            <div className="relative z-10 max-w-2xl px-6 text-center space-y-8">
              <div className="bg-white/80 backdrop-blur rounded-3xl p-8 shadow-xl border border-rose-100">
                <p className="text-2xl md:text-3xl italic text-gray-700 leading-relaxed">
                  <RomanticReveal
                    text="I'm so glad we met. You always know how to make me smile and I really appreciate having you around. Happy Valentine's Day, Oluwatomi! 💗"
                    baseDelay={0.5}
                    onComplete={() => setIsYesMessageComplete(true)}
                  />
                </p>
              </div>
              <AnimatePresence>
                {isYesMessageComplete && <ScrollHint delay={0} onNext={() => handleNavigation(1)} />}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {currentPage === 'oluwatomi-start' && (
          <StartPage key="oluwatomi-start" onStart={() => { setDirection(1); setCurrentPage('oluwatomi-page1'); }} />
        )}

        {currentPage === 'oluwatomi-page1' && (
          <Page1 key="oluwatomi-page1" direction={direction} onNext={() => { setDirection(1); setCurrentPage('oluwatomi-page2'); }} />
        )}

        {currentPage === 'oluwatomi-page2' && (
          <Page2
            key="oluwatomi-page2"
            direction={direction}
            onNext={() => { setDirection(1); setCurrentPage('oluwatomi-page3'); }}
            onComplete={() => setIsPage2Complete(true)}
          />
        )}

        {currentPage === 'oluwatomi-page3' && (
          <Page3 key="oluwatomi-page3" direction={direction} />
        )}
      </AnimatePresence>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={toggleMusic}
        className="fixed bottom-8 left-8 z-[100] p-4 bg-white/80 backdrop-blur-md rounded-full shadow-lg border border-rose-100 text-rose-500"
      >
        {isAudioPlaying ? <Volume2 size={24} /> : <VolumeX size={24} />}
      </motion.button>
    </>
  );
}
