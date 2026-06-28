"use client";

import { useEffect, useRef } from "react";
import { motion, cubicBezier } from "motion/react";

const easeOutExpo = cubicBezier(0.16, 1, 0.3, 1);

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

const categoryLore: Record<string, { body: string; close: string }> = {
  FEAR: {
    body: "They move outward through the dark, carrying faint tremors that pass over fur and floor and the long quiet of the room. Cats, like us, know fear. They freeze at a sound that may be nothing, or melt into stillness when they sense a threat hiding in the shadows. In rooms shaped by night and instinct, anxiety can bend perception — part instinct, part distortion, amplifying what may not be here, or may not be now.",
    close: "Our fears speak as much about us as about the world. They shape what we expect long before anything arrives.",
  },
  AROUSAL: {
    body: "They ripple out like a held breath finally let go, a quickening that travels through whisker and spine. A cat in arousal is all coiled attention — pupils wide, body low, every sense pulled taut toward a single point in the dark. It is the moment before the pounce, when the whole animal becomes a question aimed at one answer.",
    close: "What stirs us reveals what we want. Arousal is desire with the mask briefly off, telling the truth before we can dress it up.",
  },
  TERRITORY: {
    body: "They spread to the edges of the known and stop, marking a boundary only the cat can see. A cat maps its world in scent and shadow, claiming corners, doorways, the warm square of light by the window. What it guards, it guards completely; what lies beyond the line, it watches with one half-closed eye.",
    close: "What we defend says what we fear to lose. Territory is love and anxiety wearing the same fur.",
  },
  SOLICITATION: {
    body: "They reach outward in soft, deliberate waves, a quiet asking dressed as indifference. A cat solicits without ever seeming to need — the slow blink, the brush against a leg, the sound pitched just for human ears. It has learned that the surest way to be given to is to appear not to want.",
    close: "How we ask reveals how we love. Solicitation is the wanting we hide inside a gesture, hoping to be read.",
  },
  ATTENTION: {
    body: "They move out in measured rings, each one a small demand to be noticed. A cat decides where attention goes and withholds its own like currency, granting a glance, a presence, a weight in your lap only when it chooses. To be watched by a cat is to be chosen; to be ignored is its own quiet verdict.",
    close: "What we give attention to becomes our life. The cat spends its gaze carefully — we rarely do.",
  },
  ATTRACTION: {
    body: "They pull inward as much as out, a current drawing things toward a center. A cat is drawn by warmth, by motion, by the half-seen thing that will not hold still — and it draws others the same way, by being just out of reach. Attraction, for a cat, is a kind of gravity it never has to explain.",
    close: "What pulls at us shows what we are missing. Attraction is the shape of an absence, reaching for its fit.",
  },
  ECHOLOCATION: {
    body: "They travel out into the dark and come back changed, carrying the shape of everything they touched. A cat reads the room in ways you cannot — the tremor underfoot, the shift of air, the sound beneath the sound. It builds a map of the unseen and moves through it without doubt, certain of a world you can only guess at.",
    close: "We, too, send questions into the dark and listen for what returns. The answer is always partly the shape of the asking.",
  },
};

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

const numberWords = [
  "zero", "one", "two", "three", "four",
  "five", "six", "seven", "eight", "nine",
];

const lawReadings = [
  "You dim yourself around everyone you admire and call it humility, but it is just fear wearing a polite face. You have trained the whole world to expect your shadow and never your light, and it learned the lesson well — no one waits for you to shine anymore. You are forgettable on purpose, and the worst part is how successfully it has worked.",
  "You keep handing your warmth to people who showed you exactly who they were years ago, because being alone frightens you more than being used. You are too soft to be respected and too desperate to notice the difference. They keep you close for one reason: you never make them earn a thing.",
  "You tell everyone your plans the moment you have them, as if saying it out loud might make you matter. It doesn't — it just hands sharper people the map to walk in ahead of you. You would rather be heard than win, and that is precisely why you keep losing.",
  "You talk and talk, mistaking the noise for presence, and people stopped listening long before you noticed. Every word you spill trying to be understood makes you smaller in the room. You fear silence because in silence you would have to face how little you actually have to say.",
  "You let everyone else write your story while you stay busy being agreeable, and now your name means only whatever they felt like deciding. You are too passive to defend it and too proud to ask anyone for help. You will be remembered, if at all, as a footnote in someone else's life.",
  "You beg for attention and then panic the instant it arrives, so you end up with neither the spotlight nor any peace. You live in the doorway, never chosen, always almost. That ache you carry everywhere is one you keep feeding yourself, and then calling unfair.",
  "You do the work and watch louder people take the bow, and you whisper that it's fine. It is not fine. You are a tool that others use and thank quietly, and you have convinced yourself that being used is the same thing as being valued.",
  "You chase everyone, always first to reach, always the one crossing the room, and the people in your life have learned they never need to lift a finger for you. You think all that effort makes you worthy. It only makes you convenient.",
  "You argue to be right and walk away having lost everything but the argument. You need the last word more than you need the outcome, and that need has emptied rooms of people who used to like you. You mistake being correct for being respected, and you are neither.",
  "You keep feeding the people and worries that drain you and call your exhaustion loyalty. You are drowning in lives that were never yours, and you waded into every one of them yourself, because being needed is the only kind of worth you trust. It is killing you slowly, on schedule.",
  "You give yourself away for free and then wonder why you are so easy to set down. You made yourself disposable and handed everyone the receipt. You are used by many and chosen by no one, and somewhere you already know it.",
  "Your kindness comes with a price tag you pretend not to see, and the quiet dishonesty of it is rotting you from the inside out. You want to be good and you want to win, and you have the nerve for neither. So you do a cheap imitation of both and fool only yourself.",
  "You ask for help by begging for pity, and pity is exactly why no one takes you seriously. You think your neediness is endearing; it is tiring, and people help you mostly to make you go away. You confuse being pathetic with being humble.",
  "You watch everyone from behind a friendly face and call your suspicion wisdom. You trust no one, least of all yourself, and the loneliness of that is entirely your own doing. You built the wall, and now you complain about the view.",
  "You leave every fight half-finished because finishing things makes you uncomfortable, and your unfinished business always comes back to collect with interest. Your mercy is not kindness. It is cowardice, and you dressed it up in soft words to help yourself sleep.",
  "You are always there, always available, and so no one ever misses you or wants you. You confuse showing up with mattering. You would cross a city for people who would not cross the room for you, and you call that love.",
  "You are so predictable that anyone can manage you half-asleep. You cling to your routines because the unknown terrifies you, and you have mistaken the cage for a home. The most interesting thing about you is how reliably dull you have agreed to be.",
  "You wall yourself off and call it peace, then ask the dark for what you are too scared to ask a person. Your loneliness is not strength and it is not depth. It is just loneliness, quietly eating the years you keep telling yourself you still have.",
  "You waste your sharpness on the wrong people and make enemies you never needed, all to feel briefly, uselessly right. You react before you think, every time. Your own mouth has cost you more than any failure ever did, and you have learned nothing.",
  "You commit fast and hard to anyone who will have you, because being alone scares you more than being trapped does. Your loyalty is not devotion — it is fear, and everyone who uses you can smell it on you from across the room.",
  "You need everyone to know how clever you are, and that need is the single dumbest thing about you. You would rather be admired than effective, and your vanity tips your hand before you have even played it. You outsmart yourself constantly and blame the room.",
  "You fight hardest exactly when you are losing, because your pride cannot survive a single yield. So you break instead, over and over, and call the wreckage strength. You have confused refusing to bend with being unbreakable, and you are neither.",
  "You spread yourself across everything because committing to one thing would mean admitting you could fail at it. So you fail at all of them slowly, and call it being well-rounded. Nothing you touch ever gets the full weight of you, including your own life.",
  "You are too proud to charm and too rigid to adapt, and you lose to people half as capable while telling yourself it is integrity. It is not integrity. It is stubbornness, and it has kept you smaller than your talent your entire life.",
  "You let the world decide who you are and then ask it to please confirm the verdict. You are waiting for permission to exist as yourself, and that wait is a surrender you will keep calling patience right up until the end.",
  "You do everyone's dirty work and wear the stains while they stay spotless, and you call it being responsible. It is martyrdom, and no one is impressed by it. The guilt you carry has done you more damage than any sin you were ever afraid of committing.",
  "You hand your faith to whoever sounds most certain — tonight, that is a cat in the dark. You cannot sit with not knowing for ten seconds, and that weakness makes you the easiest person in any room to lead and to fool. You call your gullibility an open mind.",
  "You hesitate at the edge of everything and call it being careful. It is cowardice in a more respectable coat. You have lost more to your own flinching than to any mistake you were too afraid to make — and you are about to flinch again.",
  "You start things you never finish because the thrill of beginning is all you can actually stomach. Your life is a hallway of half-opened doors, and you call that being spontaneous. You have left a trail of almost behind you, and you are still proud of the energy.",
  "You make sure everyone sees how hard you are trying, as if exhaustion were proof of worth. It only makes you look weak beside the people who win without breaking a sweat. Your strain is not noble. It is a plea for credit you are too insecure to stop making.",
  "You play with cards other people dealt you and call the loss fate. You are too passive to shape anything, and you have trained yourself to mistake surrender for being easygoing. The game is being played around you, on you, and never by you.",
  "You hand people dull truth and then watch them follow louder, emptier voices instead. You call it honesty, but it is really a fear of trying to inspire and being exposed as ordinary. So you stay safe, and stay ignored, and resent both.",
  "You push people where they are strongest and wonder why nothing ever moves. You refuse to aim where it would actually count because it feels manipulative, and that squeamishness is the whole reason you have no power. You keep your hands clean and your life empty.",
  "You beg the world for permission to feel worthy, and the begging is in everything you do, this question included. You will wait your entire life for a crown someone else must place on your head, never once noticing that no one is coming to place it.",
  "Your timing is always wrong — too early from panic, too late from doubt — because you move from your feelings instead of from the moment. The world keeps leaving without you while you stand there reacting to the door it already shut. You are perpetually one beat behind your own life.",
  "You chase what you cannot have until the wanting openly humiliates you, and still you cannot let go. That leash is in plain sight, and anyone who notices it can drag you anywhere they like. Your inability to walk away is the easiest thing about you to use.",
  "You refuse to be seen and call it depth, but it is just fear of being looked at and found lacking. So you go unnoticed, and then you comfort yourself that the unnoticed are the deep ones. They are not. They are mostly just hidden, like you.",
  "You announce every contrary thought you have, including the worthless ones, just to feel different from everyone else. That need has locked you out of every room you might have run. Being a contrarian is not a personality, and disagreeing is not the same as mattering.",
  "You wait for calm before you act, and calm is exactly where you have no chance. You call your avoidance maturity, but it is just how you dodge the chaos where you would actually have to compete. You mistake standing still for staying above it.",
  "You grab whatever is free and pay for it later in ways you never see coming. You undervalue everything that comes to you easily, starting with yourself, which is the precise reason people keep getting you cheap. You are a bargain, and you taught them the price.",
  "You measure yourself against giants and then wonder why you feel so small. You are so busy imitating that you have never once been yourself, and the original you might have become is already mostly gone. You are a copy of people who were not even that impressive.",
  "You fight the whole crowd trying to be liked by all of them, and so you defeat none of them. You scatter your force to avoid making a single enemy, and the result is that you make no mark at all. Everyone tolerates you, and no one fears you.",
  "You demand with a fist what you could win with an open hand, and then act wounded when people obey you grudgingly. You reach for control because you do not believe anyone would follow you willingly. You are right about that, and it is your own doing.",
  "You react exactly the way everyone expects, every single time, so anyone with a little patience can play you like a cheap instrument. Your entire inner life is written on your face, and you call that being genuine. It just means you have no defenses left.",
  "You demand that everything change at once and frighten everyone into digging in against you. You have no patience, and your impatience strangles every future you can almost see. You want the harvest tonight and wonder why nothing you plant survives.",
  "You strain to look flawless and breed nothing but envy and distance in everyone near you. The armor is so thick that no one can reach you, and the perfection you chase is just naked terror of being seen as you actually are. No one envies a statue; they just stop visiting it.",
  "You win and then keep grabbing until it rots in your hands, because stopping feels too much like dying to you. You do not know when enough is enough, and that hunger turns everything you earn back into loss. You cannot tell the difference between ambition and a wound.",
  "You cling to fixed plans the world keeps dissolving, and your need for a clean yes or no is just the white-knuckle grip of someone terrified of losing control. You would rather be rigid and wrong than fluid and free. So you stay wrong, and you stay safe, and you stay stuck.",
];

const fade = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.4 + i * 0.15, duration: 0.8, ease: easeOutExpo },
  }),
};

function Cross({ className }: { className: string }) {
  return (
    <span className={`pointer-events-none absolute text-white/40 ${className}`}>
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M9 0V18M0 9H18" stroke="currentColor" strokeWidth="1" />
      </svg>
    </span>
  );
}

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
  const rippleWord = numberWords[num] ?? String(num);
  const lore = categoryLore[word];

  return (
    <motion.div
      className="fixed inset-0 z-[50] overflow-y-auto bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.9, ease: "easeInOut" }}
    >
      <MapCluster />

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

      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 35%, rgba(255,255,255,0.05), transparent 60%)",
        }}
      />

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
          <p>
            The Cat Cloud answered with {rippleWord} ripple{num === 1 ? "" : "s"}.
          </p>
          <p>look — {lore.body}</p>
          <p className="text-white/50">{lore.close}</p>
          <p className="pt-2">btw {reading}</p>
        </motion.div>

        <motion.div
          custom={4}
          variants={fade}
          initial="hidden"
          animate="show"
          className="mt-16 border-t border-white/15 pt-10 text-center"
        >
          <p className="font-mono text-sm uppercase tracking-[0.2em] text-white/70">
            so — the answer to your question is
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
