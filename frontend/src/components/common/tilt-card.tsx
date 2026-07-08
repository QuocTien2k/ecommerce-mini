"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import type { PropsWithChildren, MouseEvent } from "react";
import { useRef } from "react";

import { cn } from "@/lib/utils";

type TiltCardProps = PropsWithChildren<{
  className?: string;
}>;

const MAX_ROTATION = 10;
const HOVER_SCALE = 1.02;
const DEPTH = 40;

const springConfig = {
  stiffness: 220,
  damping: 20,
};

const TiltCard = ({ children, className }: TiltCardProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const scale = useMotionValue(1);
  const depth = useMotionValue(0);

  const springRotateX = useSpring(rotateX, springConfig);
  const springRotateY = useSpring(rotateY, springConfig);
  const springScale = useSpring(scale, springConfig);
  const springDepth = useSpring(depth, springConfig);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();

    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const x = ((mouseY - height / 2) / (height / 2)) * MAX_ROTATION;
    const y = ((mouseX - width / 2) / (width / 2)) * MAX_ROTATION;

    rotateX.set(-x);
    rotateY.set(y);

    scale.set(HOVER_SCALE);
    depth.set(DEPTH);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    scale.set(1);
    depth.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={cn("transform-gpu", className)}
      style={{
        rotateX: springRotateX,
        rotateY: springRotateY,
        scale: springScale,
        transformPerspective: 1200,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        style={{
          translateZ: springDepth,
          transformStyle: "preserve-3d",
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

export default TiltCard;
