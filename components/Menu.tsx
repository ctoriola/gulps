"use client";

import { useCart } from "@/lib/cart";
import { drinks, naira } from "@/lib/products";
import { unnamedDrink } from "@/lib/content";

function UnnamedMenu() {
  const { add } = useCart();
  const d = drinks.find((x) => x.id === unnamedDrink.productId);
  const n = unnamedDrink.scanThreshold;
  return (
    <div className="unnamed reveal">
      <div className="unnamed-copy">
        <span className="eyebrow">New on the menu</span>
        <h3 className="display">New on the menu. No name yet.</h3>
        <p>
          Some drinks arrive without a name. You get the contents and the price. The name stays locked until{" "}
          {n ? `${n} people have` : "enough people have"} scanned the QR code in the shop, or seven days have passed,
          whichever comes first.
        </p>
        <p>Scan the code on the board or your sleeve to find out early. Ordering online? You&rsquo;ll see the name when we reveal it.</p>
        {unnamedDrink.scans !== null && n && (
          <p className="unnamed-count">
            <strong>
              {unnamedDrink.scans} of {n} scans.
            </strong>
          </p>
        )}
        <p className="unnamed-small">Contents are always listed, so you&rsquo;ll always know what&rsquo;s in it. Only the name is a secret.</p>
      </div>
      {d && (
        <div className="unnamed-drink">
          <span className="unnamed-lock" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <rect x="5" y="11" width="14" height="9" rx="2" />
              <path d="M8 11V8a4 4 0 0 1 8 0v3" />
            </svg>
          </span>
          <p className="unnamed-contents">{unnamedDrink.contents}</p>
          <p className="unnamed-price">{naira(d.price)}</p>
          <button className="pill pill-dark pill-sm" onClick={() => add(d.id)}>
            Order it
          </button>
        </div>
      )}
    </div>
  );
}

export default function Menu() {
  const { add } = useCart();
  return (
    <section id="menu" className="menu" data-stage-end>
      <div className="menu-inner">
        <div className="menu-head reveal">
          <span className="eyebrow">The Gulpsee menu</span>
          <h2 className="display">Brewed to order</h2>
          <p>Every drink starts with the beans you just scrolled through and ends in a cup made to order.</p>
        </div>
        <UnnamedMenu />
        <ul className="menu-grid">
          {drinks
            .filter((d) => d.id !== unnamedDrink.productId)
            .map((d) => (
              <li key={d.id} className="menu-item reveal">
                <div>
                  <h3>{d.name}</h3>
                  <p>{d.notes}</p>
                </div>
                <div className="menu-buy">
                  <span>{naira(d.price)}</span>
                  <button className="round-btn" onClick={() => add(d.id)} aria-label={`Add ${d.name} to order`}>+</button>
                </div>
              </li>
            ))}
        </ul>
      </div>
    </section>
  );
}
