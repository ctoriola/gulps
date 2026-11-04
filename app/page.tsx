import Image from "next/image";
import Nav from "@/components/Nav";
import SceneMount from "@/components/SceneMount";
import StoryTracker from "@/components/StoryTracker";
import Shop from "@/components/Shop";
import Menu from "@/components/Menu";
import CartDrawer from "@/components/CartDrawer";

type Step = {
  id: string;
  stage: number;
  eyebrow: string;
  title: React.ReactNode;
  body: string;
  bigword: string;
};

const steps: Step[] = [
  {
    id: "grind",
    stage: 1,
    eyebrow: "Step 01 · Grind",
    title: "Grind",
    body: "Whole beans go straight into the burr grinder the moment you order. Never pre-ground, never stale.",
    bigword: "grind",
  },
  {
    id: "ground",
    stage: 2,
    eyebrow: "Step 02 · Ground",
    title: "Ground",
    body: "Steel burrs crush each bean to an even, sand-fine grind, so every particle brews at the same speed.",
    bigword: "fresh",
  },
  {
    id: "cup",
    stage: 3,
    eyebrow: "Step 03 · Into the cup",
    title: (
      <>
        Into the <em>cup</em>
      </>
    ),
    body: "Fresh grounds fall straight into your cup, still full of the aroma that makes the first gulp worth it.",
    bigword: "aroma",
  },
  {
    id: "pour",
    stage: 4,
    eyebrow: "Step 04 · Pour",
    title: "Pour",
    body: "Water just off the boil, poured slowly in circles, pulls out the sweetness and leaves the bitterness behind.",
    bigword: "pour",
  },
];

export default function Home() {
  return (
    <>
      <Nav />
      <SceneMount />
      <StoryTracker />
      <CartDrawer />

      <main>
        <section id="bean" className="stage stage-hero" data-stage="0">
          <div className="pin">
            <span className="bigword" aria-hidden="true">bean</span>
            <div className="copy reveal">
              <span className="eyebrow">Gulpsee Coffee · Lagos</span>
              <h1 className="display">
                It starts
                <br />
                with one <em>bean</em>
              </h1>
              <p>
                Scroll to watch your coffee being made, from a single bean to a fresh, steaming cup.
              </p>
              <div className="cta-row">
                <a href="#menu" className="pill pill-dark">Order now</a>
                <a href="#grind" className="round-btn" aria-label="Start the story">↓</a>
              </div>
            </div>
            <div className="scroll-hint" aria-hidden="true">
              <span>Scroll to brew</span>
              <i />
            </div>
          </div>
        </section>

        {steps.map((s) => (
          <section key={s.id} id={s.id} className="stage" data-stage={s.stage}>
            <div className="pin">
              <span className="bigword" aria-hidden="true">{s.bigword}</span>
              <div className="copy reveal">
                <span className="eyebrow">{s.eyebrow}</span>
                <h2 className="display">{s.title}</h2>
                <p>{s.body}</p>
                <div className="cta-row">
                  <a href="#menu" className="pill pill-dark">Order now</a>
                  <span className="arrow-line" aria-hidden="true" />
                </div>
              </div>
            </div>
          </section>
        ))}

        <Shop />
        <Menu />

        <footer id="visit" className="footer">
          <div className="footer-inner">
            <Image src="/brand/wordmark-cream.png" alt="Gulpsee" width={1200} height={643} className="footer-logo" />
            <div className="footer-cols">
              <div>
                <h4>Visit</h4>
                <p>Lagos, Nigeria</p>
                <p>Address coming soon</p>
              </div>
              <div>
                <h4>Hours</h4>
                <p>Mon–Fri · 7am – 8pm</p>
                <p>Sat–Sun · 8am – 9pm</p>
              </div>
              <div>
                <h4>Say hello</h4>
                <p><a href="#">Instagram</a></p>
                <p><a href="#">WhatsApp</a></p>
              </div>
            </div>
            <p className="footer-small">© {new Date().getFullYear()} Gulpsee Coffee. Every gulp, freshly ground.</p>
          </div>
        </footer>
      </main>
    </>
  );
}
