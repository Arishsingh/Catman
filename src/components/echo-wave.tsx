"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const MAX_RIPPLES = 10; // how many overlapping ripples can coexist

/**
 * WebGL "echolocation" ripple driven by falling drops in water.
 * Drops fall one after another and keep looping smoothly — each impact spawns
 * a ripple that overlaps and decays naturally alongside the others (no cut-off).
 * After the configured number of drops, `onComplete` fires.
 */
export function EchoWave({
  className,
  drops = 3,
  onComplete,
}: {
  className?: string;
  drops?: number;
  onComplete?: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    let w = window.innerWidth;
    let h = window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, w / h, 0.1, 200);
    camera.position.set(0, 9, 30);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h);
    container.appendChild(renderer.domElement);

    // ---- grid of points on the XZ plane ----
    const SIZE = 64;
    const SEG = 220;
    const count = SEG * SEG;
    const positions = new Float32Array(count * 3);
    let p = 0;
    for (let ix = 0; ix < SEG; ix++) {
      for (let iz = 0; iz < SEG; iz++) {
        positions[p++] = (ix / (SEG - 1) - 0.5) * SIZE;
        positions[p++] = 0;
        positions[p++] = (iz / (SEG - 1) - 0.5) * SIZE;
      }
    }
    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    // ring buffer of impact times shared with the shader
    const impacts: number[] = new Array(MAX_RIPPLES).fill(-100);

    const material = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uImpacts: { value: impacts },
        uSize: { value: 130 * Math.min(window.devicePixelRatio, 2) },
        uAmp: { value: 6.5 },
      },
      vertexShader: /* glsl */ `
        #define MAX ${MAX_RIPPLES}
        uniform float uTime;
        uniform float uImpacts[MAX];
        uniform float uSize;
        uniform float uAmp;
        varying float vB;

        void main() {
          vec3 pos = position;
          float r = length(pos.xz);

          float disp = 0.0;
          float crest = 0.0;

          // sum every active ripple so they overlap & fade naturally
          for (int i = 0; i < MAX; i++) {
            float imp = uImpacts[i];
            if (imp < -50.0) continue;
            float td = uTime - imp;
            if (td < 0.0) continue;

            float front  = td * 11.0;                          // expanding front
            float inside = smoothstep(front, front - 10.0, r); // waves within circle
            float ampR   = 1.0 / (1.0 + r * 0.12);             // spread / distance decay
            float osc    = sin(r * 0.95 - td * 7.5);           // concentric rings
            float tDecay = exp(-td * 0.5);                      // calms over time
            float waves  = osc * inside * ampR * tDecay;

            // gentle central splash + rebound at impact (kept low so no tall peak)
            float splash = exp(-r * r * 0.06) * exp(-td * 5.0) * (1.0 - exp(-td * 40.0));

            disp += uAmp * waves + uAmp * 0.45 * splash;
            crest += max(waves, 0.0) + max(splash, 0.0);
          }

          // faint ambient breathing so the surface is never fully still
          float center = smoothstep(34.0, 0.0, r);
          float ambient = 0.10 * sin(r * 0.25 - uTime * 1.2) * center;
          disp += ambient;

          pos.y = disp;
          vB = 0.10 + crest * 0.95 + abs(ambient) * 0.4;

          vec4 mv = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = uSize * (0.4 + crest * 1.1) / -mv.z;
        }
      `,
      fragmentShader: /* glsl */ `
        varying float vB;
        void main() {
          vec2 c = gl_PointCoord - 0.5;
          if (dot(c, c) > 0.25) discard;
          gl_FragColor = vec4(vec3(1.0), min(vB, 1.0));
        }
      `,
    });
    const points = new THREE.Points(geom, material);
    scene.add(points);

    // ---- falling drop (soft glow sprite) ----
    const glowCanvas = document.createElement("canvas");
    glowCanvas.width = glowCanvas.height = 64;
    const gctx = glowCanvas.getContext("2d");
    if (gctx) {
      const grad = gctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, "rgba(255,255,255,1)");
      grad.addColorStop(0.3, "rgba(255,255,255,0.85)");
      grad.addColorStop(1, "rgba(255,255,255,0)");
      gctx.fillStyle = grad;
      gctx.fillRect(0, 0, 64, 64);
    }
    const dropTex = new THREE.CanvasTexture(glowCanvas);
    const dropMat = new THREE.SpriteMaterial({
      map: dropTex,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const drop = new THREE.Sprite(dropMat);
    drop.scale.set(1.4, 2.0, 1);
    drop.visible = false;
    scene.add(drop);

    const onResize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    // ---- drop timing ----
    const t0 = 0.4; // first drop delay
    const fallDur = 0.8; // fall time
    const period = 1.7; // time between drops
    const settle = 2.4; // calm time after the configured drops
    const fallTop = 18;
    const N = Math.max(1, drops);
    const lastImpact = t0 + (N - 1) * period + fallDur;

    let recorded = -1; // last cycle whose impact was logged
    let writePtr = 0;
    let completed = false;
    const start = performance.now();
    let raf = 0;

    const animate = () => {
      const t = (performance.now() - start) / 1000;
      material.uniforms.uTime.value = t;

      drop.visible = false;
      if (t >= t0) {
        const cyc = Math.floor((t - t0) / period); // keeps counting -> loops forever
        const cycleStart = t0 + cyc * period;
        const localT = t - cycleStart;

        if (localT < fallDur) {
          // drop is falling toward the surface
          const f = localT / fallDur;
          drop.visible = true;
          drop.position.set(0, fallTop * (1 - f * f), 0);
          dropMat.opacity = Math.min(1, f * 2.2);
        }

        // log the impact once, when this drop lands
        if (localT >= fallDur && cyc > recorded) {
          recorded = cyc;
          impacts[writePtr % MAX_RIPPLES] = cycleStart + fallDur;
          writePtr++;
        }
      }

      camera.position.x = Math.sin(t * 0.12) * 2.0;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);

      if (!completed && t > lastImpact + settle) {
        completed = true;
        onCompleteRef.current?.();
      }
      raf = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      geom.dispose();
      material.dispose();
      dropTex.dispose();
      dropMat.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [drops]);

  return <div ref={ref} className={className} />;
}
