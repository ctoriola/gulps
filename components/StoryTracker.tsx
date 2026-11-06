"use client";

import { useEffect, useState } from "react";
import Lenis from "lenis";
import { clamp, easeInOut, smooth } from "@/lib/anim";
import { STAGES, story } from "@/lib/story";
import { setLenis } from "@/lib/smooth";

// Scroll-TRIGGERED story: scrolling a short way into the next section fires
// that step, which then plays as a timed animation on its own (no need to keep
// scrolling to "push" it along). Scrolling back past the line plays it in reverse.
const TRIGGER = 0.2; // fire after scrolling this share of a section
/** Seconds to play each step (index = the step being entered). */
const STEP_SECONDS = [1.2, 1.5, 1.6, 1.7, 2.3, 1.5];

/**
 * One frame-aligned loop drives the whole story, on every device:
 *  - Lenis eases mouse-wheel / trackpad scrolling (desktop). Touch keeps the
 *    phone's native momentum scrolling.
 *  - Scroll position only decides WHICH step is active (trigger lines). The
 *    move to that step is a timed, eased tween computed ONCE per frame here and
 *    shared by both the 3D scene and the step copy, so they never drift apart.
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

    /** Which step is active at scroll position y (with a little hysteresis). */
    const stepAt = (y: number, current: number) => {
      let idx = 0;
      for (let i = 1; i < tops.length - 1 && i < STAGES.length; i++) {
        const line = tops[i - 1] + TRIGGER * (tops[i] - tops[i - 1]);
        const pad = (tops[i] - tops[i - 1]) * 0.04;
        // Hysteresis: the active step's own line is "sticky" so hovering on it can't flicker.
        const threshold = i === current ? line - pad : i === current + 1 ? line + pad : line;
        if (y >= threshold) idx = i;
      }
      return idx;
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
    let stage = -1; // animated, continuous story position
    let step = 0; // active step (integer target)
    let from = 0;
    let t0 = 0;
    let dur = 1;
    let last = -1;
    let running = false;
    let lastY = -1;
    let still = 0;

    const startTween = (to: number, now: number) => {
      from = stage;
      step = to;
      t0 = now;
      const span = Math.abs(to - from);
      // One step plays at its own pace; jumping several (fast fling, nav link)
      // plays them as one continuous move that never takes too long.
      const one = STEP_SECONDS[Math.max(0, Math.min(STAGES.length - 1, Math.ceil(Math.max(to, from))))];
      dur = reduce ? 0.001 : span <= 1 ? one * Math.max(0.35, span) : Math.min(2.6, one + (span - 1) * 0.45);
    };

    let disposed = false;
    let lastAdvance = -1;
    /** Computes this frame's story position. Called by our own rAF loop AND by
     *  the 3D render loop; whichever runs first in a frame does the work, so the
     *  3D and the copy always use the identical value for that frame. */
    const advance = (now: number) => {
      if (now - lastAdvance < 4) return; // already done this frame
      lastAdvance = now;
      const y = lenis ? lenis.scroll : window.scrollY;
      const want = stepAt(y, step);
      if (stage < 0) {
        stage = from = step = want; // first frame: start where the page already is
      } else if (want !== step) {
        startTween(want, now);
      }
      const p = clamp((now - t0) / (dur * 1000));
      stage = p >= 1 ? step : from + (step - from) * easeInOut(p);
      story.target = step;
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
      still = y === lastY && stage === step ? still + 1 : 0;
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
