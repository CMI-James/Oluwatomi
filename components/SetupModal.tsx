"use client";

import React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Palette, Volume2 } from "lucide-react";
import ColorPicker from "./ColorPicker";
import ScrollIndicator from "./ui/ScrollIndicator";

interface SetupModalProps {
  onStart: (color: string, audioSrc: string, mode: "light" | "dark") => void;
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
  const [selectedMode, setSelectedMode] = useState<"light" | "dark">("light");
  const [step, setStep] = useState<"color" | "volume">("color");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 flex items-center justify-center z-50 overflow-hidden"
      style={{
        background: `
          radial-gradient(ellipse at 22% 16%, ${selectedColor}${selectedMode === "dark" ? "24" : "2e"} 0%, transparent 48%),
          radial-gradient(ellipse at 80% 84%, ${selectedColor}${selectedMode === "dark" ? "1a" : "22"} 0%, transparent 52%),
          ${selectedMode === "dark"
            ? "linear-gradient(160deg, #07090c 0%, #0b0d11 42%, #11131a 100%)"
            : "linear-gradient(160deg, #f9fbff 0%, #f7f6ff 42%, #fff5fa 100%)"}
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
          className={`relative rounded-[2.1rem] border backdrop-blur-2xl px-7 py-8 md:px-9 md:py-10 shadow-[0_28px_90px_rgba(15,23,42,0.12)] overflow-hidden ${
            selectedMode === "dark"
              ? "border-white/10 bg-black/45"
              : "border-white/70 bg-white/72"
          }`}
          style={{ boxShadow: `0 28px 90px ${selectedColor}26` }}
        >
          <div
            className={`absolute inset-0 pointer-events-none ${
              selectedMode === "dark"
                ? "bg-gradient-to-br from-white/8 via-white/4 to-transparent"
                : "bg-gradient-to-br from-white/70 via-white/35 to-white/5"
            }`}
          />
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

            <AnimatePresence mode="wait">
              {step === "color" ? (
                <motion.div
                  key="setup-color-step"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35 }}
                >
                  <h1
                    className={`text-[1.9rem] md:text-[2.15rem] leading-tight font-semibold ${
                      selectedMode === "dark" ? "text-slate-100" : "text-slate-900"
                    }`}
                    style={{ fontFamily: "var(--font-playfair), serif" }}
                  >
                    Pick your color
                  </h1>
                  <p className={`mt-2 text-sm ${selectedMode === "dark" ? "text-slate-400" : "text-slate-600"}`}>
                    Choose the vibe you want this story to carry.
                  </p>

                  <div
                    className={`mt-6 rounded-2xl border p-4 ${
                      selectedMode === "dark"
                        ? "border-white/12 bg-white/6"
                        : "border-slate-200/80 bg-white/70"
                    }`}
                  >
                    <div
                      className={`mb-3 flex items-center gap-2 text-[0.72rem] uppercase tracking-[0.18em] ${
                        selectedMode === "dark" ? "text-slate-400" : "text-slate-500"
                      }`}
                    >
                      <Palette className="h-3.5 w-3.5" />
                      choose your color
                    </div>
                    <ColorPicker value={selectedColor} onChange={setSelectedColor} />

                    <div className="mt-5">
                      <div
                        className={`mb-2 text-[0.7rem] uppercase tracking-[0.16em] ${
                          selectedMode === "dark" ? "text-slate-400" : "text-slate-500"
                        }`}
                      >
                        choose mode
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => setSelectedMode("light")}
                          className={`rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${
                            selectedMode === "light"
                              ? "bg-slate-900 text-white"
                              : selectedMode === "dark"
                                ? "bg-white/10 text-slate-200 hover:bg-white/15"
                                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                          }`}
                        >
                          Light
                        </button>
                        <button
                          onClick={() => setSelectedMode("dark")}
                          className={`rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${
                            selectedMode === "dark"
                              ? "bg-black text-white"
                              : selectedMode === "light"
                                ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                : "bg-white/10 text-slate-200 hover:bg-white/15"
                          }`}
                        >
                          Dark
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="h-12" />
                </motion.div>
              ) : (
                <motion.div
                  key="setup-volume-step"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35 }}
                >
                  <h1
                    className={`text-[1.9rem] md:text-[2.15rem] leading-tight font-semibold ${
                      selectedMode === "dark" ? "text-slate-100" : "text-slate-900"
                    }`}
                    style={{ fontFamily: "var(--font-playfair), serif" }}
                  >
                    One quick thing before we start
                  </h1>
                  <p className={`mt-2 text-sm ${selectedMode === "dark" ? "text-slate-400" : "text-slate-600"}`}>
                    Increase your volume a little so you do not miss the moment.
                  </p>

                  <div
                    className={`mt-6 rounded-xl border p-5 ${
                      selectedMode === "dark"
                        ? "border-white/12 bg-white/6"
                        : "border-slate-200/80 bg-white/65"
                    }`}
                  >
                    <p
                      className={`flex items-center justify-center gap-2 text-[0.68rem] uppercase tracking-[0.18em] ${
                        selectedMode === "dark" ? "text-slate-300" : "text-slate-500"
                      }`}
                    >
                      <motion.span
                        animate={{ scale: [1, 1.22, 1], opacity: [0.75, 1, 0.75] }}
                        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                        className="inline-flex"
                      >
                        <Volume2 className="h-5 w-5" />
                      </motion.span>
                      increase your volume
                    </p>
                  </div>

                  <div className="h-12" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {step === "color" ? (
        <ScrollIndicator
          accentColor={selectedColor}
          onNext={() => setStep("volume")}
          delay={0.6}
        />
      ) : (
        <ScrollIndicator
          accentColor={selectedColor}
          onNext={() => onStart(selectedColor, audioSrc, selectedMode)}
          onPrevious={() => setStep("color")}
          delay={0.6}
        />
      )}
    </motion.div>
  );
}
