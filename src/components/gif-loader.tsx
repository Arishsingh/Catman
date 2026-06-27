"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useLenis } from "lenis/react";

/**
 * Full-screen GIF loader. Shows `public/loader.gif` centered on black, then
 * fades out to reveal the page. Scroll (Lenis) is locked until it finishes.
 */
export function GifLoader({
  src = "/loader.gif",
  duration = 3200,
}: {
  src?: string;
  /** how long the loader stays before fading, in ms */
  duration?: number;
}) {
  const [done, setDone] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    lenis?.stop();
    const timer = setTimeout(() => setDone(true), duration);
    return () => clearTimeout(timer);
  }, [duration, lenis]);

  return (
    <AnimatePresence onExitComplete={() => lenis?.start()}>
      {!done && (
        <motion.div
          key="gif-loader"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt="Loading"
            className="w-[min(70vw,520px)] select-none"
            draggable={false}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
