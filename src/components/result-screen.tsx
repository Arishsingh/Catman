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

// What the cat thinks of itself — varied by hash, sets the tone first.
const catIntros = [
  "The cat does not answer the way you want it to. It watches, it waits, it gives affection on its own terms and attention only when it decides you have earned it — never because it was asked. That is the first thing to understand about the creature you came to.",
  "The cat owes you nothing and pretends nothing. It takes the one patch of sun, ignores your calling, and comes close only when it has judged you worth the closeness. It is the most honest thing in this dark room, and it has just looked straight through you.",
  "A cat keeps its fears close and its intentions closer. It freezes at a sound that may be nothing, melts into stillness when the unseen shifts, and lets you guess at all of it. It survives by being unreadable — and it has been reading you this whole time.",
  "The cat answered with three ripples through the dark, the way it answers everything: without hurry, without explanation, and without the smallest need for your approval. It moves through the world owing no one a reason, and it wonders why you cannot.",
];

// All 48 Laws of Power, each rewritten as a long personal reading: first the
// good the cat sees in you, then the lack it cannot help but name. One is chosen
// by the question's hash, so it stays consistent per question.
const lawReadings = [
  "There is a quiet brilliance in you that you keep folding away so the people around you feel comfortable, and that instinct is genuinely kind — others feel safe near you, lighter for your presence. But you have dimmed yourself so reliably that the world now expects your shadow instead of your light, and you have started calling that habit humility when it is really fear. You are starving for a recognition you refuse to claim, and until you stop apologizing for the warm spot, you will keep watching smaller people take it from you.",
  "You love loyally and you forgive quickly, and that open heart is rarer than you know — people are lucky to be kept by you. But you pour that warmth into people who showed you long ago exactly who they are, and you keep mistaking the comfort of the familiar for safety. You are too trusting to be powerful and too soft to admit it, and the painful truth is that a known enemy would serve you better than half the friends you keep excusing.",
  "You are open and sincere, and there is a rare honesty in the way you move through the world — people can feel that you mean what you say. But you announce what you want before it is ripe, and so your hopes keep dying in other people's hands before you can protect them. You crave to be understood far more than you want to win, and that hunger to be seen is the very reason you so often lose.",
  "You feel things deeply and you are brave enough to want to be known, and that courage to be seen is something most people never find. But you explain yourself to those who never asked, handing away your mystery for the smallest scrap of approval. You talk to fill a silence you are frightened of, and every word you spend trying to be understood makes you a little smaller in the room.",
  "You care how you are seen, and underneath that is a real wish to be good and not merely to look good — that decency is true. But you guard every little thing except the one that decides your fate: your name, your story, which you leave for others to write while you stay busy being kind. You are too passive to defend yourself and too proud to ask for help, and your reputation is slipping through fingers you keep politely folded.",
  "You have presence — people notice when you enter, whether or not you let yourself believe it. But you reach for attention and then flinch the instant it lands on you, wanting to be seen and terrified of being looked at. You live in the doorway between hiding and shining, and there is no power in that threshold, only the ache of being almost-chosen, again and again.",
  "You are the one who actually does the work, and that quiet diligence is a real strength others rely on more than they say. But you let louder people walk off with the credit while you whisper to yourself that the work is its own reward. You are afraid that claiming what you earned would make you greedy, and that fear is the leash that keeps you doing brilliant work in someone else's name.",
  "You are persistent and warm, and you give chase because you genuinely care — there is nothing cold in you. But you are always the one crossing the room, always reaching first, and the people in your life have quietly learned they never have to move for you. You confuse effort with worth, and you are exhausted from pursuing a world you were always meant to make come to you.",
  "You are thoughtful, and you believe in reason in a way that is rarer than you think — you want to be fair. But you argue to be right when you should simply act, gathering resentment where you meant to gather agreement. You need the last word more than you need the victory, and that need has cost you friendships and chances you will not let yourself count.",
  "You are compassionate, and you stay loyal to people through their lowest seasons — that steadfastness is genuinely beautiful. But you keep feeding worries and people that only drain you, mistaking endurance for love and exhaustion for virtue. You absorb other people's misfortune as if it were your duty, and you are slowly drowning in lives that were never yours to carry.",
  "You are giving, and people lean on you because you are truly dependable — that reliability is no small thing. But you give yourself away so freely that you have made yourself easy to set down and easier to forget. You are afraid that being needed is the only way you could be loved, and so you are used by many and chosen by almost no one.",
  "You are warm and disarming, and people open up to you without quite knowing why — a real gift. But you offer kindness mostly when it serves you, and you know it, and the small dishonesty of that quietly eats at you. You want to be a good person and a powerful one at the same time, and you have not yet found the nerve to be both without flinching.",
  "You are humble enough to ask for help, and that takes a courage most people only pretend to have. But you ask by pleading for mercy when you should be speaking to what the other person stands to gain. You believe that needing help makes you weak, and that shame is exactly why your asking so rarely moves anyone.",
  "You are perceptive, and you read people more accurately than they would ever guess — that awareness is power in itself. But you wear friendliness like a coat while watching everyone from underneath it, and the distance that creates is lonelier than you let anyone see. You trust no one completely, not even yourself, and you have started calling that wall wisdom.",
  "You are merciful, and you would rather forgive than fight — there is a real grace in your reluctance to wound. But you leave your conflicts half-finished and let old hurts heal inside the people who caused them, and they always come back stronger. You avoid the discomfort of finishing things, and that single avoidance is quietly unmaking your life.",
  "You are present and devoted, and the people you love never once doubt that you are there for them. But you are always available, and so you are never longed for, never missed, never quite craved. You confuse constant presence with importance, and you are starving for a desire that your own everywhereness keeps quietly killing.",
  "You are steady and reliable, the kind of person others can set their lives by — that constancy is a gift in a chaotic world. But you have made yourself so predictable that you are easy to manage and easier to take for granted. You cling to your routines because the unknown frightens you, and that fear is the bars of a cage you built with your own hands.",
  "You are self-sufficient, and you protect your peace in a way that others secretly envy. But you wall yourself off and call it safety, asking the dark for answers instead of asking a person. You mistake isolation for strength, and the loneliness you keep pretending not to feel is the slow danger eating your best years.",
  "You are passionate, and you speak your truth with a fire that is genuinely magnetic — people are drawn to your conviction. But you spend that sharpness on the wrong people at the wrong moments, making enemies you never needed to make. You react before you read the room, and your honesty keeps costing you far more than anyone's dishonesty ever could.",
  "You are devoted, and when you choose something you choose it with your whole self — that wholeheartedness is rare. But you commit too quickly, to plans and to people, and you keep getting trapped by vows you made out of a fear of being alone. You confuse commitment with belonging, and your loyalty has become the very thing others have learned to exploit.",
  "You are genuinely clever, and your mind moves faster than most of the rooms you sit in. But you need everyone to see that cleverness, even when hiding it would serve you far better, and your pride keeps tipping your hand. You would rather be admired than effective, and that vanity is the soft underbelly of an otherwise sharp and capable mind.",
  "You are resilient, and you do not give up — that stubbornness has carried you through things that would have ended other people. But you fight hardest at the exact moment you are losing, when bending would buy you everything you actually want. Your pride will not let you yield, and so you break instead, over and over, and call the breaking strength.",
  "You are curious and capable, drawn to many things because you can genuinely do many things — that range is real. But you scatter yourself so widely that nothing ever receives the full weight of you. You are afraid that choosing one thing means losing all the others, and that fear is why your considerable gifts keep arriving half-finished and unclaimed.",
  "You are principled, and you hate playing games — that integrity is real and others can feel it. But you bristle against rooms you could simply glide through, mistaking your rigidity for honesty. You are too proud to charm and too stubborn to adapt, and you keep losing, quietly and repeatedly, to people far less able than you.",
  "You are sincere, and you do not pretend to be what you are not — that refusal to perform is its own kind of dignity. But you let the world tell you who you are and then turn around and ask the world to confirm it. You are waiting for permission to become yourself, and that waiting has become a slow, polite form of surrender.",
  "You are conscientious, and you take responsibility even for things that were never yours to carry — that reliability runs deep. But you keep doing the unpleasant work that others should be handling, and the stains end up on your hands while they stay spotless. You confuse martyrdom with virtue, and the guilt you carry does more damage to you than any mistake ever could.",
  "You have faith, and you long for meaning — that yearning is deeply human and nothing to be ashamed of. But you hand your belief to whoever sounds most certain, even, tonight, a cat in the dark. You are afraid to sit with not knowing, and that fear makes you easy to lead, easy to comfort, and easy to fool.",
  "You are thoughtful, and you weigh things carefully — that caution has saved you from foolish mistakes more than once. But you hesitate at the very edge of every leap, and that hesitation has cost you more than any wrong move ever would have. You keep waiting for a certainty that never arrives, and your caution has quietly grown into cowardice wearing a respectable coat.",
  "You are a beginner of things, full of energy and fresh starts, and that spark genuinely draws people toward you. But you keep opening doors onto rooms you have not mapped, and your plans collapse somewhere in the middle. You love the thrill of starting far more than the discipline of finishing, and that is why so little of what you begin ever survives you.",
  "You work hard, and you care — that earnestness is real and people sense it. But you let everyone see the strain, performing your effort as though exhaustion were proof of your worth. You need others to know how much it all costs you, and that need makes you look smaller than the easeful people who quietly win without ever seeming to try.",
  "You are fair, and you let other people choose — that generosity of spirit is genuine. But you keep playing with cards that others dealt you and calling the loss your fate. You are too passive to shape the game in your favor, and you have learned to mistake your own surrender for open-mindedness.",
  "You are honest and grounded, and people trust exactly what you tell them — that credibility is hard-won and real. But you keep handing the world dull truth when it is starving for a dream, and so it follows louder, emptier voices instead of you. You think realism is a virtue, but your refusal to inspire is really a quiet fear of being disappointed.",
  "You are perceptive about people, and you see their soft places more clearly than they would like — that sight is a kind of power. But you keep pushing where they are strongest and wondering why they never move. You aim at the wrong target because the right one feels like manipulation, and that squeamishness is exactly what keeps you powerless.",
  "You have dignity — a real, buried sense of your own worth that flickers underneath everything you do. But you keep asking the world for permission to feel it, and that asking is woven into every move you make, this question included. You wait for a crown that someone else must place on your head, never seeing that the world only bows to those who already wear their own.",
  "You are patient in some things and decisive in others, and that range is genuinely a gift. But your timing is always a little wrong — too early out of anxiety, too late out of doubt. You move from your feelings instead of from the moment, and so the world keeps slipping past you while you are busy reacting to the last thing it did.",
  "You are passionate, and you want things fully, with your whole chest — there is nothing lukewarm about you. But you chase what you cannot have until the wanting owns you, and the chase quietly humiliates you. You cannot let go, and that inability is a leash that anyone who understands it can use to lead you anywhere they please.",
  "You have real substance — there is depth to you, not just a polished surface — and the people who look closely can tell. But you keep offering plain facts when others need something to see, and so your depth goes unwitnessed. You disdain spectacle as shallow, but your refusal to be seen is really a fear of putting yourself fully on display.",
  "You are independent-minded, and you think for yourself in a way that is genuinely rare and valuable. But you say every contrary thought aloud, including the many that cost you nothing to keep to yourself. You confuse honesty with broadcasting, and your need to be visibly different keeps locking you out of the very rooms you were built to run.",
  "You are calm, and you value peace — that steadiness soothes the people lucky enough to be around you. But you wait for still water before you act, and still water is exactly where the fish hide from you. Your aversion to conflict looks like maturity, but it is really how you avoid the churning chaos where your real chances have always lived.",
  "You are generous, and you know how to appreciate a gift — that keeps your heart open in a closing world. But you reach for what is free and pay for it later in ways you never see coming. You undervalue whatever comes to you easily, including yourself, and that is the precise reason people keep managing to get you cheap.",
  "You admire excellence, and you learn eagerly from those above you — that humility serves you better than you realize. But you keep trying to fill a shadow far larger than your own, forever measuring yourself against giants. You are so busy comparing that you never leave your own mark, and the imitation is quietly erasing the original you were meant to be.",
  "You are diplomatic, and you try to win everyone over — that patience with people is a real and tiring virtue. But you fight the whole crowd when you should simply remove the one who leads it, exhausting yourself on every battle but the decisive one. You scatter your force out of a wish to be liked by all, and so, in the end, you defeat no one.",
  "You are direct, and you do not manipulate — that straightness is honorable and others feel safe in it. But you keep demanding with a half-closed fist what you could so easily win with an open hand. You reach for control before connection, and people obey you grudgingly when they could have followed you gladly to the ends of the earth.",
  "You are responsive in a feeling, human way — you are not cold, and people warm to that. But you react in exactly the manner expected of you, every single time, and that predictability hands the controls straight to anyone watching. You wear your responses plainly on your face, and anyone patient enough can play you like a familiar instrument.",
  "You are visionary, and you want the world to be better — that idealism is rare and genuinely good. But you demand sweeping change all at once and frighten everyone into digging in against you. You have no patience for the slow turning of the wheel, and your impatience keeps strangling the very futures you can so clearly imagine.",
  "You hold yourself to a high standard, and that self-discipline is genuinely admirable. But you strain to appear flawless, and flawlessness breeds only envy and distance in the people around you. You armor yourself so completely that no one can get near, and the perfection you chase is really just a fear of being seen exactly as you are.",
  "You are ambitious and driven, and that hunger has carried you to places other people only talk about. But you win and then keep grasping past the win until it sours in your hands. You do not know how to stop, because stopping feels too much like dying, and that not-knowing keeps turning your hard-won victories into losses.",
  "You are loyal to your plans, and you value certainty — that steadiness is a genuine strength in a chaotic world. But you cling to fixed shapes that the world keeps quietly dissolving, and your need for a hard yes or no is that very grip made visible. You fear formlessness because it feels like losing yourself, when it is the one thing that could finally set you free.",
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
  const catIntro = catIntros[(hsh >> 9) % catIntros.length];

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
          <p>{catIntro}</p>
          <p className="pt-2 text-white/95">
            Well — the question you asked says a lot about you.
          </p>
          <p>{reading}</p>
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
