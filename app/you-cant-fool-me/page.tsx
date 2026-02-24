import Image from 'next/image';
import { motion } from 'framer-motion';

export default function YouCantFoolMePage() {
  return (
    <motion.main
      initial={{ opacity: 0, filter: 'blur(10px)' }}
      animate={{ opacity: 1, filter: 'blur(0px)' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-screen w-full flex items-center justify-center px-4 md:px-6 bg-slate-100"
    >
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.9, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-3xl rounded-3xl border border-slate-200 bg-white p-3 md:p-5 shadow-[0_24px_80px_rgba(15,23,42,0.12)]"
      >
        <motion.div
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
        >
        <Image
          src="/images/i-am-familiar-with-your-game.gif"
          alt="I am familiar with your game"
          width={1400}
          height={980}
          priority
          className="w-full h-auto rounded-2xl"
        />
        </motion.div>
      </motion.div>
    </motion.main>
  );
}
