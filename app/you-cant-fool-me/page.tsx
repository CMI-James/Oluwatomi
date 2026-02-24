import Image from 'next/image';

export default function YouCantFoolMePage() {
  return (
    <main className="min-h-screen w-full flex items-center justify-center px-4 md:px-6 bg-slate-100">
      <div className="w-full max-w-3xl rounded-3xl border border-slate-200 bg-white p-3 md:p-5 shadow-[0_24px_80px_rgba(15,23,42,0.12)]">
        <Image
          src="/images/i-am-familiar-with-your-game.gif"
          alt="I am familiar with your game"
          width={1400}
          height={980}
          priority
          className="w-full h-auto rounded-2xl"
        />
      </div>
    </main>
  );
}
