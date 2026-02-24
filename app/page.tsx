'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp } from 'lucide-react';
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
  const [accentColor, setAccentColor] = useState('#f43f5e');
  const [audioSrc, setAudioSrc] = useState('/music/lyrics-music.mp3');
  const [hasStarted, setHasStarted] = useState(false);
  const [showLyricsIntro, setShowLyricsIntro] = useState(false);
  const [showPostLyricsBridge, setShowPostLyricsBridge] = useState(false);
  const [showValentine, setShowValentine] = useState(false);
  const [stopAfterLyrics, setStopAfterLyrics] = useState(false);
  const [accessMode, setAccessMode] = useState<AccessMode>(null);
  const [nameAccepted, setNameAccepted] = useState(false);
  const [enteredName, setEnteredName] = useState('');
  const lyricsAudioRef = useRef<HTMLAudioElement | null>(null);
  const valentineAudioRef = useRef<HTMLAudioElement | null>(null);

  const initLyricsAudio = (src: string) => {
    if (!lyricsAudioRef.current) {
      try {
        const lAudio = new Audio(src);
        lAudio.defaultMuted = false;
        lAudio.muted = false;
        lAudio.volume = 0;
        lAudio.play().catch(() => {});
        lyricsAudioRef.current = lAudio;
      } catch (e) {}
    }
  };

  const initValentineAudio = () => {
    if (!valentineAudioRef.current) {
      try {
        const vAudio = new Audio('/music/blue.mp3');
        vAudio.loop = true;
        vAudio.defaultMuted = false;
        vAudio.muted = false;
        vAudio.volume = 0;
        vAudio.play().catch(() => {});
        valentineAudioRef.current = vAudio;
      } catch (e) {}
    }
  };

  const handleSetupStart = (color: string, audio: string) => {
    setAccentColor(color);
    setAudioSrc(audio);
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
    if (accessMode === 'full') {
      setShowPostLyricsBridge(true);
    } else {
      setStopAfterLyrics(true);
    }
  };

  return (
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
          onContinue={() => {
            initLyricsAudio(audioSrc);
            setShowLyricsIntro(false);
          }}
          onBack={() => {
            setShowLyricsIntro(false);
            setHasStarted(false);
          }}
        />
      ) : showPostLyricsBridge ? (
        <PostLyricsBridgeScreen
          key="post-lyrics-bridge"
          name={enteredName || 'love'}
          accentColor={accentColor}
          onContinue={() => {
            initValentineAudio();
            setShowPostLyricsBridge(false);
            setShowValentine(true);
          }}
          onBack={() => setShowPostLyricsBridge(false)}
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
            startDelay={0.2}
            onLyricsComplete={handleLyricsComplete}
          />
        </motion.div>
      ) : stopAfterLyrics ? (
        <LyricsStopScreen key="stop" name={enteredName} />
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
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
