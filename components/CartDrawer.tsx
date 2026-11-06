"use client";

import { useEffect } from "react";
import { useCart } from "@/lib/cart";
import { naira } from "@/lib/products";
import { getLenis } from "@/lib/smooth";

export default function CartDrawer() {
  const { open, setOpen, lines, subtotal, setQty } = useCart();

  // Freeze page scrolling while the drawer is open.
  useEffect(() => {
    const l = getLenis();
    if (open) l?.stop();
    else l?.start();
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setOpen]);

  return (
    <div className={`drawer-wrap ${open ? "open" : ""}`} aria-hidden={!open}>
      <button className="drawer-scrim" aria-label="Close cart" onClick={() => setOpen(false)} tabIndex={open ? 0 : -1} />
      <aside className="drawer" role="dialog" aria-label="Your order" data-lenis-prevent>
        <div className="drawer-head">
          <h3>Your order</h3>
          <button className="icon-btn" onClick={() => setOpen(false)} aria-label="Close" tabIndex={open ? 0 : -1}>✕</button>
        </div>
        {lines.length === 0 ? (
          <p className="drawer-empty">Your cup is empty. Fill it from the menu.</p>
        ) : (
          <ul className="drawer-lines">
            {lines.map((l) => (
              <li key={l.id}>
                <div>
                  <strong>{l.product.cartName ?? l.product.name}</strong>
                  <span>{naira(l.product.price)}</span>
                </div>
                <div className="qty">
                  <button onClick={() => setQty(l.id, l.qty - 1)} aria-label={`Remove one ${l.product.cartName ?? l.product.name}`} tabIndex={open ? 0 : -1}>−</button>
                  <span>{l.qty}</span>
                  <button onClick={() => setQty(l.id, l.qty + 1)} aria-label={`Add one ${l.product.cartName ?? l.product.name}`} tabIndex={open ? 0 : -1}>+</button>
                </div>
              </li>
            ))}
          </ul>
        )}
        <div className="drawer-foot">
          <div className="drawer-total">
            <span>Subtotal</span>
            <strong>{naira(subtotal)}</strong>
          </div>
          <button className="pill pill-dark pill-block" disabled={lines.length === 0} tabIndex={open ? 0 : -1}>
            Checkout
          </button>
          <p className="drawer-note">Online ordering is on its way. In the meantime, come and find us.</p>
        </div>
      </aside>
    </div>
  );
}
