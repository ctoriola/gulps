"use client";

import { useEffect, useState } from "react";
import { clamp, smooth } from "@/lib/anim";
import { STAGES, story } from "@/lib/story";

/**
 * Converts page scroll into a continuous "stage" number for the 3D scene.
 * Each [data-stage] section holds its state for the first part of its
 * scroll, then blends into the next one.
 */
export default function StoryTracker() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    let tops: number[] = [];
    const measure = () => {
      const els = Array.from(document.querySelectorAll<HTMLElement>("section[data-stage]"));
      tops = els.map((el) => el.getBoundingClientRect().top + window.scrollY);
      const end = document.querySelector<HTMLElement>("section[data-stage-end]");
      if (end) tops.push(end.getBoundingClientRect().top + window.scrollY);
    };
    const HOLD = 0.3;
    let last = -1;
    const update = () => {
      const y = window.scrollY;
      let stage = 0;
      for (let i = 0; i < tops.length - 1; i++) {
        if (y >= tops[i]) {
          const f = (y - tops[i]) / (tops[i + 1] - tops[i]);
          stage = i + (i < STAGES.length - 1 ? smooth(clamp((f - HOLD) / (1 - HOLD))) : 0);
        }
      }
      story.target = clamp(stage, 0, STAGES.length - 1);
      const r = Math.round(story.target);
      if (r !== last) {
        last = r;
        setActive(r);
        document.documentElement.dataset.stage = String(r);
      }
    };
    const onPointer = (e: PointerEvent) => {
      story.pointerX = (e.clientX / window.innerWidth) * 2 - 1;
      story.pointerY = (e.clientY / window.innerHeight) * 2 - 1;
    };
    measure();
    update();
    const ro = new ResizeObserver(() => {
      measure();
      update();
    });
    ro.observe(document.body);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("pointermove", onPointer, { passive: true });

    // Reveal-on-scroll for copy blocks.
    const io = new IntersectionObserver(
      (entries) => entries.forEach((en) => en.isIntersecting && en.target.classList.add("in")),
      { threshold: 0.2 },
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

    return () => {
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("scroll", update);
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
