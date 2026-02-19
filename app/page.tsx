'use client';

import { FormEvent, useState } from 'react';
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
  'ty',
  'toyosi',
  'favour',
  'oluwatomi',
  'tomi',
  'onyinye',
  'ann',
  'val',
  'valentina',
]);

function NameGate({ onSubmit }: { onSubmit: (name: string) => void }) {
  const [name, setName] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(name);
  };

  return (
    <motion.div
      key="name-gate"
      initial={{ opacity: 0, scale: 1.03 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 flex items-center justify-center px-5"
      style={{
        background:
          'radial-gradient(circle at 14% 16%, rgba(236,72,153,.18) 0%, transparent 40%), radial-gradient(circle at 84% 82%, rgba(59,130,246,.14) 0%, transparent 43%), linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
      }}
    >
      <div className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white/90 backdrop-blur-xl p-8 shadow-[0_24px_80px_rgba(15,23,42,0.10)]">
        <p className="text-xs uppercase tracking-[0.22em] text-slate-500 text-center mb-3">Welcome</p>
        <h1 className="text-3xl font-semibold text-slate-900 text-center mb-2" style={{ fontFamily: 'var(--font-playfair), serif' }}>
          Input your name
        </h1>
        <p className="text-sm text-slate-600 text-center mb-7">Enter your name to continue</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Type your name"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
          />
          <button
            type="submit"
            className="w-full rounded-xl bg-slate-900 text-white py-3 font-semibold hover:bg-slate-800 transition-colors"
          >
            Continue
          </button>
        </form>
      </div>
    </motion.div>
  );
}

function LyricsStopScreen({ name }: { name: string }) {
  return (
    <motion.div
      key="lyrics-stop"
      initial={{ opacity: 0, y: 24, filter: 'blur(10px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: -16, filter: 'blur(8px)' }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 flex items-center justify-center px-6"
      style={{ background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)' }}
    >
      <div className="max-w-xl w-full rounded-[2rem] border border-slate-200 bg-white/88 backdrop-blur-xl p-10 text-center shadow-[0_24px_80px_rgba(15,23,42,0.10)]">
        <p className="text-xs uppercase tracking-[0.22em] text-slate-500 mb-3">Thank you</p>
        <h2 className="text-4xl text-slate-900 mb-2" style={{ fontFamily: 'var(--font-great-vibes), cursive' }}>
          {name || 'Beautiful soul'}
        </h2>
        <p className="text-slate-600">That is the end of this version.</p>
      </div>
    </motion.div>
  );
}

export default function Home() {
  const [accentColor, setAccentColor] = useState('#f43f5e');
  const [audioSrc, setAudioSrc] = useState('/music/lyrics-music.mp3');
  const [hasStarted, setHasStarted] = useState(false);
  const [showValentine, setShowValentine] = useState(false);
  const [stopAfterLyrics, setStopAfterLyrics] = useState(false);
  const [accessMode, setAccessMode] = useState<AccessMode>(null);
  const [nameAccepted, setNameAccepted] = useState(false);
  const [enteredName, setEnteredName] = useState('');

  const handleSetupStart = (color: string, audio: string) => {
    setAccentColor(color);
    setAudioSrc(audio);
    setHasStarted(true);
  };

  const handleNameSubmit = (name: string) => {
    const normalized = name.trim().toLowerCase();
    if (!normalized) return;

    if (normalized === 'bunmi') {
      setAccessMode('full');
      setEnteredName(name.trim());
      setNameAccepted(true);
      return;
    }

    if (LYRICS_ONLY_NAMES.has(normalized)) {
      setAccessMode('lyrics-only');
      setEnteredName(name.trim());
      setNameAccepted(true);
      return;
    }

    window.location.href = 'https://cmi-james.vercel.app';
  };

  const handleLyricsComplete = () => {
    if (accessMode === 'full') {
      setShowValentine(true);
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
          <ValentinePages accentColor={accentColor} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
