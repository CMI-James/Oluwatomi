# Oluwatomi Love Website

Personalized interactive website built with Next.js and Framer Motion.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Experience flow

1. Setup modal (pick accent color)
2. Lyrics player intro
3. Valentine story sequence with progress and manual navigation
4. Final personalized closing screen

## Key files

- `app/page.tsx` - top-level flow controller
- `components/SetupModal.tsx` - personalization entry
- `components/LyricsPlayer.tsx` - audio + lyric sync
- `components/ValentinePages.tsx` - story navigation shell
- `components/oluwatomi-pages/*` - individual story sections
