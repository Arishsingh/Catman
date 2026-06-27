"use client";

import { useEffect, useRef } from "react";
import { motion } from "motion/react";

// category words (radial labels + result word), generic single terms
const categories = [
  "FEAR",
  "AROUSAL",
  "TERRITORY",
  "SOLICITATION",
  "ATTENTION",
  "ATTRACTION",
  "ECHOLOCATION",
];
const ringText =
  "CAT LANGUAGE MAP • ECHOLOCATION • ATTRACTION • ATTENTION • SOLICITATION • TERRITORY • AROUSAL • FEAR • ";

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

// A reading is composed from three fragment pools (opening / insight / law),
// each indexed by a different slice of the hash. The combinations make it
// effectively unique per question, and it reads as one cat-voiced paragraph.
const openings = [
  "You didn't really come for a yes or a no — you came for permission to do what you'd already chosen.",
  "The question you typed is a mask; the real one hides behind it, and the cat sees both.",
  "You ask this lightly, but it has been circling you for a long while now.",
  "Some part of you is performing even here, asking the cat as if someone were watching.",
  "You called this curiosity, though it is really about what you stand to gain.",
  "You want the certainty handed to you, yet you already suspect the answer.",
  "You phrased it so carefully, half-hoping the wording might bend the truth.",
  "You came looking for a sign, which means you have quietly stopped trusting your own.",
  "You ask the smallest version of a much larger question, and the cat is not fooled.",
  "You hold this question out like a treat, expecting the world to come when called.",
];
const insights = [
  "Power was never in the asking — it was in deciding before you asked.",
  "What you reveal in a question, you can never quite take back.",
  "The one who needs the answer least is always the one who controls it.",
  "Wanting a thing too openly is the surest way to lose it.",
  "Boldness, not hesitation, is the only move you have left.",
  "Say less, and the silence will rearrange itself in your favor.",
  "The patient creature eats; the anxious one only watches the door.",
  "Whatever you chase will run, and whatever you ignore will follow you home.",
  "Certainty is a thing you build, not a thing you are given.",
  "The mask you wear long enough stops being a mask at all — choose it well.",
];
const laws = [
  "The cat already knew, and the cat said nothing — learn from that.",
  "Conceal your intent, and even a no becomes useful to you.",
  "Leave the room, and watch carefully what comes looking for you.",
  "Land first; decide where you meant to be afterward.",
  "Keep your reasons to yourself and your claws for later.",
  "Move as though you have already won, and the winning follows.",
  "Be still until the moment is unmistakably yours.",
  "Want nothing visibly, and you may quietly have everything.",
  "Let them guess at your shape; a thing without edges cannot be cornered.",
  "Strike once, cleanly, and never explain the strike.",
];
const observations = [
  "The cat has watched you longer than you would like to admit, and it has noticed the pattern in how you reach for things.",
  "There is a hunger under this question, the kind that pretends to be patience while it paces the room.",
  "You measure the world in outcomes, in wins and losses, when the cat measures only in warmth and distance.",
  "Beneath the calm wording lies a fear you have not named, and naming it is half of mastering it.",
  "You are braver than your question sounds, and more cautious than you pretend to be.",
  "The thing you fear losing is the same thing you refuse to hold loosely.",
  "You ask the night for permission you could simply grant yourself.",
  "Every question you ask is a small confession of what you cannot yet control.",
];
const directives = [
  "So watch how the cat does it: it commits to nothing it cannot abandon, and abandons nothing it has truly chosen.",
  "So do as the predator does — wait, weigh, and then move all at once, leaving no room for second-guessing.",
  "So gather your intent quietly, show the world only the result, and let them wonder how you arrived.",
  "So stop asking permission of shadows; decide, and let the decision become the truth.",
  "So hold your power in reserve, spend it once, and spend it where it cannot be undone.",
  "So let go of the outcome you are clutching, and watch how quickly it turns and follows you.",
  "So make yourself difficult to read, and the room will arrange itself around your silence.",
  "So move first, apologize never, and let the world catch up to the shape you have already taken.",
];

const fade = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.4 + i * 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  }),
};

/** small crosshair "+" mark */
function Cross({ className }: { className: string }) {
  return (
    <span className={`pointer-events-none absolute text-white/40 ${className}`}>
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M9 0V18M0 9H18" stroke="currentColor" strokeWidth="1" />
      </svg>
    </span>
  );
}

/** original symmetric "language" glyph (not the brand's mark) */
function Glyph() {
  return (
    <svg width="120" height="120" viewBox="0 0 200 200" className="fill-white">
      <path d="M100 70 C112 88 112 112 100 130 C88 112 88 88 100 70 Z" />
      <path d="M82 42 C92 36 108 36 118 42 C108 48 92 48 82 42 Z" />
      <path d="M82 158 C92 164 108 164 118 158 C108 152 92 152 82 158 Z" />
      <path d="M112 84 C136 72 152 56 166 42 C160 62 144 82 120 100 C117 95 114 89 112 84 Z" />
      <path d="M88 84 C64 72 48 56 34 42 C40 62 56 82 80 100 C83 95 86 89 88 84 Z" />
      <path d="M112 116 C136 128 152 144 166 158 C160 138 144 118 120 100 C117 105 114 111 112 116 Z" />
      <path d="M88 116 C64 128 48 144 34 158 C40 138 56 118 80 100 C83 105 86 111 88 116 Z" />
    </svg>
  );
}

/** faint twinkling particle "map" cluster behind the reading */
function MapCluster() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio, 2);
    const size = Math.min(window.innerWidth, window.innerHeight) * 0.92;
    c.width = size * dpr;
    c.height = size * dpr;
    ctx.scale(dpr, dpr);

    const pts: { x: number; y: number; r: number; p: number; br: number; warm: number }[] = [];
    const cx = size / 2;
    const cy = size / 2;
    const R = size * 0.46;
    for (let b = 0; b < 9; b++) {
      const bx = cx + (Math.random() - 0.5) * R * 1.2;
      const by = cy + (Math.random() - 0.5) * R * 1.2;
      const warmBlob = Math.random() < 0.4;
      const n = 90 + Math.random() * 160;
      for (let i = 0; i < n; i++) {
        const ang = Math.random() * 6.2831;
        const rad = Math.pow(Math.random(), 0.5) * R * 0.16;
        const x = bx + Math.cos(ang) * rad;
        const y = by + Math.sin(ang) * rad;
        if ((x - cx) ** 2 + (y - cy) ** 2 < R * R) {
          pts.push({
            x,
            y,
            r: Math.random() * 1.5 + 0.3,
            p: Math.random() * 6.28,
            br: Math.random(),
            warm: warmBlob ? Math.random() : 0,
          });
        }
      }
    }

    let raf = 0;
    const start = performance.now();
    const draw = () => {
      const t = (performance.now() - start) / 1000;
      ctx.clearRect(0, 0, size, size);
      for (const pt of pts) {
        const tw = 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(t * 1.4 + pt.p));
        const a = (0.12 + pt.br * 0.5 * tw) * 0.8;
        const warm = pt.warm * tw;
        ctx.beginPath();
        ctx.fillStyle = `rgba(255,${Math.round(250 - warm * 40)},${Math.round(
          235 - warm * 90
        )},${a})`;
        ctx.arc(pt.x, pt.y, pt.r, 0, 6.2831);
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <canvas
      ref={ref}
      className="pointer-events-none fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-70"
      style={{ width: "92vmin", height: "92vmin" }}
    />
  );
}

export function ResultScreen({
  question,
  onRestart,
}: {
  question: string;
  onRestart: () => void;
}) {
  const hsh = hash(question || "the cat cloud");
  const num = (hsh % 9) + 1;
  const word = categories[hsh % categories.length];
  const answer = (hsh >> 3) % 2 === 0 ? "YES" : "NO";
  const reading = [
    openings[hsh % openings.length],
    observations[(hsh >> 4) % observations.length],
    insights[(hsh >> 7) % insights.length],
    directives[(hsh >> 10) % directives.length],
    laws[(hsh >> 13) % laws.length],
  ].join(" ");

  return (
    <motion.div
      className="fixed inset-0 z-[50] overflow-y-auto bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.9, ease: "easeInOut" }}
    >
      {/* particle map cluster */}
      <MapCluster />

      {/* rotating circular "map" labels */}
      <motion.svg
        viewBox="0 0 500 500"
        aria-hidden
        className="pointer-events-none fixed left-1/2 top-1/2 h-[150vmin] w-[150vmin] -translate-x-1/2 -translate-y-1/2 fill-white/12"
        animate={{ rotate: 360 }}
        transition={{ duration: 110, repeat: Infinity, ease: "linear" }}
      >
        <defs>
          <path
            id="ring"
            d="M250,250 m-205,0 a205,205 0 1,1 410,0 a205,205 0 1,1 -410,0"
          />
        </defs>
        <text style={{ fontFamily: "var(--font-dm-mono)", fontSize: 15, letterSpacing: 5 }}>
          <textPath href="#ring">{ringText.repeat(2)}</textPath>
        </text>
      </motion.svg>

      {/* faint radial glow */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 35%, rgba(255,255,255,0.05), transparent 60%)",
        }}
      />

      {/* reading panel with corner crosshairs + side rules */}
      <div className="relative mx-auto flex min-h-svh max-w-2xl flex-col px-8 py-24">
        <span className="pointer-events-none absolute inset-y-12 left-0 w-px bg-white/15" />
        <span className="pointer-events-none absolute inset-y-12 right-0 w-px bg-white/15" />
        <Cross className="left-0 top-10 -translate-x-1/2" />
        <Cross className="right-0 top-10 translate-x-1/2" />
        <Cross className="bottom-10 left-0 -translate-x-1/2" />
        <Cross className="bottom-10 right-0 translate-x-1/2" />

        <motion.p
          custom={0}
          variants={fade}
          initial="hidden"
          animate="show"
          className="text-center font-['Share_Tech'] text-4xl"
        >
          {num}
        </motion.p>

        <motion.div
          custom={1}
          variants={fade}
          initial="hidden"
          animate="show"
          className="mt-8 flex justify-center"
        >
          <Glyph />
        </motion.div>

        <motion.h2
          custom={2}
          variants={fade}
          initial="hidden"
          animate="show"
          className="mt-8 text-center font-['Share_Tech'] text-4xl font-bold uppercase tracking-[0.1em] sm:text-5xl"
        >
          {word}
        </motion.h2>

        <motion.div
          custom={3}
          variants={fade}
          initial="hidden"
          animate="show"
          className="mt-14 space-y-6 font-mono text-base leading-relaxed text-white/85"
        >
          <p>The Cat Cloud answered with three ripples.</p>
          <p>
            They move outward through the dark, carrying small tremors that pass
            over fur and floor and the long quiet of the room. Cats, like us,
            keep their fears close. They freeze at a sound that may be nothing,
            or melt into stillness when something unseen shifts nearby — instinct
            bending what is real into what might be.
          </p>
          <p>{reading}</p>
          <p className="text-white/50">
            What we ask of another creature often says more about us than about
            them — the shape of our wondering, drawn long before any answer
            arrives.
          </p>
        </motion.div>

        <motion.div
          custom={4}
          variants={fade}
          initial="hidden"
          animate="show"
          className="mt-16 border-t border-white/15 pt-10 text-center"
        >
          <p className="font-mono text-sm uppercase tracking-[0.2em] text-white/70">
            The answer to your question is
          </p>
          <p className="mt-3 font-['Share_Tech'] text-6xl font-bold">{answer}</p>
        </motion.div>

        <motion.div
          custom={5}
          variants={fade}
          initial="hidden"
          animate="show"
          className="mt-auto flex items-center justify-between pt-16 font-mono text-sm uppercase tracking-[0.2em]"
        >
          <button onClick={onRestart} className="transition-opacity hover:opacity-60">
            Restart
          </button>
          <span aria-hidden className="text-xl">
            ⟶
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
}
