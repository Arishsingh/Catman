"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useLenis } from "lenis/react";

const items = ["Home"];

// smooth easing for the bars morph
const morph = { duration: 0.4, ease: [0.45, 0, 0.2, 1] as const };

export function Menu() {
  const [open, setOpen] = useState(false);
  const lenis = useLenis();

  // lock smooth scroll while the menu is open
  useEffect(() => {
    if (open) lenis?.stop();
    else lenis?.start();
  }, [open, lenis]);

  const bar = "absolute left-0 h-[2.5px] w-10 bg-white";

  return (
    <>
      {/* hamburger <-> X morphing button (stays above the overlay) */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close menu" : "Open menu"}
        className="relative z-[110] h-6 w-10"
      >
        <motion.span
          className={bar}
          style={{ top: 0 }}
          animate={open ? { y: 11, rotate: 45 } : { y: 0, rotate: 0 }}
          transition={morph}
        />
        <motion.span
          className={bar}
          style={{ top: 11 }}
          animate={open ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
          transition={morph}
        />
        <motion.span
          className={bar}
          style={{ top: 22 }}
          animate={open ? { y: -11, rotate: -45 } : { y: 0, rotate: 0 }}
          transition={morph}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[90] bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {/* nav items, right-aligned, staggered in from the right */}
            <nav className="flex h-full flex-col items-end gap-3 px-5 pt-28 sm:px-9">
              {items.map((label, i) => (
                <motion.a
                  key={label}
                  href="#"
                  onClick={() => setOpen(false)}
                  className="bg-white/10 px-3 py-1 font-mono text-base whitespace-nowrap transition-colors hover:bg-white/20 sm:text-lg"
                  initial={{ x: 60, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 60, opacity: 0 }}
                  transition={{
                    delay: 0.12 + i * 0.07,
                    duration: 0.5,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  {label}
                </motion.a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
