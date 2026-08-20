import { useEffect, useRef, useState } from "react";

export type SpringConfig = { stiffness: number; damping: number };

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Animates toward `target` with real spring physics (position + velocity,
 * integrated every frame) instead of a fixed-duration CSS transition — the
 * value keeps its momentum if the target changes mid-flight, so rapidly
 * clicking between tabs redirects smoothly instead of restarting a canned
 * animation. Snaps instantly when the user has prefers-reduced-motion set.
 */
export function useSpring(target: number, config: SpringConfig): number {
  const [value, setValue] = useState(target);
  const valueRef = useRef(target);
  const velocityRef = useRef(0);
  const targetRef = useRef(target);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    targetRef.current = target;

    if (prefersReducedMotion()) {
      valueRef.current = target;
      velocityRef.current = 0;
      setValue(target);
      return;
    }

    let lastTime = performance.now();

    function tick(now: number) {
      const dt = Math.min((now - lastTime) / 1000, 1 / 30);
      lastTime = now;

      const displacement = valueRef.current - targetRef.current;
      const acceleration = -config.stiffness * displacement - config.damping * velocityRef.current;
      velocityRef.current += acceleration * dt;
      valueRef.current += velocityRef.current * dt;

      const settled = Math.abs(displacement) < 0.4 && Math.abs(velocityRef.current) < 0.4;
      if (settled) {
        valueRef.current = targetRef.current;
        velocityRef.current = 0;
        setValue(valueRef.current);
        rafRef.current = null;
        return;
      }

      setValue(valueRef.current);
      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [target, config.stiffness, config.damping]);

  return value;
}
