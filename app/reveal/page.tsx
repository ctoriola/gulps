import type { Metadata } from "next";
import Image from "next/image";
import { unnamedDrink } from "@/lib/content";

// QR landing page for the Unnamed Menu. Not linked from the site: only people
// who scan the code on the board or a cup sleeve land here.
export const metadata: Metadata = {
  title: "You're one of the first to know · Gulpsee",
  robots: { index: false, follow: false },
};

export default function Reveal() {
  const { name, revealDate, scanThreshold } = unnamedDrink;
  const when = [revealDate ? `on ${revealDate}` : null, scanThreshold ? `when ${scanThreshold} people have scanned` : null]
    .filter(Boolean)
    .join(" or ");
  return (
    <main className="reveal-page">
      <a href="/" aria-label="Gulpsee home">
        <Image src="/brand/wordmark-espresso.png" alt="Gulpsee" width={1200} height={643} className="reveal-logo" priority />
      </a>
      <span className="eyebrow">{unnamedDrink.contents}</span>
      <h1 className="display">You&rsquo;re one of the first to know.</h1>
      <p className="reveal-name">
        It&rsquo;s called <strong>{name ?? "[Name]"}</strong>.
      </p>
      <p>
        Everyone else finds out {when || "soon"}
        {when.includes(" or ") ? ", whichever comes first" : ""}. Until then, this stays between us.
      </p>
      <a href="/#menu" className="pill pill-dark">See the menu</a>
    </main>
  );
}
