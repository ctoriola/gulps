// Decides once, on the client, how much rendering work the device can take.
export type Tier = "mobile" | "desktop";

let cached: { tier: Tier; grounds: number; beanDetail: number; envRes: number } | null = null;

export function getQuality() {
  if (cached) return cached;
  let tier: Tier = "desktop";
  if (typeof window !== "undefined") {
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const small = Math.min(window.innerWidth, window.innerHeight) < 820;
    if (coarse || small) tier = "mobile";
  }
  cached =
    tier === "mobile"
      ? { tier, grounds: 2200, beanDetail: 48, envRes: 256 }
      : { tier, grounds: 3800, beanDetail: 72, envRes: 512 };
  return cached;
}
