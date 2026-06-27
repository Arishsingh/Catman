"use client";

import { EchoCinematic } from "@/components/echo-cinematic";

export default function LoopPage() {
  return (
    <main className="relative h-svh w-full overflow-hidden bg-black text-white">
      <EchoCinematic className="absolute inset-0" />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 50%, transparent 55%, rgba(0,0,0,0.85) 100%)",
        }}
      />

      <div
        className="pointer-events-none absolute inset-0"
        style={{ animation: "echoFlicker 4s steps(1, end) infinite" }}
      >
        <div className="absolute left-8 top-7 font-['Share_Tech'] text-[11px] uppercase tracking-[0.4em] text-white/70">
          Bat Cloud
        </div>
        <div className="absolute right-8 top-8 flex flex-col gap-[3px]">
          <span className="block h-px w-5 bg-white/60" />
          <span className="block h-px w-5 bg-white/60" />
          <span className="block h-px w-5 bg-white/60" />
        </div>
        <div className="absolute left-8 bottom-7 font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
          ECHOLOCATION · MAP
        </div>
        <div className="absolute right-8 bottom-7 font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
          SONAR / 04
        </div>

        <svg
          viewBox="0 0 400 400"
          aria-hidden
          className="absolute left-1/2 top-1/2 h-[82vmin] w-[82vmin] -translate-x-1/2 -translate-y-1/2 opacity-60"
          style={{ animation: "echoSpin 60s linear infinite" }}
        >
          <circle cx="200" cy="200" r="196" fill="none" stroke="white" strokeOpacity="0.10" />
          {Array.from({ length: 72 }).map((_, i) => {
            const long = i % 6 === 0;
            return (
              <line
                key={i}
                x1="200"
                y1="4"
                x2="200"
                y2={long ? 16 : 10}
                stroke="white"
                strokeOpacity={long ? 0.45 : 0.18}
                strokeWidth="1"
                transform={`rotate(${i * 5} 200 200)`}
              />
            );
          })}
        </svg>

        <div
          className="absolute left-1/2 top-1/2 h-px w-[72vmin] -translate-x-1/2 bg-gradient-to-r from-transparent via-white/40 to-transparent"
          style={{ animation: "echoScan 8s ease-in-out infinite" }}
        />

        <div
          className="absolute left-1/2 top-[34%] w-[min(90vw,760px)] -translate-x-1/2 -translate-y-1/2 text-center"
          style={{ animation: "cineQuestion 20s ease-in-out infinite, cineGlitch 20s linear infinite" }}
        >
          <div style={{ animation: "cineTextFlicker 3.4s ease-in-out infinite" }}>
            <h1 className="font-['Share_Tech'] text-2xl font-bold uppercase leading-[1.4] tracking-[0.2em] [word-spacing:0.3em] sm:text-4xl">
              If you could<span className="-ml-[0.12em]">,</span>
              <br />
              what would you ask a bat?
            </h1>

            <div className="mx-auto mt-10 h-px w-[70%] bg-white/60" />

            <div className="mt-6 flex items-center justify-center gap-1 font-mono text-[11px] tracking-wide text-white/55">
              <span>Type a question that can be answered by YES or NO.</span>
              <span
                className="inline-block h-4 w-px bg-white"
                style={{ animation: "cineCursor 20s steps(1, end) infinite" }}
              />
            </div>
          </div>
        </div>
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-screen"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: "160px 160px",
          animation: "echoTick 0.4s steps(2) infinite",
        }}
      />
    </main>
  );
}
