import { useLenis } from "@/lib/useLenis";
import { SkipLink } from "@/components/layout/SkipLink";
import { Nav } from "@/components/nav/Nav";
import { SignalCursor } from "@/components/cursor/SignalCursor";
import { Hero } from "@/components/hero/Hero";
import { About } from "@/components/about/About";
import { Experience } from "@/components/experience/Experience";
import { Projects } from "@/components/projects/Projects";
import { TechStack } from "@/components/stack/TechStack";
import { Contact } from "@/components/contact/Contact";
import { LiveStats } from "@/components/stats/LiveStats";
import { Footer } from "@/components/footer/Footer";

export default function App() {
  useLenis();

  return (
    <>
      <SkipLink />
      <SignalCursor />
      <Nav />

      <main id="main">
        <Hero />
        <About />
        <Experience />
        <Projects />
        <TechStack />
        {/* <EngineeringLog /> */}
        <LiveStats />
        <Contact />
      </main>
      <Footer />
    </>
  );
}