import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

type Sparkle = {
  id: number;
  x: number;
  y: number;
  size: number;
  dx: number;
  dy: number;
  color: string;
};

const COLORS = [
  "#60A5FA", // blue-400
  "#38BDF8", // sky-400
  "#A78BFA", // violet-400
  "#C4B5FD", // violet-300
  "#FFFFFF",
];

const MAX_PARTICLES = 30;
const INTERVAL = 32; // ~30 FPS

export const CursorSparkles = () => {
  const [particles, setParticles] = useState<Sparkle[]>([]);
  const idRef = useRef(0);
  const lastSpawn = useRef(0);

  const createParticle = useCallback((x: number, y: number) => {
    const angle = Math.random() * Math.PI * 2;
    const distance = 20 + Math.random() * 35;

    const particle: Sparkle = {
      id: idRef.current++,
      x,
      y,
      size: 3 + Math.random() * 4,
      dx: Math.cos(angle) * distance,
      dy: Math.sin(angle) * distance,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    };

    setParticles((prev) => {
      const next = [...prev, particle];
      return next.slice(-MAX_PARTICLES);
    });

    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => p.id !== particle.id));
    }, 850);
  }, []);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const now = performance.now();

      if (now - lastSpawn.current < INTERVAL) return;

      lastSpawn.current = now;

      const count = Math.random() > 0.6 ? 2 : 1;

      for (let i = 0; i < count; i++) {
        createParticle(
          e.clientX + (Math.random() - 0.5) * 10,
          e.clientY + (Math.random() - 0.5) * 10,
        );
      }
    };

    window.addEventListener("mousemove", handleMove);

    return () => {
      window.removeEventListener("mousemove", handleMove);
    };
  }, [createParticle]);

  return (
    <div className="pointer-events-none absolute inset-0 z-1 overflow-hidden">
      <AnimatePresence>
        {particles.map((p) => (
          <motion.span
            key={p.id}
            className="absolute rounded-full"
            initial={{
              x: p.x,
              y: p.y,
              opacity: 1,
              scale: 0.6,
            }}
            animate={{
              x: p.x + p.dx,
              y: p.y + p.dy,
              opacity: 0,
              scale: 1.8,
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.85,
              ease: "easeOut",
            }}
            style={{
              width: p.size,
              height: p.size,
              background: p.color,
              boxShadow: `0 0 10px ${p.color}`,
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};
