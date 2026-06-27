"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import { GifLoader } from "@/components/gif-loader";
import { Menu } from "@/components/menu";
import { EchoWave } from "@/components/echo-wave";
import { CatCloudScene } from "@/components/cat-cloud-scene";
import { ResultScreen } from "@/components/result-screen";

// content fades in just as the loader finishes
const REVEAL_DELAY = 3.3;

type Phase = "input" | "wave" | "result";

/** synthesized "sonar" echo — three decaying pings, no audio file needed */
function playSonar() {
  try {
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    const ctx = new Ctx();
    const now = ctx.currentTime;
    [0, 0.45, 0.9].forEach((delay, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(620 - i * 120, now + delay);
      osc.frequency.exponentialRampToValueAtTime(220, now + delay + 0.5);
      gain.gain.setValueAtTime(0.0001, now + delay);
      gain.gain.exponentialRampToValueAtTime(0.18 - i * 0.04, now + delay + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + 0.9);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now + delay);
      osc.stop(now + delay + 1);
    });
    setTimeout(() => ctx.close(), 3000);
  } catch {
    /* audio not available — ignore */
  }
}

export default function Home() {
  const [question, setQuestion] = useState("");
  const [phase, setPhase] = useState<Phase>("input");

  // drop count from question length: > 5 words -> 4 drops, else 3 drops
  const wordCount = question.trim().split(/\s+/).filter(Boolean).length;
  const drops = wordCount > 5 ? 4 : 3;

  // safety fallback in case the ripple's onComplete never fires
  useEffect(() => {
    if (phase !== "wave") return;
    const t = setTimeout(() => setPhase("result"), 15000);
    return () => clearTimeout(t);
  }, [phase]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    playSonar();
    setPhase("wave");
  };

  const restart = () => {
    setQuestion("");
    setPhase("input");
  };

  return (
    <div className="app-wrapper relative min-h-svh bg-black text-white">
      <GifLoader />

      {/* header (stays above the experience) */}
      <motion.header
        className="fixed left-0 top-0 z-[60] flex w-full items-center justify-between px-6 pt-10 pb-6 sm:px-12 sm:pt-16 sm:pb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: REVEAL_DELAY, duration: 0.8 }}
      >
        <span className="font-['Maiden_Orange'] text-base font-bold uppercase tracking-[0.35em] sm:text-lg">
          Cat Cloud
        </span>
        <Menu />
      </motion.header>

      {/* ambient 3D cloud behind the input phase */}
      <AnimatePresence>
        {phase === "input" && (
          <motion.div
            key="cloud"
            className="pointer-events-none fixed inset-0 z-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: REVEAL_DELAY, duration: 1.4 }}
          >
            <CatCloudScene className="h-full w-full" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* INPUT phase */}
      <AnimatePresence>
        {phase === "input" && (
          <motion.main
            key="input"
            className="relative z-10 flex min-h-svh flex-col items-center justify-center px-6"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.h1
              className="text-center font-['Maiden_Orange'] font-bold uppercase leading-[1.3] tracking-[0.12em] [word-spacing:0.3em] text-3xl sm:text-5xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: REVEAL_DELAY, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              If you could<span className="-ml-[0.12em]">,</span>
              <br />
              what would you ask a cat?
            </motion.h1>

            <motion.form
              onSubmit={submit}
              className="mt-24 w-full max-w-[1600px]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: REVEAL_DELAY + 0.15,
                duration: 0.9,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {/* question input — the underline */}
              <input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                autoFocus
                aria-label="Your question"
                className="w-full border-b border-white/70 bg-transparent pb-4 text-center font-mono text-xl caret-white outline-none focus:border-white"
              />

              {/* instructions */}
              <div className="mt-10 space-y-6 text-center font-mono text-lg leading-relaxed text-white">
                <p>Type a question that can be answered by YES or NO.</p>
                <p className="mx-auto max-w-5xl text-white/90">
                  Your question to cats can be about them, about you, about the
                  universe, or about anything you would like to ask another
                  species if they could speak back to you.
                </p>
              </div>
            </motion.form>
          </motion.main>
        )}
      </AnimatePresence>

      {/* language toggle (input only) */}
      <AnimatePresence>
        {phase === "input" && (
          <motion.button
            key="lang"
            className="fixed bottom-6 left-6 z-50 bg-white px-2 py-1 font-mono text-sm font-medium text-black sm:bottom-8 sm:left-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: REVEAL_DELAY + 0.3, duration: 0.8 }}
          >
            ES
          </motion.button>
        )}
      </AnimatePresence>

      {/* EXPERIENCE: black wash -> ripple -> result */}
      <AnimatePresence>
        {phase === "wave" && (
          <motion.div
            key="wave"
            className="fixed inset-0 z-[40] bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1.2 }}
            >
              <EchoWave
                className="h-full w-full"
                drops={drops}
                onComplete={() => setPhase("result")}
              />
            </motion.div>

            <motion.p
              className="absolute left-1/2 top-[18%] -translate-x-1/2 font-mono text-sm uppercase tracking-[0.35em] text-white/70"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            >
              Listening…
            </motion.p>
          </motion.div>
        )}

        {phase === "result" && (
          <ResultScreen key="result" question={question} onRestart={restart} />
        )}
      </AnimatePresence>
    </div>
  );
}
