"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const LOOP = 20; // seconds

/**
 * Cinematic echolocation sequence (loops every 20s):
 *  0-5s  field hidden (question screen handled by HUD)
 *  5-7s  tiny cluster expands into a flat elliptical ripple ring
 *  7-13s grows into a large particle dome with a travelling sonar wave
 *  13-20 a bright drop hits and a shockwave ripple slides across, surface breathes
 * Slow cinematic push-in throughout.
 */
export function EchoCinematic({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    let w = window.innerWidth;
    let h = window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, w / h, 0.1, 300);
    camera.position.set(0, 9, 40);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h);
    container.appendChild(renderer.domElement);

    // ---- particle grid ----
    const SIZE = 80;
    const SEG = 210;
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

    const material = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uGrow: { value: 0 },
        uFade: { value: 0 },
        uImpact: { value: -100 },
        uSize: { value: 120 * Math.min(window.devicePixelRatio, 2) },
      },
      vertexShader: /* glsl */ `
        uniform float uTime;
        uniform float uGrow;
        uniform float uFade;
        uniform float uImpact;
        uniform float uSize;
        varying float vB;

        void main() {
          float r = length(position.xz);
          float falloff = smoothstep(40.0, 0.0, r);

          // reveal: cluster grows outward into the full field
          float reveal = smoothstep(uGrow * 44.0, uGrow * 44.0 - 9.0, r);

          // gentle breathing ripple
          float base = sin(r * 0.5 - uTime * 2.0);

          // travelling bright sonar wave (a band sweeping outward)
          float front = mod(uTime * 7.0, 52.0);
          float waveBand = exp(-pow(r - front, 2.0) * 0.012);

          // drop shockwave ripple from the impact point
          float td = max(uTime - uImpact, 0.0);
          float iFront = td * 11.0;
          float iInside = smoothstep(iFront, iFront - 10.0, r);
          float iOsc = sin(r * 0.9 - td * 7.0);
          float iDecay = exp(-td * 0.5);
          float impact = iOsc * iInside * (1.0 / (1.0 + r * 0.12)) * iDecay;

          float disp = (base * 1.8 + impact * 5.5) * falloff;
          vec3 pos = position;
          pos.y = disp * reveal;

          float crest =
            (max(base, 0.0) * 0.45 + waveBand * 0.9 + max(impact, 0.0) * 1.3) * reveal;
          vB = (0.07 + crest * 0.95) * uFade;

          vec4 mv = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = uSize * (0.35 + crest * 1.0) / -mv.z;
        }
      `,
      fragmentShader: /* glsl */ `
        varying float vB;
        void main() {
          vec2 c = gl_PointCoord - 0.5;
          float d = dot(c, c);
          if (d > 0.25) discard;
          float soft = smoothstep(0.25, 0.0, d);
          gl_FragColor = vec4(vec3(1.0), min(vB, 1.0) * soft);
        }
      `,
    });
    const points = new THREE.Points(geom, material);
    scene.add(points);

    // ---- bright drop (soft glow sprite) ----
    const gc = document.createElement("canvas");
    gc.width = gc.height = 64;
    const gx = gc.getContext("2d");
    if (gx) {
      const grad = gx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, "rgba(255,255,255,1)");
      grad.addColorStop(0.3, "rgba(255,255,255,0.8)");
      grad.addColorStop(1, "rgba(255,255,255,0)");
      gx.fillStyle = grad;
      gx.fillRect(0, 0, 64, 64);
    }
    const dropTex = new THREE.CanvasTexture(gc);
    const dropMat = new THREE.SpriteMaterial({
      map: dropTex,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      opacity: 0,
    });
    const drop = new THREE.Sprite(dropMat);
    drop.scale.set(1.1, 1.5, 1);
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

    let raf = 0;
    const animate = () => {
      const T = (performance.now() / 1000) % LOOP;
      material.uniforms.uTime.value = T;

      // soft fade-in once the text has dissolved (~5.2s), gentle fade-out near loop end
      let fade = 1;
      if (T < 5.2) fade = 0;
      else if (T < 6.4) fade = (T - 5.2) / 1.2;
      else if (T > 19) fade = 1 - (T - 19);
      material.uniforms.uFade.value = Math.max(0, fade);

      // seed glows first, then slowly expands into the full field
      let grow = 0;
      if (T >= 5.2) {
        const lin = Math.min(1, (T - 5.2) / 6.0); // 5.2s -> 11.2s
        grow = Math.max(0.05, Math.pow(lin, 1.7)); // slow seed start, then expand
      }
      material.uniforms.uGrow.value = grow;

      // drop + shockwave at ~13s
      const dropStart = 12.2;
      const dropDur = 0.8;
      if (T >= dropStart && T < dropStart + dropDur) {
        const f = (T - dropStart) / dropDur;
        drop.visible = true;
        drop.position.set(0, 18 * (1 - f * f), 0);
        dropMat.opacity = Math.min(1, f * 2.2);
        material.uniforms.uImpact.value = -100;
      } else if (T >= dropStart + dropDur && T < 20) {
        drop.visible = false;
        material.uniforms.uImpact.value = dropStart + dropDur;
      } else {
        drop.visible = false;
        material.uniforms.uImpact.value = -100;
      }

      // slow cinematic push-in + gentle rotation
      const k = Math.min(1, Math.max(0, (T - 5) / 15));
      camera.position.z = 40 - 12 * k;
      camera.position.x = Math.sin(T * 0.15) * 2.5;
      camera.position.y = 9 - 2 * k;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
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
  }, []);

  return <div ref={ref} className={className} />;
}
