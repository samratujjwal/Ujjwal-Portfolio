import { useLayoutEffect, useRef } from "react";
import { FrameCorners } from "@/components/ui/FrameCorners";
import { MonoChip } from "@/components/ui/MonoChip";

export interface Project {
  id: string;
  name: string;
  imageSrc: string;
  imageAlt: string;
  calloutLabel: string;
  stack: string[];
  href: string;
  githubUrl?: string;
  liveUrl?: string;
  featured?: boolean;
}

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const cardRef = useRef<HTMLElement>(null);
  const lineRef = useRef<SVGLineElement>(null);

  useLayoutEffect(() => {
    const card = cardRef.current;
    const line = lineRef.current;
    if (!card || !line) return;

    const supportsFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!supportsFinePointer) return;

    const tick = card.querySelector<SVGSVGElement>('[data-corner-tick="top-left"]');

    const getOrigin = () => {
      const cardRect = card.getBoundingClientRect();
      if (!tick) return { x: 4, y: 4 };
      const tickRect = tick.getBoundingClientRect();
      return {
        x: tickRect.left - cardRect.left + tickRect.width / 2,
        y: tickRect.top - cardRect.top + tickRect.height / 2,
      };
    };

    const onMove = (event: PointerEvent) => {
      const rect = card.getBoundingClientRect();
      const origin = getOrigin();
      line.setAttribute("x1", String(origin.x));
      line.setAttribute("y1", String(origin.y));
      line.setAttribute("x2", String(event.clientX - rect.left));
      line.setAttribute("y2", String(event.clientY - rect.top));
    };
    const onEnter = (event: PointerEvent) => {
      card.dataset.circuitActive = "true";
      onMove(event);
    };
    const onLeave = () => {
      delete card.dataset.circuitActive;
    };

    card.addEventListener("pointerenter", onEnter);
    card.addEventListener("pointermove", onMove);
    card.addEventListener("pointerleave", onLeave);
    return () => {
      card.removeEventListener("pointerenter", onEnter);
      card.removeEventListener("pointermove", onMove);
      card.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  const hasLinks = Boolean(project.githubUrl || project.liveUrl);

  return (
    <article
      ref={cardRef}
      data-project-card
      className={`group relative ${project.featured ? "md:col-span-2" : ""}`}
    >
      {/* Cursor-to-corner "complete a circuit" line — decorative, fine-pointer
          only. z-10 so it paints above the image/heading instead of behind them. */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 h-full w-full opacity-0 transition-opacity duration-200 group-hover:opacity-100"
      >
        <line ref={lineRef} x1="4" y1="4" x2="4" y2="4" stroke="var(--color-signal)" strokeWidth="1.5" />
      </svg>

      <h3 className="mb-3 font-serif text-xl md:text-2xl">
        <a href={project.href} className="after:absolute after:inset-0">
          {project.name}
        </a>
      </h3>

      <FrameCorners>
        <div className="relative">
          <img
            src={project.imageSrc}
            alt={project.imageAlt}
            width={800}
            height={500}
            loading="lazy"
            className="aspect-[8/5] w-full bg-structure-soft object-cover dark:bg-structure-dark-soft"
          />

          {/* Leader-line callout to one real, specific decision. */}
          <div className="absolute bottom-3 left-3 flex max-w-[85%] items-start gap-2 rounded-sm bg-paper/90 px-2.5 py-1.5 backdrop-blur-sm transition-colors group-hover:bg-paper dark:bg-paper-dark/90 dark:group-hover:bg-paper-dark">
            <span aria-hidden="true" className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-signal dark:bg-signal-dark" />
            <p className="font-mono text-xs leading-snug text-ink/80 dark:text-ink-dark/80">
              {project.calloutLabel}
            </p>
          </div>
        </div>
      </FrameCorners>

      <ul className="mt-3 flex flex-wrap gap-2" aria-label={`Stack used in ${project.name}`}>
        {project.stack.map((tech) => (
          <li key={tech}>
            <MonoChip>{tech}</MonoChip>
          </li>
        ))}
      </ul>

      {hasLinks && (
        // relative + z-20: sits above the title's stretched-link overlay
        // (which has no explicit z-index) so these stay independently clickable.
        <div className="relative z-20 mt-3 flex flex-wrap items-center gap-x-4 gap-y-1">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="font-mono text-xs text-ink/60 underline decoration-structure/30 underline-offset-4 transition-colors hover:text-ink hover:decoration-signal dark:text-ink-dark/60 dark:hover:text-ink-dark dark:hover:decoration-signal-dark"
            >
              GitHub ↗
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="font-mono text-xs text-signal underline decoration-signal/40 underline-offset-4 transition-colors hover:decoration-signal dark:text-signal-dark dark:decoration-signal-dark/40"
            >
              Live ↗
            </a>
          )}
        </div>
      )}
    </article>
  );
}