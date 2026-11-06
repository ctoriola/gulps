"use client";

import { useCart } from "@/lib/cart";
import { coffees, type Product } from "@/lib/products";
import { pairings } from "@/lib/content";

/** The cup in focus; the artwork behind it blurred beyond recognition. */
function PairingArt({ p }: { p: Product }) {
  const [a, b, c] = p.art ?? ["#c9783c", "#4b5f3a", "#efe0c4"];
  return (
    <div className="p-art" aria-hidden="true">
      <span className="p-blob" style={{ background: a, left: "-10%", top: "-20%" }} />
      <span className="p-blob" style={{ background: b, right: "-15%", top: "10%" }} />
      <span className="p-blob" style={{ background: c, left: "25%", bottom: "-35%" }} />
      <svg className="p-cup" viewBox="0 0 64 56" width="64" height="56">
        <ellipse cx="30" cy="52" rx="22" ry="3" fill="rgba(43,24,8,0.25)" />
        <path d="M10 16h40l-3 26a8 8 0 0 1-8 7H21a8 8 0 0 1-8-7Z" fill="#efe7d8" />
        <path d="M13.5 34c6 3 11-2 17 1s11 1 15-1l-1.5 8a8 8 0 0 1-8 7H21a8 8 0 0 1-8-7Z" fill="#c48a5f" />
        <ellipse cx="30" cy="16" rx="20" ry="4" fill="#e6dccb" />
        <ellipse cx="30" cy="16.5" rx="16.5" ry="2.8" fill="#4a2512" />
        <path d="M49 22c6 0 8 3 8 6s-3 7-9 7" fill="none" stroke="#efe7d8" strokeWidth="3.5" />
      </svg>
    </div>
  );
}

function Card({ p, side }: { p: Product; side: string }) {
  const { add } = useCart();
  return (
    <article className={`p-card ${side}`}>
      <PairingArt p={p} />
      <h3>{p.name}</h3>
      <p className="p-detail">{p.detail}</p>
      <p className="p-notes">{p.notes}</p>
      <p className="p-lock">Pairing: not yet revealed.</p>
      <button className="pill pill-dark pill-sm pill-block" onClick={() => add(p.id)}>
        Order this coffee
      </button>
    </article>
  );
}

export default function Shop() {
  return (
    <section id="sip" className="stage stage-shop" data-stage="5">
      <div className="shop-inner">
        <div className="shop-head reveal">
          <span className="eyebrow clue">Now you know what&rsquo;s in it.</span>
          <h2 className="display shop-title">Now taste it.</h2>
          <p className="shop-sub">Then go and see what it belongs next to.</p>
          <div className="cta-row">
            <a href="#menu" className="pill pill-dark">Order now</a>
            <a href="#pairings" className="pill pill-outline">See the Pairings</a>
          </div>
        </div>
        <div className="shop-cards" id="pairings">
          {coffees.map((p, i) => (
            <Card key={p.id} p={p} side={i < 2 ? "left" : "right"} />
          ))}
        </div>
        <div className="pairings-copy reveal">
          <h3 className="display">The Pairings</h3>
          <p>Every coffee here has an artwork it belongs next to. You can&rsquo;t see which one yet.</p>
          <p>
            {pairings.revealWhen
              ? `They’re revealed ${pairings.revealWhen}. Until then, you have the tasting notes and a hunch.`
              : "Until they’re revealed, you have the tasting notes and a hunch."}
          </p>
          <p className="pairings-close">Order the coffee now. The piece can wait.</p>
        </div>
      </div>
    </section>
  );
}
