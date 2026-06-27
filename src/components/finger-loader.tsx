"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useLenis } from "lenis/react";

export function FingerLoader({ duration = 3000 }: { duration?: number }) {
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
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-8 bg-[#fdfaf6]"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <DrummingHand />
          <LoadingText />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function DrummingHand({ size = 180 }: { size?: number }) {

  const fingers = [
    { x: 38, h: 132 },
    { x: 74, h: 140 },
    { x: 110, h: 136 },
    { x: 146, h: 124 },
  ];

  const fingerWidth = 30;
  const topY = 26;
  const step = 0.14;
  const tap = 0.42;
  const period = fingers.length * step + 0.28;

  return (
    <svg
      width={size}
      height={size * 0.78}
      viewBox="0 0 220 172"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <motion.ellipse
        cx="110"
        cy="158"
        rx="92"
        ry="11"
        fill="#000"
        opacity={0.12}
        animate={{ rx: [92, 80, 92], opacity: [0.12, 0.08, 0.12] }}
        transition={{ duration: period, repeat: Infinity, ease: "easeInOut" }}
      />

      <rect
        x="30"
        y={topY - 4}
        width="156"
        height="44"
        rx="22"
        fill="#e07f33"
        stroke="#5a3417"
        strokeWidth="5"
      />

      <g transform="rotate(28 182 96)">
        <rect
          x="170"
          y="78"
          width="62"
          height="30"
          rx="15"
          fill="#e07f33"
          stroke="#5a3417"
          strokeWidth="5"
        />
        <rect x="178" y="84" width="34" height="8" rx="4" fill="#f3a866" />
      </g>

      {fingers.map((f, i) => (
        <motion.g
          key={i}
          style={{ transformOrigin: `${f.x + fingerWidth / 2}px ${topY}px` }}
          animate={{ rotate: [0, -24, 0] }}
          transition={{
            duration: tap,
            ease: [0.45, 0, 0.55, 1] as [number, number, number, number],
            repeat: Infinity,
            repeatDelay: period - tap,
            delay: i * step,
          }}
        >
          <rect
            x={f.x}
            y={topY}
            width={fingerWidth}
            height={f.h}
            rx={fingerWidth / 2}
            fill="#e07f33"
            stroke="#5a3417"
            strokeWidth="5"
          />
          <rect
            x={f.x + 6}
            y={topY + 12}
            width="8"
            height={f.h - 40}
            rx="4"
            fill="#f3a866"
          />
        </motion.g>
      ))}
    </svg>
  );
}

function LoadingText() {
  const letters = "LOADING".split("");
  return (
    <div className="flex gap-[2px] text-2xl font-extrabold tracking-wider text-[#4a2c16]">
      {letters.map((ch, i) => (
        <motion.span
          key={i}
          animate={{ opacity: [0.35, 1, 0.35], y: [0, -3, 0] }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.1,
          }}
        >
          {ch}
        </motion.span>
      ))}
    </div>
  );
}
