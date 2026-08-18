import { useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { Container } from "@/components/layout/Container";
import { useReducedMotion } from "@/lib/useReducedMotion";

interface ExperienceEntry {
  id: string;
  dateLabel: string;
  dateTime: string; // machine-readable start, ISO year-month
  role: string;
  company: string;
  detail: string;
}

// Edit these directly — dates, roles, and the one extra "detail" line
// that reveals on hover/focus.
const ENTRIES: ExperienceEntry[] = [
  {
    id: "omega",
    dateLabel: "Apr 2026 – May 2026 (2 Months)",
    dateTime: "2026-06",
    role: "Full Stack Developer",
    company: "Omega Solutions, Gurugram",
    detail: "Building and shipping production features across the MERN stack.",
  },
  {
    id: "nayepankh",
    dateLabel: "Jun 2026 – Jul 2026 (2 Months)",
    dateTime: "2026-06",
    role: "Full Stack Developer (MERN + Firebase)",
    company: "NayePankh Foundation, Sector 62, Noida",
    detail: "Supervised by Ravish Kumar, Senior Software Developer.",
  },
  {
    id: "MarsMeta Tech",
    dateLabel: "Jul 2026 – Present (Ongoing)",
    dateTime: "2026-06",
    role: "Full Stack Developer (MERN + Firebase)",
    company: "MarsMeta Tech, Sector 62, Noida",
    detail: "Supervised by Ravish Kumar, Senior Software Developer.",
  },
];

export function Experience() {
  const rootRef = useRef<HTMLDivElement>(null);
  const spineRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const spine = spineRef.current;
      const nodes = gsap.utils.toArray<HTMLElement>("[data-node-fill]");
      const rows = gsap.utils.toArray<HTMLElement>("[data-entry-reveal]");

      if (prefersReducedMotion) {
        if (spine) gsap.set(spine, { scaleY: 1 });
        gsap.set(nodes, { scale: 1, opacity: 1 });
        gsap.set(rows, { opacity: 1, y: 0 });
        return;
      }

      if (spine) {
        gsap.fromTo(
          spine,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: root,
              start: "top 65%",
              end: "bottom 75%",
              scrub: 0.4,
            },
          },
        );
      }

      nodes.forEach((node) => {
        gsap.fromTo(
          node,
          { scale: 0, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.35,
            ease: "back.out(2)",
            scrollTrigger: { trigger: node, start: "top 78%" },
          },
        );
      });

      rows.forEach((row) => {
        gsap.from(row, {
          opacity: 0,
          y: 10,
          duration: 0.45,
          ease: "power2.out",
          scrollTrigger: { trigger: row, start: "top 80%" },
        });
      });
    }, root);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  useLayoutEffect(() => {
    return () => ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  }, []);

  return (
    <section id="experience" ref={rootRef} aria-labelledby="experience-heading" className="pt-24 md:pt-32">
      <Container>
        <p className="mb-10 font-mono text-xs tracking-wide text-structure dark:text-structure-dark md:mb-14">
          02 / Experience
        </p>
        <h2 id="experience-heading" className="sr-only">
          Experience
        </h2>

        <ol className="relative max-w-2xl list-none">
          <div
            aria-hidden="true"
            className="absolute left-[15px] top-2 h-[calc(100%-1rem)] w-px origin-top bg-structure/40 dark:bg-structure-dark/40 md:left-[19px]"
            ref={spineRef}
          />

          {ENTRIES.map((entry) => (
            <li
              key={entry.id}
              data-entry-reveal
              tabIndex={0}
              className="group relative mb-14 pl-10 last:mb-0 md:pl-16"
            >
              <span
                aria-hidden="true"
                data-node-fill
                className="absolute left-[9px] top-1.5 h-3 w-3 rounded-full bg-signal dark:bg-signal-dark md:left-3.5"
              />
              <span
                aria-hidden="true"
                className="absolute left-2 top-1 h-4 w-4 rounded-full border border-structure/50 dark:border-structure-dark/50 md:left-3"
              />

              <time dateTime={entry.dateTime} className="block font-mono text-xs text-ink/60 dark:text-ink-dark/60">
                {entry.dateLabel}
              </time>

              <h3 className="mt-2 font-serif text-xl leading-snug md:text-2xl">
                {entry.role}
                <span className="block font-sans text-base font-normal text-ink/70 dark:text-ink-dark/70">
                  {entry.company}
                </span>
              </h3>

              <div className="grid transition-[grid-template-rows] duration-300 ease-out md:grid-rows-[0fr] md:group-hover:grid-rows-[1fr] md:group-focus-within:grid-rows-[1fr]">
                <p className="mt-2 max-w-md overflow-hidden font-sans text-sm text-ink/60 dark:text-ink-dark/60">
                  {entry.detail}
                </p>
              </div>
            </li>
          ))}

          <li aria-hidden="true" className="relative pl-10 md:pl-16">
            <span className="absolute left-2 top-1 h-4 w-4 rounded-full border border-dashed border-structure/40 dark:border-structure-dark/40 md:left-3" />
          </li>
        </ol>
      </Container>
    </section>
  );
}