'use client';

import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';

interface NameGateProps {
  onSubmit: (name: string) => void;
}

export default function NameGate({ onSubmit }: NameGateProps) {
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
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 flex items-center justify-center px-5"
      style={{
        background:
          'radial-gradient(circle at 14% 16%, rgba(236,72,153,.18) 0%, transparent 40%), radial-gradient(circle at 84% 82%, rgba(59,130,246,.14) 0%, transparent 43%), linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
      }}
    >
      <div className="w-full max-w-md rounded-4xl border border-slate-200 bg-white/90 backdrop-blur-xl p-8 shadow-[0_24px_80px_rgba(15,23,42,0.10)]">
        <p className="text-xs uppercase tracking-[0.22em] text-slate-500 text-center mb-3">Welcome</p>
        <h1 className="text-3xl font-semibold text-slate-900 text-center mb-2 font-playfair">
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
