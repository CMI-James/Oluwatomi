"use client";

import React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import ColorPicker from "./ColorPicker";

interface SetupModalProps {
  onStart: (color: string, audioSrc: string) => void;
}

/* Tiny floating hearts that drift upward */
function FloatingHearts({ color }: { color: string }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          initial={{
            opacity: 0,
            y: "110%",
            x: `${8 + Math.random() * 84}%`,
            scale: 0.4 + Math.random() * 0.5,
            rotate: -20 + Math.random() * 40,
          }}
          animate={{
            opacity: [0, 0.45, 0.3, 0],
            y: "-10%",
            rotate: -20 + Math.random() * 40,
          }}
          transition={{
            duration: 6 + Math.random() * 6,
            repeat: Infinity,
            delay: Math.random() * 8,
            ease: "easeOut",
          }}
          className="absolute text-lg md:text-xl"
          style={{ color }}
        >
          {["♥", "♡", "❤", "💗"][i % 4]}
        </motion.div>
      ))}
    </div>
  );
}

export default function SetupModal({ onStart }: SetupModalProps) {
  const [selectedColor, setSelectedColor] = useState("#ec4899");
  const [audioSrc, setAudioSrc] = useState("/music/lyrics-music.mp3");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="fixed inset-0 flex items-center justify-center z-50 overflow-hidden"
      style={{
        background: `
          radial-gradient(ellipse at 30% 20%, ${selectedColor}18 0%, transparent 50%),
          radial-gradient(ellipse at 70% 80%, ${selectedColor}12 0%, transparent 50%),
          radial-gradient(ellipse at 50% 50%, #fdf2f8 0%, #fce7f3 40%, #fff1f2 70%, #fffbeb08 100%)
        `,
      }}
    >
      {/* Floating hearts */}
      <FloatingHearts color={selectedColor} />

      {/* Soft aurora blurs */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.25, 0.4, 0.25],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-5%] right-[-5%] w-[45vw] h-[45vw] max-w-[400px] max-h-[400px] rounded-full blur-[120px] pointer-events-none"
        style={{ backgroundColor: selectedColor }}
      />
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.15, 0.3, 0.15],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="absolute bottom-[-8%] left-[-5%] w-[40vw] h-[40vw] max-w-[350px] max-h-[350px] rounded-full blur-[100px] pointer-events-none"
        style={{ backgroundColor: selectedColor }}
      />
      {/* Small accent orb */}
      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 4,
        }}
        className="absolute top-[40%] left-[60%] w-32 h-32 rounded-full blur-[80px] pointer-events-none"
        style={{ backgroundColor: selectedColor }}
      />

      {/* Card */}
      <motion.div
        initial={{ scale: 0.88, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.9, type: "spring", damping: 20, stiffness: 90 }}
        className="relative z-10 max-w-[26rem] w-full mx-4"
      >
        {/* Outer glow behind card */}
        <div
          className="absolute -inset-3 rounded-[2.5rem] blur-2xl opacity-20 pointer-events-none"
          style={{ backgroundColor: selectedColor }}
        />

        <div className="relative bg-white/80 backdrop-blur-2xl rounded-[2rem] shadow-[0_30px_80px_-20px_rgba(190,24,93,0.18)] px-7 py-9 md:px-9 md:py-11 border border-pink-100/60 overflow-hidden">
          {/* Inner shimmer */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-rose-50/20 to-transparent pointer-events-none" />
          {/* Top decorative line */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 h-[2px] w-20 rounded-full opacity-50"
            style={{ background: `linear-gradient(90deg, transparent, ${selectedColor}, transparent)` }}
          />

          <div className="relative z-10 flex flex-col items-center">
            {/* Animated heart icon (from merged page style) */}
            <motion.div
              initial={{ scale: 0, y: 8 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, type: "spring" }}
              className="mb-5 flex justify-center"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="bg-white p-6 rounded-full shadow-xl border"
                style={{ borderColor: `${selectedColor}44` }}
              >
                <Heart className="w-16 h-16" style={{ color: selectedColor, fill: selectedColor }} />
              </motion.div>
            </motion.div>

            {/* Title — elegant serif */}
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
              className="text-[1.75rem] md:text-[2.1rem] font-semibold text-center mb-1 leading-tight text-gray-800"
              style={{ fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif" }}
            >
              I made this for you
            </motion.h1>

            {/* Decorative script line */}
            <motion.p
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.45 }}
              className="text-lg md:text-xl mb-6"
              style={{
                fontFamily: "var(--font-dancing-script), 'Dancing Script', cursive",
                color: selectedColor,
              }}
            >
              pick a color you love 💗
            </motion.p>

            {/* Color picker */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.55 }}
              className="mb-6"
            >
              <ColorPicker value={selectedColor} onChange={setSelectedColor} />
            </motion.div>

            {/* Volume reminder — soft, delicate */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.65 }}
              className="text-[0.68rem] uppercase tracking-[0.25em] mb-7 opacity-60"
              style={{ color: selectedColor }}
            >
              🔊 increase your volume
            </motion.p>

            {/* Button — with gradient & glow */}
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.75 }}
              whileHover={{
                scale: 1.04,
                boxShadow: `0 20px 50px ${selectedColor}45`,
              }}
              whileTap={{ scale: 0.96 }}
              onClick={() => onStart(selectedColor, audioSrc)}
              className="w-full px-6 py-4 rounded-2xl text-[1.05rem] font-semibold text-white transition-all relative overflow-hidden group"
              style={{
                background: `linear-gradient(135deg, ${selectedColor}, ${selectedColor}dd)`,
                boxShadow: `0 12px 35px ${selectedColor}35`,
                fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
                letterSpacing: "0.06em",
              }}
            >
              {/* Shimmer sweep */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <span className="relative z-10">Open 💕</span>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
