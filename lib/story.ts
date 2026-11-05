// Shared, mutable scroll state. Written by the DOM scroll tracker,
// read every frame by the 3D scene (no React re-renders involved).
export const story = {
  /** Target stage from scroll position: 0 = bean, 1 = grinder, 2 = grounds,
   *  3 = into the cup, 4 = hot water, 5 = shop. */
  target: 0,
  /** Smoothed stage used by the scene. */
  stage: 0,
  pointerX: 0,
  pointerY: 0,
  /** True when page scrolling is smoothed by Lenis (scroll is already eased). */
  smoothed: false,
  /** Called when the menu/footer start or stop covering the 3D. */
  onCover: null as null | ((covered: boolean) => void),
  covered: false,
  /** Advances the shared story position for the current frame (set by StoryTracker). */
  advance: null as null | ((now: number) => void),
};

export const STAGES = ["Bean", "Grind", "Ground", "Cup", "Pour", "Sip"] as const;
