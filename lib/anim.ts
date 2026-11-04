// Small math helpers shared by the 3D scene.
export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const smooth = (t: number) => t * t * (3 - 2 * t);
export const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
export const easeIn = (t: number) => t * t;
export const easeOut = (t: number) => 1 - (1 - t) * (1 - t);

/** Progress (0..1) of stage value `s` between `a` and `b`. */
export const seg = (s: number, a: number, b: number) => clamp((s - a) / (b - a));

/** Piecewise-linear lookup of keyframes indexed by integer stage. */
export const keyframes = (s: number, values: number[]) => {
  const i = Math.floor(clamp(s, 0, values.length - 1));
  const j = Math.min(i + 1, values.length - 1);
  return lerp(values[i], values[j], smooth(s - i));
};

/** Frame-rate independent exponential smoothing. */
export const damp = (current: number, target: number, lambda: number, dt: number) =>
  lerp(current, target, 1 - Math.exp(-lambda * dt));
