'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';

interface Lyric {
  id: number;
  text: string;
  timestamp?: number; // Start time in seconds
  endTime?: number;   // End time in seconds
}

interface LyricsPlayerProps {
  lyrics: Lyric[];
  accentColor: string;
  audioSrc?: string;
  initialAudio?: HTMLAudioElement | null;
  autoStart?: boolean;
  startDelay?: number;
  onLyricsComplete?: () => void;
}

const WORD_DURATION = 0.5;
const LINE_TRANSITION_TIME = 0.25;

const BackgroundAnimations = ({ accentColor }: { accentColor: string }) => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Primary animated blob */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          x: ['-10%', '10%', '-10%'],
          y: ['-10%', '10%', '-10%'],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] rounded-full blur-[120px] opacity-[0.22]"
        style={{ background: `radial-gradient(circle, ${accentColor} 0%, transparent 70%)` }}
      />
      
      {/* Secondary animated blob */}
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          x: ['10%', '-10%', '10%'],
          y: ['20%', '-5%', '20%'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute -bottom-[20%] -right-[10%] w-[60vw] h-[60vw] rounded-full blur-[100px] opacity-[0.18]"
        style={{ background: `radial-gradient(circle, ${accentColor} 0%, transparent 70%)` }}
      />

      {/* Floating accent particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            x: Math.random() * 100 + '%', 
            y: Math.random() * 100 + '%',
            opacity: 0 
          }}
          animate={{
            y: [null, (Math.random() - 0.5) * 200 + 'px'],
            opacity: [0, 0.15, 0],
            scale: [0, 1.5, 0]
          }}
          transition={{
            duration: 8 + Math.random() * 10,
            repeat: Infinity,
            delay: Math.random() * 5
          }}
          className="absolute w-32 h-32 rounded-full blur-3xl"
          style={{ backgroundColor: accentColor }}
        />
      ))}
    </div>
  );
};

export default function LyricsPlayer({
  lyrics,
  accentColor,
  audioSrc,
  initialAudio = null,
  autoStart = true,
  startDelay = 0,
  onLyricsComplete,
}: LyricsPlayerProps) {
  const [currentLyricIndex, setCurrentLyricIndex] = useState(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [hasCompleted, setHasCompleted] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Set up initialAudio if provided
  useEffect(() => {
    if (initialAudio) {
      initialAudio.defaultMuted = false;
      initialAudio.muted = false;
      if (initialAudio.volume < 0.01) {
        initialAudio.volume = 0.01;
      }
      audioRef.current = initialAudio;
      const alreadyPlaying =
        !initialAudio.paused &&
        !initialAudio.muted &&
        initialAudio.volume > 0.01;
      hasAutoplayStartedRef.current = alreadyPlaying;
      setIsPlaying(alreadyPlaying);
    }
  }, [initialAudio]);

  // Handle ended event globally for both initialAudio and standard element
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      setHasCompleted(true);
      setIsPlaying(false);
      onLyricsComplete?.();
    };

    audio.addEventListener('ended', handleEnded);
    return () => audio.removeEventListener('ended', handleEnded);
  }, [initialAudio, onLyricsComplete]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const hasAutoplayStartedRef = useRef(false);
  const hasUserPausedRef = useRef(false);

  // Pre-calculate line start times or use provided timestamps
  const lineTimings = useMemo(() => {
    let accumTime = 0;
    return lyrics.map((lyric, i) => {
      // Use explicit timestamp if valid, otherwise calculate
      const startTime = lyric.timestamp ?? accumTime;

      const wordCount = lyric.text.split(/\s+/).filter((w) => w.length > 0).length;

      // If we have an explicit duration/endtime, use it
      let endTime;
      if (lyric.endTime !== undefined) {
        endTime = lyric.endTime;
      } else if (lyrics[i + 1]?.timestamp !== undefined) {
        endTime = lyrics[i + 1].timestamp!;
      } else {
        // Fallback legacy calculation
        endTime = startTime + wordCount * WORD_DURATION + LINE_TRANSITION_TIME;
      }

      // Update accumulator for next fallback
      accumTime = endTime;

      return { startTime, endTime, wordCount };
    });
  }, [lyrics]);

  // Handle auto-scroll
  useEffect(() => {
    if (scrollContainerRef.current) {
      const activeLine = scrollContainerRef.current.querySelector(`[data-line="${currentLyricIndex}"]`);
      if (activeLine) {
        activeLine.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    }
  }, [currentLyricIndex]);

  // Handle audio sync
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !audioSrc) return;

    const syncToTime = (newTime: number) => {
      setCurrentTime(newTime);
      const lastLyricIndex = lyrics.length - 1;

      // Find which line we're on
      let lineIndex = 0;

      // 1. Try to find the exact line where currentTime is within [startTime, endTime)
      for (let i = 0; i < lineTimings.length; i++) {
        if (newTime >= lineTimings[i].startTime && newTime < lineTimings[i].endTime) {
          lineIndex = i;
          break;
        }
      }

      // 2. If no exact match (we might be in a gap), find the most recent start time
      if (newTime >= lineTimings[lineIndex].endTime) {
        for (let i = 0; i < lineTimings.length; i++) {
          if (newTime >= lineTimings[i].startTime) {
            lineIndex = i;
          } else {
            break;
          }
        }
      }

      const currentLineWords = lyrics[lineIndex].text.split(/\s+/).filter((w) => w.length > 0);
      const startTime = lineTimings[lineIndex].startTime;
      const duration = lineTimings[lineIndex].endTime - startTime;

      const timeIntoLine = newTime - startTime;
      const wordProgress = timeIntoLine / duration;
      const estimatedWordIndex = Math.floor(wordProgress * currentLineWords.length);
      const maxWordIndex = currentLineWords.length - 1;

      if (isPlaying && lineIndex === lastLyricIndex && estimatedWordIndex > maxWordIndex) {
        // let it play out
      }

      setCurrentLyricIndex(lineIndex);
      setCurrentWordIndex(Math.min(estimatedWordIndex, maxWordIndex));
    };

    const updateDuration = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    if (audio.duration && !isNaN(audio.duration)) {
      setDuration(audio.duration);
    }

    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('durationchange', updateDuration);

    let rafId: number;
    const onTimeUpdate = () => syncToTime(audio.currentTime);

    if (isPlaying) {
      const loop = () => {
        syncToTime(audio.currentTime);
        rafId = requestAnimationFrame(loop);
      }
      rafId = requestAnimationFrame(loop);
    } else {
      audio.addEventListener('timeupdate', onTimeUpdate);
    }

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('durationchange', updateDuration);
    };
  }, [lineTimings, lyrics, audioSrc, isPlaying]);

  // Handle timer-based playback (fallback)
  useEffect(() => {
    if (!isPlaying || audioSrc) return;

    if (timerRef.current) clearInterval(timerRef.current);

    let elapsed = currentTime;
    const lastLyricIndex = lyrics.length - 1;

    timerRef.current = setInterval(() => {
      elapsed += 0.05;
      setCurrentTime(elapsed);

      let lineIndex = 0;
      for (let i = 0; i < lineTimings.length; i++) {
        if (elapsed < lineTimings[i].endTime) {
          lineIndex = i;
          break;
        }
      }

      const currentLineWords = lyrics[lineIndex].text.split(/\s+/).filter((w) => w.length > 0);
      const timeIntoLine = elapsed - lineTimings[lineIndex].startTime;
      const estimatedWordIndex = Math.floor(timeIntoLine / WORD_DURATION);
      const maxWordIndex = currentLineWords.length - 1;

      if (lineIndex === lastLyricIndex && estimatedWordIndex >= maxWordIndex) {
        setHasCompleted(true);
        setIsPlaying(false);
        onLyricsComplete?.();
        if (timerRef.current) clearInterval(timerRef.current);
        return;
      }

      setCurrentLyricIndex(lineIndex);
      setCurrentWordIndex(Math.min(estimatedWordIndex, maxWordIndex));
    }, 50);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, audioSrc, lineTimings, lyrics, currentTime, onLyricsComplete]);

  const togglePlayPause = useCallback(async () => {
    if (isPlaying) {
      hasUserPausedRef.current = true;
      setIsPlaying(false);
      if (audioRef.current && audioSrc) {
        audioRef.current.pause();
      }
      return;
    }

    if (audioSrc && audioRef.current) {
      try {
        audioRef.current.muted = false;
        await audioRef.current.play();
        hasAutoplayStartedRef.current = true;
        hasUserPausedRef.current = false;
        setIsPlaying(true);
      } catch (err) {
        console.error('Error playing audio:', err);
      }
    } else {
      hasAutoplayStartedRef.current = true;
      hasUserPausedRef.current = false;
      setIsPlaying(true);
    }
  }, [audioSrc, isPlaying]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // ... (keyboard handler remains same)
      if (e.code === 'Space') {
        e.preventDefault();
        if (e.repeat) return;
        togglePlayPause();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        if (audioRef.current) {
          audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 2);
        }
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        if (audioRef.current) {
          audioRef.current.currentTime = Math.min(audioRef.current.duration, audioRef.current.currentTime + 2);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlayPause]);

  // Autoplay shortly after entering the lyrics screen.
  useEffect(() => {
    if (!autoStart) return;
    if (isPlaying || hasCompleted || hasAutoplayStartedRef.current || hasUserPausedRef.current) return;
    if (audioRef.current && !audioRef.current.paused) {
      hasAutoplayStartedRef.current = true;
      setIsPlaying(true);
      return;
    }

    let cancelled = false;

    const startPlayback = async () => {
      if (
        cancelled ||
        isPlaying ||
        hasCompleted ||
        hasAutoplayStartedRef.current ||
        hasUserPausedRef.current
      ) {
        return;
      }

      if (audioSrc && audioRef.current) {
        try {
          audioRef.current.muted = false;
          await audioRef.current.play();
          if (cancelled) return;
          hasAutoplayStartedRef.current = true;
          setIsPlaying(true);
        } catch (err) {
          console.error('Autoplay blocked:', err);
        }
      } else {
        hasAutoplayStartedRef.current = true;
        setIsPlaying(true);
      }
    };

    const autoplayDelayMs = Math.max(0, startDelay * 1000);
    const timer = setTimeout(startPlayback, autoplayDelayMs);
    const handleUserInteraction = () => {
      void startPlayback();
    };
    window.addEventListener('touchstart', handleUserInteraction, { passive: true });
    window.addEventListener('touchend', handleUserInteraction, { passive: true });
    window.addEventListener('wheel', handleUserInteraction, { passive: true });
    window.addEventListener('pointerdown', handleUserInteraction, { passive: true });
    window.addEventListener('keydown', handleUserInteraction);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      window.removeEventListener('touchstart', handleUserInteraction);
      window.removeEventListener('touchend', handleUserInteraction);
      window.removeEventListener('wheel', handleUserInteraction);
      window.removeEventListener('pointerdown', handleUserInteraction);
      window.removeEventListener('keydown', handleUserInteraction);
    };
  }, [audioSrc, autoStart, isPlaying, hasCompleted, startDelay]);

  // Handle volume fade-in
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !isPlaying) return;

    // Keep a softer entrance on lyrics track.
    const startVolume = Math.max(0.01, Math.min(audio.volume, 0.03));
    const targetVolume = 0.45;
    const duration = 3000;
    const interval = 50; // Update every 50ms
    audio.volume = startVolume;
    const step = (targetVolume - startVolume) / (duration / interval);

    const fadeTimer = setInterval(() => {
      if (audio.volume < targetVolume) {
        audio.volume = Math.min(targetVolume, audio.volume + step);
      } else {
        clearInterval(fadeTimer);
      }
    }, interval);

    return () => clearInterval(fadeTimer);
  }, [isPlaying]);

  const handleSkipForward = () => {
    if (audioRef.current && audioSrc) {
      audioRef.current.currentTime = Math.min(
        audioRef.current.currentTime + 10,
        audioRef.current.duration
      );
    }
  };

  const handleSkipBackward = () => {
    if (audioRef.current && audioSrc) {
      audioRef.current.currentTime = Math.max(
        audioRef.current.currentTime - 10,
        0
      );
    }
  };

  const formatTime = (time: number) => {
    if (time === undefined || isNaN(time)) return '0:00.00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    const milliseconds = Math.floor((time % 1) * 100);
    return `${minutes}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
  };

  return (
    <div
      className="relative h-screen flex flex-col overflow-hidden text-slate-900 bg-white"
    >
      <BackgroundAnimations accentColor={accentColor} />

      {!initialAudio && audioSrc && (
        <audio
          ref={audioRef}
          className="hidden"
          src={audioSrc}
        />
      )}

      {/* Lyrics Scroll Area */}
      <div
        ref={scrollContainerRef}
        className="flex-1 w-full max-w-4xl mx-auto overflow-y-auto px-6 py-[50vh] no-scrollbar space-y-8 md:space-y-12 text-center"
        style={{ scrollBehavior: 'smooth' }}
      >
        {lyrics.map((lyric, index) => {
          const isActive = index === currentLyricIndex;
          return (
            <motion.div
              key={lyric.id}
              data-line={index}
              initial={false}
              animate={{
                scale: isActive ? 1.05 : 0.98,
                opacity: isActive ? 1 : 0.4,
                filter: isActive ? 'blur(0px)' : 'blur(2px)',
                y: isActive ? 0 : 0,
              }}
              transition={{
                duration: 0.8,
                ease: [0.23, 1, 0.32, 1], // Cubic bezier for smooth ease-out
              }}
              className={`cursor-pointer mb-8 md:mb-12 ${isActive ? 'font-black' : 'font-bold'}`}
              onClick={() => {
                if (audioRef.current && audioSrc) {
                  const targetTime = lineTimings[index].startTime;
                  audioRef.current.currentTime = targetTime;
                } else {
                  setCurrentLyricIndex(index);
                  setCurrentTime(lineTimings[index].startTime);
                }
              }}
            >
              <div className="flex flex-wrap justify-center gap-x-3 md:gap-x-4 leading-tight">
                {lyric.text.split(/\s+/).filter(w => w).map((word, wIndex) => {
                  const isWordActive = isActive && wIndex <= currentWordIndex;
                  return (
                    <motion.span
                      key={wIndex}
                      initial={false}
                      animate={{
                        color: isActive
                          ? (isWordActive ? '#0f172a' : 'rgba(71,85,105,0.45)')
                          : 'rgba(71,85,105,0.45)',
                        textShadow: isWordActive && isActive
                          ? `0 0 12px ${accentColor}55`
                          : 'none',
                        opacity: isActive ? 1 : 0.65
                      }}
                      transition={{
                        duration: 0.3,
                        ease: "easeOut"
                      }}
                      className="text-3xl md:text-5xl lg:text-6xl inline-block"
                    >
                      {word}
                    </motion.span>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom Controls Area */}
      <div className="absolute bottom-0 w-full pt-20 pb-10 px-6 max-w-4xl mx-auto inset-x-0">
        <div className="max-w-xl mx-auto space-y-6">
          {/* Progress Bar */}
          <div className="w-full h-8 flex items-center cursor-pointer relative group"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const percentage = (e.clientX - rect.left) / rect.width;
              if (audioRef.current && audioSrc) {
                audioRef.current.currentTime = percentage * audioRef.current.duration;
              }
            }}
          >
            {/* Track Background */}
            <div className="w-full h-1.5 bg-slate-300/70 rounded-full overflow-hidden">
              {/* Fill is handled below, outside of this container to allow thumb overflow if needed, 
                    but for this style we strictly fill inside. 
                    Actually, let's keep the original structure but wrap it in the larger hit area div.
                */}
            </div>

            {/* Active Fill & Thumb - Positioned absolute over the track */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1.5 pointer-events-none">
              <motion.div
                className="h-full rounded-full relative"
                style={{
                  width: `${duration ? (currentTime / duration) * 100 : 0}%`,
                  backgroundColor: accentColor,
                }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg border border-slate-300" />
              </motion.div>
            </div>
          </div>

          <div className="flex justify-between text-xs font-medium text-slate-600">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-10">
            <button
              onClick={handleSkipBackward}
              className="text-slate-600 hover:text-slate-900 transition-colors"
            >
              <SkipBack size={32} />
            </button>

            <button
              onClick={togglePlayPause}
              className="p-4 rounded-full text-white hover:scale-105 transition-transform shadow-lg"
              style={{ backgroundColor: accentColor }}
            >
              {isPlaying ? (
                <Pause size={36} fill="white" />
              ) : (
                <Play size={36} fill="white" className="ml-1" />
              )}
            </button>

            <button
              onClick={handleSkipForward}
              className="text-slate-600 hover:text-slate-900 transition-colors"
            >
              <SkipForward size={32} />
            </button>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div >
  );
}
