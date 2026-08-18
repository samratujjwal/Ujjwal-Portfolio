import { useEffect, useState } from "react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";

const LINKS = [
  { id: "hero", label: "Home" },
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Work" },
  { id: "stack", label: "Stack" },
  { id: "stats", label: "Stats" },
  { id: "contact", label: "Contact" },
] as const;

export function Nav() {
  const [activeId, setActiveId] = useState<string>("hero");

  useEffect(() => {
    const sections = LINKS.map((link) => document.getElementById(link.id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length > 0) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-structure/15 bg-paper/80 backdrop-blur-sm dark:border-structure-dark/15 dark:bg-paper-dark/80">
      <Container as="nav" aria-label="Primary" className="flex h-16 items-center justify-between">
        <a href="#hero" className="font-mono text-sm tracking-wide">
          UM
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {LINKS.map((link) => (
            <li key={link.id}>
              <a
                href={`#${link.id}`}
                aria-current={activeId === link.id ? "true" : undefined}
                className="relative flex items-center gap-2 px-3 py-2 font-mono text-xs tracking-wide text-ink/70 transition-colors hover:text-ink dark:text-ink-dark/70 dark:hover:text-ink-dark"
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full transition-colors ${
                    activeId === link.id
                      ? "bg-signal dark:bg-signal-dark"
                      : "bg-structure/30 dark:bg-structure-dark/30"
                  }`}
                  aria-hidden="true"
                />
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <Button href="#contact" variant="secondary" className="text-xs">
          Let's talk
        </Button>
      </Container>
    </header>
  );
}
