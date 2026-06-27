"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useLenis } from "lenis/react";

export function LogoReveal({
  src = "/logo.svg",
  cycles = 4,
  hold = 600,
}: {
  src?: string;

  cycles?: number;

  hold?: number;
}) {
  const [done, setDone] = useState(false);
  const lenis = useLenis();

  const growIn = 700;

  useEffect(() => {
    lenis?.stop();
    const timer = setTimeout(() => setDone(true), growIn * cycles + hold);
    return () => clearTimeout(timer);
  }, [cycles, hold, lenis]);

  const maskStyle = {
    backgroundColor: "#ffffff",
    WebkitMaskImage: `url(${src})`,
    maskImage: `url(${src})`,
    WebkitMaskRepeat: "no-repeat",
    maskRepeat: "no-repeat",
    WebkitMaskPosition: "center",
    maskPosition: "center",
    WebkitMaskSize: "contain",
    maskSize: "contain",
  } as const;

  return (
    <AnimatePresence onExitComplete={() => lenis?.start()}>
      {!done && (
        <motion.div
          key="logo-reveal"
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-black"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <motion.div
            className="size-[clamp(140px,28vmin,320px)] will-change-transform"
            style={maskStyle}
            initial={{ scale: 0.06, opacity: 0 }}
            animate={{ scale: [0.06, 1], opacity: [0, 1] }}
            transition={{
              duration: growIn / 1000,
              ease: [0.16, 1, 0.3, 1],
              repeat: cycles - 1,
              repeatType: "loop",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
