'use client';

import { useRef, useState } from 'react';
import { useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import RomanticReveal from '@/components/ui/RomanticReveal';

export default function Home() {
  const [showVerdict, setShowVerdict] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onPlay = () => setIsAudioPlaying(true);
    const onPause = () => setIsAudioPlaying(false);
    const onEnded = () => setIsAudioPlaying(false);

    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnded);
    };
  }, []);

  const startSongFromBeginning = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    audio.muted = false;
    audio.defaultMuted = false;
    try {
      await audio.play();
    } catch {
      setIsAudioPlaying(false);
    }
  };

  const handleContinue = async () => {
    await startSongFromBeginning();
    setShowVerdict(true);
  };

  const toggleMusic = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isAudioPlaying) {
      audio.pause();
      return;
    }

    await startSongFromBeginning();
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950 px-6 py-12 text-slate-100">
      <audio ref={audioRef} src="/music/Soldier.mp3" preload="auto" className="hidden" />

      {!showVerdict ? (
        <section className="w-full max-w-2xl rounded-2xl border border-slate-700 bg-slate-900/70 p-8 md:p-12 text-center">
          <h1 className="text-6xl md:text-8xl font-great-vibes">...Well</h1>
          <button
            onClick={() => void handleContinue()}
            className="mt-8 rounded-full border border-slate-500 px-7 py-3 text-sm font-semibold uppercase tracking-[0.15em] transition hover:bg-slate-800"
          >
            Continue
          </button>
        </section>
      ) : (
        <section className="w-full max-w-3xl rounded-2xl border border-slate-700 bg-slate-900/70 p-8 md:p-12 text-left">
          <div className="text-xl leading-snug md:text-3xl space-y-6">
            <RomanticReveal
              text="Unfortunately, even after this case was brought before the court with genuine affection."
              baseDelay={0.5}
              wordDelay={0.2}
              wordDuration={1.1}
              className="inline-flex flex-wrap justify-start gap-x-2 gap-y-2 w-full"
            />
            <RomanticReveal
              text="It leaves its mark upon the record."
              baseDelay={3.6}
              wordDelay={0.2}
              wordDuration={1.1}
              className="inline-flex flex-wrap justify-start gap-x-2 gap-y-2 w-full"
            />
            <RomanticReveal
              text="The verdict has been spoken."
              baseDelay={5.9}
              wordDelay={0.2}
              wordDuration={1.1}
              className="inline-flex flex-wrap justify-start gap-x-2 gap-y-2 w-full"
            />
            <RomanticReveal
              text="The court will now adjourn this matter for the time being."
              baseDelay={7.9}
              wordDelay={0.2}
              wordDuration={1.1}
              className="inline-flex flex-wrap justify-start gap-x-2 gap-y-2 w-full"
            />
          </div>
        </section>
      )}

      {showVerdict && (
        <button
          onClick={() => void toggleMusic()}
          className="fixed bottom-6 left-6 z-50 rounded-full border border-slate-600 bg-slate-900/80 p-3 text-slate-100 shadow-lg backdrop-blur-md"
          aria-label={isAudioPlaying ? 'Pause music' : 'Play music'}
        >
          {isAudioPlaying ? <Volume2 size={22} /> : <VolumeX size={22} />}
        </button>
      )}
    </main>
  );
}
