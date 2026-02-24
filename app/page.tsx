'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LyricsPlayer from '@/components/LyricsPlayer';
import ValentinePages from '@/components/ValentinePages';
import SetupModal from '@/components/SetupModal';

const SAMPLE_LYRICS = [
  { id: 1, text: "Maybe it's 6:45", timestamp: 0.1, endTime: 2.0 },
  { id: 2, text: "Maybe I'm barely alive", timestamp: 2.0, endTime: 3.9 },
  {
    id: 3,
    text: "Maybe you've taken my shit for the last time, yeah",
    timestamp: 3.9,
    endTime: 6.2,
  },
  { id: 4, text: "Maybe I know that I'm drunk", timestamp: 6.9, endTime: 9.4 },
  { id: 5, text: "Maybe I know you're the one", timestamp: 9.4, endTime: 11.5 },
  {
    id: 6,
    text: "Maybe I'm thinking it's better if you drive",
    timestamp: 11.5,
    endTime: 13.6,
  },
  {
    id: 7,
    text: "Oh, 'cause girls like you run 'round with guys like me",
    timestamp: 15.3,
    endTime: 20.0,
  },
  {
    id: 8,
    text: "'Til sundown when I come through",
    timestamp: 20.0,
    endTime: 22.0,
  },
  {
    id: 9,
    text: 'I need a girl like you, yeah',
    timestamp: 22.0,
    endTime: 24.1,
  },
];

type AccessMode = 'full' | 'lyrics-only' | null;

const LYRICS_ONLY_NAMES = new Set([
  'omotoyosi',
  'chidinma',
]);

const YOU_CANT_FOOL_ME_NAMES = new Set([
  'ty',
  'oluwatomi',
  'tomi',
  'favour',
  'valentina',
  'ann',
]);

import NameGate from '@/components/screens/NameGate';
import LyricsIntroScreen from '@/components/screens/LyricsIntroScreen';
import PostLyricsBridgeScreen from '@/components/screens/PostLyricsBridgeScreen';
import LyricsStopScreen from '@/components/screens/LyricsStopScreen';

export default function Home() {
  const LYRICS_PREWARM_VOLUME = 0.01;
  const VALENTINE_PREWARM_VOLUME = 0.2;

  const [accentColor, setAccentColor] = useState('#f43f5e');
  const [audioSrc, setAudioSrc] = useState('/music/lyrics-music.mp3');
  const [hasStarted, setHasStarted] = useState(false);
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');
  const [showLyricsIntro, setShowLyricsIntro] = useState(false);
  const [showPostLyricsBridge, setShowPostLyricsBridge] = useState(false);
  const [showValentine, setShowValentine] = useState(false);
  const [stopAfterLyrics, setStopAfterLyrics] = useState(false);
  const [accessMode, setAccessMode] = useState<AccessMode>(null);
  const [nameAccepted, setNameAccepted] = useState(false);
  const [enteredName, setEnteredName] = useState('');
  const lyricsAudioRef = useRef<HTMLAudioElement | null>(null);
  const valentineAudioRef = useRef<HTMLAudioElement | null>(null);
  const lastLyricsStartAtRef = useRef(0);
  const lastValentineStartAtRef = useRef(0);

  const initLyricsAudio = () => {
    const now = Date.now();
    if (now - lastLyricsStartAtRef.current < 800) return;
    lastLyricsStartAtRef.current = now;

    const lyricsAudio = lyricsAudioRef.current;
    if (!lyricsAudio) return;

    const valentineAudio = valentineAudioRef.current;
    if (valentineAudio && !valentineAudio.paused) {
      valentineAudio.pause();
      valentineAudio.currentTime = 0;
    }

    lyricsAudio.defaultMuted = false;
    lyricsAudio.muted = false;
    lyricsAudio.currentTime = 0;
    lyricsAudio.volume = LYRICS_PREWARM_VOLUME;
    lyricsAudio.play().catch(() => {});
  };

  const initValentineAudio = () => {
    const now = Date.now();
    if (now - lastValentineStartAtRef.current < 800) return;
    lastValentineStartAtRef.current = now;

    const valentineAudio = valentineAudioRef.current;
    if (!valentineAudio) return;

    const lyricsAudio = lyricsAudioRef.current;
    if (lyricsAudio && !lyricsAudio.paused) {
      lyricsAudio.pause();
      lyricsAudio.currentTime = 0;
    }

    valentineAudio.defaultMuted = false;
    valentineAudio.muted = false;
    valentineAudio.loop = true;
    valentineAudio.currentTime = 0;
    valentineAudio.volume = VALENTINE_PREWARM_VOLUME;
    valentineAudio.play().catch(() => {});
  };

  useEffect(() => {
    const root = document.documentElement;
    if (themeMode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [themeMode]);

  const handleSetupStart = (color: string, audio: string, mode: 'light' | 'dark') => {
    setAccentColor(color);
    setAudioSrc(audio);
    setThemeMode(mode);
    setHasStarted(true);
    setShowLyricsIntro(true);
  };

  const handleNameSubmit = (name: string) => {
    const normalized = name.trim().toLowerCase();
    if (!normalized) return;

    if (normalized === 'bunmi') {
      setAccessMode('full');
      setEnteredName('Oluwatomi');
      setNameAccepted(true);
      return;
    }

    if (YOU_CANT_FOOL_ME_NAMES.has(normalized)) {
      window.location.href = '/you-cant-fool-me';
      return;
    }

    if (LYRICS_ONLY_NAMES.has(normalized)) {
      setAccessMode('lyrics-only');
      setEnteredName(name.trim());
      setNameAccepted(true);
      return;
    }

    window.location.href = 'https://zzz.zoomquilt2.com/';
  };

  const handleLyricsComplete = () => {
    const lyricsAudio = lyricsAudioRef.current;
    if (lyricsAudio && !lyricsAudio.paused) {
      lyricsAudio.pause();
      lyricsAudio.currentTime = 0;
    }

    if (accessMode === 'full') {
      setShowPostLyricsBridge(true);
    } else {
      setStopAfterLyrics(true);
    }
  };

  return (
    <>
      <audio ref={lyricsAudioRef} src={audioSrc} preload="auto" playsInline className="hidden" />
      <audio ref={valentineAudioRef} src="/music/blue.mp3" preload="auto" playsInline loop className="hidden" />
      <AnimatePresence mode="wait">
      {!nameAccepted ? (
        <NameGate onSubmit={handleNameSubmit} />
      ) : !hasStarted ? (
        <SetupModal key="setup" onStart={handleSetupStart} />
      ) : showLyricsIntro ? (
        <LyricsIntroScreen
          key="lyrics-intro"
          name={enteredName || 'love'}
          accentColor={accentColor}
          isDark={themeMode === 'dark'}
          onContinue={() => {
            initLyricsAudio();
            setShowLyricsIntro(false);
          }}
        />
      ) : showPostLyricsBridge ? (
        <PostLyricsBridgeScreen
          key="post-lyrics-bridge"
          name={enteredName || 'love'}
          accentColor={accentColor}
          isDark={themeMode === 'dark'}
          onContinue={() => {
            initValentineAudio();
            setShowPostLyricsBridge(false);
            setShowValentine(true);
          }}
        />
      ) : !showValentine && !stopAfterLyrics ? (
        <motion.div
          key="lyrics"
          initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <LyricsPlayer
            lyrics={SAMPLE_LYRICS}
            accentColor={accentColor}
            audioSrc={audioSrc}
            initialAudio={lyricsAudioRef.current}
            isDark={themeMode === 'dark'}
            autoStart={false}
            startDelay={2}
            onLyricsComplete={handleLyricsComplete}
          />
        </motion.div>
      ) : stopAfterLyrics ? (
        <LyricsStopScreen key="stop" name={enteredName} isDark={themeMode === 'dark'} />
      ) : (
        <motion.div
          key="valentine"
          initial={{ opacity: 0, scale: 0.88, filter: 'blur(30px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
          transition={{ duration: 1.5, ease: [0.23, 1, 0.32, 1] }}
          className="fixed inset-0 w-full h-full"
        >
          <ValentinePages
            accentColor={accentColor}
            name={enteredName || 'love'}
            initialAudio={valentineAudioRef.current}
            isDark={themeMode === 'dark'}
            autoStartAudio={false}
          />
        </motion.div>
      )}
    </AnimatePresence>
    {themeMode === 'dark' && (
      <>
        <div className="pointer-events-none fixed inset-x-0 top-0 h-[10vh] z-[60] bg-gradient-to-b from-black/85 to-transparent" />
        <div className="pointer-events-none fixed inset-x-0 bottom-0 h-[10vh] z-[60] bg-gradient-to-t from-black/85 to-transparent" />
      </>
    )}
    </>
  );
}
