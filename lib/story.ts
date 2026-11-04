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
};

export const STAGES = ["Bean", "Grind", "Ground", "Cup", "Pour", "Sip"] as const;
