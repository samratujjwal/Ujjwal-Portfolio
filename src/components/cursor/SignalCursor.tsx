import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useReducedMotion } from "@/lib/useReducedMotion";

/**
 * Replaces the system cursor with a small signal dot and a short trailing
 * ring — the "cursor is a signal, not a pointer" interaction principle.
 * Renders nothing on touch devices or coarse pointers, and drops the
 * trailing lag (ring snaps straight to the pointer instead) when the
 * user prefers reduced motion.
 */
export function SignalCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const supportsFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!supportsFinePointer) return;

    document.body.dataset.signalCursor = "active";

    const dot = dotRef.current;
    const trail = trailRef.current;
    if (!dot || !trail) return;

    const trailX = gsap.quickTo(trail, "x", { duration: 0.35, ease: "power2.out" });
    const trailY = gsap.quickTo(trail, "y", { duration: 0.35, ease: "power2.out" });

    const onMove = (event: PointerEvent) => {
      dot.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`;
      if (prefersReducedMotion) {
        trail.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`;
      } else {
        trailX(event.clientX);
        trailY(event.clientY);
      }
    };

    window.addEventListener("pointermove", onMove);
    return () => {
      window.removeEventListener("pointermove", onMove);
      delete document.body.dataset.signalCursor;
    };
  }, [prefersReducedMotion]);

  return (
    <div className="pointer-events-none fixed inset-0 z-[90] hidden md:block" aria-hidden="true">
      <div
        ref={trailRef}
        className="absolute left-0 top-0 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border border-signal/50 dark:border-signal-dark/50"
      />
      <div
        ref={dotRef}
        className="absolute left-0 top-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal dark:bg-signal-dark"
      />
    </div>
  );
}
