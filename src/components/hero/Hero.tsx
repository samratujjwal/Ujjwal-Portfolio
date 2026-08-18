import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { MonoChip } from "@/components/ui/MonoChip";
import { NodeGraph } from "@/components/hero/NodeGraph";
import { useReducedMotion } from "@/lib/useReducedMotion";

export function Hero() {
  const rootRef = useRef<HTMLDivElement>(null);
  const graphWrapRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) return;

      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
      tl.from(graphWrapRef.current, { opacity: 0, duration: 0.7 })
        .from(
          "[data-hero-line]",
          { opacity: 0, y: 8, duration: 0.5, stagger: 0.08 },
          "-=0.35",
        )
        .from("[data-hero-cue]", { opacity: 0, duration: 0.4 }, "-=0.1");
    }, root);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section
      id="hero"
      ref={rootRef}
      aria-labelledby="hero-heading"
      className="relative flex min-h-screen items-center pt-16"
    >
      <Container className="grid grid-cols-1 items-center gap-12 pt-16 md:grid-cols-[1.15fr_1fr] md:gap-8">
        <div className="order-2 md:order-1">
          <p data-hero-line className="mb-4 font-mono text-xs tracking-wide text-structure dark:text-structure-dark">
            MERN developer · real-time systems
          </p>

          <h1
            id="hero-heading"
            data-hero-line
            className="font-serif text-5xl leading-[1.05] tracking-tight md:text-7xl"
          >
            Ujjwal Maurya
          </h1>

          <p
            data-hero-line
            className="mt-6 max-w-md font-sans text-lg text-ink/80 dark:text-ink-dark/80 md:text-xl"
          >
            MERN developer building real-time systems.
          </p>

          <div data-hero-line className="mt-6">
            <MonoChip>SDE-1 candidate · open to roles</MonoChip>
          </div>

          <div data-hero-line className="mt-10 flex flex-wrap items-center gap-4">
            <Button href="#projects" variant="primary">
              View work →
            </Button>
            <Button href="/Ujjwal_Maurya_Resume.pdf" variant="secondary" download>
              Resume ↓
            </Button>
          </div>
        </div>

        <div ref={graphWrapRef} className="order-1 md:order-2">
          <div className="aspect-square w-full max-w-md rounded-sm border border-structure/15 dark:border-structure-dark/20 md:ml-auto">
            <NodeGraph className="h-full w-full" />
          </div>
        </div>
      </Container>

      <a
        data-hero-cue
        href="#about"
        aria-label="Scroll to About section"
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 items-center gap-2 font-mono text-xs text-ink/50 hover:text-signal dark:text-ink-dark/50 dark:hover:text-signal-dark md:flex"
      >
        <span aria-hidden="true">↓</span> scroll
      </a>
    </section>
  );
}
