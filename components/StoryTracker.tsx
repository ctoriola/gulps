"use client";

import { useEffect, useState } from "react";
import Lenis from "lenis";
import { clamp, damp, smooth } from "@/lib/anim";
import { STAGES, story } from "@/lib/story";
import { setLenis } from "@/lib/smooth";

const HOLD = 0.3; // share of each section where the scene holds still

/**
 * One frame-aligned loop drives the whole story, on every device:
 *  - Lenis eases mouse-wheel / trackpad scrolling (desktop). Touch keeps the
 *    phone's native momentum scrolling.
 *  - Each animation frame, the scroll position becomes a target "stage", which
 *    is smoothed ONCE here. That single value drives both the 3D scene and the
 *    step copy, so they can never drift apart.
 *  - The loop sleeps when nothing is moving and wakes on scroll/resize.
 * Layout is measured only on resize; per-frame work is cached reads plus
 * opacity/transform writes on small, pre-promoted layers (no layout, no paint).
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

    // ---- layout cache (measured on resize only) ----
    let tops: number[] = [];
    let menuTop = Infinity;
    let pins: HTMLElement[] = [];
    let intros: (HTMLElement | null)[] = [];
    let callouts: HTMLElement[][] = [];
    const measure = () => {
      const y = window.scrollY;
      const els = Array.from(document.querySelectorAll<HTMLElement>("section[data-stage]"));
      tops = els.map((el) => el.getBoundingClientRect().top + y);
      const end = document.querySelector<HTMLElement>("section[data-stage-end]");
      if (end) tops.push(end.getBoundingClientRect().top + y);
      menuTop = end ? end.getBoundingClientRect().top + y : Infinity;
      pins = els.map((el) => el.querySelector<HTMLElement>(".pin")).filter(Boolean) as HTMLElement[];
      intros = pins.map((p) => p.querySelector<HTMLElement>(".intro"));
      // Skip callouts hidden by CSS (phones) so we never write to them.
      callouts = pins.map((p) =>
        Array.from(p.querySelectorAll<HTMLElement>(".callout")).filter((c) => getComputedStyle(c).display !== "none"),
      );
      shown.length = 0;
    };

    const stageAt = (y: number) => {
      let stage = 0;
      for (let i = 0; i < tops.length - 1; i++) {
        if (y >= tops[i]) {
          const f = (y - tops[i]) / (tops[i + 1] - tops[i]);
          stage = i + (i < STAGES.length - 1 ? smooth(clamp((f - HOLD) / (1 - HOLD))) : 0);
        }
      }
      return clamp(stage, 0, STAGES.length - 1);
    };

    // ---- step copy crossfade ----
    const shown: number[] = [];
    const applyCopy = (s: number) => {
      pins.forEach((pin, i) => {
        const d = s - i;
        // Fully visible near its stage, gone just past halfway to the next.
        const o = Math.round((1 - smooth(clamp((Math.abs(d) - 0.12) / 0.36))) * 1000) / 1000;
        const drift = reduce ? 0 : Math.round(-d * 700) / 10; // copy drifts up as it leaves, rises in as it arrives
        const key = o * 1e6 + drift;
        if (shown[i] === key) return;
        shown[i] = key;
        pin.style.visibility = o < 0.01 ? "hidden" : "visible";
        const intro = intros[i];
        if (intro) {
          intro.style.opacity = String(o);
          intro.style.transform = `translate3d(0,${drift}px,0)`;
        }
        callouts[i]?.forEach((c, k) => {
          c.style.opacity = String(o);
          c.style.transform = `translate3d(0,${reduce ? 0 : (-d * (110 + k * 40)).toFixed(1)}px,0)`;
        });
      });
    };

    // ---- the loop ----
    // Lenis already eases desktop scrolling, so follow it almost 1:1.
    // Native touch scrolling arrives in uneven steps; a light filter evens it out.
    const LAMBDA = lenis ? 22 : 12;
    let stage = -1;
    let last = -1;
    let running = false;
    let lastT = 0;
    let lastY = -1;
    let still = 0;

    let disposed = false;
    let lastAdvance = -1;
    /** Computes this frame's story position. Called by our own rAF loop AND by
     *  the 3D render loop; whichever runs first in a frame does the work, so the
     *  3D and the copy always use the identical value for that frame. */
    const advance = (now: number) => {
      if (now - lastAdvance < 4) return; // already done this frame
      lastAdvance = now;
      const dt = Math.min(0.05, Math.max(0.001, (now - lastT) / 1000));
      lastT = now;
      const y = lenis ? lenis.scroll : window.scrollY;
      const target = stageAt(y);
      stage = stage < 0 ? target : damp(stage, target, LAMBDA, dt);
      if (Math.abs(stage - target) < 0.0004) stage = target;
      story.target = target;
      story.stage = stage;
      applyCopy(stage);

      const covered = y >= menuTop - 1;
      if (covered !== story.covered) {
        story.covered = covered;
        story.onCover?.(covered);
      }
      const r = Math.round(stage);
      if (r !== last) {
        last = r;
        setActive(r);
        root.dataset.stage = String(r);
      }

      // Sleep once scrolling has stopped and the story has settled.
      still = y === lastY && stage === target ? still + 1 : 0;
      lastY = y;
    };
    story.advance = advance;

    const tick = () => {
      if (disposed) return;
      advance(performance.now());
      if (still > 20) {
        running = false;
        return;
      }
      requestAnimationFrame(tick);
    };
    const kick = () => {
      still = 0;
      if (running) return;
      running = true;
      lastT = performance.now();
      requestAnimationFrame(tick);
    };

    const onPointer = (e: PointerEvent) => {
      // Touch "pointers" jump on every tap; parallax is for mice only.
      if (e.pointerType !== "mouse") return;
      story.pointerX = (e.clientX / window.innerWidth) * 2 - 1;
      story.pointerY = (e.clientY / window.innerHeight) * 2 - 1;
    };

    measure();
    kick();
    root.classList.add("story-ready");

    const ro = new ResizeObserver(() => {
      measure();
      kick();
    });
    ro.observe(document.body);
    if (lenis) lenis.on("scroll", kick);
    window.addEventListener("scroll", kick, { passive: true });
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
      disposed = true;
      story.advance = null;
      window.removeEventListener("scroll", kick);
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
