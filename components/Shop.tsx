"use client";

import { useCart } from "@/lib/cart";
import { beans, naira, type Product } from "@/lib/products";

function Bag({ p }: { p: Product }) {
  return (
    <div className="bag" style={{ ["--bag" as string]: p.color }}>
      <div className="bag-top" />
      <div className="bag-label">
        <img src="/brand/icon-brown.png" alt="" />
        <span>{p.tag}</span>
      </div>
    </div>
  );
}

function Card({ p, side }: { p: Product; side: string }) {
  const { add } = useCart();
  return (
    <article className={`p-card ${side}`}>
      <header>
        <span className="p-tag">{p.tag}</span>
        <button className="p-heart" aria-label={`Save ${p.name}`}>♡</button>
      </header>
      <Bag p={p} />
      <h3>{p.name}</h3>
      <p className="p-detail">{p.detail}</p>
      <p className="p-notes">{p.notes}</p>
      <div className="p-foot">
        <strong>{naira(p.price)}</strong>
        <button className="pill pill-dark pill-sm" onClick={() => add(p.id)}>Add</button>
      </div>
    </article>
  );
}

export default function Shop() {
  return (
    <section id="sip" className="stage stage-shop" data-stage="5">
      <div className="shop-inner">
        <div className="shop-head reveal">
          <span className="eyebrow">Step 05 · Sip</span>
          <h2 className="display shop-title">
            Find your
            <br />
            <em>cup</em>
          </h2>
          <a href="#menu" className="pill pill-dark">Order now</a>
        </div>
        <div className="shop-cards">
          {beans.map((p, i) => (
            <Card key={p.id} p={p} side={i < 2 ? "left" : "right"} />
          ))}
        </div>
      </div>
    </section>
  );
}
