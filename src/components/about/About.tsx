import { useLayoutEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { Container } from "@/components/layout/Container";
import { FrameCorners } from "@/components/ui/FrameCorners";
import { MonoChip } from "@/components/ui/MonoChip";
import { useReducedMotion } from "@/lib/useReducedMotion";
import UjjwalPort from "./images/UjjwalPort.png";
const HIGHLIGHTS = [
  { label: "7.8 SGPA", tone: "structure" as const },
  { label: "MERN", tone: "structure" as const },
  { label: "WebRTC", tone: "structure" as const },
  { label: "Real-time systems", tone: "signal" as const },
];

export function About() {
  const rootRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) return;

      const tl = gsap.timeline({
        defaults: { ease: "power2.out" },
        scrollTrigger: { trigger: root, start: "top 70%" },
      });

      if (lineRef.current) {
        tl.fromTo(lineRef.current, { scaleX: 0 }, { scaleX: 1, duration: 0.5 });
      }
      tl.from("[data-about-reveal]", { opacity: 0, y: 4, duration: 0.45, stagger: 0.1 }, "-=0.15");
    }, root);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section id="about" ref={rootRef} aria-labelledby="about-heading" className="pt-24 md:pt-32">
      <Container className="grid grid-cols-1 gap-10 md:grid-cols-[240px_56px_1fr] md:items-start">
        <div>
          <p className="mb-4 font-mono text-xs tracking-wide text-structure dark:text-structure-dark">
            01 / About
          </p>
          <FrameCorners>
            {/* Replace with a real photo — /public/images/about-photo.jpg.
                Rectangular, never a circular avatar: that's the one
                deliberate template pattern this identity avoids. */}
            <img
              src={UjjwalPort}
              alt="Ujjwal Maurya"
              width={240}
              height={300}
              loading="lazy"
              className="aspect-[4/5] w-full bg-structure-soft object-cover dark:bg-structure-dark-soft"
            />
          </FrameCorners>
        </div>

        <div className="hidden md:flex md:h-full md:justify-center md:pt-28" aria-hidden="true">
          <div
            ref={lineRef}
            className="h-0 w-full origin-left self-start border-t border-dashed border-structure/40 dark:border-structure-dark/40"
          />
        </div>

        <div>
          <h2 id="about-heading" className="sr-only">
            About
          </h2>

          <p
            data-about-reveal
            className="max-w-xl font-serif text-2xl leading-snug tracking-tight md:text-[28px]"
          >
            I build the boring parts well — auth, schemas, state — so the real-time parts can
            actually be trusted.
          </p>

          <p
            data-about-reveal
            className="mt-6 max-w-xl font-sans text-base leading-relaxed text-ink/80 dark:text-ink-dark/80"
          >
            Final-year CSE student (2023–2027) at IMS Engineering College, Ghaziabad, currently
            working as a MERN Developer Intern at MarsMeta Tech(Remote), Noida.
          </p>

          <ul data-about-reveal className="mt-8 flex flex-wrap gap-2" aria-label="Highlights">
            {HIGHLIGHTS.map((item) => (
              <li key={item.label}>
                <MonoChip tone={item.tone}>{item.label}</MonoChip>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}