import type { Metadata } from "next";
import { SmoothScrollProvider, IntroProvider } from "./components/providers";
import { Grain, Nav } from "./components/chrome";
import { Loader } from "./components/loader";
import { ScrollRail } from "./components/scroll-rail";
import { Hero } from "./components/hero";
import { About } from "./components/about";
import { Projects } from "./components/projects";
import { Blog } from "./components/blog";
import { Music } from "./components/music";
import { Skills } from "./components/skills";
import { Contact } from "./components/contact";
import { Footer } from "./components/footer";

export const metadata: Metadata = {
  title: "ELVISH SCOUT",
};

export default function HomePage() {
  return (
    <div className="overflow-x-clip bg-paper font-zh text-ink selection:bg-acid selection:text-ink">
      <SmoothScrollProvider>
        <IntroProvider>
          <Grain />
          <Loader />
          <Nav />
          <ScrollRail />

          <Hero />
          <About />

          <div className="relative z-4">
            <div className="h-6.5 w-full border-y-3 border-ink bg-acid" />
          </div>

          <Projects />
          <Blog />
          <Music />
          <Skills />

          <div className="relative z-4">
            <div className="h-4.5 w-full border-y-3 border-ink bg-size-[26px_26px] bg-[repeating-conic-gradient(var(--color-ink)_0%_25%,var(--color-paper)_0%_50%)]" />
          </div>

          <Contact />
          <Footer />
        </IntroProvider>
      </SmoothScrollProvider>
    </div>
  );
}
