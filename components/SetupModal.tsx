"use client";

import React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Palette, Volume2 } from "lucide-react";
import ColorPicker from "./ColorPicker";

interface SetupModalProps {
  onStart: (color: string, audioSrc: string) => void;
}

function FloatingHearts({ color }: { color: string }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(10)].map((_, i) => {
        const r1 = (i * 13) % 100 / 100;
        const r2 = (i * 27) % 100 / 100;
        const r3 = (i * 7) % 100 / 100;
        return (
          <motion.div
            key={i}
            initial={{
              opacity: 0,
              y: "106%",
              x: `${8 + r1 * 84}%`,
              scale: 0.3 + r2 * 0.5,
              rotate: -20 + r3 * 40,
            }}
            animate={{
              opacity: [0, 0.26, 0.2, 0],
              y: "-8%",
              rotate: -20 + r3 * 40,
            }}
            transition={{
              duration: 10 + r1 * 5,
              repeat: Infinity,
              delay: r2 * 8,
              ease: "easeOut",
            }}
            className="absolute text-base md:text-lg blur-[0.3px]"
            style={{ color }}
          >
            {["♥", "♡", "❤", "✦"][i % 4]}
          </motion.div>
        );
      })}
    </div>
  );
}

export default function SetupModal({ onStart }: SetupModalProps) {
  const [selectedColor, setSelectedColor] = useState("#ec4899");
  const [audioSrc] = useState("/music/lyrics-music.mp3");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 flex items-center justify-center z-50 overflow-hidden"
      style={{
        background: `
          radial-gradient(ellipse at 22% 16%, ${selectedColor}2e 0%, transparent 48%),
          radial-gradient(ellipse at 80% 84%, ${selectedColor}22 0%, transparent 52%),
          linear-gradient(160deg, #f9fbff 0%, #f7f6ff 42%, #fff5fa 100%)
        `,
      }}
    >
      <FloatingHearts color={selectedColor} />

      <motion.div
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.22, 0.35, 0.22],
        }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-8%] right-[-6%] w-[45vw] h-[45vw] max-w-[430px] max-h-[430px] rounded-full pointer-events-none"
        style={{ 
          background: `radial-gradient(circle, ${selectedColor} 0%, transparent 70%)` 
        }}
      />
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.12, 0.26, 0.12],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.4,
        }}
        className="absolute bottom-[-10%] left-[-8%] w-[42vw] h-[42vw] max-w-[360px] max-h-[360px] rounded-full pointer-events-none"
        style={{ 
          background: `radial-gradient(circle, ${selectedColor} 0%, transparent 70%)` 
        }}
      />
      <motion.div
        animate={{ scale: [1, 1.18, 1], opacity: [0.08, 0.14, 0.08] }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2.8,
        }}
        className="absolute top-[38%] left-[58%] w-28 h-28 rounded-full pointer-events-none"
        style={{ 
          background: `radial-gradient(circle, ${selectedColor} 0%, transparent 70%)` 
        }}
      />

      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.4, type: "spring", damping: 24, stiffness: 120 }}
        className="relative z-10 max-w-[30rem] w-full mx-4"
      >
        <div
          className="absolute -inset-[1px] rounded-[2.15rem] opacity-70 pointer-events-none"
          style={{
            background: `linear-gradient(145deg, ${selectedColor}40, rgba(255,255,255,0.75), ${selectedColor}24)`,
          }}
        />
        <div
          className="relative rounded-[2.1rem] border border-white/70 bg-white/72 backdrop-blur-2xl px-7 py-8 md:px-9 md:py-10 shadow-[0_28px_90px_rgba(15,23,42,0.12)] overflow-hidden"
          style={{ boxShadow: `0 28px 90px ${selectedColor}26` }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/70 via-white/35 to-white/5 pointer-events-none" />
          <div
            className="absolute -top-20 -right-12 h-52 w-52 rounded-full pointer-events-none"
            style={{ background: `radial-gradient(circle, ${selectedColor}35 0%, transparent 70%)` }}
          />
          <div
            className="absolute -bottom-20 -left-12 h-52 w-52 rounded-full pointer-events-none"
            style={{ background: `radial-gradient(circle, ${selectedColor}25 0%, transparent 70%)` }}
          />

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-7">
              <div
                className="inline-flex items-center gap-2 rounded-full border bg-white/80 px-3 py-1 text-[0.64rem] uppercase tracking-[0.17em]"
                style={{ borderColor: `${selectedColor}3d`, color: selectedColor }}
              >
                <Heart className="h-3.5 w-3.5" fill="currentColor" />
                Custom setup
              </div>
              <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)]" />
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.12 }}
              className="text-[2rem] md:text-[2.25rem] leading-tight font-semibold text-slate-900"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              Pick your color, turn the volume up, and open it.
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.28 }}
              className="mt-6 rounded-2xl border border-slate-200/80 bg-white/70 p-4"
            >
              <div className="flex items-center gap-2 text-[0.72rem] uppercase tracking-[0.18em] text-slate-500 mb-3">
                <Palette className="h-3.5 w-3.5" />
                pick a color you love
              </div>
              <ColorPicker value={selectedColor} onChange={setSelectedColor} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.36 }}
              className="mt-4 rounded-xl border border-slate-200/80 bg-white/65 p-4"
            >
              <p className="flex items-center justify-center gap-2 text-[0.68rem] uppercase tracking-[0.18em] text-slate-500">
                <motion.span
                  animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                  className="inline-flex"
                >
                  <Volume2 className="h-4 w-4" />
                </motion.span>
                increase your volume
              </p>
            </motion.div>

            <motion.button
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.46 }}
              whileHover={{
                scale: 1.02,
                boxShadow: `0 18px 42px ${selectedColor}52`,
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onStart(selectedColor, audioSrc)}
              className="mt-6 w-full rounded-2xl px-6 py-4 text-white text-base font-semibold tracking-[0.08em] transition-all"
              style={{
                background: `linear-gradient(135deg, ${selectedColor}, ${selectedColor}d9)`,
                boxShadow: `0 14px 30px ${selectedColor}45`,
                fontFamily: "var(--font-playfair), serif",
              }}
            >
              Open 💕
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
