"use client";

import { useEffect, useRef } from "react";

/* Splash field. A deliberate stand-in for the night-street photograph: it
   depicts what the product does rather than decorating with filler. Dots
   cluster along a route and the route traces itself, which is the core pitch
   (move onto the busier path). Deliberately low contrast; it sits behind a
   scrim and the lockup has to stay dominant.

   Everything is seeded so the server and client render the same frame, and
   there is no Math.random anywhere, so there is no hydration flicker. */

const DENSITY = 46; // dots along the route band
const SCATTER = 150; // dots in the wider field
const GOLD = "255, 179, 0";

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Dot = { x: number; y: number; r: number; a: number; phase: number; near: boolean };

export default function SplashField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const rand = mulberry32(0x5afe91);

    let w = 0;
    let h = 0;
    let raf = 0;
    const start = typeof performance !== "undefined" ? performance.now() : 0;

    // Route runs left to right, sagging through the lower third.
    const routeY = (t: number) => h * 0.62 + Math.sin(t * Math.PI * 1.15) * h * 0.16;

    const build = () => {
      const dots: Dot[] = [];
      for (let i = 0; i < DENSITY; i++) {
        const t = i / (DENSITY - 1);
        const x = t * w;
        const spread = h * 0.1 * (0.35 + rand() * 0.65);
        dots.push({
          x: x + (rand() - 0.5) * 26,
          y: routeY(t) + (rand() - 0.5) * spread * 2,
          r: 1.1 + rand() * 1.9,
          a: 0.18 + rand() * 0.5,
          phase: rand() * Math.PI * 2,
          near: true,
        });
      }
      for (let i = 0; i < SCATTER; i++) {
        dots.push({
          x: rand() * w,
          y: rand() * h,
          r: 0.6 + rand() * 1.1,
          a: 0.05 + rand() * 0.16,
          phase: rand() * Math.PI * 2,
          near: false,
        });
      }
      return dots;
    };

    let dots: Dot[] = [];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      dots = build();
    };

    const draw = (time: number) => {
      const t0 = time - start;
      ctx.clearRect(0, 0, w, h);

      for (const d of dots) {
        // A slow breathing lift, phase-offset per dot.
        const drift = reduce ? 0 : Math.sin(t0 / 2600 + d.phase) * (d.near ? 5 : 3);
        ctx.beginPath();
        ctx.arc(d.x, d.y + drift, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${GOLD}, ${d.a})`;
        ctx.fill();
      }

      // Route line tracing itself, left to right.
      const t = reduce ? 0.72 : Math.min(1, t0 / 1500);
      ctx.beginPath();
      for (let i = 0; i <= 120; i++) {
        const p = (i / 120) * t;
        const x = p * w;
        const y = routeY(p);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = `rgba(${GOLD}, 0.5)`;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Bright head at the trace front.
      if (t < 1) {
        ctx.beginPath();
        ctx.arc(t * w, routeY(t), 3.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${GOLD}, 0.85)`;
        ctx.fill();
      }

      if (!reduce) raf = window.requestAnimationFrame(draw);
    };

    resize();
    draw(0);
    window.addEventListener("resize", resize);
    if (!reduce) raf = window.requestAnimationFrame(draw);

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 h-full w-full"
    />
  );
}
