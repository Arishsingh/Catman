"use client";

import { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useTransform,
  animate,
} from "motion/react";
import { useLenis } from "lenis/react";

export function IntroLoader({ duration = 2.2 }: { duration?: number }) {
  const [done, setDone] = useState(false);
  const lenis = useLenis();

  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));
  const width = useTransform(count, (v) => `${v}%`);

  useEffect(() => {
    lenis?.stop();
    const controls = animate(count, 100, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onComplete: () => {

        setTimeout(() => setDone(true), 250);
      },
    });
    return () => controls.stop();
  }, [count, duration, lenis]);

  return (
    <AnimatePresence onExitComplete={() => lenis?.start()}>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col justify-center items-center bg-black text-white"
          exit={{ y: "-100%" }}
          transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
        >
          <motion.span
            className="font-mono text-[18vw] leading-none tracking-tighter sm:text-[12vw]"
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.5, ease: "easeIn" }}
          >
            <motion.span>{rounded}</motion.span>
          </motion.span>

          <div className="mt-8 h-px w-[60vw] max-w-md overflow-hidden bg-white/20">
            <motion.div className="h-full bg-white" style={{ width }} />
          </div>

          <motion.span
            className="mt-6 text-xs uppercase tracking-[0.3em] text-white/50"
            exit={{ opacity: 0 }}
          >
            Loading
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
