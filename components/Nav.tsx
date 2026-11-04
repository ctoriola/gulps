"use client";

import Image from "next/image";
import { useCart } from "@/lib/cart";

export default function Nav() {
  const { count, setOpen } = useCart();
  return (
    <header className="nav">
      <a href="#bean" className="nav-logo" aria-label="Gulpsee home">
        <Image src="/brand/wordmark-brown.png" alt="Gulpsee" width={1200} height={643} priority />
      </a>
      <nav className="nav-links" aria-label="Main">
        <a href="#grind">Our process</a>
        <a href="#sip">Shop beans</a>
        <a href="#menu">Menu</a>
        <a href="#visit">Visit</a>
      </nav>
      <div className="nav-actions">
        <a href="#" className="nav-text">Log in</a>
        <a href="#" className="pill pill-dark pill-sm">Sign up</a>
        <button className="icon-btn" aria-label={`Open cart, ${count} items`} onClick={() => setOpen(true)}>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 7h12l-1 13H7L6 7Z" />
            <path d="M9 7a3 3 0 0 1 6 0" />
          </svg>
          {count > 0 && <span className="badge">{count}</span>}
        </button>
      </div>
    </header>
  );
}
