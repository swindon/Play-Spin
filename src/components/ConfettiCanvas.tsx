import React, { useEffect, useRef } from 'react';

interface ConfettiCanvasProps {
  triggerKey: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  vRot: number;
  color: string;
  shape: 'rect' | 'circle' | 'ribbon';
  alpha: number;
  tiltAngle: number;
  tiltSpeed: number;
}

const PASTEL_CONFETTI_COLORS = [
  '#FDE047', // Butter yellow
  '#86EFAC', // Mint green
  '#C4B5FD', // Lavender
  '#7DD3FC', // Sky blue
  '#FDBA74', // Peach
  '#F9A8D4', // Rose pink
  '#FB923C', // Warm coral
  '#38BDF8', // Bright sky
];

export const ConfettiCanvas: React.FC<ConfettiCanvasProps> = ({ triggerKey }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (triggerKey <= 0) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const originX = width * 0.5;
    const originY = Math.min(height * 0.42, 340);
    const count = width < 640 ? 68 : 105;

    const particles: Particle[] = Array.from({ length: count }, (_, i) => {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const speed = 4.5 + Math.random() * 8.5;
      const shapes: Particle['shape'][] = ['rect', 'circle', 'ribbon'];
      return {
        x: originX + (Math.random() - 0.5) * 40,
        y: originY + (Math.random() - 0.5) * 24,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 4.2,
        size: 6 + Math.random() * 6,
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.22,
        color: PASTEL_CONFETTI_COLORS[i % PASTEL_CONFETTI_COLORS.length],
        shape: shapes[i % shapes.length],
        alpha: 1,
        tiltAngle: Math.random() * Math.PI * 2,
        tiltSpeed: 0.08 + Math.random() * 0.08,
      };
    });

    let lastTime = performance.now();
    const startTime = lastTime;

    const tick = (now: number) => {
      const dt = Math.min((now - lastTime) / 16.667, 2.2);
      lastTime = now;
      const elapsed = now - startTime;

      ctx.clearRect(0, 0, width, height);

      let aliveCount = 0;
      for (const p of particles) {
        p.vy += 0.24 * dt; // gentle gravity
        p.vx *= Math.pow(0.985, dt);
        p.vy *= Math.pow(0.99, dt);
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.rotation += p.vRot * dt;
        p.tiltAngle += p.tiltSpeed * dt;

        if (elapsed > 1400) {
          p.alpha = Math.max(0, p.alpha - 0.022 * dt);
        }

        if (p.alpha > 0.01 && p.y < height + 40) {
          aliveCount++;
          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.scale(1, Math.cos(p.tiltAngle) * 0.85 + 0.15);
          ctx.fillStyle = p.color;

          if (p.shape === 'circle') {
            ctx.beginPath();
            ctx.arc(0, 0, p.size * 0.45, 0, Math.PI * 2);
            ctx.fill();
          } else if (p.shape === 'ribbon') {
            ctx.beginPath();
            ctx.roundRect(-p.size * 0.7, -p.size * 0.28, p.size * 1.4, p.size * 0.56, 3);
            ctx.fill();
          } else {
            ctx.beginPath();
            ctx.roundRect(-p.size * 0.5, -p.size * 0.5, p.size, p.size * 0.8, 2);
            ctx.fill();
          }
          ctx.restore();
        }
      }

      if (aliveCount > 0 && elapsed < 3600) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        ctx.clearRect(0, 0, width, height);
        rafRef.current = null;
      }
    };

    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [triggerKey]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-50"
    />
  );
};
