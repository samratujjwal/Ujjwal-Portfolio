import { Container } from "@/components/layout/Container";

const CURRENT_YEAR = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="border-t border-structure/15 py-8 dark:border-structure-dark/15">
      <Container className="flex flex-col items-center gap-3 text-center sm:flex-row sm:justify-between sm:text-left">
        <p className="font-mono text-xs text-ink/50 dark:text-ink-dark/50">
          © {CURRENT_YEAR} Ujjwal Maurya
        </p>

        <p className="font-mono text-xs text-ink/40 dark:text-ink-dark/40">
          Built with React, Three.js &amp; GSAP
        </p>

        <a        
          href="#hero"
          className="font-mono text-xs text-ink/50 transition-colors hover:text-signal dark:text-ink-dark/50 dark:hover:text-signal-dark"
        >
          ↑ Top
        </a>
      </Container>
    </footer>
  );
}