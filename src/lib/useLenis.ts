import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "./gsap";
import { useReducedMotion } from "./useReducedMotion";

/**
 * Mounts Lenis once at the app root and drives it from the GSAP ticker so
 * scroll-linked GSAP animations (ScrollTrigger) and Lenis's smoothing
 * stay on the same frame clock. Skips entirely when the user prefers
 * reduced motion — native scroll takes over and every scroll-triggered
 * animation in the app must have a static fallback for that case.
 */
export function useLenis(): void {
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const onTick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(onTick);
      lenis.destroy();
    };
  }, [prefersReducedMotion]);
}
