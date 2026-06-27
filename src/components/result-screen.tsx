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

// All 48 Laws of Power, each rewritten as a reading about the person asking.
// One is chosen by the question's hash, so it stays consistent per question.
const lawReadings = [
  "You shrink yourself around the people you admire, dimming your own light so theirs burns brighter. The cat never apologizes for taking the warm spot, and the question you ask reveals someone still waiting for permission to shine.",
  "You give your warmth to the wrong people and waste your sharpness on the wrong enemies. A known foe is more useful than an uncertain friend — and your question shows you have not yet learned who is which.",
  "You announce what you want before you have it, and so it keeps slipping away. The way you asked this lays your hand on the table; learn to let no one read your next move until it is already made.",
  "You explain too much, hoping words will earn what silence could simply command. The length of your wondering gives you away — say less, and you will seem larger than the question.",
  "You guard everything except the one thing that decides how the world treats you: your name. The care in your question shows you sense its weight, even as you forget to protect it.",
  "You ache to be seen, then flinch the moment the eyes arrive. Your question is a small bid for attention; decide whether to truly be seen, because there is no power in the doorway between.",
  "You do the heavy work and let others walk off with the credit. Even now you hand the cat the decision that is yours to make — learn to stand where the praise lands.",
  "You chase the thing you want across the whole room. Sit still instead; the way you reached out with this question shows someone who has not yet learned to make the world come to them.",
  "You argue to win and collect only resentment. You wanted the cat to settle a thing words never could — prove it by doing, for actions leave the mark that arguments never do.",
  "You keep feeding a worry that only drains you, and this question is one more saucer of milk left out for it. The cat avoids the unlucky and the unhappy, because misfortune is catching.",
  "You give yourself away too freely, then wonder why you are so easily set down. Your question shows a generous, dependent heart — make yourself necessary, and you will never be discarded.",
  "You are honest only when it serves you and generous only when watched, and some of that is folded into how you asked. A little real kindness disarms — just never forget that you are the one wielding it.",
  "You ask for help by appealing to mercy when you should appeal to hunger. This question pleads where it could persuade — show people what they gain, and they will move for you.",
  "You wear friendliness like a coat while gathering what you need beneath it. The cat purrs and watches at once, and your careful question says you already know how to do both.",
  "You leave your fights half-finished and let old troubles recover their strength. The hesitation behind this question is the same hesitation that lets enemies return — finish what you start.",
  "You are always available, and so you are never quite missed. Asking the moment it crossed your mind shows it; withdraw a little, for absence is what teaches people your worth.",
  "You have made yourself easy to predict, and the predictable are easy to manage. Even this question runs along a groove you have worn — keep a little of the cat's unpredictability and watch the room lean in.",
  "You wall yourself off and call it safety, then ask the dark instead of a person. The cat hunts the open floor; your question shows the slow danger of choosing isolation.",
  "You spend your sharpness on the wrong people and the wrong moments. Before you bare a claw — or ask a thing like this — learn first exactly who you are dealing with.",
  "You commit too quickly, to plans and to people, and your question is already half a vow. Stay a little uncommitted, and watch how everyone begins to court your choice.",
  "You need to be seen as the clever one even when it costs you, and this clever little question proves it. Sometimes the cat plays dumb to catch what cleverness would only frighten off.",
  "You fight hardest exactly when losing, when surrender would buy you time and turn the tide. The strain in your question is that same refusal — bend now, and break them later on your terms.",
  "You scatter yourself across too many wants, and this is only the loudest of them today. Concentrate your force on one thing and it will yield what ten half-efforts never could.",
  "You bristle against the room when you could glide through it. Your blunt little question shows it; there is real power in the perfect courtier, in pleasing without ever surrendering.",
  "You let the world decide who you are, then ask the world to confirm it. Re-create yourself instead — the cat answers to no name it did not choose.",
  "You get your hands dirty doing what others should be doing for you. Even this question is work you could have delegated to your own nerve — keep your hands clean and let others leave the fingerprints.",
  "You hand your faith to whoever speaks loudest of certainty, and tonight that voice is a cat. People ache to believe; be careful, for your question shows how readily you let someone else do your believing.",
  "You hesitate at the very edge of the leap, and hesitation is the only true failure. This question is you standing at that edge — enter with boldness, because half-measures invite the wound.",
  "You begin things you have not finished imagining, and this question is a door opened onto a room you have not mapped. Plan to the end, the way the cat sees the landing before the jump.",
  "You let everyone watch how hard you strain. The visible effort in your question undoes you — make it look effortless, for ease is what convinces others you are more than you are.",
  "You play with cards other people dealt you and call the result fate. Control the options instead; even in asking this, you handed the cat the deck that should have been yours.",
  "You offer people the dull truth when they hunger for a dream, and you asked the cat for fact when you wanted a vision. Speak to the fantasy, and they will follow you into it.",
  "You push on people where they are strongest and wonder why they do not move. Find the soft place — the one need, the one fear your question keeps circling — and you will never have to push hard again.",
  "You keep asking the world's permission to feel worthy, this question among them. Carry yourself like a king, and the world will hand you the crown it was only hiding.",
  "You act too early or far too late, rarely in the one right moment. The timing of this question betrays the habit — the cat waits in stillness, then moves all at once, and timing is the whole hunt.",
  "You chase the thing you cannot have until the wanting owns you. This question is the leash it holds — disdain it, turn your back, for ignoring is the sharpest revenge the cat knows.",
  "You hand people plain truth when you should hand them a spectacle. Your unadorned question shows it; give them something to see, and they will believe whatever you wish.",
  "You say aloud every contrary thought you keep, this one included. Think as freely as you like, but behave like the others, and you will move untouched among them.",
  "You wait for calm water before you act, but calm water hides the fish. Your patient question is a still pond — stir things up, because confusion is where the cat finds its opening.",
  "You reach for what is offered free and pay for it later in ways you cannot yet see. Even a free answer from a cat has its price — despise the free lunch, for what costs nothing usually costs everything.",
  "You strain to fill a shadow far larger than your own. Step out of the great one's shoes the question keeps measuring you against, and leave a smaller print that is wholly yours.",
  "You fight the whole crowd when you should remove the one who leads it. Your question scatters its force the same way — strike the shepherd, and the rest disperse on their own.",
  "You demand with force what you could win with warmth. This question reaches with a hand half-closed into a fist — work on the heart first, for a willing creature needs no leash.",
  "You react to provocation in exactly the way that is expected of you. The predictability lives in this question too — mirror them instead, hand back their own behavior, and watch it unsettle them.",
  "You demand sweeping change all at once and frighten everyone into resisting you. Your question wants the whole answer this instant — preach change, but turn the wheel slowly.",
  "You strain to seem flawless, and flawlessness breeds only envy. The polish on your question is part of the armor — show one small crack, for it is the imperfect cat that is allowed near the fire.",
  "You win, then keep grasping past the win until it sours in your hands. This question reaches for one certainty too many — learn where to stop, the way the cat leaves the table while still ahead.",
  "You cling to fixed plans that the world keeps quietly dissolving. Your need for a hard yes or no is that grip — assume the cat's formlessness, be water and shadow, and nothing can corner you.",
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
  const reading = lawReadings[hsh % lawReadings.length];

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
