import { useLayoutEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { Container } from "@/components/layout/Container";
import { ProjectCard, type Project } from "@/components/projects/ProjectCard";
import { useReducedMotion } from "@/lib/useReducedMotion";
import BrokerBase from "./images/BrokerBase.png";
import NexCall from  "./images/NexCall.png";
import WanderLust from  "./images/WanderLust.png";
import TeamUp from  "./images/TeamUp.png";
import NewsLens from  "./images/NewsLens.png";
// Edit freely — screenshots, callouts, stack tags, and links per project.
// calloutLabel should name one real, specific engineering decision,
// never a generic "role / tools / outcome" line. Leave githubUrl or
// liveUrl out entirely (don't set to "") if a project doesn't have one —
// the card only renders the links that exist.
const PROJECTS: Project[] = [
  {
    id: "brokerbase",
    name: "BrokerBase",
    imageSrc: BrokerBase,
    imageAlt: "BrokerBase dashboard showing brokerage analytics charts",
    calloutLabel: "JWT refresh handled via httpOnly cookies, not localStorage.",
    stack: ["React", "Node", "Express", "MongoDB", "Chart.js"],
    href: "/projects/brokerbase",
    githubUrl: "https://github.com/samratujjwal/BrokerBase",
    liveUrl: "https://brokerbase.netlify.app/",
  },
  {
    id: "nexcall",
    name: "NexCall",
    imageSrc:NexCall,
    imageAlt: "NexCall video call interface with two connected peers",
    calloutLabel: "Falls back to a TURN relay when direct peer connections fail.",
    stack: ["React", "Node", "WebRTC", "Socket.io"],
    href: "/projects/nexcall",
    githubUrl: "https://github.com/samratujjwal/NexCall",
    liveUrl: "https://nexcall45.netlify.app/",
  },
  {
    id: "wanderlust",
    name: "Wanderlust",
    imageSrc: WanderLust,
    imageAlt: "Wanderlust travel listing page with an interactive map",
    calloutLabel: "Map tiles load lazily as listing markers enter the viewport.",
    stack: ["React", "Node", "MongoDB", "Cloudinary", "MapTiler"],
    href: "/projects/wanderlust",
    githubUrl: "https://github.com/samratujjwal/WanderLust",
    liveUrl: "https://wanderlust-1-vbej.onrender.com/listings",
  },
  {
    id: "teamup",
    name: "TeamUp",
    imageSrc: TeamUp,
    imageAlt: "TeamUp collaboration board with live team presence",
    calloutLabel: "Presence state synced across clients over Socket.io rooms.",
    stack: ["React", "Node", "Express", "MongoDB", "Socket.io"],
    href: "/projects/teamup",
    githubUrl: "https://github.com/samratujjwal/TeamUp",
    liveUrl: "/",
  },
  {
    id: "newslens",
    name: "NewsLens",
    imageSrc: NewsLens,
    imageAlt: "NewsLens article feed with categorized headlines",
    calloutLabel: "Client-side response caching cuts duplicate API calls on repeat visits.",
    stack: ["React", "Node", "Express", "MongoDB"],
    href: "/projects/newslens",
    githubUrl: "https://github.com/samratujjwal/NewsLens",
    liveUrl: "https://newslens.vercel.app",
    featured: true,
  },
];

export function Projects() {
  const rootRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-project-card]");

      if (prefersReducedMotion) {
        gsap.set(cards, { opacity: 1, y: 0 });
        gsap.set("[data-corner-tick]", { opacity: 1, scale: 1 });
        return;
      }

      cards.forEach((card, i) => {
        const ticks = card.querySelectorAll("[data-corner-tick]");
        const tl = gsap.timeline({
          scrollTrigger: { trigger: card, start: "top 82%" },
          delay: (i % 2) * 0.08,
        });
        tl.from(card, { opacity: 0, y: 16, duration: 0.5, ease: "power2.out" }).from(
          ticks,
          { opacity: 0, scale: 0.5, duration: 0.3, ease: "back.out(2)", stagger: 0.04 },
          "-=0.3",
        );
      });
    }, root);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section id="projects" ref={rootRef} aria-labelledby="projects-heading" className="pt-24 md:pt-32">
      <Container>
        <p className="mb-10 font-mono text-xs tracking-wide text-structure dark:text-structure-dark md:mb-14">
          03 / Projects
        </p>
        <h2 id="projects-heading" className="sr-only">
          Projects
        </h2>

        <div className="grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-2">
          {PROJECTS.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </Container>
    </section>
  );
}