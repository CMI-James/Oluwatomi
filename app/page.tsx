'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LyricsPlayer from '@/components/lyrics-player';
import ValentinePages from '@/components/valentine-pages';
import SetupModal from '@/components/setup-modal';

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
    text: "I need a girl like you, yeah",
    timestamp: 22.0,
    endTime: 24.1,
  },
];

export default function Home() {
  const [accentColor, setAccentColor] = useState('#f43f5e');
  const [audioSrc, setAudioSrc] = useState('/music/lyrics music.mp3');
  const [hasStarted, setHasStarted] = useState(false);
  const [showValentine, setShowValentine] = useState(false);

  const handleSetupStart = (color: string, audio: string) => {
    setAccentColor(color);
    setAudioSrc(audio);
    setHasStarted(true);
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {!hasStarted ? (
          <SetupModal key="setup" onStart={handleSetupStart} />
        ) : !showValentine ? (
          <motion.div
            key="lyrics"
            initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <LyricsPlayer
              lyrics={SAMPLE_LYRICS}
              accentColor={accentColor}
              audioSrc={audioSrc}
              onLyricsComplete={() => setShowValentine(true)}
            />
          </motion.div>
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
    </>
  );
}
