"use client";

import Image from "next/image";
import { useCart } from "@/lib/cart";

export default function Nav() {
  const { count, setOpen } = useCart();
  return (
    <header className="topbar">
      <p className="announce">
        <strong>Free delivery across Abuja</strong> on orders over ₦20,000. Get 10% off your first order with code: <strong>FIRSTGULP</strong>
      </p>
      <div className="nav">
        <nav className="nav-links" aria-label="Main">
          <a href="#grind">Our process</a>
          <a href="#pairings">The Pairings</a>
          <a href="#menu">Menu</a>
        </nav>
        <a href="#bean" className="nav-logo" aria-label="Gulpsee home">
          <Image src="/brand/wordmark-espresso.png" alt="Gulpsee" width={1200} height={643} priority />
        </a>
        <div className="nav-actions">
          <a href="#visit" className="nav-text">Visit</a>
          <a href="#" className="icon-btn" aria-label="Account">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <circle cx="12" cy="8.5" r="3.5" />
              <path d="M5 20c1.2-3.6 3.8-5.4 7-5.4s5.8 1.8 7 5.4" />
            </svg>
          </a>
          <button className="icon-btn" aria-label={`Open cart, ${count} items`} onClick={() => setOpen(true)}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 4h2.2l2.2 11h10.4L20 7.5H6.4" />
              <circle cx="9" cy="19.5" r="1.3" />
              <circle cx="17" cy="19.5" r="1.3" />
            </svg>
            {count > 0 && <span className="badge">{count}</span>}
          </button>
        </div>
      </div>
    </header>
  );
}
