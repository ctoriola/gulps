import Image from "next/image";
import Nav from "@/components/Nav";
import SceneMount from "@/components/SceneMount";
import StoryTracker from "@/components/StoryTracker";
import Shop from "@/components/Shop";
import Menu from "@/components/Menu";
import CartDrawer from "@/components/CartDrawer";
import { Icon, type IconName } from "@/components/Icons";

type Callout = { icon: IconName; title: string; body: string };
type Step = {
  id: string;
  stage: number;
  eyebrow: string;
  title: React.ReactNode;
  body: string;
  left: Callout;
  right: Callout;
  hero?: boolean;
};

const steps: Step[] = [
  {
    id: "bean",
    stage: 0,
    hero: true,
    eyebrow: "Freshly ground in Lagos",
    title: (
      <>
        Coffee Worth
        <br />
        Every Gulp
      </>
    ),
    body: "Specialty beans, ground the moment you order and poured by hand. Scroll to watch your cup come to life.",
    left: {
      icon: "leaf",
      title: "Single-Origin & Ethically Sourced",
      body: "From the Mambilla Plateau to Yirgacheffe, we buy from farms that are paid fairly.",
    },
    right: {
      icon: "flame",
      title: "Roasted Weekly, Always Fresh",
      body: "Small-batch roasts, never more than a few days old when they reach your cup.",
    },
  },
  {
    id: "grind",
    stage: 1,
    eyebrow: "Step 01 · Grind",
    title: (
      <>
        Ground The Moment
        <br />
        You Order
      </>
    ),
    body: "Whole beans go straight into the grinder when you order. Never pre-ground, never stale.",
    left: { icon: "burr", title: "Burrs, Not Blades", body: "Steel burrs crush evenly instead of chopping, so nothing gets scorched." },
    right: { icon: "clock", title: "Seconds, Not Days", body: "Coffee starts losing aroma within minutes of grinding. Ours never waits." },
  },
  {
    id: "ground",
    stage: 2,
    eyebrow: "Step 02 · Ground",
    title: (
      <>
        Even Grounds,
        <br />
        Even Flavour
      </>
    ),
    body: "Every particle is the same size, so every particle brews at the same speed.",
    left: { icon: "grain", title: "Sand-Fine & Uniform", body: "Dialled in for each brew method, from espresso to pour-over." },
    right: { icon: "aroma", title: "Aroma Locked In", body: "The oils that carry flavour are still in the grounds when they hit your cup." },
  },
  {
    id: "cup",
    stage: 3,
    eyebrow: "Step 03 · Into the cup",
    title: (
      <>
        Straight Into
        <br />
        Your Cup
      </>
    ),
    body: "Fresh grounds go straight into your cup, still full of the aroma that makes the first gulp worth it.",
    left: { icon: "cup", title: "Hand-Thrown Ceramics", body: "Heavy, warm cups that hold the heat and feel good in your hands." },
    right: { icon: "hand", title: "Made For You", body: "Every cup is brewed to order. Nothing sits waiting on a warmer." },
  },
  {
    id: "pour",
    stage: 4,
    eyebrow: "Step 04 · Pour",
    title: (
      <>
        Poured Slowly,
        <br />
        By Hand
      </>
    ),
    body: "Water just off the boil, poured in slow circles, brings out the sweetness and leaves the bitterness behind.",
    left: { icon: "thermo", title: "Just Off The Boil", body: "Around 93°C, hot enough for full flavour without burning it." },
    right: { icon: "spiral", title: "Slow, Even Circles", body: "A gooseneck kettle lets us wet every ground evenly." },
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
              <div className="intro reveal">
                <span className="eyebrow">{s.eyebrow}</span>
                {s.hero ? <h1 className="display">{s.title}</h1> : <h2 className="display">{s.title}</h2>}
                <p>{s.body}</p>
                {s.hero && (
                  <div className="cta-row">
                    <a href="#menu" className="pill pill-dark">Order now</a>
                    <a href="#sip" className="pill pill-outline">Shop our beans</a>
                  </div>
                )}
              </div>
              <CalloutBlock c={s.left} side="left" />
              <CalloutBlock c={s.right} side="right" />
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
