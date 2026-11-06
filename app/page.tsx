import Nav from "@/components/Nav";
import SceneMount from "@/components/SceneMount";
import StoryTracker from "@/components/StoryTracker";
import Shop from "@/components/Shop";
import Menu from "@/components/Menu";
import CartDrawer from "@/components/CartDrawer";
import Footer from "@/components/Footer";
import Story from "@/components/Story";
import { Icon, type IconName } from "@/components/Icons";

type Callout = { icon: IconName; title: string; body: string };
type Step = {
  id: string;
  stage: number;
  /** Shown first, above the headline: the clue. */
  clue: string;
  title: React.ReactNode;
  body: string;
  left?: Callout;
  right?: Callout;
  hero?: boolean;
};

// Copy from the Gulpsee content strategy (section 09, Website).
const steps: Step[] = [
  {
    id: "bean",
    stage: 0,
    hero: true,
    clue: "Poured by hand in Abuja",
    title: (
      <>
        What are you
        <br />
        looking at?
      </>
    ),
    body: "Keep scrolling. We\u2019ll show you.",
    left: {
      icon: "leaf",
      title: "Somebody grew this.",
      body: "On the Mambilla Plateau, or in the hills of Yirgacheffe, someone grew it on a farm that\u2019s paid fairly for what it grows. We\u2019d like the story to start with them.",
    },
    right: {
      icon: "flame",
      title: "Roasted weekly.",
      body: "Small batches, a few days old at most by the time they reach your cup.",
    },
  },
  {
    id: "grind",
    stage: 1,
    clue: "Chopped, or crushed?",
    title: "Crushed, not chopped.",
    body: "Steel burrs crush coffee evenly instead of chopping it, so nothing gets scorched on the way to your cup.",
    left: { icon: "burr", title: "Dialled in for every drink.", body: "Espresso and pour-over each get their own setting." },
  },
  {
    id: "ground",
    stage: 2,
    clue: "Look how even this is.",
    title: "Every grain the same size.",
    body: "When every grain is the same size, every grain gives up its flavour at the same speed. That\u2019s what makes a cup taste balanced.",
  },
  {
    id: "cup",
    stage: 3,
    clue: "Hold it before you taste it.",
    title: "Into the cup.",
    body: "A hand-thrown ceramic cup, heavy enough to hold the heat and good to hold in your hands. Every cup is made to order. Nothing sits on a warmer.",
  },
  {
    id: "pour",
    stage: 4,
    clue: "Slowly. Slower than that.",
    title: "Poured by hand, in slow circles.",
    body: "Water just off the boil, about 93\u00b0C, from a gooseneck kettle. Every ground gets wet evenly, the sweetness comes forward, and the bitterness stays behind.",
  },
];

function CalloutBlock({ c, side }: { c: Callout; side: "left" | "right" }) {
  return (
    <div className={`callout callout-${side}`}>
      <span className="callout-icon">
        <Icon name={c.icon} />
      </span>
      <h3>{c.title}</h3>
      <span className="callout-line" aria-hidden="true" />
      <p>{c.body}</p>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <Nav />
      <SceneMount />
      <StoryTracker />
      <CartDrawer />

      <main>
        {steps.map((s) => (
          <section key={s.id} id={s.id} className={`stage ${s.hero ? "stage-hero" : ""}`} data-stage={s.stage}>
            <div className="pin">
              <div className="intro">
                <span className={s.hero ? "eyebrow" : "eyebrow clue"}>{s.clue}</span>
                {s.hero ? <h1 className="display">{s.title}</h1> : <h2 className="display">{s.title}</h2>}
                <p>{s.body}</p>
                {s.hero && (
                  <div className="cta-row">
                    <a href="#menu" className="pill pill-dark">Order now</a>
                    <a href="#pairings" className="pill pill-outline">See the Pairings</a>
                  </div>
                )}
              </div>
              {s.left && <CalloutBlock c={s.left} side="left" />}
              {s.right && <CalloutBlock c={s.right} side="right" />}
            </div>
          </section>
        ))}

        <Shop />
        <Menu />
        <Story />
        <Footer />
      </main>
    </>
  );
}
