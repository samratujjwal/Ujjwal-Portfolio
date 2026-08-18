import { useLayoutEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { Container } from "@/components/layout/Container";
import { MonoChip } from "@/components/ui/MonoChip";
import { useReducedMotion } from "@/lib/useReducedMotion";

interface StackCategory {
  id: string;
  label: string;
  items: string[];
  tone?: "structure" | "signal";
}

// Exactly four categories, matching the approved wireframe — do not add
// more. Real-time stays last and is the only category in signal orange;
// every other item is structure-blue. This is the one honest taxonomy
// the identity system asks for, not a skills cloud.
const CATEGORIES: StackCategory[] = [
  {
    id: "frontend",
    label: "Frontend",
    items: [
      "HTML",
      "CSS",
      "JavaScript",
      "React.js",
      "Redux Toolkit",
      "Tailwind CSS",
      "Bootstrap",
    ],
  },
  {
    id: "backend",
    label: "Backend",
    items: [
      "Node.js",
      "Express.js",
      "REST API",
      "JWT Authentication",
      "Socket.io",
      "WebRTC",
    ],
  },
  {
    id: "data",
    label: "DataBase",
    items: [
      "MongoDB",
      "MySQL",
      "Firebase",
      "MongoDB Atlas",
    ],
  },
  {
    id: "tools",
    label: "Tools & DevOps",
    items: [
      "SQL",
      "Docker",
      "AWS EC2",
      "Git",
      "GitHub",
      "Git Bash",
      "Postman",
      "Render",
      "Vercel",
    ],
    tone: "signal",
  },
];

export function TechStack() {
  const rootRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const pills = gsap.utils.toArray<HTMLElement>("[data-stack-pill]");

      if (prefersReducedMotion) {
        gsap.set(pills, { opacity: 1, y: 0 });
        return;
      }

      gsap.from(pills, {
        opacity: 0,
        y: 8,
        duration: 0.35,
        ease: "power2.out",
        stagger: 0.04,
        scrollTrigger: { trigger: root, start: "top 75%" },
      });
    }, root);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section id="stack" ref={rootRef} aria-labelledby="stack-heading" className="pt-24 md:pt-32">
      <Container>
        <p className="mb-10 font-mono text-xs tracking-wide text-structure dark:text-structure-dark md:mb-14">
          04 / TechStack
        </p>
        <h2 id="stack-heading" className="sr-only">
          Tech stack
        </h2>

        <div className="grid grid-cols-2 gap-x-8 gap-y-12 md:grid-cols-4">
          {CATEGORIES.map((category) => (
            <div key={category.id}>
              <h3 className="border-b border-structure/20 pb-3 font-mono text-xs tracking-wide text-ink/60 dark:border-structure-dark/20 dark:text-ink-dark/60">
                {category.label}
              </h3>

              <ul className="mt-4 flex flex-col items-start gap-2" aria-label={`${category.label} tools`}>
                {category.items.map((item) => (
                  <li key={item} data-stack-pill>
                    <MonoChip tone={category.tone ?? "structure"}>{item}</MonoChip>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}