"use client";

import { useEffect, useState } from "react";
import Lenis from "lenis";
import { clamp, smooth } from "@/lib/anim";
import { STAGES, story } from "@/lib/story";
import { setLenis } from "@/lib/smooth";

const HOLD = 0.3; // share of each section where the scene holds still

/**
 * One loop drives the whole story:
 *  - Lenis eases mouse-wheel / trackpad scrolling (desktop).
 *  - The eased scroll position becomes a continuous "stage" for the 3D scene.
 *  - The same value crossfades each step's text in place, so copy and 3D
 *    always move in lockstep.
 * Layout is measured only on resize; per-frame work is reads from cache and
 * transform/opacity writes (compositor-only, no layout).
 */
export default function StoryTracker() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const root = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;

    let lenis: Lenis | null = null;
    if (finePointer && !reduce) {
      lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.9, smoothWheel: true, anchors: true, autoRaf: true });
      setLenis(lenis);
      story.smoothed = true;
    }

    let tops: number[] = [];
    let menuTop = Infinity;
    let pins: HTMLElement[] = [];
    let callouts: HTMLElement[][] = [];
    const measure = () => {
      const y = window.scrollY;
      const els = Array.from(document.querySelectorAll<HTMLElement>("section[data-stage]"));
      tops = els.map((el) => el.getBoundingClientRect().top + y);
      const end = document.querySelector<HTMLElement>("section[data-stage-end]");
      if (end) tops.push(end.getBoundingClientRect().top + y);
      menuTop = end ? end.getBoundingClientRect().top + y : Infinity;
      pins = els.map((el) => el.querySelector<HTMLElement>(".pin")).filter(Boolean) as HTMLElement[];
      callouts = pins.map((p) => Array.from(p.querySelectorAll<HTMLElement>(".callout")));
    };

    let last = -1;
    const shown: number[] = [];
    const update = (y: number) => {
      let stage = 0;
      for (let i = 0; i < tops.length - 1; i++) {
        if (y >= tops[i]) {
          const f = (y - tops[i]) / (tops[i + 1] - tops[i]);
          stage = i + (i < STAGES.length - 1 ? smooth(clamp((f - HOLD) / (1 - HOLD))) : 0);
        }
      }
      const s = clamp(stage, 0, STAGES.length - 1);
      story.target = s;

      // Crossfade step copy: fully visible near its stage, gone halfway to the next.
      pins.forEach((pin, i) => {
        const d = s - i;
        const o = 1 - smooth(clamp((Math.abs(d) - 0.12) / 0.36));
        const q = Math.round(o * 1000) / 1000;
        if (shown[i] === q) return;
        shown[i] = q;
        pin.style.opacity = String(q);
        pin.style.visibility = q < 0.01 ? "hidden" : "visible";
        // Copy drifts up as it leaves and rises in as it arrives.
        pin.style.setProperty("--drift", `${(-d * 70).toFixed(1)}px`);
        callouts[i]?.forEach((c, k) => c.style.setProperty("--drift", `${(-d * (110 + k * 40)).toFixed(1)}px`));
      });

      const covered = y >= menuTop - 1;
      if (covered !== story.covered) {
        story.covered = covered;
        story.onCover?.(covered);
      }

      const r = Math.round(s);
      if (r !== last) {
        last = r;
        setActive(r);
        root.dataset.stage = String(r);
      }
    };

    const onScroll = () => update(lenis ? lenis.scroll : window.scrollY);
    const onPointer = (e: PointerEvent) => {
      story.pointerX = (e.clientX / window.innerWidth) * 2 - 1;
      story.pointerY = (e.clientY / window.innerHeight) * 2 - 1;
    };

    measure();
    onScroll();
    root.classList.add("story-ready");

    const ro = new ResizeObserver(() => {
      measure();
      onScroll();
    });
    ro.observe(document.body);
    if (lenis) lenis.on("scroll", onScroll);
    else window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onPointer, { passive: true });

    // Reveal-on-scroll for the shop / menu blocks.
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("in");
            io.unobserve(en.target);
          }
        }),
      { threshold: 0.2 },
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

    return () => {
      ro.disconnect();
      io.disconnect();
      lenis?.destroy();
      setLenis(null);
      story.smoothed = false;
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointer);
    };
  }, []);

  return (
    <nav className="rail" aria-label="Brewing steps">
      <ol>
        {STAGES.map((name, i) => (
          <li key={name} className={i === active ? "on" : i < active ? "done" : ""}>
            <a href={`#${name.toLowerCase()}`}>
              <span className="rail-dot" />
              <span className="rail-label">{name}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
