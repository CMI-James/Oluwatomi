'use client';

import React from "react"
import { useState } from 'react';
import { motion } from 'framer-motion';
import ColorPicker from './color-picker';

interface SetupModalProps {
  onStart: (color: string, audioSrc: string) => void;
}

export default function SetupModal({ onStart }: SetupModalProps) {
  const [selectedColor, setSelectedColor] = useState('#ec4899');
  const [audioSrc, setAudioSrc] = useState('/music/lyrics music.mp3');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 flex items-center justify-center z-50 overflow-hidden"
      style={{
        background: `radial-gradient(ellipse at center, ${selectedColor}15 0%, ${selectedColor}05 40%, #fdf2f8 70%, #fff 100%)`,
      }}
    >
      {/* Soft decorative blurs */}
      <div
        className="absolute top-10 right-10 w-72 h-72 rounded-full blur-[100px] opacity-30 pointer-events-none"
        style={{ backgroundColor: selectedColor }}
      />
      <div
        className="absolute bottom-10 left-10 w-60 h-60 rounded-full blur-[80px] opacity-20 pointer-events-none"
        style={{ backgroundColor: selectedColor }}
      />

      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: 'spring', damping: 20 }}
        className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-12 max-w-md w-full mx-4 border border-white/50 relative overflow-hidden"
      >
        {/* Subtle shimmer */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-white/20 pointer-events-none" />

        <div className="relative z-10">
          {/* Envelope icon */}
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.5, delay: 0.2, type: 'spring' }}
            className="text-center mb-6"
          >
            <span className="text-6xl">💌</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-3xl md:text-4xl font-bold text-center mb-1"
            style={{ fontFamily: 'var(--font-playfair), serif' }}
          >
            I made this for you
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-gray-500 text-center mb-8 text-sm"
          >
            Pick a color you love, then press play 💗
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="space-y-6"
          >
            {/* Color Picker Section */}
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-4 text-center">
                Your favorite color ✨
              </label>
              <div className="flex justify-center">
                <ColorPicker value={selectedColor} onChange={setSelectedColor} />
              </div>
            </div>

            {/* Start Button */}
            <motion.button
              whileHover={{ scale: 1.03, boxShadow: `0 20px 40px ${selectedColor}40` }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onStart(selectedColor, audioSrc)}
              className="w-full px-6 py-4 rounded-2xl text-lg font-bold text-white transition-all relative overflow-hidden group"
              style={{
                backgroundColor: selectedColor,
                boxShadow: `0 10px 30px ${selectedColor}30`,
              }}
            >
              {/* Button shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <span className="relative z-10">Open 💕</span>
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
