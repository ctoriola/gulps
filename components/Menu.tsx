"use client";

import { useCart } from "@/lib/cart";
import { drinks, naira } from "@/lib/products";

export default function Menu() {
  const { add } = useCart();
  return (
    <section id="menu" className="menu" data-stage-end>
      <div className="menu-inner">
        <div className="menu-head reveal">
          <span className="eyebrow">The Gulpsee menu</span>
          <h2 className="display">Brewed to order</h2>
          <p>Every drink starts the same way you just scrolled through: whole beans, ground fresh, poured by hand.</p>
        </div>
        <ul className="menu-grid">
          {drinks.map((d) => (
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
