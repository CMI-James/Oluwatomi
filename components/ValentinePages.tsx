'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import Page1 from './oluwatomi-pages/Page1';
import Page2 from './oluwatomi-pages/Page2';
import Page3 from './oluwatomi-pages/Page3';
import ScrollIndicator from './ui/ScrollIndicator';
import RomanticReveal from './ui/RomanticReveal';
import Countdown from './ui/Countdown';

interface ValentinePagesProps {
  accentColor: string;
  name?: string;
  initialAudio?: HTMLAudioElement | null;
  isDark?: boolean;
  autoStartAudio?: boolean;
  onReturnToSetup?: () => void;
  onPageChange?: (page: Page) => void;
}

type Page = 'question' | 'yes-response' | 'yes-response-message' | 'post-yes-message' | 'oluwatomi-page1' | 'pre-oluwatomi-message' | 'oluwatomi-page2' | 'oluwatomi-page3' | 'smile-prompt' | 'part2-teaser';

const PAGE_ORDER: Page[] = [
  'question',
  'yes-response',
  'yes-response-message',
  'post-yes-message',
  'oluwatomi-page1',
  'pre-oluwatomi-message',
  'oluwatomi-page2',
  'oluwatomi-page3',
  'smile-prompt',
  'part2-teaser'
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



const NO_TEXT_SEQUENCE = [
  'Are you sure?',
  'Really sure?',
  'Are you positive?',
  'Pookie please',
  'Just think about it',
  'If you click no again, I will be sad',
  'Well I tried',
  'I will be very sad',
  'Pretty please?',
  'One more thought?',
  "Don't break my heart",
  'Still no? 🥺',
  'Give me a chance',
  'I brought flowers',
  'I can wait...',
  'That hurt a little',
  'Maybe yes this time?',
  "You're too cute to say no",
  'Final answer?',
  'Okay... last try',
  'Please? just once',
  "I'm trying my best here",
  'Come on now',
  'You are making this hard',
  'My heart is on the line',
  'Just one tiny yes',
  'Be kind to me',
  'I rehearsed for this',
  'I even wore my best smile',
  'No way this is real',
  'Why you doing this to me?',
  'You know I will ask again',
  'This could be our moment',
  'I can be patient',
  'Let me spoil you a little',
  'I promise good vibes only',
  'Can I get a yes maybe?',
  'This no is loud',
  'I heard that... still asking',
  'You are too adorable to reject me',
  'Plot twist: you say yes',
  'We look good together though',
  'I am not giving up yet',
  'Just imagine the cute dates',
  'My heart says try again',
  'I have snacks too',
  'I can write you poems',
  'I will send voice notes',
  'You are worth the wait',
  'Can we call that a soft yes?'
];



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



export default function ValentinePages({
  accentColor,
  name = 'love',
  initialAudio = null,
  isDark = false,
  autoStartAudio = true,
  onReturnToSetup,
  onPageChange,
}: ValentinePagesProps) {
  const TARGET_MUSIC_VOLUME = 0.4;
  const START_MUSIC_VOLUME = 0.2;
  const FADE_IN_DURATION_MS = 2200;
  const FADE_STEP_MS = 60;

  const [currentPage, setCurrentPage] = useState<Page>('question');
  const [noClickCount, setNoClickCount] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [direction, setDirection] = useState(1);
  const [isYesResponseComplete, setIsYesResponseComplete] = useState(false);
  const [isYesMessageComplete, setIsYesMessageComplete] = useState(false);
  const [isPostYesMessageComplete, setIsPostYesMessageComplete] = useState(false);
  const [isPreludeMessageComplete, setIsPreludeMessageComplete] = useState(false);
  const [isPage1Complete, setIsPage1Complete] = useState(false);
  const [isPage2Complete, setIsPage2Complete] = useState(false);
  const [isPage3Complete, setIsPage3Complete] = useState(false);
  const [isSmilePromptComplete, setIsSmilePromptComplete] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const preludeAutoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const audioStartInFlightRef = useRef(false);
  const lastNavTimeRef = useRef(0);
  const touchStartYRef = useRef<number | null>(null);
  const wheelAccumRef = useRef(0);
  const wheelLastTimeRef = useRef(0);
  const daysAfterValentines = useMemo(() => {
    const now = new Date();
    const valentines = new Date(now.getFullYear(), 1, 14);

    if (now < valentines) {
      valentines.setFullYear(valentines.getFullYear() - 1);
    }

    const diffMs = now.getTime() - valentines.getTime();
    return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
  }, []);
  const valentinesDayLabel = daysAfterValentines === 1 ? 'day' : 'days';

  useEffect(() => {
    onPageChange?.(currentPage);
  }, [currentPage, onPageChange]);

  const clearFadeTimer = useCallback(() => {
    if (fadeTimerRef.current) {
      clearInterval(fadeTimerRef.current);
      fadeTimerRef.current = null;
    }
  }, []);

  const playAudioWithFade = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audioStartInFlightRef.current || isAudioPlaying) return;

    clearFadeTimer();
    audio.muted = false;
    audio.volume = START_MUSIC_VOLUME;
    audioStartInFlightRef.current = true;

    try {
      await audio.play();
      setIsAudioPlaying(true);

      const step = (TARGET_MUSIC_VOLUME - START_MUSIC_VOLUME) / (FADE_IN_DURATION_MS / FADE_STEP_MS);
      fadeTimerRef.current = setInterval(() => {
        const activeAudio = audioRef.current;
        if (!activeAudio || activeAudio.paused) {
          clearFadeTimer();
          return;
        }

        const nextVolume = activeAudio.volume + step;
        if (nextVolume >= TARGET_MUSIC_VOLUME) {
          activeAudio.volume = TARGET_MUSIC_VOLUME;
          clearFadeTimer();
          return;
        }

        activeAudio.volume = nextVolume;
      }, FADE_STEP_MS);
    } catch (error) {
      console.error(error);
    } finally {
      audioStartInFlightRef.current = false;
    }
  }, [clearFadeTimer, FADE_IN_DURATION_MS, FADE_STEP_MS, START_MUSIC_VOLUME, TARGET_MUSIC_VOLUME, isAudioPlaying]);

  useEffect(() => {
    if (initialAudio) {
      initialAudio.loop = true;
      initialAudio.defaultMuted = false;
      initialAudio.muted = false;
      if (initialAudio.volume < START_MUSIC_VOLUME) {
        initialAudio.volume = START_MUSIC_VOLUME;
      }
      audioRef.current = initialAudio;
      const isAudiblyPlaying =
        !initialAudio.paused &&
        !initialAudio.muted &&
        initialAudio.volume > 0.01;
      setIsAudioPlaying(isAudiblyPlaying);
      return () => {
        clearFadeTimer();
      };
    }

    const audio = new Audio('/music/blue.mp3');
    audio.loop = true;
    audio.defaultMuted = false;
    audio.muted = false;
    audio.volume = TARGET_MUSIC_VOLUME;
    audioRef.current = audio;
    return () => {
      clearFadeTimer();
      audio.pause();
      audio.src = '';
    };
  }, [TARGET_MUSIC_VOLUME, clearFadeTimer, initialAudio]);

  useEffect(() => {
    if (!autoStartAudio) return;
    if (!audioRef.current) return;
    if (currentPage === 'question' && !isAudioPlaying) {
      playAudioWithFade();
    }
  }, [autoStartAudio, currentPage, isAudioPlaying, playAudioWithFade]);

  useEffect(() => {
    if (!autoStartAudio) return;
    if (currentPage !== 'question' || isAudioPlaying) return;

    const retryPlay = () => {
      playAudioWithFade();
    };

    window.addEventListener('touchstart', retryPlay, { passive: true });
    window.addEventListener('touchend', retryPlay, { passive: true });
    window.addEventListener('wheel', retryPlay, { passive: true });
    window.addEventListener('pointerdown', retryPlay, { passive: true });
    window.addEventListener('keydown', retryPlay);

    return () => {
      window.removeEventListener('touchstart', retryPlay);
      window.removeEventListener('touchend', retryPlay);
      window.removeEventListener('wheel', retryPlay);
      window.removeEventListener('pointerdown', retryPlay);
      window.removeEventListener('keydown', retryPlay);
    };
  }, [autoStartAudio, currentPage, isAudioPlaying, playAudioWithFade]);

  const handleNavigation = useCallback((dir: 1 | -1) => {
    const now = Date.now();
    if (now - lastNavTimeRef.current < 1050) return;

    const currentIndex = PAGE_ORDER.indexOf(currentPage);
    if (currentIndex === -1) return;
    if (currentPage === 'pre-oluwatomi-message') return;

    if (dir === 1) {
      if (currentPage === 'question') return;
      if (currentPage === 'yes-response' && !isYesResponseComplete) return;
      if (currentPage === 'yes-response-message' && !isYesMessageComplete) return;
      if (currentPage === 'post-yes-message' && !isPostYesMessageComplete) return;
      if (currentPage === 'oluwatomi-page1' && !isPage1Complete) return;
      if (currentPage === 'oluwatomi-page2' && !isPage2Complete) return;
      if (currentPage === 'oluwatomi-page3' && !isPage3Complete) return;
      if (currentPage === 'smile-prompt' && !isSmilePromptComplete) return;
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
  }, [currentPage, isYesResponseComplete, isYesMessageComplete, isPostYesMessageComplete, isPage1Complete, isPage2Complete, isPage3Complete, isSmilePromptComplete]);

  useEffect(() => {
    if (currentPage === 'pre-oluwatomi-message') {
      setIsPreludeMessageComplete(false);
    }
  }, [currentPage]);

  useEffect(() => {
    if (preludeAutoTimerRef.current) {
      clearTimeout(preludeAutoTimerRef.current);
      preludeAutoTimerRef.current = null;
    }

    if (currentPage !== 'pre-oluwatomi-message' || !isPreludeMessageComplete) return;

    preludeAutoTimerRef.current = setTimeout(() => {
      setDirection(1);
      setCurrentPage('oluwatomi-page2');
    }, 1500);

    return () => {
      if (preludeAutoTimerRef.current) {
        clearTimeout(preludeAutoTimerRef.current);
        preludeAutoTimerRef.current = null;
      }
    };
  }, [currentPage, isPreludeMessageComplete]);

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

  const restartFlow = useCallback(() => {
    setDirection(-1);
    setCurrentPage('question');
    setNoClickCount(0);
    setShowConfetti(false);
    setIsYesResponseComplete(false);
    setIsYesMessageComplete(false);
    setIsPostYesMessageComplete(false);
    setIsPreludeMessageComplete(false);
    setIsPage1Complete(false);
    setIsPage2Complete(false);
    setIsPage3Complete(false);
    setIsSmilePromptComplete(false);
  }, []);

  const toggleMusic = useCallback(() => {
    if (audioRef.current) {
      if (isAudioPlaying) {
        clearFadeTimer();
        audioRef.current.pause();
        setIsAudioPlaying(false);
      } else {
        playAudioWithFade();
      }
    }
  }, [clearFadeTimer, isAudioPlaying, playAudioWithFade]);

  const currentNoText = noClickCount === 0 ? 'No' : NO_TEXT_SEQUENCE[(noClickCount - 1) % NO_TEXT_SEQUENCE.length];
  return (
    <div
      className="fixed inset-0 overflow-hidden"
      style={{
        background: isDark
          ? `radial-gradient(circle at 12% 12%, ${accentColor}36 0%, transparent 42%), radial-gradient(circle at 88% 85%, ${accentColor}20 0%, transparent 46%), linear-gradient(180deg, #07090d 0%, #0b1018 45%, #0f141d 100%)`
          : `radial-gradient(circle at 12% 12%, ${accentColor}30 0%, transparent 42%), radial-gradient(circle at 88% 85%, ${accentColor}18 0%, transparent 46%), linear-gradient(180deg, #ffffff 0%, #fcfcfd 45%, #f7f8fa 100%)`,
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
              <p className={`text-sm tracking-[0.24em] uppercase ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>For {name}</p>
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
                  className={`rounded-full px-8 py-3 text-sm font-medium border ${isDark ? 'bg-white/10' : 'bg-white/80'}`}
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
              className={`relative z-10 text-center space-y-6 backdrop-blur-xl border rounded-[2.2rem] px-8 py-10 md:px-14 md:py-12 overflow-hidden ${isDark ? 'bg-black/45' : 'bg-white/86'}`}
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
              <div className="text-5xl md:text-6xl font-great-vibes relative z-10" style={{ color: accentColor }}>
                <RomanticReveal text="Knew you would say yes" baseDelay={0.8} />
              </div>
              <div className={`text-lg md:text-2xl font-light italic relative z-10 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                <RomanticReveal 
                  text="I am definitely a lucky one." 
                  baseDelay={2.4} 
                  onComplete={() => setIsYesResponseComplete(true)}
                />
              </div>
            </div>
            <AnimatePresence>
              {isYesResponseComplete && (
                <ScrollIndicator accentColor={accentColor} delay={0.1} onNext={() => handleNavigation(1)} />
              )}
            </AnimatePresence>
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
                className={`text-3xl md:text-5xl font-bold leading-relaxed italic max-w-3xl mx-auto ${isDark ? 'text-slate-100' : 'text-slate-800'}`}
              >
                <RomanticReveal
                  text="I'm so glad we met. You always know how to make me smile and I really appreciate having you around. Happy Valentine's Day, Tomiwa! 💗"
                  baseDelay={0.5}
                  onComplete={() => setIsYesMessageComplete(true)}
                />
              </motion.div>
              <div className="h-24"></div>
              <AnimatePresence>
                {isYesMessageComplete && (
                  <ScrollIndicator accentColor={accentColor} delay={0.1} onNext={() => handleNavigation(1)} />
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
                className={`space-y-6 text-3xl md:text-5xl font-bold leading-relaxed italic max-w-3xl mx-auto ${isDark ? 'text-slate-100' : 'text-slate-800'}`}
              >
                <RomanticReveal text="Even if Valentine's is over," baseDelay={1.2} />
                <RomanticReveal text="Even if it's too soon," baseDelay={3.2} />
                <RomanticReveal
                  text="Even if it's just a feeling..."
                  baseDelay={5.2}
                  onComplete={() => setIsPreludeMessageComplete(true)}
                />
              </motion.div>
              <div className="h-24"></div>
            </div>
          </motion.div>
        )}

        {currentPage === 'post-yes-message' && (
          <motion.div
            key="post-yes-message"
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
                className={`space-y-6 text-3xl md:text-5xl font-bold leading-relaxed italic max-w-3xl mx-auto ${isDark ? 'text-slate-100' : 'text-slate-800'}`}
              >
                <RomanticReveal
                  text={`I know, right? Who does this ${daysAfterValentines} ${valentinesDayLabel} late?`}
                  baseDelay={0.35}
                  wordDelay={0.1}
                  wordDuration={0.8}
                />
                <RomanticReveal
                  text="It felt too soon to ask you on the actual day, but I didn't want to let the moment pass by either."
                  baseDelay={2.8}
                  wordDelay={0.1}
                  wordDuration={0.8}
                />
                <RomanticReveal
                  text="But....."
                  baseDelay={5.8}
                  wordDelay={0.1}
                  wordDuration={0.8}
                  onComplete={() => setIsPostYesMessageComplete(true)}
                />
              </motion.div>
              <div className="h-24"></div>
              <AnimatePresence>
                {isPostYesMessageComplete && (
                  <ScrollIndicator accentColor={accentColor} delay={0.1} onNext={() => handleNavigation(1)} />
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
            isDark={isDark}
            name={name}
            onComplete={() => setIsPage1Complete(true)}
            onNext={() => { setDirection(1); setCurrentPage('pre-oluwatomi-message'); }}
          />
        )}

        {currentPage === 'oluwatomi-page2' && (
          <Page2
            key="oluwatomi-page2"
            direction={direction}
            accentColor={accentColor}
            isDark={isDark}
            onComplete={() => setIsPage2Complete(true)}
            onNext={() => { setDirection(1); setCurrentPage('oluwatomi-page3'); }}
          />
        )}

        {currentPage === 'oluwatomi-page3' && (
          <Page3 
            key="oluwatomi-page3" 
            direction={direction} 
            accentColor={accentColor} 
            isDark={isDark}
            name={name}
            onComplete={() => setIsPage3Complete(true)}
            onNext={() => handleNavigation(1)}
          />
        )}
        
        {currentPage === 'smile-prompt' && (
          <motion.div
            key="smile-prompt"
            custom={direction}
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 flex items-center justify-center"
          >
            <div className="relative z-10 w-full max-w-4xl px-6 text-center">
              <motion.div
                initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                className={`text-3xl md:text-5xl font-bold leading-relaxed italic ${isDark ? 'text-slate-100' : 'text-slate-800'}`}
              >
                <RomanticReveal 
                  text="Well, if you want to know what those ***** mean... just come find me and smile 🙂. Don't say a word, just smile and go 😉." 
                  baseDelay={0.5}
                  onComplete={() => setIsSmilePromptComplete(true)}
                />
              </motion.div>
              <AnimatePresence>
                {isSmilePromptComplete && (
                  <ScrollIndicator accentColor={accentColor} delay={0.1} onNext={() => handleNavigation(1)} />
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {currentPage === 'part2-teaser' && (
          <motion.div
            key="part2-teaser"
            custom={direction}
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
            className={`fixed inset-0 flex items-center justify-center backdrop-blur-sm px-6 ${isDark ? 'bg-black/35' : 'bg-white/50'}`}
          >
            <div className="text-center w-full max-w-4xl">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="space-y-4"
              >
                <p className="text-5xl md:text-8xl font-great-vibes" style={{ color: accentColor }}>
                  ...Or just wait for part 2.
                </p>
                <p className={`text-xs md:text-sm ${isDark ? 'text-slate-400' : 'text-slate-500/80'}`}>
                  well you voted for it for Thu, 16th Apr at 21:00
                </p>
                <div className={`h-px bg-linear-to-r from-transparent w-full mt-12 ${isDark ? 'via-slate-600' : 'via-slate-300'} to-transparent`} />
                <Countdown accentColor={accentColor} isDark={isDark} />
                <div className="mt-8 flex flex-col items-center gap-4">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={restartFlow}
                    className="rounded-full px-8 py-3 text-sm font-semibold border"
                    style={{
                      color: accentColor,
                      borderColor: `${accentColor}66`,
                      backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.75)',
                    }}
                  >
                    Restart
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={onReturnToSetup}
                    className="rounded-full px-8 py-3 text-sm font-semibold border"
                    style={{
                      color: accentColor,
                      borderColor: `${accentColor}66`,
                      backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.75)',
                    }}
                  >
                    Reset
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={toggleMusic}
        className={`fixed bottom-6 left-6 z-100 p-3 backdrop-blur-md rounded-full shadow-lg border ${isDark ? 'bg-white/10' : 'bg-white/80'}`}
        style={{ color: accentColor, borderColor: `${accentColor}66` }}
      >
        {isAudioPlaying ? <Volume2 size={24} /> : <VolumeX size={24} />}
      </motion.button>
    </div>
  );
}
