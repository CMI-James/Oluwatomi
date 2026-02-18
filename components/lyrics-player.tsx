'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  startDelay?: number;
  onLyricsComplete?: () => void;
}

const WORD_DURATION = 0.5;
const LINE_TRANSITION_TIME = 0.25;

export default function LyricsPlayer({
  lyrics,
  accentColor,
  audioSrc,
  startDelay = 0,
  onLyricsComplete,
}: LyricsPlayerProps) {
  const [currentLyricIndex, setCurrentLyricIndex] = useState(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef<HTMLAudioElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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

  const togglePlayPause = async () => {
    if (isPlaying) {
      setIsPlaying(false);
      if (audioRef.current && audioSrc) {
        audioRef.current.pause();
      }
      return;
    }

    if (audioSrc && audioRef.current) {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (err) {
        console.error('Error playing audio:', err);
      }
    } else {
      setIsPlaying(true);
    }
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // ... (keyboard handler remains same)
      if (e.code === 'Space') {
        e.preventDefault();
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

  // Removed autoplay effect as requested

  // Handle volume fade-in
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !isPlaying) return;

    // Start at a low volume
    audio.volume = 0.1;
    const targetVolume = 0.5;
    const duration = 2000; // 2 seconds fade in
    const interval = 50; // Update every 50ms
    const step = (targetVolume - 0.1) / (duration / interval);

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

  const currentGradient = `linear-gradient(180deg, ${accentColor}40 0%, ${accentColor}10 50%, #000 100%)`;

  return (
    <div
      className="relative h-screen flex flex-col overflow-hidden bg-black text-white"
      style={{
        background: `linear-gradient(to bottom, ${accentColor} 0%, #000000 100%)`,
      }}
    >
      <audio
        ref={audioRef}
        onEnded={() => {
          setIsPlaying(false);
          onLyricsComplete?.();
        }}
        className="hidden"
        src={audioSrc || undefined}
      />

      {/* Lyrics Scroll Area */}
      <div
        ref={scrollContainerRef}
        className="flex-1 w-full max-w-4xl mx-auto overflow-y-auto px-6 py-[50vh] no-scrollbar space-y-8 md:space-y-12 text-center"
        style={{ scrollBehavior: 'smooth' }}
      >
        {lyrics.map((lyric, index) => {
          const isActive = index === currentLyricIndex;
          const isPast = index < currentLyricIndex;

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
                          ? (isWordActive ? '#FFFFFF' : 'rgba(255,255,255,0.3)')
                          : 'rgba(255,255,255,0.3)',
                        textShadow: isWordActive && isActive
                          ? '0 0 15px rgba(255,255,255,0.4)'
                          : 'none',
                        opacity: isActive ? 1 : 0.5
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
      <div className="absolute bottom-0 w-full bg-gradient-to-t from-black via-black/80 to-transparent pt-20 pb-10 px-6 max-w-4xl mx-auto inset-x-0">
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
            <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
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
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg" />
              </motion.div>
            </div>
          </div>

          <div className="flex justify-between text-xs font-medium text-white/50">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-10">
            <button
              onClick={handleSkipBackward}
              className="text-white/70 hover:text-white transition-colors"
            >
              <SkipBack size={32} />
            </button>

            <button
              onClick={togglePlayPause}
              className="p-4 rounded-full bg-white text-black hover:scale-105 transition-transform"
            >
              {isPlaying ? (
                <Pause size={36} fill="black" />
              ) : (
                <Play size={36} fill="black" className="ml-1" />
              )}
            </button>

            <button
              onClick={handleSkipForward}
              className="text-white/70 hover:text-white transition-colors"
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
